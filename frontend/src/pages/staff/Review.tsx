import { useEffect, useState } from "react";
import { CATEGORIES, CATEGORY_LABEL, type Category } from "@t2t/shared";
import { api, type Submission } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Review() {
  const [queue, setQueue] = useState<Submission[]>([]);
  const [busy, setBusy] = useState<string | null>(null);

  const load = async () => {
    const r = await api.reviewQueue();
    setQueue(r.submissions);
  };
  useEffect(() => {
    load();
  }, []);

  const approve = async (id: string, cat: Category) => {
    setBusy(id);
    try {
      await api.approve(id, cat);
      await load();
    } finally {
      setBusy(null);
    }
  };
  const reject = async (id: string) => {
    setBusy(id);
    try {
      await api.reject(id);
      await load();
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="flex items-center gap-2 text-lg font-semibold">
        Review queue <Badge variant="secondary">{queue.length}</Badge>
      </h2>
      {queue.length === 0 && <p className="text-sm text-muted-foreground">Nothing to review.</p>}
      <div className="grid gap-4 sm:grid-cols-2">
        {queue.map((s) => (
          <Card key={s.id}>
            <CardContent className="space-y-3 p-4">
              <img
                src={`/api/images/${s.imageKey}`}
                alt=""
                className="h-48 w-full rounded bg-secondary object-contain"
              />
              <div className="text-sm text-muted-foreground">
                ML guess: <b className="capitalize">{s.mlCategory ?? "n/a"}</b>
                {s.mlConfidence != null && ` (${Math.round(s.mlConfidence * 100)}%)`}
              </div>
              <div>
                <p className="mb-1 text-xs text-muted-foreground">Approve as:</p>
                <div className="flex flex-wrap gap-1">
                  {CATEGORIES.map((c) => (
                    <Button
                      key={c}
                      size="sm"
                      variant="outline"
                      disabled={busy === s.id}
                      onClick={() => approve(s.id, c)}
                    >
                      {CATEGORY_LABEL[c]}
                    </Button>
                  ))}
                </div>
              </div>
              <Button size="sm" variant="destructive" disabled={busy === s.id} onClick={() => reject(s.id)}>
                Reject
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
