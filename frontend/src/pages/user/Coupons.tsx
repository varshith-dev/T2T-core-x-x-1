import { useEffect, useState } from "react";
import { Coins } from "lucide-react";
import { api, type Coupon, ApiError } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Coupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [balance, setBalance] = useState(0);
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const load = async () => {
    const [c, w] = await Promise.all([api.coupons(), api.wallet()]);
    setCoupons(c.coupons);
    setBalance(w.balance);
  };
  useEffect(() => {
    load();
  }, []);

  const redeem = async (id: string) => {
    setBusy(id);
    setMsg(null);
    try {
      const r = await api.redeem(id);
      setBalance(r.balance);
      setMsg("Redeemed! Awaiting fulfillment by the team.");
      await load();
    } catch (e) {
      setMsg(e instanceof ApiError ? e.message : "redeem failed");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Coupons</h2>
        <div className="flex items-center gap-1 text-sm">
          <Coins size={16} className="text-primary" /> <b>{balance}</b> points
        </div>
      </div>
      {msg && <p className="text-sm text-muted-foreground">{msg}</p>}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {coupons.length === 0 && <p className="text-sm text-muted-foreground">No coupons available.</p>}
        {coupons.map((c) => (
          <Card key={c.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{c.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="min-h-[1.25rem] text-sm text-muted-foreground">{c.description}</p>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-primary">{c.costPoints} pts</span>
                <Button
                  size="sm"
                  disabled={busy === c.id || balance < c.costPoints || c.stock <= 0}
                  onClick={() => redeem(c.id)}
                >
                  {c.stock <= 0
                    ? "Out of stock"
                    : balance < c.costPoints
                      ? "Not enough"
                      : busy === c.id
                        ? "…"
                        : "Redeem"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
