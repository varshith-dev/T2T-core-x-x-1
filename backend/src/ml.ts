import { mlResultSchema, type MlResult } from "@t2t/shared";
import { env } from "./env.js";
import { getBytes } from "./storage.js";

// Calls the Python ML service. Returns null if it's unreachable or errors —
// the caller then routes the photo to the human Reviewer queue (safe fallback).
export async function classifyImage(imageKey: string): Promise<MlResult | null> {
  try {
    const buf = await getBytes(imageKey);
    const form = new FormData();
    form.append("file", new Blob([new Uint8Array(buf)]), imageKey);
    const res = await fetch(`${env.ML_SERVICE_URL}/classify`, {
      method: "POST",
      body: form,
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) return null;
    return mlResultSchema.parse(await res.json());
  } catch {
    return null;
  }
}
