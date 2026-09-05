import { pathToFileURL } from "node:url";
import { eq, sql } from "drizzle-orm";
import { db, schema } from "./db/index.js";

// Balance is always derived: SUM(delta). There is no stored balance column.
export async function getBalance(userId: string): Promise<number> {
  const [row] = await db
    .select({ balance: sql<string>`coalesce(sum(${schema.pointLedger.delta}), 0)` })
    .from(schema.pointLedger)
    .where(eq(schema.pointLedger.userId, userId));
  return Number(row?.balance ?? 0);
}

type AwardInput = {
  userId: string;
  amount: number; // credited (stored as +delta)
  reason: "submission_award" | "adjustment" | "reversal";
  refType?: string;
  refId?: string;
  idempotencyKey: string;
  createdBy?: string | null;
};

// Idempotent credit. The same idempotencyKey never double-credits (unique constraint
// + onConflictDoNothing), so retries and re-processed submissions are safe.
export async function award(input: AwardInput) {
  const inserted = await db
    .insert(schema.pointLedger)
    .values({
      userId: input.userId,
      delta: Math.abs(input.amount),
      reason: input.reason,
      refType: input.refType,
      refId: input.refId,
      idempotencyKey: input.idempotencyKey,
      createdBy: input.createdBy ?? null,
    })
    .onConflictDoNothing({ target: schema.pointLedger.idempotencyKey })
    .returning();
  if (inserted.length) return inserted[0];
  const [existing] = await db
    .select()
    .from(schema.pointLedger)
    .where(eq(schema.pointLedger.idempotencyKey, input.idempotencyKey))
    .limit(1);
  return existing;
}

// Runnable self-check for the money logic: `tsx src/points.ts`
async function demo() {
  const assert = (c: boolean, m: string) => {
    if (!c) throw new Error("FAIL: " + m);
  };
  const [u] = await db
    .insert(schema.users)
    .values({
      email: `ledger-demo-${Date.now()}@t2t.local`,
      passwordHash: "x",
      displayName: "demo",
    })
    .returning();
  try {
    assert((await getBalance(u.id)) === 0, "new user balance is 0");
    await award({ userId: u.id, amount: 100, reason: "adjustment", idempotencyKey: `k1-${u.id}` });
    assert((await getBalance(u.id)) === 100, "after +100 -> 100");
    // same key again must NOT double-credit
    await award({ userId: u.id, amount: 100, reason: "adjustment", idempotencyKey: `k1-${u.id}` });
    assert((await getBalance(u.id)) === 100, "idempotent: still 100");
    await award({ userId: u.id, amount: 50, reason: "adjustment", idempotencyKey: `k2-${u.id}` });
    assert((await getBalance(u.id)) === 150, "after +50 -> 150");
    console.log("points self-check: PASS");
  } finally {
    await db.delete(schema.pointLedger).where(eq(schema.pointLedger.userId, u.id));
    await db.delete(schema.users).where(eq(schema.users.id, u.id));
  }
  process.exit(0);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  demo().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
