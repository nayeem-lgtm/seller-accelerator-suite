import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  CreditCard,
  LifeBuoy,
  CheckCircle2,
  Circle,
  Sparkles,
  Store,
  UserCheck,
  CalendarClock,
  ArrowRight,
  Activity,
  ListChecks,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_authenticated/dashboard/")({
  component: OverviewPage,
});

type Profile = {
  full_name: string | null;
  email: string | null;
  company_name: string | null;
  selected_marketplace: string | null;
  onboarding_status: string;
  payment_status: string;
  created_at?: string | null;
  updated_at?: string | null;
};

type PaymentRow = {
  amount: number | null;
  currency: string | null;
  payment_status: string | null;
  reference_id: string | null;
  created_at: string | null;
};

const MARKETPLACE_LABEL: Record<string, string> = {
  walmart: "Walmart",
  tiktok_shop: "TikTok Shop",
  ebay: "eBay",
  multiple: "Multiple Platforms",
};

const STEPS = [
  "Account Created",
  "Business Information Submitted",
  "Service Selected",
  "Payment Completed",
  "Account Review",
  "Marketplace Setup Started",
];

const STATUS_KEY = (s: string) => s.toLowerCase().replace(/\s+/g, "_");

function paymentMeta(status: string) {
  const s = (status || "pending").toLowerCase();
  if (s === "paid" || s === "completed")
    return { label: "Paid", tone: "bg-emerald-50 text-emerald-700 border-emerald-200", cta: "View Receipt" };
  if (s === "failed")
    return { label: "Failed", tone: "bg-rose-50 text-rose-700 border-rose-200", cta: "Retry Payment" };
  if (s === "refunded")
    return { label: "Refunded", tone: "bg-slate-100 text-slate-700 border-slate-200", cta: "View Status" };
  if (s === "under_review" || s === "review")
    return { label: "Under Review", tone: "bg-amber-50 text-amber-800 border-amber-200", cta: "View Status" };
  return { label: "Pending", tone: "bg-blue-50 text-blue-700 border-blue-200", cta: "Complete Payment" };
}

function accountStatusFrom(profile: Profile | null) {
  if (!profile) return { label: "Pending Setup", tone: "bg-slate-100 text-slate-700 border-slate-200" };
  const pay = (profile.payment_status || "").toLowerCase();
  const ob = profile.onboarding_status || "account_created";
  if (ob === "marketplace_setup_started")
    return { label: "Setup Started", tone: "bg-blue-50 text-blue-700 border-blue-200" };
  if (ob === "account_review")
    return { label: "Under Review", tone: "bg-amber-50 text-amber-800 border-amber-200" };
  if (pay === "pending" && ob !== "account_created")
    return { label: "Payment Pending", tone: "bg-blue-50 text-blue-700 border-blue-200" };
  if (pay === "paid") return { label: "Active", tone: "bg-emerald-50 text-emerald-700 border-emerald-200" };
  return { label: "Pending Setup", tone: "bg-slate-100 text-slate-700 border-slate-200" };
}

function formatDate(iso?: string | null) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return "—";
  }
}

function OverviewPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [payment, setPayment] = useState<PaymentRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      const { data: p } = await supabase
        .from("profiles")
        .select(
          "full_name,email,company_name,selected_marketplace,onboarding_status,payment_status,created_at,updated_at",
        )
        .eq("id", user.id)
        .maybeSingle();
      if (cancelled) return;
      setProfile((p as Profile | null) ?? null);

      if (p?.email) {
        const { data: pay } = await supabase
          .from("payments")
          .select("amount,currency,payment_status,reference_id,created_at")
          .eq("client_email", p.email)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();
        if (!cancelled) setPayment((pay as PaymentRow | null) ?? null);
      }
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full rounded-2xl" />
        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-72 w-full rounded-2xl" />
      </div>
    );
  }

  const name = profile?.full_name || user?.email?.split("@")[0] || "Seller";
  const hasMarketplace = Boolean(profile?.selected_marketplace);
  const marketplace = hasMarketplace
    ? MARKETPLACE_LABEL[profile!.selected_marketplace as string] ?? profile!.selected_marketplace!
    : "Not selected";
  const obKey = profile?.onboarding_status ?? "account_created";
  const foundIdx = STEPS.findIndex((s) => STATUS_KEY(s) === obKey);
  const stepIndex = foundIdx >= 0 ? foundIdx : 0;
  const completedSteps = stepIndex + 1;
  const progress = Math.round((completedSteps / STEPS.length) * 100);
  const pay = paymentMeta(payment?.payment_status || profile?.payment_status || "pending");
  const acct = accountStatusFrom(profile);

  const nextAction = (() => {
    if (obKey === "account_created")
      return { title: "Complete Business Information", desc: "Submit your business details to continue onboarding.", to: "/seller-onboarding", cta: "Continue Onboarding" };
    if (!hasMarketplace || obKey === "business_information_submitted")
      return { title: "Choose Your Service Plan", desc: "Pick the marketplace plan that fits your goals.", to: "/pricing", cta: "Choose a Plan" };
    if ((payment?.payment_status || profile?.payment_status) !== "paid" && obKey !== "account_review" && obKey !== "marketplace_setup_started")
      return { title: "Complete Payment", desc: "Finish payment to activate your service.", to: "/seller-onboarding", cta: "Complete Payment" };
    if (obKey === "account_review")
      return { title: "Your account is under review", desc: "Our team is verifying your details. We'll notify you shortly.", to: "/contact", cta: "Contact Support" };
    if (obKey === "marketplace_setup_started")
      return { title: "Marketplace setup has started", desc: "Your specialist is configuring your seller account.", to: "/contact", cta: "Talk to Your Specialist" };
    return { title: "Your onboarding is complete", desc: "You're all set. Reach out anytime for support.", to: "/contact", cta: "Contact Support" };
  })();

  const activity: { label: string; date?: string | null }[] = [];
  if (profile?.created_at) activity.push({ label: "Account created", date: profile.created_at });
  if (stepIndex >= 1) activity.push({ label: "Business information submitted", date: profile?.updated_at });
  if (hasMarketplace) activity.push({ label: `Service selected — ${marketplace}`, date: profile?.updated_at });
  if ((payment?.payment_status || profile?.payment_status) === "paid")
    activity.push({ label: "Payment completed", date: payment?.created_at });
  if (obKey === "account_review") activity.push({ label: "Account review started", date: profile?.updated_at });
  if (obKey === "marketplace_setup_started")
    activity.push({ label: "Marketplace setup started", date: profile?.updated_at });

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-bold">Welcome back, {name}</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Track your onboarding progress and complete the next step for your marketplace setup.
            </p>
            <div className="mt-3">
              <Badge className={`rounded-full border px-3 py-1 text-xs font-medium ${acct.tone}`} variant="outline">
                {acct.label}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard icon={<Sparkles className="h-4 w-4" />} title="Onboarding" value={`${completedSteps} / ${STEPS.length}`} helper={`${progress}% complete`} />
        <SummaryCard icon={<Store className="h-4 w-4" />} title="Selected Service" value={marketplace} helper={hasMarketplace ? "Active plan" : "No plan selected yet"} />
        <SummaryCard icon={<CreditCard className="h-4 w-4" />} title="Payment" value={pay.label} helper={payment?.amount ? `${payment.currency ?? "USD"} ${Number(payment.amount).toFixed(2)}` : "Awaiting payment"} />
        <SummaryCard icon={<UserCheck className="h-4 w-4" />} title="Account" value={acct.label} helper={`Updated ${formatDate(profile?.updated_at)}`} />
      </div>

      {/* Onboarding + Next action */}
      <div id="onboarding" className="grid gap-6 lg:grid-cols-3 scroll-mt-24">
        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Onboarding Progress</h2>
            <span className="text-xs text-muted-foreground">{completedSteps} of {STEPS.length}</span>
          </div>
          <div className="mt-3"><Progress value={progress} /></div>
          <ul className="mt-6 space-y-3">
            {STEPS.map((s, i) => (
              <li key={s} className="flex items-center gap-3 text-sm">
                {i <= stepIndex ? <CheckCircle2 className="h-5 w-5 text-primary" /> : <Circle className="h-5 w-5 text-muted-foreground/40" />}
                <span className={i === stepIndex ? "font-semibold text-primary" : i < stepIndex ? "font-medium" : "text-muted-foreground"}>{s}</span>
                {i === stepIndex && (
                  <Badge variant="outline" className="ml-auto rounded-full border-blue-200 bg-blue-50 text-[10px] text-blue-700">Current</Badge>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-6 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary">
            <ListChecks className="h-4 w-4" /> Next Action
          </div>
          <h3 className="mt-3 text-lg font-bold">{nextAction.title}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{nextAction.desc}</p>
          <Button asChild className="mt-5 w-full rounded-full brand-gradient text-white btn-glow">
            <Link to={nextAction.to}>
              {nextAction.cta} <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Service + Payment + Account */}
      <div className="grid gap-6 md:grid-cols-3">
        <DetailCard id="service" icon={<Store className="h-4 w-4 text-primary" />} title="Selected Service">
          {hasMarketplace ? (
            <>
              <p className="text-xl font-semibold text-primary">{marketplace}</p>
              {payment?.amount && (
                <p className="mt-1 text-sm text-muted-foreground">{payment.currency ?? "USD"} {Number(payment.amount).toFixed(2)}</p>
              )}
              <Button asChild variant="outline" size="sm" className="mt-4 rounded-full">
                <Link to="/pricing">Change Plan</Link>
              </Button>
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">No service selected yet.</p>
              <Button asChild size="sm" className="mt-4 rounded-full brand-gradient text-white">
                <Link to="/pricing">Choose a Plan</Link>
              </Button>
            </>
          )}
        </DetailCard>

        <DetailCard id="payments" icon={<CreditCard className="h-4 w-4 text-primary" />} title="Payment Status">
          <Badge className={`rounded-full border px-3 py-1 text-xs font-medium ${pay.tone}`} variant="outline">
            {pay.label}
          </Badge>
          <div className="mt-3 space-y-1 text-sm">
            {payment?.amount != null && (
              <p><span className="text-muted-foreground">Amount:</span> {payment.currency ?? "USD"} {Number(payment.amount).toFixed(2)}</p>
            )}
            {payment?.created_at && (
              <p><span className="text-muted-foreground">Date:</span> {formatDate(payment.created_at)}</p>
            )}
            {payment?.reference_id && (
              <p className="truncate"><span className="text-muted-foreground">Ref:</span> {payment.reference_id}</p>
            )}
            {!payment && <p className="text-muted-foreground">No payment on file yet.</p>}
          </div>
          <Button asChild size="sm" className="mt-4 rounded-full brand-gradient text-white">
            <Link to="/seller-onboarding">{pay.cta}</Link>
          </Button>
        </DetailCard>

        <DetailCard icon={<UserCheck className="h-4 w-4 text-primary" />} title="Account Status">
          <Badge className={`rounded-full border px-3 py-1 text-xs font-medium ${acct.tone}`} variant="outline">
            {acct.label}
          </Badge>
          <div className="mt-3 space-y-1 text-sm">
            <p><span className="text-muted-foreground">Signed up:</span> {formatDate(profile?.created_at)}</p>
            <p><span className="text-muted-foreground">Stage:</span> {STEPS[stepIndex]}</p>
            <p><span className="text-muted-foreground">Updated:</span> {formatDate(profile?.updated_at)}</p>
          </div>
        </DetailCard>
      </div>

      {/* Activity + Support */}
      <div className="grid gap-6 md:grid-cols-2">
        <div id="activity" className="rounded-2xl border border-border bg-white p-6 shadow-sm scroll-mt-24">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Activity className="h-4 w-4 text-primary" /> Recent Activity
          </div>
          {activity.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">No recent activity yet. Complete your next step to begin onboarding.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {activity.slice(-6).reverse().map((a, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{a.label}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(a.date)}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div id="support" className="rounded-2xl border border-border bg-white p-6 shadow-sm scroll-mt-24">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <LifeBuoy className="h-4 w-4 text-primary" /> Support
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Need help with your seller account? Our team can guide you through the next step.
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Typical response time: under 24 hours</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button asChild size="sm" variant="outline" className="rounded-full bg-background hover:bg-accent">
              <Link to="/contact"><CalendarClock className="h-4 w-4 mr-1" /> Schedule Strategy Call</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ icon, title, value, helper }: { icon: React.ReactNode; title: string; value: string; helper: string }) {
  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        <span className="grid h-7 w-7 place-items-center rounded-full bg-blue-50 text-primary">{icon}</span>
        {title}
      </div>
      <p className="mt-3 truncate text-lg font-bold">{value}</p>
      <p className="mt-1 truncate text-xs text-muted-foreground">{helper}</p>
    </div>
  );
}

function DetailCard({ id, icon, title, children }: { id?: string; icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div id={id} className="rounded-2xl border border-border bg-white p-6 shadow-sm transition hover:shadow-md scroll-mt-24">
      <div className="flex items-center gap-2 text-sm font-semibold">{icon} {title}</div>
      <div className="mt-4">{children}</div>
    </div>
  );
}