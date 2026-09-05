import { randomUUID } from "node:crypto";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { AwsClient } from "aws4fetch";

const localDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", ".uploads");

// R2 is used when all creds are present; otherwise everything falls back to local disk.
const R2 = {
  account: process.env.R2_ACCOUNT_ID,
  key: process.env.R2_ACCESS_KEY_ID,
  secret: process.env.R2_SECRET_ACCESS_KEY,
  bucket: process.env.R2_BUCKET,
  publicBase: process.env.R2_PUBLIC_BASE_URL,
};
const r2Enabled = !!(R2.account && R2.key && R2.secret && R2.bucket);
const client = r2Enabled ? new AwsClient({ accessKeyId: R2.key!, secretAccessKey: R2.secret! }) : null;
const endpoint = r2Enabled
  ? `https://${R2.account}.r2.cloudflarestorage.com/${R2.bucket}`
  : "";

const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

export const isR2 = () => r2Enabled;
export const localPathFor = (key: string) => path.join(localDir, key);

export type StoredImage = { key: string };

export async function putImage(buf: Buffer, ext: string): Promise<StoredImage> {
  const e = ext.startsWith(".") ? ext : "." + ext;
  const key = `${randomUUID()}${e}`;
  if (client) {
    const res = await client.fetch(`${endpoint}/${key}`, {
      method: "PUT",
      body: new Uint8Array(buf),
      headers: { "content-type": CONTENT_TYPES[e.toLowerCase()] ?? "application/octet-stream" },
    });
    if (!res.ok) throw new Error(`R2 upload failed: ${res.status}`);
  } else {
    await mkdir(localDir, { recursive: true });
    await writeFile(localPathFor(key), buf);
  }
  return { key };
}

// Raw bytes (used by the ML worker to classify). Works for both backends.
export async function getBytes(key: string): Promise<Buffer> {
  if (client) {
    const res = await client.fetch(`${endpoint}/${key}`);
    if (!res.ok) throw new Error(`R2 get failed: ${res.status}`);
    return Buffer.from(await res.arrayBuffer());
  }
  return readFile(localPathFor(key));
}

// Absolute URL for R2-hosted images (public base or presigned); null when local
// (the /images/:key route streams local files instead).
export async function imageUrl(key: string): Promise<string | null> {
  if (!client) return null;
  if (R2.publicBase) return `${R2.publicBase.replace(/\/$/, "")}/${key}`;
  const signed = await client.sign(`${endpoint}/${key}?X-Amz-Expires=3600`, {
    method: "GET",
    aws: { signQuery: true },
  });
  return signed.url;
}
