import { createFileRoute, Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  LayoutDashboard,
  UserCircle2,
  ShieldCheck,
  ListChecks,
  Store,
  CreditCard,
  LifeBuoy,
  Activity,
  LogOut,
  Menu,
  X,
  Shield,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard")({
  ssr: false,
  head: () => ({ meta: [{ title: "Client Portal | Ray Ecommerce" }] }),
  component: DashboardLayout,
});

type NavItem = { to?: string; hash?: string; label: string; icon: any; exact?: boolean };

const PAGES: NavItem[] = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/dashboard/profile", label: "Profile", icon: UserCircle2 },
  { to: "/dashboard/security", label: "Security", icon: ShieldCheck },
];

const SECTIONS: NavItem[] = [
  { hash: "onboarding", label: "Onboarding", icon: ListChecks },
  { hash: "service", label: "Selected Service", icon: Store },
  { hash: "payments", label: "Payments", icon: CreditCard },
  { hash: "support", label: "Support", icon: LifeBuoy },
  { hash: "activity", label: "Recent Activity", icon: Activity },
];

function DashboardLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const loc = useLocation();
  const [open, setOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .rpc("has_role", { _user_id: user.id, _role: "admin" })
      .then(({ data }) => setIsAdmin(Boolean(data)));
  }, [user]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/login" });
  }

  const onOverview = loc.pathname === "/dashboard";

  function NavBody({ onClick }: { onClick?: () => void }) {
    return (
      <>
        <div className="p-5 border-b border-border">
          <Link to="/" className="text-[10px] font-bold tracking-[0.22em] uppercase text-primary">
            Ray Ecommerce
          </Link>
          <div className="mt-1 text-base font-bold">Client Portal</div>
          <div className="mt-0.5 text-[11px] text-muted-foreground truncate">{user?.email}</div>
        </div>

        <nav className="p-3 space-y-0.5">
          {PAGES.map((n) => {
            const active = n.exact ? loc.pathname === n.to : loc.pathname === n.to;
            const Icon = n.icon;
            return (
              <Link
                key={n.to}
                to={n.to!}
                onClick={onClick}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
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

          <div className="pt-4 pb-1 px-3 text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground">
            Sections
          </div>
          {SECTIONS.map((n) => {
            const Icon = n.icon;
            const href = `/dashboard#${n.hash}`;
            return (
              <a
                key={n.hash}
                href={href}
                onClick={(e) => {
                  if (onOverview) {
                    e.preventDefault();
                    document.getElementById(n.hash!)?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }
                  onClick?.();
                }}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-foreground/70 hover:bg-muted hover:text-foreground transition"
              >
                <Icon className="h-4 w-4" />
                {n.label}
              </a>
            );
          })}
        </nav>

        {isAdmin && (
          <div className="px-3">
            <Link
              to="/admin"
              onClick={onClick}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-primary border border-primary/20 bg-primary/[0.04] hover:bg-primary/[0.08]"
            >
              <Shield className="h-4 w-4" /> Admin Panel
            </Link>
          </div>
        )}

        <div className="p-3 mt-2 border-t border-border">
          <button
            onClick={() => {
              onClick?.();
              handleSignOut();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-foreground/70 hover:bg-muted hover:text-foreground"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/40 to-white">
      <div className="mx-auto max-w-[1400px] md:grid md:grid-cols-[260px_1fr]">
        {/* Desktop sidebar */}
        <aside className="hidden md:flex md:flex-col border-r border-border bg-white md:min-h-screen md:sticky md:top-0 md:max-h-screen md:overflow-y-auto">
          <NavBody />
        </aside>

        {/* Mobile header */}
        <div className="md:hidden sticky top-0 z-30 flex items-center justify-between border-b border-border bg-white px-4 py-3">
          <div>
            <div className="text-[10px] font-bold tracking-[0.22em] uppercase text-primary">Ray Ecommerce</div>
            <div className="text-sm font-bold">Client Portal</div>
          </div>
          <button
            aria-label="Open menu"
            className="rounded-lg border border-border p-2"
            onClick={() => setOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        {open && (
          <div className="md:hidden fixed inset-0 z-40">
            <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
            <div className="absolute left-0 top-0 h-full w-[280px] bg-white shadow-xl flex flex-col">
              <button
                aria-label="Close menu"
                className="absolute right-3 top-3 rounded-lg p-1.5 hover:bg-muted"
                onClick={() => setOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
              <NavBody onClick={() => setOpen(false)} />
            </div>
          </div>
        )}

        <main className="p-4 sm:p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}