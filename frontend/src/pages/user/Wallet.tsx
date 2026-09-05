import { useEffect, useState } from "react";
import { Coins } from "lucide-react";
import { api, type LedgerEntry } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const REASON_LABEL: Record<string, string> = {
  submission_award: "Trash submission",
  redemption: "Coupon redeemed",
  reversal: "Refund",
  adjustment: "Adjustment",
};

export default function Wallet() {
  const [balance, setBalance] = useState(0);
  const [history, setHistory] = useState<LedgerEntry[]>([]);

  useEffect(() => {
    api.wallet().then((w) => {
      setBalance(w.balance);
      setHistory(w.history);
    });
  }, []);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Coins className="text-primary" size={18} /> Eco-points wallet
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-primary">{balance}</div>
          <p className="text-sm text-muted-foreground">current balance</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {history.length === 0 && (
            <p className="text-sm text-muted-foreground">No transactions yet.</p>
          )}
          {history.map((h) => (
            <div key={h.id} className="flex items-center justify-between border-b py-2 text-sm last:border-0">
              <div>
                <div>{REASON_LABEL[h.reason] ?? h.reason}</div>
                <div className="text-xs text-muted-foreground">
                  {new Date(h.createdAt).toLocaleString()}
                </div>
              </div>
              <div className={h.delta >= 0 ? "font-semibold text-primary" : "font-semibold text-destructive"}>
                {h.delta >= 0 ? "+" : ""}
                {h.delta}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
