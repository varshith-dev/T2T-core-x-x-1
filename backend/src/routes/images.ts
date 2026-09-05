import type { FastifyInstance } from "fastify";
import { createReadStream, existsSync } from "node:fs";
import { extname } from "node:path";
import { isR2, imageUrl, localPathFor } from "../storage.js";

const TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

export async function imageRoutes(app: FastifyInstance) {
  // ponytail: public access by unguessable UUID key so plain <img src> works
  // (img tags can't send an auth header). R2 -> redirect to a signed/public URL;
  // local -> stream the file from disk.
  app.get("/images/:key", async (req, reply) => {
    const { key } = req.params as { key: string };
    if (!/^[A-Za-z0-9._-]+$/.test(key)) return reply.code(400).send({ error: "bad key" });

    if (isR2()) {
      const url = await imageUrl(key);
      if (!url) return reply.code(404).send({ error: "not found" });
      return reply.redirect(url);
    }

    const p = localPathFor(key);
    if (!existsSync(p)) return reply.code(404).send({ error: "not found" });
    return reply
      .type(TYPES[extname(key).toLowerCase()] ?? "application/octet-stream")
      .send(createReadStream(p));
  });
}
