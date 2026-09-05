import {
  pgTable,
  pgEnum,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  doublePrecision,
  index,
} from "drizzle-orm/pg-core";
import { ROLES, CATEGORIES } from "@t2t/shared";

export const roleEnum = pgEnum("role", ROLES);
export const categoryEnum = pgEnum("category", CATEGORIES);
export const userStatusEnum = pgEnum("user_status", ["active", "suspended"]);
export const submissionStatusEnum = pgEnum("submission_status", [
  "pending", // job queued, not yet classified
  "needs_review", // low confidence -> reviewer queue
  "approved", // points awarded (auto or by reviewer)
  "rejected",
]);
export const ledgerReasonEnum = pgEnum("ledger_reason", [
  "submission_award",
  "redemption",
  "adjustment",
  "reversal",
]);
export const redemptionStatusEnum = pgEnum("redemption_status", [
  "pending",
  "approved",
  "rejected",
  "fulfilled",
]);

// One table for everyone; `role` gates the dashboard. Employees = role != 'user'.
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  displayName: text("display_name").notNull(),
  role: roleEnum("role").notNull().default("user"),
  status: userStatusEnum("status").notNull().default("active"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// Editable point rules per category (admin-managed). No hardcoded points in code.
export const pointRules = pgTable("point_rules", {
  category: categoryEnum("category").primaryKey(),
  points: integer("points").notNull(),
  dailyCap: integer("daily_cap").notNull().default(10), // max awarded submissions/day/user
  active: boolean("active").notNull().default(true),
});

export const submissions = pgTable(
  "submissions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    imageKey: text("image_key").notNull(), // R2 object key
    imagePhash: text("image_phash"), // perceptual hash for dup detection
    status: submissionStatusEnum("status").notNull().default("pending"),
    mlCategory: categoryEnum("ml_category"),
    mlConfidence: doublePrecision("ml_confidence"),
    mlModelVersion: text("ml_model_version"),
    productName: text("product_name"), // specific item name from the model
    awardedPoints: integer("awarded_points"),
    reviewedBy: uuid("reviewed_by").references(() => users.id),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
    lat: doublePrecision("lat"),
    lng: doublePrecision("lng"),
    capturedAt: timestamp("captured_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    userIdx: index("submissions_user_idx").on(t.userId),
    statusIdx: index("submissions_status_idx").on(t.status),
    phashIdx: index("submissions_phash_idx").on(t.imagePhash),
  }),
);

// Append-only ledger. Balance = SUM(delta) per user. NEVER store a balance column.
// idempotencyKey (unique) makes every award/redeem safe to retry.
export const pointLedger = pgTable(
  "point_ledger",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    delta: integer("delta").notNull(), // + award, - redeem
    reason: ledgerReasonEnum("reason").notNull(),
    refType: text("ref_type"), // 'submission' | 'redemption' | ...
    refId: uuid("ref_id"),
    idempotencyKey: text("idempotency_key").notNull().unique(),
    createdBy: uuid("created_by").references(() => users.id), // null = system
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    userIdx: index("ledger_user_idx").on(t.userId),
  }),
);

export const coupons = pgTable("coupons", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  costPoints: integer("cost_points").notNull(),
  stock: integer("stock").notNull().default(0),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const redemptions = pgTable(
  "redemptions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    couponId: uuid("coupon_id")
      .notNull()
      .references(() => coupons.id),
    costPoints: integer("cost_points").notNull(),
    status: redemptionStatusEnum("status").notNull().default("pending"),
    idempotencyKey: text("idempotency_key").notNull().unique(),
    approvedBy: uuid("approved_by").references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    userIdx: index("redemptions_user_idx").on(t.userId),
  }),
);
