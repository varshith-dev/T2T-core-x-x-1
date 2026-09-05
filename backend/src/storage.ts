import { randomUUID } from "node:crypto";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const localDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", ".uploads");

// S3 is used when S3_BUCKET is set; credentials come from the EC2 instance role
// (default provider chain) — no keys stored anywhere. Otherwise: local disk.
const BUCKET = process.env.S3_BUCKET;
const REGION = process.env.AWS_REGION ?? "ap-south-1";
const s3 = BUCKET ? new S3Client({ region: REGION }) : null;

const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

export const isCloud = () => !!s3;
export const localPathFor = (key: string) => path.join(localDir, key);

export type StoredImage = { key: string };

export async function putImage(buf: Buffer, ext: string): Promise<StoredImage> {
  const e = ext.startsWith(".") ? ext : "." + ext;
  const key = `${randomUUID()}${e}`;
  if (s3) {
    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: buf,
        ContentType: CONTENT_TYPES[e.toLowerCase()] ?? "application/octet-stream",
      }),
    );
  } else {
    await mkdir(localDir, { recursive: true });
    await writeFile(localPathFor(key), buf);
  }
  return { key };
}

// Raw bytes (used by the ML worker to classify). Works for S3 or local.
export async function getBytes(key: string): Promise<Buffer> {
  if (s3) {
    const r = await s3.send(new GetObjectCommand({ Bucket: BUCKET, Key: key }));
    return Buffer.from(await r.Body!.transformToByteArray());
  }
  return readFile(localPathFor(key));
}

// Short-lived signed URL for S3-hosted images; null when local (route streams the file).
export async function imageUrl(key: string): Promise<string | null> {
  if (!s3) return null;
  return getSignedUrl(s3, new GetObjectCommand({ Bucket: BUCKET, Key: key }), { expiresIn: 3600 });
}
