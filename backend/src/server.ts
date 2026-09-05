import Fastify, { type FastifyError } from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import jwt from "@fastify/jwt";
import multipart from "@fastify/multipart";
import { ZodError } from "zod";
import { env } from "./env.js";
import { authRoutes } from "./routes/auth.js";
import { submissionRoutes } from "./routes/submissions.js";
import { imageRoutes } from "./routes/images.js";
import { walletRoutes } from "./routes/wallet.js";
import { couponRoutes } from "./routes/coupons.js";
import { reviewRoutes } from "./routes/review.js";
import { adminRoutes } from "./routes/admin.js";
import { dashboardRoutes } from "./routes/dashboards.js";
import { seed } from "./seed.js";
import { startWorker } from "./worker.js";
import { pushEvent, recentEvents } from "./events.js";

// T2T API entrypoint: security plugins, routes, seed, then the submission worker.
const app = Fastify({ logger: true });

await app.register(helmet);
await app.register(cors, { origin: true });
await app.register(rateLimit, { max: 100, timeWindow: "1 minute" });
await app.register(jwt, { secret: env.JWT_SECRET });
await app.register(multipart, { limits: { fileSize: 10 * 1024 * 1024 } }); // 10 MB images

// Validation errors -> 400 with field details.
app.setErrorHandler((err: FastifyError, _req, reply) => {
  if (err instanceof ZodError) {
    return reply.code(400).send({ error: "validation", issues: err.issues });
  }
  reply.log.error(err);
  return reply.code(err.statusCode ?? 500).send({ error: err.message ?? "internal error" });
});

app.get("/health", async () => ({ status: "ok" }));

// Record every request for the local monitoring GUI, and expose the feed.
app.addHook("onResponse", async (req, reply) => {
  if (req.url.startsWith("/debug/")) return;
  pushEvent({
    time: new Date().toISOString(),
    method: req.method,
    path: req.url,
    status: reply.statusCode,
    ms: Math.round(reply.elapsedTime),
  });
});
app.get("/debug/events", async () => ({ events: recentEvents() }));

await app.register(authRoutes);
await app.register(submissionRoutes);
await app.register(imageRoutes);
await app.register(walletRoutes);
await app.register(couponRoutes);
await app.register(reviewRoutes);
await app.register(adminRoutes);
await app.register(dashboardRoutes);

try {
  await seed((m) => app.log.info(m));
  const addr = await app.listen({ port: env.PORT, host: "0.0.0.0" });
  app.log.info(`API listening on ${addr}`);
  startWorker({ info: (m) => app.log.info(m), error: (e) => app.log.error(e) });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
