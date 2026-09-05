import { z } from "zod";

// ---- Roles (fixed set; gates the dashboard) ----
export const ROLES = ["user", "reviewer", "catalog_manager", "admin"] as const;
export type Role = (typeof ROLES)[number];

// ---- Segregation categories. Appended (never reorder) so the DB enum change
// stays additive. The ML service maps its own labels onto these. ----
export const CATEGORIES = [
  "cardboard",
  "glass",
  "metal",
  "paper",
  "plastic",
  "trash",
  "organic",
  "ewaste",
] as const;
export type Category = (typeof CATEGORIES)[number];

// Human labels for the UI.
export const CATEGORY_LABEL: Record<Category, string> = {
  organic: "Organic / Wet",
  plastic: "Plastic",
  paper: "Paper",
  cardboard: "Cardboard",
  metal: "Metal",
  glass: "Glass",
  ewaste: "E-waste",
  trash: "Trash / Other",
};

// ---- Auth ----
export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(200),
  displayName: z.string().min(1).max(80),
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
export type LoginInput = z.infer<typeof loginSchema>;

// ---- Submission (client sends metadata; image uploaded separately to R2) ----
export const submissionSchema = z.object({
  imageKey: z.string().min(1), // R2 object key
  capturedAt: z.string().datetime().optional(),
  lat: z.number().min(-90).max(90).optional(),
  lng: z.number().min(-180).max(180).optional(),
});
export type SubmissionInput = z.infer<typeof submissionSchema>;

// ---- Redemption ----
export const redeemSchema = z.object({
  couponId: z.string().uuid(),
});
export type RedeemInput = z.infer<typeof redeemSchema>;

// ---- Coupons (catalog_manager / admin) ----
export const couponCreateSchema = z.object({
  title: z.string().min(1).max(120),
  description: z.string().max(1000).optional(),
  costPoints: z.number().int().positive(),
  stock: z.number().int().min(0).default(0),
});
export type CouponCreateInput = z.infer<typeof couponCreateSchema>;

export const couponUpdateSchema = couponCreateSchema.partial().extend({
  active: z.boolean().optional(),
});
export type CouponUpdateInput = z.infer<typeof couponUpdateSchema>;

// ---- Admin ----
export const pointRuleUpdateSchema = z.object({
  points: z.number().int().min(0),
  dailyCap: z.number().int().min(0),
  active: z.boolean(),
});
export type PointRuleUpdateInput = z.infer<typeof pointRuleUpdateSchema>;

export const roleUpdateSchema = z.object({ role: z.enum(ROLES) });
export type RoleUpdateInput = z.infer<typeof roleUpdateSchema>;

// ---- Review ----
export const reviewApproveSchema = z.object({ category: z.enum(CATEGORIES) });
export type ReviewApproveInput = z.infer<typeof reviewApproveSchema>;

// ---- ML service response contract ----
export const mlResultSchema = z.object({
  category: z.enum(CATEGORIES),
  confidence: z.number().min(0).max(1),
  modelVersion: z.string(),
});
export type MlResult = z.infer<typeof mlResultSchema>;
