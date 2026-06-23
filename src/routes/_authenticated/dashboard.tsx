import { createFileRoute, Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  UserCircle2,
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
import { toast } from "sonner";
import { ProfileProvider, initialsOf, useProfile } from "@/hooks/useProfile";

export const Route = createFileRoute("/_authenticated/dashboard")({
  ssr: false,
  head: () => ({ meta: [{ title: "Client Portal | Ray Ecommerce" }] }),
  component: DashboardLayoutWrapper,
});

function DashboardLayoutWrapper() {
  return (
    <ProfileProvider>
      <DashboardLayout />
    </ProfileProvider>
  );
}

type NavItem = { to: string; label: string; icon: any; exact?: boolean };

const NAV: NavItem[] = [
  { to: "/dashboard", label: "Profile", icon: UserCircle2, exact: true },
  { to: "/dashboard/service", label: "Selected Service", icon: Store },
  { to: "/dashboard/payments", label: "Payments", icon: CreditCard },
  { to: "/dashboard/support", label: "Support", icon: LifeBuoy },
  { to: "/dashboard/activity", label: "Recent Activity", icon: Activity },
];

function DashboardLayout() {
  const { user } = useAuth();
  const { profile, avatarUrl } = useProfile();
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

  const displayName = profile?.full_name || user?.email?.split("@")[0] || "Account";

  function NavBody({ onClick }: { onClick?: () => void }) {
    return (
      <>
        <div className="p-5 border-b border-border">
          <Link to="/" className="text-[10px] font-bold tracking-[0.22em] uppercase text-primary">
            Ray Ecommerce
          </Link>
          <div className="mt-1 text-base font-bold">Client Portal</div>
          <div className="mt-4 flex items-center gap-3">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Avatar"
                className="h-10 w-10 rounded-full object-cover border border-border"
              />
            ) : (
              <div className="h-10 w-10 rounded-full grid place-items-center bg-blue-50 text-primary font-bold text-sm border border-border">
                {initialsOf(profile?.full_name, user?.email)}
              </div>
            )}
            <div className="min-w-0">
              <div className="text-sm font-semibold truncate">{displayName}</div>
              <div className="text-[11px] text-muted-foreground truncate">{user?.email}</div>
            </div>
          </div>
        </div>

        <nav className="p-3 space-y-1 flex-1">
          {NAV.map((n) => {
            const active = n.exact ? loc.pathname === n.to : loc.pathname.startsWith(n.to);
            const Icon = n.icon;
            return (
              <Link
                key={n.to}
                to={n.to}
                onClick={onClick}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                  active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-foreground/75 hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {n.label}
              </Link>
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
        <aside className="hidden md:flex md:flex-col border-r border-border bg-white md:min-h-screen md:sticky md:top-0 md:max-h-screen md:overflow-y-auto">
          <NavBody />
        </aside>

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