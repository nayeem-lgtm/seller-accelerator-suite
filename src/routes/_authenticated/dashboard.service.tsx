import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Store, ArrowRight, CreditCard } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_authenticated/dashboard/service")({
  component: SelectedServicePage,
});

const LABEL: Record<string, string> = {
  walmart: "Walmart",
  tiktok_shop: "TikTok Shop",
  ebay: "eBay",
  multiple: "Multiple Platforms",
};

type Plan = { plan_selected: string | null; platform_selected: string | null; created_at: string | null };
type Pay = { amount: number | null; currency: string | null; payment_status: string | null };

function SelectedServicePage() {
  const { profile, loading } = useProfile();
  const [plan, setPlan] = useState<Plan | null>(null);
  const [pay, setPay] = useState<Pay | null>(null);
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    if (!profile?.email) { setBusy(false); return; }
    let cancelled = false;
    (async () => {
      const [{ data: planRow }, { data: payRow }] = await Promise.all([
        supabase.from("plan_selections").select("plan_selected,platform_selected,created_at")
          .eq("email", profile.email!).order("created_at", { ascending: false }).limit(1).maybeSingle(),
        supabase.from("payments").select("amount,currency,payment_status")
          .eq("client_email", profile.email!).order("created_at", { ascending: false }).limit(1).maybeSingle(),
      ]);
      if (cancelled) return;
      setPlan((planRow as Plan | null) ?? null);
      setPay((payRow as Pay | null) ?? null);
      setBusy(false);
    })();
    return () => { cancelled = true; };
  }, [profile?.email]);

  if (loading || busy) return <Skeleton className="h-64 w-full rounded-2xl" />;

  const key = profile?.selected_marketplace || plan?.platform_selected || "";
  const marketplace = key ? LABEL[key] ?? key : "";
  const hasService = Boolean(key);
  const status = (pay?.payment_status || "pending").toLowerCase();
  const statusLabel = status === "paid" ? "Active" : status === "failed" ? "Payment Failed" : status === "refunded" ? "Refunded" : "Awaiting Payment";
  const statusTone = status === "paid" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : status === "failed" ? "bg-rose-50 text-rose-700 border-rose-200" : "bg-blue-50 text-blue-700 border-blue-200";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Selected Service</h1>
        <p className="text-sm text-muted-foreground mt-1">Your active marketplace plan and setup status.</p>
      </div>

      {!hasService ? (
        <div className="rounded-2xl border border-border bg-white p-10 shadow-sm text-center">
          <div className="mx-auto h-12 w-12 grid place-items-center rounded-full bg-blue-50 text-primary"><Store className="h-5 w-5" /></div>
          <h2 className="mt-4 text-lg font-semibold">No service selected yet</h2>
          <p className="mt-1 text-sm text-muted-foreground">Choose a plan that fits your goals to begin your marketplace setup.</p>
          <Button asChild className="mt-5 rounded-full brand-gradient text-white btn-glow">
            <Link to="/pricing">Choose a Plan <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground"><Store className="h-4 w-4 text-primary" /> Marketplace</div>
              <p className="mt-2 text-2xl font-bold text-primary">{marketplace}</p>
              {plan?.plan_selected && <p className="mt-1 text-sm text-muted-foreground">Plan: {plan.plan_selected}</p>}
            </div>
            <Badge variant="outline" className={`rounded-full border px-3 py-1 text-xs font-medium ${statusTone}`}>{statusLabel}</Badge>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Info label="Payment Amount">{pay?.amount != null ? `${pay.currency ?? "USD"} ${Number(pay.amount).toFixed(2)}` : "—"}</Info>
            <Info label="Service Status">{statusLabel}</Info>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <Button asChild variant="outline" className="rounded-full"><Link to="/pricing">Change Plan</Link></Button>
            {status !== "paid" && (
              <Button asChild className="rounded-full brand-gradient text-white">
                <Link to="/seller-onboarding"><CreditCard className="h-4 w-4 mr-1.5" /> Complete Payment</Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Info({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-muted/30 p-4">
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm font-medium">{children}</div>
    </div>
  );
}