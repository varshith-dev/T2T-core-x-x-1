import type { FastifyInstance } from "fastify";
import { desc, eq } from "drizzle-orm";
import { reviewApproveSchema } from "@t2t/shared";
import { db, schema } from "../db/index.js";
import { requireRole } from "../auth.js";
import { award } from "../points.js";

export async function reviewRoutes(app: FastifyInstance) {
  // The human review queue: photos the ML wasn't confident about (or ML was down).
  app.get("/review/queue", { preHandler: requireRole("reviewer", "admin") }, async () => {
    const rows = await db
      .select()
      .from(schema.submissions)
      .where(eq(schema.submissions.status, "needs_review"))
      .orderBy(desc(schema.submissions.createdAt))
      .limit(100);
    return { submissions: rows };
  });

  // Approve with the reviewer's chosen category; awards points per that category's rule.
  app.post(
    "/review/:id/approve",
    { preHandler: requireRole("reviewer", "admin") },
    async (req, reply) => {
      const { id } = req.params as { id: string };
      const { category } = reviewApproveSchema.parse(req.body);
      const [sub] = await db
        .select()
        .from(schema.submissions)
        .where(eq(schema.submissions.id, id))
        .limit(1);
      if (!sub) return reply.code(404).send({ error: "submission not found" });
      if (sub.status === "approved") return reply.code(409).send({ error: "already approved" });

      const [rule] = await db
        .select()
        .from(schema.pointRules)
        .where(eq(schema.pointRules.category, category))
        .limit(1);
      const points = rule?.active ? rule.points : 0;

      // idempotent on submission id — a re-approve never double-credits
      await award({
        userId: sub.userId,
        amount: points,
        reason: "submission_award",
        refType: "submission",
        refId: sub.id,
        idempotencyKey: `submission:${sub.id}`,
        createdBy: req.user.sub,
      });
      const [updated] = await db
        .update(schema.submissions)
        .set({
          status: "approved",
          finalCategory: category, // reviewer's confirmed label (ml_category keeps the model's guess)
          awardedPoints: points,
          reviewedBy: req.user.sub,
          reviewedAt: new Date(),
        })
        .where(eq(schema.submissions.id, sub.id))
        .returning();
      return { submission: updated, awarded: points };
    },
  );

  app.post(
    "/review/:id/reject",
    { preHandler: requireRole("reviewer", "admin") },
    async (req, reply) => {
      const { id } = req.params as { id: string };
      const [updated] = await db
        .update(schema.submissions)
        .set({ status: "rejected", reviewedBy: req.user.sub, reviewedAt: new Date() })
        .where(eq(schema.submissions.id, id))
        .returning();
      if (!updated) return reply.code(404).send({ error: "submission not found" });
      return { submission: updated };
    },
  );
}
