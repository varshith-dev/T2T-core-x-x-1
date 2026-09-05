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

  if (env.ADMIN_EMAIL && env.ADMIN_PASSWORD) {
    const email = env.ADMIN_EMAIL.toLowerCase();
    const [existing] = await db
      .select({ id: schema.users.id })
      .from(schema.users)
      .where(eq(schema.users.email, email))
      .limit(1);
    if (!existing) {
      await db.insert(schema.users).values({
        email,
        passwordHash: await hashPassword(env.ADMIN_PASSWORD),
        displayName: "Admin",
        role: "admin",
      });
      log(`bootstrapped admin user: ${email}`);
    }
  }
}
