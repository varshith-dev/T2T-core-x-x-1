import { and, eq, gte, sql } from "drizzle-orm";
import { db, schema } from "./db/index.js";
import { env } from "./env.js";
import { award } from "./points.js";
import { classifyImage } from "./ml.js";

// ponytail: single in-process poll loop, one submission at a time. To run multiple
// worker instances later, claim rows with `.for("update", { skipLocked: true })`.
let running = false;

async function toReview(id: string, ml: { category?: string; confidence?: number; modelVersion?: string } | null) {
  await db
    .update(schema.submissions)
    .set({
      status: "needs_review",
      mlCategory: ml?.category as any,
      mlConfidence: ml?.confidence,
      mlModelVersion: ml?.modelVersion,
    })
    .where(eq(schema.submissions.id, id));
}

async function processOne(): Promise<boolean> {
  const [sub] = await db
    .select()
    .from(schema.submissions)
    .where(eq(schema.submissions.status, "pending"))
    .orderBy(schema.submissions.createdAt)
    .limit(1);
  if (!sub) return false;

  const ml = await classifyImage(sub.imageKey);
  // ML down or unsure -> human review
  if (!ml || ml.confidence < env.ML_CONFIDENCE_THRESHOLD) {
    await toReview(sub.id, ml);
    return true;
  }

  const [rule] = await db
    .select()
    .from(schema.pointRules)
    .where(eq(schema.pointRules.category, ml.category))
    .limit(1);

  // daily cap: count this user's approved submissions today
  const [cnt] = await db
    .select({ c: sql<string>`count(*)` })
    .from(schema.submissions)
    .where(
      and(
        eq(schema.submissions.userId, sub.userId),
        eq(schema.submissions.status, "approved"),
        gte(schema.submissions.createdAt, sql`date_trunc('day', now())`),
      ),
    );
  const overCap = rule ? Number(cnt?.c ?? 0) >= rule.dailyCap : false;

  // no active rule or over the daily cap -> let a human decide
  if (!rule || !rule.active || overCap) {
    await toReview(sub.id, ml);
    return true;
  }

  await award({
    userId: sub.userId,
    amount: rule.points,
    reason: "submission_award",
    refType: "submission",
    refId: sub.id,
    idempotencyKey: `submission:${sub.id}`,
  });
  await db
    .update(schema.submissions)
    .set({
      status: "approved",
      mlCategory: ml.category,
      mlConfidence: ml.confidence,
      mlModelVersion: ml.modelVersion,
      awardedPoints: rule.points,
    })
    .where(eq(schema.submissions.id, sub.id));
  return true;
}

export function startWorker(log: { info: (m: string) => void; error: (e: unknown) => void }) {
  const tick = async () => {
    if (running) return;
    running = true;
    try {
      let n = 0;
      while (n < 10 && (await processOne())) n++;
    } catch (e) {
      log.error(e);
    } finally {
      running = false;
    }
  };
  setInterval(tick, 2000);
  log.info("submission worker started (2s poll)");
}
