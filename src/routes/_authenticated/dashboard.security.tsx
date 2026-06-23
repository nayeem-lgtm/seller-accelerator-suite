import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Eye, EyeOff, Loader2, ShieldCheck, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_authenticated/dashboard/security")({
  component: SecurityPage,
});

function strength(pw: string): { score: number; label: string; tone: string } {
  let s = 0;
  if (pw.length >= 8) s++;
  if (pw.length >= 12) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  const labels = ["Too short", "Weak", "Fair", "Good", "Strong", "Excellent"];
  const tones = [
    "bg-rose-100 text-rose-700",
    "bg-rose-100 text-rose-700",
    "bg-amber-100 text-amber-800",
    "bg-amber-100 text-amber-800",
    "bg-emerald-100 text-emerald-700",
    "bg-emerald-100 text-emerald-700",
  ];
  return { score: s, label: labels[s], tone: tones[s] };
}

function fmt(d?: string | null) {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleString();
  } catch {
    return "—";
  }
}

function SecurityPage() {
  const { user } = useAuth();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showC, setShowC] = useState(false);
  const [showN, setShowN] = useState(false);
  const [showK, setShowK] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pwUpdatedAt, setPwUpdatedAt] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("password_last_updated_at")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        const v = (data as { password_last_updated_at: string | null } | null)?.password_last_updated_at;
        setPwUpdatedAt(v ?? null);
      });
  }, [user]);

  const meter = useMemo(() => strength(next), [next]);

  async function handleChange(e: React.FormEvent) {
    e.preventDefault();
    if (!user?.email) return;
    if (next.length < 8) return toast.error("New password must be at least 8 characters");
    if (next !== confirm) return toast.error("New passwords do not match");
    if (next === current) return toast.error("New password must be different from current");

    setSaving(true);
    // Re-authenticate to verify current password
    const { error: signErr } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: current,
    });
    if (signErr) {
      setSaving(false);
      return toast.error("Current password is incorrect");
    }
    const { error: upErr } = await supabase.auth.updateUser({ password: next });
    if (upErr) {
      setSaving(false);
      return toast.error("Could not update password. Please try again.");
    }
    const now = new Date().toISOString();
    await supabase.from("profiles").update({ password_last_updated_at: now } as never).eq("id", user.id);
    setPwUpdatedAt(now);
    setCurrent("");
    setNext("");
    setConfirm("");
    setSaving(false);
    toast.success("Password updated");
  }

  const meta = (user as unknown as { last_sign_in_at?: string; created_at?: string; email_confirmed_at?: string }) || {};

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Security</h1>
        <p className="text-sm text-muted-foreground mt-1">Update your password and review account security.</p>
      </div>

      {/* Change password */}
      <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold flex items-center gap-2">
          <KeyRound className="h-4 w-4 text-primary" /> Change Password
        </h2>
        <form onSubmit={handleChange} className="mt-5 space-y-4 max-w-lg">
          <PwField label="Current Password" value={current} onChange={setCurrent} show={showC} onToggle={() => setShowC((v) => !v)} />
          <PwField label="New Password" value={next} onChange={setNext} show={showN} onToggle={() => setShowN((v) => !v)} />
          {next && (
            <div className="flex items-center gap-2 text-xs">
              <div className="flex-1 grid grid-cols-5 gap-1">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full ${i < meter.score ? "bg-primary" : "bg-muted"}`}
                  />
                ))}
              </div>
              <span className={`rounded-full px-2 py-0.5 font-medium ${meter.tone}`}>{meter.label}</span>
            </div>
          )}
          <PwField label="Confirm New Password" value={confirm} onChange={setConfirm} show={showK} onToggle={() => setShowK((v) => !v)} />
          <div className="flex items-center justify-between gap-3">
            <Link to="/forgot-password" className="text-sm text-primary hover:underline">
              Forgot password?
            </Link>
            <Button type="submit" disabled={saving} className="rounded-full brand-gradient text-white btn-glow">
              {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Updating</> : "Update Password"}
            </Button>
          </div>
        </form>
      </div>

      {/* Login Security */}
      <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-primary" /> Login Security
        </h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2 text-sm">
          <Row label="Account created" value={fmt(meta.created_at)} />
          <Row label="Last sign in" value={fmt(meta.last_sign_in_at)} />
          <Row label="Email verified" value={meta.email_confirmed_at ? "Yes" : "No"} />
          <Row label="Password last updated" value={fmt(pwUpdatedAt)} />
        </dl>
      </div>

      <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-5 text-sm text-foreground/80">
        Keep your account secure by using a strong, unique password and updating it regularly.
      </div>
    </div>
  );
}

function PwField({
  label,
  value,
  onChange,
  show,
  onToggle,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="relative">
        <Input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pr-10"
          autoComplete="new-password"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-muted-foreground hover:bg-muted"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <dt className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">{label}</dt>
      <dd className="mt-1 text-sm">{value}</dd>
    </div>
  );
}