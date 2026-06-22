import { createFileRoute, Link, Outlet, redirect, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  LayoutDashboard,
  UserCheck,
  FileSignature,
  CreditCard,
  Inbox,
  Bot,
  Users,
  History,
  LogOut,
  UsersRound,
} from "lucide-react";

const NAV = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/admin/customers", label: "Customers", icon: UsersRound },
  { to: "/admin/onboarding", label: "Onboarding", icon: UserCheck },
  { to: "/admin/contracts", label: "Contracts", icon: FileSignature },
  { to: "/admin/payments", label: "Payments", icon: CreditCard },
  { to: "/admin/contacts", label: "Contact Inbox", icon: Inbox },
  { to: "/admin/ai-leads", label: "Ray AI Leads", icon: Bot },
  { to: "/admin/users", label: "Users & Roles", icon: Users },
  { to: "/admin/audit", label: "Audit Log", icon: History },
];

export const Route = createFileRoute("/_authenticated/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin · Ray Ecommerce" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  beforeLoad: async ({ context }) => {
    // _authenticated already injected the user
    const user = (context as any).user;
    if (!user) throw redirect({ to: "/login" });
    const { data: isAdmin } = await supabase.rpc("has_role", {
      _user_id: user.id,
      _role: "admin",
    });
    if (!isAdmin) throw redirect({ to: "/dashboard" });
    return { adminEmail: user.email as string };
  },
  component: AdminLayout,
});

function AdminLayout() {
  const { adminEmail } = Route.useRouteContext();
  const loc = useLocation();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-[1400px] grid grid-cols-1 md:grid-cols-[260px_1fr] gap-0">
        <aside className="border-r border-border bg-white md:min-h-screen">
          <div className="p-5 border-b border-border">
            <Link to="/" className="text-xs font-bold tracking-[0.2em] uppercase text-primary">
              Ray Ecommerce
            </Link>
            <div className="mt-1 text-lg font-bold">Admin Panel</div>
            <div className="mt-0.5 text-[11px] text-muted-foreground truncate">{adminEmail}</div>
          </div>
          <nav className="p-3 space-y-0.5">
            {NAV.map((n) => {
              const active = n.exact
                ? loc.pathname === n.to
                : loc.pathname.startsWith(n.to);
              const Icon = n.icon;
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
                    active
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-foreground/70 hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {n.label}
                </Link>
              );
            })}
          </nav>
          <div className="p-3 border-t border-border mt-4">
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                window.location.href = "/login";
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-foreground/70 hover:bg-muted hover:text-foreground"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </aside>
        <main className="p-6 md:p-8">{mounted ? <Outlet /> : null}</main>
      </div>
    </div>
  );
}