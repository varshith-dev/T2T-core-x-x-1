import type { FastifyInstance } from "fastify";
import { sql, type SQL } from "drizzle-orm";
import { db } from "../db/index.js";
import { authenticate, requireRole } from "../auth.js";

const rows = async <T = Record<string, any>>(query: SQL): Promise<T[]> =>
  (await db.execute(query)) as unknown as T[];
const one = async (query: SQL): Promise<any> => (await rows(query))[0] ?? {};

// Predefined read-only queries for the Database viewer (no user input in SQL; password_hash never exposed).
const DB_TABLES: Record<string, string> = {
  users: "select id, email, display_name, role, status, created_at from users order by created_at desc limit 200",
  submissions:
    "select id, user_id, status, ml_category, final_category, product_name, ml_confidence, ml_is_waste, awarded_points, created_at from submissions order by created_at desc limit 200",
  point_ledger:
    "select id, user_id, delta, reason, ref_type, created_at from point_ledger order by created_at desc limit 200",
  coupons: "select id, title, cost_points, stock, active, created_at from coupons order by created_at desc limit 200",
  redemptions:
    "select id, user_id, coupon_id, cost_points, status, created_at from redemptions order by created_at desc limit 200",
  point_rules: "select category, points, daily_cap, active from point_rules order by category",
};

export async function dashboardRoutes(app: FastifyInstance) {
  const admin = { preHandler: requireRole("admin") };

  // ---- Analytics ----
  app.get("/admin/analytics", admin, async () => {
    const head = await one(sql`select
      (select count(*) from users) as users,
      (select count(*) from submissions) as submissions,
      (select count(*) from submissions where status='approved') as approved,
      (select coalesce(sum(delta) filter (where delta>0),0) from point_ledger) as points_issued,
      (select coalesce(-sum(delta) filter (where delta<0),0) from point_ledger) as points_spent,
      (select count(*) from coupons where active) as coupons,
      (select count(*) from redemptions where status='pending') as redemptions_pending`);
    return {
      head,
      submissionsByDay: await rows(sql`select to_char(date_trunc('day',created_at),'MM-DD') as d, count(*)::int as n
        from submissions where created_at > now() - interval '14 days' group by 1 order by 1`),
      pointsByDay: await rows(sql`select to_char(date_trunc('day',created_at),'MM-DD') as d,
        coalesce(sum(delta) filter (where delta>0),0)::int as issued,
        coalesce(-sum(delta) filter (where delta<0),0)::int as spent
        from point_ledger where created_at > now() - interval '14 days' group by 1 order by 1`),
      statusBreakdown: await rows(sql`select status, count(*)::int as n from submissions group by 1`),
      categoryBreakdown: await rows(sql`select final_category as category, count(*)::int as n
        from submissions where status='approved' and final_category is not null group by 1 order by 2 desc`),
    };
  });

  // ---- ML performance ----
  app.get("/admin/ml", admin, async () => ({
    confidenceBuckets: await rows(sql`select width_bucket(ml_confidence,0,1,10) as bucket, count(*)::int as n
      from submissions where ml_confidence is not null group by 1 order by 1`),
    gate: await rows(sql`select ml_is_waste as is_waste, count(*)::int as n
      from submissions where ml_is_waste is not null group by 1`),
    agreement: await one(sql`select
      count(*) filter (where ml_category = final_category)::int as agree,
      count(*)::int as total
      from submissions where ml_category is not null and final_category is not null`),
    models: await rows(sql`select ml_model_version as model, count(*)::int as n
      from submissions where ml_model_version is not null group by 1 order by 2 desc`),
    mismatches: await rows(sql`select id, ml_category, final_category, round(ml_confidence::numeric,2) as confidence
      from submissions where ml_category is not null and final_category is not null and ml_category <> final_category
      order by created_at desc limit 20`),
  }));

  // ---- Fraud / anomaly ----
  app.get("/admin/fraud", admin, async () => ({
    duplicates: await rows(sql`select image_phash, count(*)::int as n from submissions
      where image_phash is not null group by 1 having count(*) > 1 order by 2 desc limit 20`),
    notWasteCount: (await one(sql`select count(*)::int as n from submissions where ml_is_waste = false`)).n,
    topUsersToday: await rows(sql`select u.display_name, count(*)::int as n from submissions s
      join users u on u.id = s.user_id where s.created_at > date_trunc('day', now())
      group by 1 order by 2 desc limit 10`),
    flagged: await rows(sql`select s.id, u.display_name, s.ml_category, round(s.ml_waste_score::numeric,2) as waste_score, s.created_at
      from submissions s join users u on u.id = s.user_id
      where s.ml_is_waste = false order by s.created_at desc limit 20`),
  }));

  // ---- Coupon analytics ----
  app.get("/admin/coupon-stats", admin, async () => ({
    byStatus: await rows(sql`select status, count(*)::int as n from redemptions group by 1`),
    popular: await rows(sql`select c.title, count(*)::int as n from redemptions r
      join coupons c on c.id = r.coupon_id group by 1 order by 2 desc limit 10`),
    stock: await rows(sql`select title, stock, cost_points, active from coupons order by cost_points`),
    liability: (await one(sql`select coalesce(sum(delta),0)::int as n from point_ledger`)).n,
  }));

  // ---- Audit ----
  app.get("/admin/audit", admin, async () => ({
    ledger: await rows(sql`select l.created_at, u.display_name, l.delta, l.reason, l.ref_type
      from point_ledger l join users u on u.id = l.user_id order by l.created_at desc limit 100`),
    reviews: await rows(sql`select s.reviewed_at, r.display_name as reviewer, s.final_category, s.status
      from submissions s join users r on r.id = s.reviewed_by
      where s.reviewed_by is not null order by s.reviewed_at desc limit 50`),
  }));

  // ---- Users (detailed) ----
  app.get("/admin/users-detail", admin, async () => ({
    users: await rows(sql`select u.id, u.email, u.display_name, u.role, u.status, u.created_at,
      coalesce(sum(l.delta),0)::int as balance,
      (select count(*) from submissions s where s.user_id = u.id)::int as submissions
      from users u left join point_ledger l on l.user_id = u.id
      group by u.id order by u.created_at desc limit 500`),
  }));

  // ---- Database viewer ----
  app.get("/admin/db/tables", admin, async () => {
    const tables: { name: string; count: number }[] = [];
    for (const name of Object.keys(DB_TABLES)) {
      const c = await one(sql.raw(`select count(*)::int as n from ${name}`));
      tables.push({ name, count: c.n });
    }
    return { tables };
  });
  app.get("/admin/db/:table", admin, async (req, reply) => {
    const { table } = req.params as { table: string };
    const query = DB_TABLES[table];
    if (!query) return reply.code(404).send({ error: "unknown table" });
    return { rows: await rows(sql.raw(query)) };
  });

  // ---- Leaderboard (any signed-in user) ----
  app.get("/leaderboard", { preHandler: authenticate }, async () => ({
    top: await rows(sql`select u.display_name,
      coalesce(sum(l.delta) filter (where l.delta>0),0)::int as earned
      from users u left join point_ledger l on l.user_id = u.id
      where u.role = 'user' group by u.id, u.display_name order by earned desc limit 20`),
  }));
}
