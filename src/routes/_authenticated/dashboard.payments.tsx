import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CreditCard, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_authenticated/dashboard/payments")({
  component: PaymentsPage,
});

type PaymentRow = {
  id: string;
  amount: number | null;
  currency: string | null;
  payment_status: string | null;
  reference_id: string | null;
  platforms: string[] | null;
  created_at: string | null;
};

function meta(status: string) {
  const s = (status || "pending").toLowerCase();
  if (s === "paid" || s === "completed") return { label: "Paid", tone: "bg-emerald-50 text-emerald-700 border-emerald-200", cta: "View Receipt" };
  if (s === "failed") return { label: "Failed", tone: "bg-rose-50 text-rose-700 border-rose-200", cta: "Retry Payment" };
  if (s === "refunded") return { label: "Refunded", tone: "bg-slate-100 text-slate-700 border-slate-200", cta: "View Status" };
  if (s === "under_review" || s === "review") return { label: "Under Review", tone: "bg-amber-50 text-amber-800 border-amber-200", cta: "View Status" };
  return { label: "Pending", tone: "bg-blue-50 text-blue-700 border-blue-200", cta: "Complete Payment" };
}

function formatDate(iso?: string | null) {
  if (!iso) return "—";
  try { return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }); } catch { return "—"; }
}

function PaymentsPage() {
  const { profile, loading } = useProfile();
  const [rows, setRows] = useState<PaymentRow[]>([]);
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    if (!profile?.email) { setBusy(false); return; }
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("payments")
        .select("id,amount,currency,payment_status,reference_id,platforms,created_at")
        .eq("client_email", profile.email!)
        .order("created_at", { ascending: false });
      if (!cancelled) { setRows((data as PaymentRow[] | null) ?? []); setBusy(false); }
    })();
    return () => { cancelled = true; };
  }, [profile?.email]);

  if (loading || busy) return <Skeleton className="h-64 w-full rounded-2xl" />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Payments</h1>
        <p className="text-sm text-muted-foreground mt-1">Track your payment status and history.</p>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-border bg-white p-10 shadow-sm text-center">
          <div className="mx-auto h-12 w-12 grid place-items-center rounded-full bg-blue-50 text-primary"><CreditCard className="h-5 w-5" /></div>
          <h2 className="mt-4 text-lg font-semibold">No payments yet</h2>
          <p className="mt-1 text-sm text-muted-foreground">Once you complete your plan checkout, your payments will appear here.</p>
          <Button asChild className="mt-5 rounded-full brand-gradient text-white btn-glow">
            <Link to="/pricing">View Plans <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {rows.map((row) => {
            const m = meta(row.payment_status || "pending");
            const isPaid = m.label === "Paid";
            return (
              <div key={row.id} className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Badge variant="outline" className={`rounded-full border px-3 py-1 text-xs font-medium ${m.tone}`}>{m.label}</Badge>
                    <p className="mt-3 text-xl font-bold">{row.amount != null ? `${row.currency ?? "USD"} ${Number(row.amount).toFixed(2)}` : "—"}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{formatDate(row.created_at)}</p>
                  </div>
                  <Button asChild variant={isPaid ? "outline" : "default"} className={`rounded-full ${isPaid ? "" : "brand-gradient text-white"}`}>
                    <Link to="/seller-onboarding">{m.cta}</Link>
                  </Button>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 text-sm">
                  <div><span className="text-muted-foreground">Item:</span> {row.platforms?.join(", ") || "—"}</div>
                  <div className="truncate"><span className="text-muted-foreground">Transaction ID:</span> {row.reference_id || "—"}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}