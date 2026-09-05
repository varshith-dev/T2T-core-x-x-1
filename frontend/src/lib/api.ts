import type { Role, Category } from "@t2t/shared";

const BASE = "/api";
const TOKEN_KEY = "t2t_token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t: string | null) =>
  t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY);

export class ApiError extends Error {
  constructor(public status: number, message: string, public data?: unknown) {
    super(message);
  }
}

type Opts = { method?: string; body?: unknown; form?: FormData };

async function req<T>(path: string, opts: Opts = {}): Promise<T> {
  const headers: Record<string, string> = {};
  const token = getToken();
  if (token) headers.authorization = "Bearer " + token;

  let body: BodyInit | undefined;
  if (opts.form) body = opts.form;
  else if (opts.body !== undefined) {
    headers["content-type"] = "application/json";
    body = JSON.stringify(opts.body);
  }

  const res = await fetch(BASE + path, {
    method: opts.method ?? (body ? "POST" : "GET"),
    headers,
    body,
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) throw new ApiError(res.status, data?.error ?? "request failed", data);
  return data as T;
}

// ---- Types (API shapes) ----
export type User = { id: string; email: string; displayName: string; role: Role; status: string };
export type Submission = {
  id: string;
  status: "pending" | "needs_review" | "approved" | "rejected";
  mlCategory: Category | null;
  mlConfidence: number | null;
  mlModelVersion: string | null;
  awardedPoints: number | null;
  imageKey: string;
  createdAt: string;
};
export type LedgerEntry = { id: string; delta: number; reason: string; createdAt: string };
export type Coupon = {
  id: string;
  title: string;
  description: string | null;
  costPoints: number;
  stock: number;
  active: boolean;
};
export type PointRule = { category: Category; points: number; dailyCap: number; active: boolean };
export type Redemption = {
  id: string;
  userId: string;
  couponId: string;
  costPoints: number;
  status: string;
  createdAt: string;
};

export const api = {
  // auth
  register: (b: { email: string; password: string; displayName: string }) =>
    req<{ token: string; user: User }>("/auth/register", { body: b }),
  login: (b: { email: string; password: string }) =>
    req<{ token: string; user: User }>("/auth/login", { body: b }),
  me: () => req<{ user: User | null }>("/auth/me"),

  // user
  uploadSubmission: (file: File, meta?: { lat?: number; lng?: number; capturedAt?: string }) => {
    const fd = new FormData();
    fd.append("file", file);
    if (meta?.lat != null) fd.append("lat", String(meta.lat));
    if (meta?.lng != null) fd.append("lng", String(meta.lng));
    if (meta?.capturedAt) fd.append("capturedAt", meta.capturedAt);
    return req<{ submission: Submission }>("/submissions", { form: fd });
  },
  mySubmissions: () => req<{ submissions: Submission[] }>("/submissions"),
  wallet: () => req<{ balance: number; history: LedgerEntry[] }>("/wallet"),
  coupons: () => req<{ coupons: Coupon[] }>("/coupons"),
  redeem: (couponId: string) =>
    req<{ balance: number }>(`/coupons/${couponId}/redeem`, { method: "POST", body: {} }),

  // reviewer
  reviewQueue: () => req<{ submissions: Submission[] }>("/review/queue"),
  approve: (id: string, category: Category) =>
    req<{ awarded: number }>(`/review/${id}/approve`, { body: { category } }),
  reject: (id: string) => req(`/review/${id}/reject`, { method: "POST", body: {} }),

  // catalog manager
  createCoupon: (b: { title: string; description?: string; costPoints: number; stock: number }) =>
    req<{ coupon: Coupon }>("/coupons", { body: b }),
  updateCoupon: (id: string, b: Partial<Coupon>) =>
    req<{ coupon: Coupon }>(`/coupons/${id}`, { method: "PATCH", body: b }),
  redemptions: () => req<{ redemptions: Redemption[] }>("/redemptions"),
  fulfill: (id: string) => req(`/redemptions/${id}/fulfill`, { method: "POST", body: {} }),
  rejectRedemption: (id: string) => req(`/redemptions/${id}/reject`, { method: "POST", body: {} }),

  // admin
  pointRules: () => req<{ rules: PointRule[] }>("/admin/point-rules"),
  setPointRule: (category: string, b: { points: number; dailyCap: number; active: boolean }) =>
    req<{ rule: PointRule }>(`/admin/point-rules/${category}`, { method: "PUT", body: b }),
  users: () => req<{ users: User[] }>("/admin/users"),
  setRole: (id: string, role: Role) =>
    req(`/admin/users/${id}/role`, { method: "PATCH", body: { role } }),
};
