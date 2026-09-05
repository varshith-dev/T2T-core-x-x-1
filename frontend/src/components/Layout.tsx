import { Link, Outlet, useLocation } from "react-router-dom";
import { Leaf, LogOut } from "lucide-react";
import type { Role } from "@t2t/shared";
import { useAuth } from "@/auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

function navFor(role: Role) {
  const items = [
    { to: "/", label: "Home" },
    { to: "/wallet", label: "Wallet" },
    { to: "/coupons", label: "Coupons" },
  ];
  if (role === "reviewer" || role === "admin") items.push({ to: "/review", label: "Review" });
  if (role === "catalog_manager" || role === "admin") items.push({ to: "/catalog", label: "Catalog" });
  if (role === "admin") items.push({ to: "/admin", label: "Admin" });
  return items;
}

export function Layout() {
  const { user, logout } = useAuth();
  const loc = useLocation();
  if (!user) return null;

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center gap-1 px-4">
          <Leaf className="text-primary" size={20} />
          <span className="mr-4 font-bold">T2T</span>
          {navFor(user.role).map((i) => (
            <Link
              key={i.to}
              to={i.to}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm",
                loc.pathname === i.to
                  ? "bg-secondary font-medium"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {i.label}
            </Link>
          ))}
          <div className="ml-auto flex items-center gap-2">
            <span className="hidden text-sm text-muted-foreground sm:inline">{user.displayName}</span>
            <Badge variant="secondary">{user.role}</Badge>
            <Button variant="ghost" size="icon" onClick={logout} title="Log out">
              <LogOut size={16} />
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl p-4">
        <Outlet />
      </main>
    </div>
  );
}
