import { useEffect, useState } from "react";
import { ROLES, CATEGORY_LABEL, type Role } from "@t2t/shared";
import { api, type PointRule, type User } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Admin() {
  const [rules, setRules] = useState<PointRule[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const load = async () => {
    const [r, u] = await Promise.all([api.pointRules(), api.users()]);
    setRules(r.rules.slice().sort((a, b) => a.category.localeCompare(b.category)));
    setUsers(u.users);
  };
  useEffect(() => {
    load();
  }, []);

  const saveRule = async (rule: PointRule) => {
    await api.setPointRule(rule.category, {
      points: rule.points,
      dailyCap: rule.dailyCap,
      active: rule.active,
    });
    await load();
  };
  const setRole = async (id: string, role: Role) => {
    await api.setRole(id, role);
    await load();
  };

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Point rules (per category)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {rules.map((r, i) => (
            <div key={r.category} className="flex items-center gap-2 text-sm">
              <span className="w-28">{CATEGORY_LABEL[r.category]}</span>
              <Input
                type="number"
                className="h-8 w-20"
                value={r.points}
                onChange={(e) => {
                  const c = [...rules];
                  c[i] = { ...r, points: +e.target.value };
                  setRules(c);
                }}
              />
              <span className="text-xs text-muted-foreground">pts</span>
              <Input
                type="number"
                className="h-8 w-20"
                value={r.dailyCap}
                onChange={(e) => {
                  const c = [...rules];
                  c[i] = { ...r, dailyCap: +e.target.value };
                  setRules(c);
                }}
              />
              <span className="text-xs text-muted-foreground">cap</span>
              <Button size="sm" onClick={() => saveRule(rules[i])}>
                Save
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Users & roles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {users.map((u) => (
            <div key={u.id} className="flex items-center justify-between gap-2 text-sm">
              <div className="min-w-0 flex-1">
                <div className="truncate">{u.displayName}</div>
                <div className="truncate text-xs text-muted-foreground">{u.email}</div>
              </div>
              <select
                className="h-8 rounded border bg-background px-2 text-sm"
                value={u.role}
                onChange={(e) => setRole(u.id, e.target.value as Role)}
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
