import { useEffect, useState, type FormEvent } from "react";
import { api, type Coupon, type Redemption } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

const empty = { title: "", description: "", costPoints: 10, stock: 10 };

export default function Catalog() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [reds, setReds] = useState<Redemption[]>([]);
  const [f, setF] = useState(empty);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const [c, r] = await Promise.all([api.coupons(), api.redemptions()]);
    setCoupons(c.coupons);
    setReds(r.redemptions);
  };
  useEffect(() => {
    load();
  }, []);

  const create = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.createCoupon(f);
      setF(empty);
      await load();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">New coupon</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={create} className="space-y-2">
              <div className="space-y-1">
                <Label>Title</Label>
                <Input value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} required />
              </div>
              <div className="space-y-1">
                <Label>Description</Label>
                <Input
                  value={f.description}
                  onChange={(e) => setF({ ...f, description: e.target.value })}
                />
              </div>
              <div className="flex gap-2">
                <div className="flex-1 space-y-1">
                  <Label>Cost (pts)</Label>
                  <Input
                    type="number"
                    value={f.costPoints}
                    onChange={(e) => setF({ ...f, costPoints: +e.target.value })}
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <Label>Stock</Label>
                  <Input
                    type="number"
                    value={f.stock}
                    onChange={(e) => setF({ ...f, stock: +e.target.value })}
                  />
                </div>
              </div>
              <Button disabled={busy} className="w-full">
                Create coupon
              </Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Coupons</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {coupons.map((c) => (
              <div key={c.id} className="flex items-center justify-between gap-2 rounded border p-2 text-sm">
                <span className={c.active ? "min-w-0 flex-1 truncate" : "min-w-0 flex-1 truncate text-muted-foreground line-through"}>
                  {c.title}
                </span>
                <span className="whitespace-nowrap text-muted-foreground">
                  {c.costPoints}pts · stock {c.stock}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={async () => {
                    await api.updateCoupon(c.id, { active: !c.active });
                    load();
                  }}
                >
                  {c.active ? "Hide" : "Show"}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Redemptions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {reds.length === 0 && <p className="text-sm text-muted-foreground">No redemptions.</p>}
          {reds.map((r) => (
            <div key={r.id} className="flex items-center justify-between rounded border p-2 text-sm">
              <div>
                <div>{r.costPoints} pts</div>
                <div className="text-xs text-muted-foreground">
                  {new Date(r.createdAt).toLocaleString()}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    r.status === "fulfilled"
                      ? "default"
                      : r.status === "rejected"
                        ? "destructive"
                        : "secondary"
                  }
                >
                  {r.status}
                </Badge>
                {r.status === "pending" && (
                  <>
                    <Button
                      size="sm"
                      onClick={async () => {
                        await api.fulfill(r.id);
                        load();
                      }}
                    >
                      Fulfill
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={async () => {
                        await api.rejectRedemption(r.id);
                        load();
                      }}
                    >
                      Reject
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
