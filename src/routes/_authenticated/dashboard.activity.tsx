import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Activity, UserPlus, Store, CreditCard, RefreshCcw, MessageSquare, KeyRound } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/useProfile";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_authenticated/dashboard/activity")({
  component: ActivityPage,
});

type Item = { icon: any; label: string; date: string | null };

function formatDate(iso?: string | null) {
  if (!iso) return "—";
  try { return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }); } catch { return "—"; }
}

const LABEL: Record<string, string> = {
  walmart: "Walmart", tiktok_shop: "TikTok Shop", ebay: "eBay", multiple: "Multiple Platforms",
};

function ActivityPage() {
  const { profile, loading } = useProfile();
  const [payments, setPayments] = useState<{ payment_status: string | null; created_at: string | null }[]>([]);
  const [contacts, setContacts] = useState<{ created_at: string | null }[]>([]);
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    if (!profile?.email) { setBusy(false); return; }
    let cancelled = false;
    (async () => {
      const [{ data: pay }, { data: ct }] = await Promise.all([
        supabase.from("payments").select("payment_status,created_at").eq("client_email", profile.email!).order("created_at", { ascending: false }),
        supabase.from("contact_queries").select("created_at").eq("email", profile.email!).order("created_at", { ascending: false }),
      ]);
      if (cancelled) return;
      setPayments((pay as never) ?? []);
      setContacts((ct as never) ?? []);
      setBusy(false);
    })();
    return () => { cancelled = true; };
  }, [profile?.email]);

  const items: Item[] = useMemo(() => {
    const out: Item[] = [];
    if (profile?.created_at) out.push({ icon: UserPlus, label: "Account created", date: profile.created_at });
    if (profile?.password_last_updated_at) out.push({ icon: KeyRound, label: "Password updated", date: profile.password_last_updated_at });
    if (profile?.selected_marketplace) {
      const m = LABEL[profile.selected_marketplace] ?? profile.selected_marketplace;
      out.push({ icon: Store, label: `Service selected — ${m}`, date: profile.updated_at });
    }
    if (profile?.updated_at && profile.updated_at !== profile.created_at) {
      out.push({ icon: RefreshCcw, label: "Profile updated", date: profile.updated_at });
    }
    for (const p of payments) {
      const s = (p.payment_status || "").toLowerCase();
      const label = s === "paid" || s === "completed" ? "Payment completed" : s === "failed" ? "Payment failed" : s === "refunded" ? "Payment refunded" : "Payment pending";
      out.push({ icon: CreditCard, label, date: p.created_at });
    }
    for (const c of contacts) {
      out.push({ icon: MessageSquare, label: "Support request submitted", date: c.created_at });
    }
    return out.filter((i) => i.date).sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime());
  }, [profile, payments, contacts]);

  if (loading || busy) return <Skeleton className="h-64 w-full rounded-2xl" />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Recent Activity</h1>
        <p className="text-sm text-muted-foreground mt-1">A log of your recent account events.</p>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-border bg-white p-10 shadow-sm text-center">
          <div className="mx-auto h-12 w-12 grid place-items-center rounded-full bg-blue-50 text-primary"><Activity className="h-5 w-5" /></div>
          <h2 className="mt-4 text-lg font-semibold">No recent activity yet</h2>
          <p className="mt-1 text-sm text-muted-foreground">Your updates will appear here.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
          <ul className="space-y-4">
            {items.map((it, i) => {
              const Icon = it.icon;
              return (
                <li key={i} className="flex items-start gap-3">
                  <div className="h-9 w-9 shrink-0 rounded-full bg-blue-50 grid place-items-center text-primary"><Icon className="h-4 w-4" /></div>
                  <div className="min-w-0 flex-1 pt-1">
                    <p className="text-sm font-medium">{it.label}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(it.date)}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}