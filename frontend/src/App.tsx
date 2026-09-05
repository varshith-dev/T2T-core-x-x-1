import type { ReactNode } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import type { Role } from "@t2t/shared";
import { useAuth } from "@/auth";
import { Layout } from "@/components/Layout";
import Login from "@/pages/Login";
import Home from "@/pages/user/Home";
import Wallet from "@/pages/user/Wallet";
import Coupons from "@/pages/user/Coupons";
import Review from "@/pages/staff/Review";
import Catalog from "@/pages/staff/Catalog";
import Admin from "@/pages/staff/Admin";

function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-8 text-muted-foreground">Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function RequireRole({ roles, children }: { roles: Role[]; children: ReactNode }) {
  const { user } = useAuth();
  if (!user || !roles.includes(user.role)) return <Navigate to="/" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        element={
          <RequireAuth>
            <Layout />
          </RequireAuth>
        }
      >
        <Route index element={<Home />} />
        <Route path="wallet" element={<Wallet />} />
        <Route path="coupons" element={<Coupons />} />
        <Route
          path="review"
          element={
            <RequireRole roles={["reviewer", "admin"]}>
              <Review />
            </RequireRole>
          }
        />
        <Route
          path="catalog"
          element={
            <RequireRole roles={["catalog_manager", "admin"]}>
              <Catalog />
            </RequireRole>
          }
        />
        <Route
          path="admin"
          element={
            <RequireRole roles={["admin"]}>
              <Admin />
            </RequireRole>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
