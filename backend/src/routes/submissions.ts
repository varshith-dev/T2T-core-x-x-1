import type { FastifyInstance } from "fastify";
import { createHash } from "node:crypto";
import { desc, eq } from "drizzle-orm";
import { db, schema } from "../db/index.js";
import { authenticate } from "../auth.js";
import { putImage } from "../storage.js";

const numOf = (v: unknown) =>
  v != null && v !== "" && !Number.isNaN(Number(v)) ? Number(v) : undefined;

export async function submissionRoutes(app: FastifyInstance) {
  // Upload one image (multipart). Optional fields: lat, lng, capturedAt.
  app.post("/submissions", { preHandler: authenticate }, async (req, reply) => {
    const file = await req.file();
    if (!file) return reply.code(400).send({ error: "image file required" });
    if (!file.mimetype?.startsWith("image/")) {
      return reply.code(400).send({ error: "file must be an image" });
    }
    const buf = await file.toBuffer();
    if (buf.length === 0) return reply.code(400).send({ error: "empty file" });

    // ponytail: exact-duplicate detection via sha256 (blocks reused/downloaded photos).
    // Perceptual (near-duplicate) hash is the upgrade if users start cropping to evade.
    const hash = createHash("sha256").update(buf).digest("hex");
    const [dup] = await db
      .select({ id: schema.submissions.id })
      .from(schema.submissions)
      .where(eq(schema.submissions.imagePhash, hash))
      .limit(1);
    if (dup) return reply.code(409).send({ error: "duplicate image" });

    const ext = file.mimetype.split("/")[1] ?? "jpg";
    const { key } = await putImage(buf, ext);

    const fields = file.fields as Record<string, { value?: string }> | undefined;
    const capturedRaw = fields?.capturedAt?.value;
    const [sub] = await db
      .insert(schema.submissions)
      .values({
        userId: req.user.sub,
        imageKey: key,
        imagePhash: hash,
        status: "pending",
        lat: numOf(fields?.lat?.value),
        lng: numOf(fields?.lng?.value),
        capturedAt: capturedRaw ? new Date(capturedRaw) : undefined,
      })
      .returning();
    return reply.code(201).send({ submission: sub });
  });

  // The signed-in user's own submissions.
  app.get("/submissions", { preHandler: authenticate }, async (req) => {
    const rows = await db
      .select()
      .from(schema.submissions)
      .where(eq(schema.submissions.userId, req.user.sub))
      .orderBy(desc(schema.submissions.createdAt))
      .limit(50);
    return { submissions: rows };
  });
}
