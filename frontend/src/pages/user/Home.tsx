import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { Upload, Coins, Camera } from "lucide-react";
import { CATEGORY_LABEL } from "@t2t/shared";
import { api, type Submission, ApiError } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function StatusBadge({ status }: { status: Submission["status"] }) {
  const map = {
    pending: ["secondary", "Pending"],
    needs_review: ["warning", "In review"],
    approved: ["default", "Approved"],
    rejected: ["destructive", "Rejected"],
  } as const;
  const [variant, label] = map[status];
  return <Badge variant={variant}>{label}</Badge>;
}

export default function Home() {
  const [balance, setBalance] = useState(0);
  const [subs, setSubs] = useState<Submission[]>([]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    const [w, s] = await Promise.all([api.wallet(), api.mySubmissions()]);
    setBalance(w.balance);
    setSubs(s.submissions);
  };
  useEffect(() => {
    load();
  }, []);

  const onFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setBusy(true);
    setMsg(null);
    // Attach timestamp + GPS (best-effort) — helps the team spot faked/reused photos.
    const meta: { lat?: number; lng?: number; capturedAt: string } = {
      capturedAt: new Date().toISOString(),
    };
    try {
      const pos = await new Promise<GeolocationPosition>((res, rej) =>
        navigator.geolocation.getCurrentPosition(res, rej, { timeout: 4000 }),
      );
      meta.lat = pos.coords.latitude;
      meta.lng = pos.coords.longitude;
    } catch {
      // location denied/unavailable — upload without it
    }
    try {
      await api.uploadSubmission(f, meta);
      setMsg("Uploaded! The model is classifying it…");
      await load();
      setTimeout(load, 3500); // refresh after the worker processes it
    } catch (err) {
      setMsg(err instanceof ApiError ? err.message : "upload failed");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Coins className="text-primary" size={18} /> Eco-points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">{balance}</div>
            <p className="text-sm text-muted-foreground">available to redeem</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Camera size={18} /> Submit trash photo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={onFile}
            />
            <Button className="w-full" disabled={busy} onClick={() => fileRef.current?.click()}>
              <Upload size={16} /> {busy ? "Uploading…" : "Take / upload photo"}
            </Button>
            {msg && <p className="mt-2 text-sm text-muted-foreground">{msg}</p>}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Your submissions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {subs.length === 0 && <p className="text-sm text-muted-foreground">No submissions yet.</p>}
          {subs.map((s) => (
            <div key={s.id} className="flex items-center gap-3 rounded-md border p-2">
              <img
                src={`/api/images/${s.imageKey}`}
                alt=""
                className="h-12 w-12 rounded bg-secondary object-cover"
              />
              <div className="flex-1 text-sm">
                <div>
                  {s.mlCategory ? CATEGORY_LABEL[s.mlCategory] : "—"}{" "}
                  {s.awardedPoints != null && (
                    <span className="font-medium text-primary">+{s.awardedPoints}</span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date(s.createdAt).toLocaleString()}
                </div>
              </div>
              <StatusBadge status={s.status} />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
