import type { FastifyInstance } from "fastify";
import { randomUUID } from "node:crypto";
import { desc, eq, sql } from "drizzle-orm";
import { couponCreateSchema, couponUpdateSchema } from "@t2t/shared";
import { db, schema } from "../db/index.js";
import { authenticate, requireRole } from "../auth.js";

export async function couponRoutes(app: FastifyInstance) {
  // Users see active coupons only; catalog managers/admins see all (to manage them).
  app.get("/coupons", { preHandler: authenticate }, async (req) => {
    const staff = req.user.role === "catalog_manager" || req.user.role === "admin";
    const base = db.select().from(schema.coupons);
    const coupons = staff
      ? await base.orderBy(schema.coupons.costPoints)
      : await base.where(eq(schema.coupons.active, true)).orderBy(schema.coupons.costPoints);
    return { coupons };
  });

  // Catalog management.
  app.post("/coupons", { preHandler: requireRole("catalog_manager", "admin") }, async (req) => {
    const body = couponCreateSchema.parse(req.body);
    const [coupon] = await db.insert(schema.coupons).values(body).returning();
    return { coupon };
  });

  app.patch(
    "/coupons/:id",
    { preHandler: requireRole("catalog_manager", "admin") },
    async (req, reply) => {
      const { id } = req.params as { id: string };
      const body = couponUpdateSchema.parse(req.body);
      const [coupon] = await db
        .update(schema.coupons)
        .set(body)
        .where(eq(schema.coupons.id, id))
        .returning();
      if (!coupon) return reply.code(404).send({ error: "coupon not found" });
      return { coupon };
    },
  );

  // Redeem: atomically check balance, deduct points, reserve stock. Status 'pending'
  // until a catalog_manager fulfills it. Advisory lock serializes a user's spends
  // (no overdraft); the coupon row lock prevents overselling stock.
  app.post("/coupons/:id/redeem", { preHandler: authenticate }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const userId = req.user.sub;
    const result = await db.transaction(async (tx) => {
      await tx.execute(sql`select pg_advisory_xact_lock(hashtext(${userId}))`);
      const [coupon] = await tx
        .select()
        .from(schema.coupons)
        .where(eq(schema.coupons.id, id))
        .for("update")
        .limit(1);
      if (!coupon || !coupon.active) return { code: 404, body: { error: "coupon not found" } };
      if (coupon.stock <= 0) return { code: 409, body: { error: "out of stock" } };

      const [bal] = await tx
        .select({ v: sql<string>`coalesce(sum(${schema.pointLedger.delta}), 0)` })
        .from(schema.pointLedger)
        .where(eq(schema.pointLedger.userId, userId));
      const balance = Number(bal?.v ?? 0);
      if (balance < coupon.costPoints) {
        return { code: 402, body: { error: "insufficient points", balance } };
      }

      const key = `redemption:${randomUUID()}`;
      const [redemption] = await tx
        .insert(schema.redemptions)
        .values({
          userId,
          couponId: coupon.id,
          costPoints: coupon.costPoints,
          status: "pending",
          idempotencyKey: key,
        })
        .returning();
      await tx.insert(schema.pointLedger).values({
        userId,
        delta: -coupon.costPoints,
        reason: "redemption",
        refType: "redemption",
        refId: redemption.id,
        idempotencyKey: key,
      });
      await tx
        .update(schema.coupons)
        .set({ stock: coupon.stock - 1 })
        .where(eq(schema.coupons.id, coupon.id));
      return { code: 200, body: { redemption, balance: balance - coupon.costPoints } };
    });
    return reply.code(result.code).send(result.body);
  });

  // Fulfillment queue for catalog managers.
  app.get(
    "/redemptions",
    { preHandler: requireRole("catalog_manager", "admin") },
    async () => {
      const rows = await db
        .select()
        .from(schema.redemptions)
        .orderBy(desc(schema.redemptions.createdAt))
        .limit(100);
      return { redemptions: rows };
    },
  );

  app.post(
    "/redemptions/:id/fulfill",
    { preHandler: requireRole("catalog_manager", "admin") },
    async (req, reply) => {
      const { id } = req.params as { id: string };
      const [r] = await db
        .update(schema.redemptions)
        .set({ status: "fulfilled", approvedBy: req.user.sub })
        .where(eq(schema.redemptions.id, id))
        .returning();
      if (!r) return reply.code(404).send({ error: "redemption not found" });
      return { redemption: r };
    },
  );

  // Reject: refund points (reversal entry) and restock.
  app.post(
    "/redemptions/:id/reject",
    { preHandler: requireRole("catalog_manager", "admin") },
    async (req, reply) => {
      const { id } = req.params as { id: string };
      const out = await db.transaction(async (tx) => {
        const [r] = await tx
          .select()
          .from(schema.redemptions)
          .where(eq(schema.redemptions.id, id))
          .for("update")
          .limit(1);
        if (!r) return { code: 404, body: { error: "redemption not found" } };
        if (r.status === "rejected") return { code: 409, body: { error: "already rejected" } };
        await tx
          .update(schema.redemptions)
          .set({ status: "rejected", approvedBy: req.user.sub })
          .where(eq(schema.redemptions.id, r.id));
        // refund is idempotent on the redemption id
        await tx
          .insert(schema.pointLedger)
          .values({
            userId: r.userId,
            delta: r.costPoints,
            reason: "reversal",
            refType: "redemption",
            refId: r.id,
            idempotencyKey: `reversal:${r.id}`,
            createdBy: req.user.sub,
          })
          .onConflictDoNothing({ target: schema.pointLedger.idempotencyKey });
        await tx
          .update(schema.coupons)
          .set({ stock: sql`${schema.coupons.stock} + 1` })
          .where(eq(schema.coupons.id, r.couponId));
        return { code: 200, body: { redemption: { ...r, status: "rejected" } } };
      });
      return reply.code(out.code).send(out.body);
    },
  );
}
