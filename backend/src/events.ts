// In-memory ring buffer of recent API calls, for the local monitoring GUI.
// ponytail: dev observability only — not persisted, capped, no sensitive data (headers excluded).
export type ApiEvent = {
  time: string;
  method: string;
  path: string;
  status: number;
  ms: number;
};

const MAX = 300;
const buf: ApiEvent[] = [];

export function pushEvent(e: ApiEvent) {
  buf.push(e);
  if (buf.length > MAX) buf.shift();
}

export function recentEvents(): ApiEvent[] {
  return buf.slice().reverse(); // newest first
}
