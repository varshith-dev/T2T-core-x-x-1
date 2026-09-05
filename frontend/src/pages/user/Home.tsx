import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { Camera, Upload, Coins, Sparkles, Check } from "lucide-react";
import { CATEGORY_LABEL } from "@t2t/shared";
import { api, type Submission, ApiError } from "@/lib/api";
import { CATEGORY_META } from "@/lib/categories";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CameraCapture } from "@/components/CameraCapture";

type Phase = "idle" | "uploading" | "processing" | "result";

const STATUS = {
  pending: ["secondary", "Pending"],
  needs_review: ["warning", "In review"],
  approved: ["default", "Approved"],
  rejected: ["destructive", "Rejected"],
} as const;

export default function Home() {
  const [balance, setBalance] = useState(0);
  const [subs, setSubs] = useState<Submission[]>([]);
  const [view, setView] = useState<"home" | "camera">("home");
  const [phase, setPhase] = useState<Phase>("idle");
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<Submission | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    const [w, s] = await Promise.all([api.wallet(), api.mySubmissions()]);
    setBalance(w.balance);
    setSubs(s.submissions);
  };
  useEffect(() => {
    load();
  }, []);

  async function startUpload(file: File, source: "camera" | "gallery") {
    setErr(null);
    setPreview(URL.createObjectURL(file));
    setPhase("uploading");
    const meta: { lat?: number; lng?: number; capturedAt: string; source: "camera" | "gallery" } = {
      capturedAt: new Date().toISOString(),
      source,
    };
    try {
      const pos = await new Promise<GeolocationPosition>((res, rej) =>
        navigator.geolocation.getCurrentPosition(res, rej, { timeout: 4000 }),
      );
      meta.lat = pos.coords.latitude;
      meta.lng = pos.coords.longitude;
    } catch {
      /* no location */
    }
    try {
      const up = await api.uploadSubmission(file, meta);
      const id = up.submission.id;
      setPhase("processing");
      let final: Submission | undefined;
      for (let i = 0; i < 20; i++) {
        await new Promise((r) => setTimeout(r, 1500));
        const s = (await api.mySubmissions()).submissions.find((x) => x.id === id);
        if (s && s.status !== "pending") {
          final = s;
          break;
        }
      }
      setResult(final ?? up.submission);
      setPhase("result");
      load();
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "upload failed");
      setPhase("idle");
    }
  }

  function reset() {
    setPhase("idle");
    setResult(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
  }

  const onFile = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) startUpload(f, "gallery");
    if (fileRef.current) fileRef.current.value = "";
  };

  // ---- camera ----
  if (view === "camera") {
    return (
      <Card className="mx-auto max-w-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Camera size={18} /> Take a live photo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CameraCapture
            onCapture={(f) => {
              setView("home");
              startUpload(f, "camera");
            }}
            onCancel={() => setView("home")}
          />
        </CardContent>
      </Card>
    );
  }

  // ---- processing ----
  if (phase === "uploading" || phase === "processing") {
    return (
      <Card className="mx-auto max-w-sm animate-rise">
        <CardContent className="space-y-4 p-6">
          <div className="relative mx-auto aspect-[3/4] max-w-[16rem] overflow-hidden rounded-xl bg-secondary">
            {preview && <img src={preview} alt="" className="h-full w-full object-cover" />}
            <div className="scanline" />
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 font-medium">
              <Sparkles className="animate-pulse text-primary" size={18} />
              {phase === "uploading" ? "Uploading…" : "Analyzing your trash…"}
            </div>
            <p className="text-sm text-muted-foreground">checking what this is</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // ---- result ----
  if (phase === "result" && result) {
    return <ResultCard result={result} onDone={reset} />;
  }

  // ---- idle ----
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
              <Sparkles size={18} className="text-primary" /> Submit trash
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
            <Button className="w-full" onClick={() => setView("camera")}>
              <Camera size={16} /> Take photo (live)
            </Button>
            <Button variant="outline" className="w-full" onClick={() => fileRef.current?.click()}>
              <Upload size={16} /> Upload from gallery
            </Button>
            {err && <p className="text-sm text-destructive">{err}</p>}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Your submissions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {subs.length === 0 && <p className="text-sm text-muted-foreground">No submissions yet.</p>}
          {subs.map((s) => {
            const meta = s.mlCategory ? CATEGORY_META[s.mlCategory] : null;
            const [variant, label] = STATUS[s.status];
            return (
              <div key={s.id} className="flex items-center gap-3 rounded-md border p-2">
                <img
                  src={`/api/images/${s.imageKey}`}
                  alt=""
                  className="h-12 w-12 rounded bg-secondary object-cover"
                />
                <div className="flex-1 text-sm">
                  <div className="flex items-center gap-1">
                    {meta && <span>{meta.emoji}</span>}
                    <span>{s.mlCategory ? CATEGORY_LABEL[s.mlCategory] : "—"}</span>
                    {s.awardedPoints != null && (
                      <span className="font-medium text-primary">+{s.awardedPoints}</span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(s.createdAt).toLocaleString()}
                  </div>
                </div>
                <Badge variant={variant}>{label}</Badge>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}

function ResultCard({ result, onDone }: { result: Submission; onDone: () => void }) {
  const approved = result.status === "approved";
  const review = result.status === "needs_review";
  const cat = result.mlCategory;
  const meta = cat ? CATEGORY_META[cat] : null;
  const conf = result.mlConfidence != null ? Math.round(result.mlConfidence * 100) : null;

  return (
    <Card className="mx-auto max-w-sm animate-rise overflow-hidden">
      <div className={approved ? "bg-primary/10" : review ? "bg-amber-500/10" : "bg-destructive/10"}>
        <CardContent className="space-y-3 p-6 text-center">
          <div className="animate-pop text-5xl">{approved ? "🎉" : review ? "👀" : "🚫"}</div>
          <div className="text-lg font-semibold">
            {approved ? "Approved!" : review ? "Sent for review" : "Not accepted"}
          </div>
          {meta && cat && (
            <div className="flex justify-center">
              <Badge className={meta.chip}>
                {meta.emoji} {CATEGORY_LABEL[cat]}
              </Badge>
            </div>
          )}
          {conf != null && (
            <div className="mx-auto max-w-[16rem] text-left">
              <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                <span>model confidence</span>
                <span>{conf}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-secondary">
                <div
                  className={`h-full ${meta?.bar ?? "bg-primary"} animate-grow`}
                  style={{ width: `${conf}%` }}
                />
              </div>
            </div>
          )}
          {approved && result.awardedPoints != null && (
            <div className="animate-pop text-3xl font-bold text-primary">
              +{result.awardedPoints} <span className="text-base font-medium">eco-points</span>
            </div>
          )}
          {review && (
            <p className="text-sm text-muted-foreground">
              This didn’t clearly look like disposed waste (or the model wasn’t sure), so our team
              will verify it. No points yet.
            </p>
          )}
        </CardContent>
      </div>
      <CardContent className="pt-3">
        <Button className="w-full" onClick={onDone}>
          <Check size={16} /> Done
        </Button>
      </CardContent>
    </Card>
  );
}
