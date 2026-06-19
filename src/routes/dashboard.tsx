import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, FileText, CreditCard, LifeBuoy, CheckCircle2, Circle, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard | Ray Ecommerce" }] }),
  component: DashboardPage,
});

type Profile = {
  full_name: string | null;
  email: string | null;
  company_name: string | null;
  selected_marketplace: string | null;
  onboarding_status: string;
  payment_status: string;
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
  "Documents Uploaded",
  "Service Selected",
  "Payment Completed",
  "Account Review",
  "Marketplace Setup Started",
];

function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) navigate({ to: "/login" });
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("full_name,email,company_name,selected_marketplace,onboarding_status,payment_status")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        setProfile(data as Profile | null);
        setLoading(false);
      });
  }, [user]);

  if (authLoading || loading || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  const name = profile?.full_name || user.email?.split("@")[0] || "Seller";
  const marketplace = profile?.selected_marketplace ? MARKETPLACE_LABEL[profile.selected_marketplace] ?? profile.selected_marketplace : "Not selected";
  const stepIndex = Math.max(0, STEPS.findIndex((s) => s.toLowerCase().replace(/\s+/g, "_") === (profile?.onboarding_status ?? "account_created")));
  const completedSteps = stepIndex + 1;
  const progress = Math.round((completedSteps / STEPS.length) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/40 to-white">
      <div className="mx-auto max-w-6xl px-4 py-10 lg:px-8 space-y-6">
        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold">Welcome back, {name}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage your marketplace onboarding, documents, service status, and Ray Ecommerce support from one secure dashboard.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm md:col-span-2">
            <h2 className="text-lg font-semibold">Onboarding Progress</h2>
            <div className="mt-3"><Progress value={progress} /></div>
            <p className="mt-2 text-xs text-muted-foreground">{completedSteps} of {STEPS.length} steps complete</p>
            <ul className="mt-5 space-y-3">
              {STEPS.map((s, i) => (
                <li key={s} className="flex items-center gap-3 text-sm">
                  {i <= stepIndex ? (
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground/40" />
                  )}
                  <span className={i <= stepIndex ? "font-medium" : "text-muted-foreground"}>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Selected Service</p>
              <p className="mt-2 text-xl font-semibold text-primary">{marketplace}</p>
              <Button asChild variant="outline" size="sm" className="mt-4 rounded-full">
                <Link to="/pricing">Change plan</Link>
              </Button>
            </div>
            <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-semibold"><CreditCard className="h-4 w-4 text-primary" /> Payment Status</div>
              <p className="mt-2 text-sm capitalize">{profile?.payment_status ?? "pending"}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-semibold"><FileText className="h-4 w-4 text-primary" /> Documents</div>
            <p className="mt-2 text-sm text-muted-foreground">Upload your business documents to complete onboarding.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button size="sm" className="rounded-full brand-gradient text-white"><Upload className="h-4 w-4 mr-1" /> Upload Documents</Button>
              <Button size="sm" variant="outline" className="rounded-full">View Requirements</Button>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-semibold"><LifeBuoy className="h-4 w-4 text-primary" /> Support</div>
            <p className="mt-2 text-sm text-muted-foreground">Need help with your seller account? Contact Ray Ecommerce support.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button asChild size="sm" className="rounded-full brand-gradient text-white"><Link to="/contact">Contact Support</Link></Button>
              <Button asChild size="sm" variant="outline" className="rounded-full"><Link to="/contact">Schedule Strategy Call</Link></Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
