import { z } from "zod";

// Load apps/api/.env in dev; in prod the vars come from the real environment.
try {
  process.loadEnvFile();
} catch {
  // no .env file — rely on process.env (production)
}

const schema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(16),
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  ML_SERVICE_URL: z.string().url().default("http://localhost:8000"),
  ML_CONFIDENCE_THRESHOLD: z.coerce.number().min(0).max(1).default(0.75),
  // Optional bootstrap admin — created on first boot if no admin exists.
  ADMIN_EMAIL: z.string().email().optional(),
  ADMIN_PASSWORD: z.string().min(8).optional(),
});

export const env = schema.parse(process.env);
