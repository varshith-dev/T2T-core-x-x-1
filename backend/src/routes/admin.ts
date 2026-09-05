import type { FastifyInstance } from "fastify";
import { eq } from "drizzle-orm";
import { CATEGORIES, pointRuleUpdateSchema, roleUpdateSchema, type Category } from "@t2t/shared";
import { db, schema } from "../db/index.js";
import { requireRole } from "../auth.js";

export async function adminRoutes(app: FastifyInstance) {
  app.get("/admin/point-rules", { preHandler: requireRole("admin") }, async () => {
    const rules = await db.select().from(schema.pointRules);
    return { rules };
  });

  // Upsert the points/dailyCap/active for one category.
  app.put("/admin/point-rules/:category", { preHandler: requireRole("admin") }, async (req, reply) => {
    const category = (req.params as { category: string }).category as Category;
    if (!CATEGORIES.includes(category)) return reply.code(400).send({ error: "unknown category" });
    const body = pointRuleUpdateSchema.parse(req.body);
    const [rule] = await db
      .insert(schema.pointRules)
      .values({ category, ...body })
      .onConflictDoUpdate({ target: schema.pointRules.category, set: body })
      .returning();
    return { rule };
  });

  // Re-queue submissions stuck in review (e.g. after a model upgrade) so the
  // worker re-classifies them with the current model.
  app.post("/admin/reprocess", { preHandler: requireRole("admin") }, async () => {
    const rows = await db
      .update(schema.submissions)
      .set({ status: "pending", mlCategory: null, mlConfidence: null, mlModelVersion: null })
      .where(eq(schema.submissions.status, "needs_review"))
      .returning({ id: schema.submissions.id });
    return { requeued: rows.length };
  });

  app.get("/admin/users", { preHandler: requireRole("admin") }, async () => {
    const users = await db
      .select({
        id: schema.users.id,
        email: schema.users.email,
        displayName: schema.users.displayName,
        role: schema.users.role,
        status: schema.users.status,
        createdAt: schema.users.createdAt,
      })
      .from(schema.users)
      .limit(500);
    return { users };
  });

  // Assign an employee role (or demote back to 'user').
  app.patch("/admin/users/:id/role", { preHandler: requireRole("admin") }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const { role } = roleUpdateSchema.parse(req.body);
    // only a super admin can grant admin / super_admin
    if ((role === "admin" || role === "super_admin") && req.user.role !== "super_admin") {
      return reply.code(403).send({ error: "only a super admin can grant admin roles" });
    }
    const [u] = await db
      .update(schema.users)
      .set({ role })
      .where(eq(schema.users.id, id))
      .returning();
    if (!u) return reply.code(404).send({ error: "user not found" });
    return { user: { id: u.id, email: u.email, role: u.role } };
  });
}
