import { eq } from "drizzle-orm";
import { CATEGORIES } from "@t2t/shared";
import { db, schema } from "./db/index.js";
import { env } from "./env.js";
import { hashPassword } from "./auth.js";

// Default eco-points per category (admin can edit via /admin/point-rules).
const DEFAULT_POINTS: Record<string, number> = {
  cardboard: 5,
  paper: 5,
  glass: 8,
  plastic: 10,
  metal: 12,
  organic: 6,
  ewaste: 20,
  trash: 1,
};

export async function seed(log: (m: string) => void) {
  for (const category of CATEGORIES) {
    await db
      .insert(schema.pointRules)
      .values({ category, points: DEFAULT_POINTS[category] ?? 5, dailyCap: 10, active: true })
      .onConflictDoNothing({ target: schema.pointRules.category });
  }

  await bootstrap(env.ADMIN_EMAIL, env.ADMIN_PASSWORD, "admin", "Admin", log);
  await bootstrap(env.SUPER_ADMIN_EMAIL, env.SUPER_ADMIN_PASSWORD, "super_admin", "Super Admin", log);
}

async function bootstrap(
  emailRaw: string | undefined,
  password: string | undefined,
  role: "admin" | "super_admin",
  displayName: string,
  log: (m: string) => void,
) {
  if (!emailRaw || !password) return;
  const email = emailRaw.toLowerCase();
  const [existing] = await db
    .select({ id: schema.users.id, role: schema.users.role })
    .from(schema.users)
    .where(eq(schema.users.email, email))
    .limit(1);
  if (!existing) {
    await db.insert(schema.users).values({
      email,
      passwordHash: await hashPassword(password),
      displayName,
      role,
    });
    log(`bootstrapped ${role}: ${email}`);
  } else if (existing.role !== role && role === "super_admin") {
    await db.update(schema.users).set({ role }).where(eq(schema.users.id, existing.id));
    log(`promoted ${email} to ${role}`);
  }
}
