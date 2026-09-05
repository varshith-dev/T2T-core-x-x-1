import type { FastifyInstance } from "fastify";
import { eq } from "drizzle-orm";
import { registerSchema, loginSchema } from "@t2t/shared";
import { db, schema } from "../db/index.js";
import { hashPassword, verifyPassword, authenticate } from "../auth.js";

type UserRow = typeof schema.users.$inferSelect;
const publicUser = (u: UserRow) => ({
  id: u.id,
  email: u.email,
  displayName: u.displayName,
  role: u.role,
  status: u.status,
});

export async function authRoutes(app: FastifyInstance) {
  app.post("/auth/register", async (req, reply) => {
    const body = registerSchema.parse(req.body);
    const passwordHash = await hashPassword(body.password);
    try {
      const [u] = await db
        .insert(schema.users)
        .values({
          email: body.email.toLowerCase(),
          passwordHash,
          displayName: body.displayName,
        })
        .returning();
      const token = await reply.jwtSign({ sub: u.id, role: u.role });
      return { token, user: publicUser(u) };
    } catch (e: any) {
      if (e?.code === "23505") return reply.code(409).send({ error: "email already registered" });
      throw e;
    }
  });

  app.post("/auth/login", async (req, reply) => {
    const body = loginSchema.parse(req.body);
    const [u] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, body.email.toLowerCase()))
      .limit(1);
    if (!u || !(await verifyPassword(u.passwordHash, body.password))) {
      return reply.code(401).send({ error: "invalid credentials" });
    }
    if (u.status !== "active") return reply.code(403).send({ error: "account suspended" });
    const token = await reply.jwtSign({ sub: u.id, role: u.role });
    return { token, user: publicUser(u) };
  });

  app.get("/auth/me", { preHandler: authenticate }, async (req) => {
    const [u] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, req.user.sub))
      .limit(1);
    return { user: u ? publicUser(u) : null };
  });
}
