import type { FastifyInstance } from "fastify";
import { desc, eq } from "drizzle-orm";
import { db, schema } from "../db/index.js";
import { authenticate } from "../auth.js";
import { getBalance } from "../points.js";

export async function walletRoutes(app: FastifyInstance) {
  app.get("/wallet", { preHandler: authenticate }, async (req) => {
    const [balance, history] = await Promise.all([
      getBalance(req.user.sub),
      db
        .select()
        .from(schema.pointLedger)
        .where(eq(schema.pointLedger.userId, req.user.sub))
        .orderBy(desc(schema.pointLedger.createdAt))
        .limit(50),
    ]);
    return { balance, history };
  });
}
