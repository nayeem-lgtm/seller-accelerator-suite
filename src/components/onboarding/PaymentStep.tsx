import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CreditCard,
  Landmark,
  Lock,
  ShieldCheck,
  Sparkles,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  PLATFORMS,
  PLATFORM_FULL_NAME,
  totalForPlatforms,
  type Branch,
  type PlatformKey,
} from "./shared";

export function PaymentStep({
  platforms,
  branch,
  clientName,
  clientEmail,
  fulfillmentLabel,
  onBack,
  onComplete,
  onSubmit,
}: {
  platforms: PlatformKey[];
  branch: Branch;
  clientName: string;
  clientEmail: string;
  fulfillmentLabel?: string;
  onBack: () => void;
  onComplete: () => void;
  onSubmit?: (paymentMethod: string) => Promise<void>;
}) {
  const total = totalForPlatforms(platforms);
  const headline =
    platforms.length === 1
      ? PLATFORM_FULL_NAME[platforms[0]]
      : `${platforms.length} Marketplace Packages`;
  const [pay, setPay] = useState({ method: "card", cardName: clientName, cardNumber: "", exp: "", cvc: "" });
  const [processing, setProcessing] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    try {
      if (onSubmit) await onSubmit(pay.method);
      onComplete();
    } catch (err) {
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="flex items-center gap-2 text-sm font-semibold text-primary">
        <Lock className="h-4 w-4" /> Secure Payment · 256-bit SSL
      </div>

      <div className="rounded-3xl brand-gradient text-white p-6 md:p-7 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/80">Order Summary</div>
            <div className="mt-1 text-xl font-bold">{headline}</div>
            <div className="text-sm text-white/85 mt-0.5">
              {branch === "existing" ? "Existing seller account onboarding" : "New seller account creation & onboarding"}
            </div>
          </div>
          <Sparkles className="h-6 w-6" />
        </div>
        <div className="mt-5 border-t border-white/20 pt-4 space-y-1.5 text-sm">
          <Row label="Customer" value={clientName || "—"} />
          <Row label="Email" value={clientEmail || "—"} />
          {fulfillmentLabel && <Row label="Fulfillment Process" value={fulfillmentLabel} />}
        </div>
        <div className="mt-4 border-t border-white/20 pt-4 space-y-1.5 text-sm">
          <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/70">Selected Packages</div>
          {platforms.map((k) => (
            <div key={k} className="flex items-center justify-between text-white">
              <span className="text-white/90">{PLATFORM_FULL_NAME[k]} Package</span>
              <span className="font-semibold tabular-nums">${PLATFORMS[k].price.toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-baseline justify-between border-t border-white/20 pt-4">
          <div className="text-sm">Total due today</div>
          <div className="text-4xl font-bold tabular-nums">${total.toFixed(2)}</div>
        </div>
      </div>

      <div className="relative rounded-3xl border border-border/70 bg-white p-6 md:p-8 shadow-[0_20px_60px_-25px_rgba(15,23,42,0.25)] space-y-6 overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
        <div className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />

        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold tracking-[0.22em] uppercase text-muted-foreground">Payment Method</div>
            <div className="mt-1 text-lg font-bold text-foreground">Choose how you'd like to pay</div>
          </div>
          <div className="hidden md:flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-3 py-1 text-[10px] font-bold tracking-[0.18em] uppercase text-muted-foreground">
            <ShieldCheck className="h-3 w-3 text-success" /> PCI · DSS
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {[
            { k: "card", label: "Card", sub: "Visa · MC · Amex", icon: CreditCard },
            { k: "paypal", label: "PayPal", sub: "Pay with balance", icon: Wallet },
            { k: "bank", label: "Bank Transfer", sub: "ACH / Wire", icon: Landmark },
          ].map((t) => {
            const active = pay.method === t.k;
            const Icon = t.icon;
            return (
              <button
                key={t.k}
                type="button"
                onClick={() => setPay({ ...pay, method: t.k })}
                className={`group relative flex flex-col items-start gap-2 rounded-2xl border p-3.5 text-left transition-all ${
                  active
                    ? "border-primary bg-gradient-to-br from-primary/8 to-primary/[0.02] shadow-[0_8px_24px_-12px_color-mix(in_oklab,var(--brand)_50%,transparent)]"
                    : "border-border bg-white hover:border-primary/40 hover:-translate-y-0.5"
                }`}
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
                    active ? "brand-gradient text-white" : "bg-muted text-muted-foreground group-hover:text-primary"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <div className={`text-sm font-bold ${active ? "text-primary" : "text-foreground"}`}>{t.label}</div>
                  <div className="text-[10px] font-medium tracking-wide text-muted-foreground mt-0.5">{t.sub}</div>
                </div>
                {active && (
                  <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-primary shadow-[0_0_0_4px_color-mix(in_oklab,var(--brand)_18%,transparent)]" />
                )}
              </button>
            );
          })}
        </div>

        {pay.method === "card" && (
          <div className="space-y-5">
            <div className="relative rounded-2xl brand-gradient p-5 text-white shadow-xl overflow-hidden">
              <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/15 blur-2xl" />
              <div className="pointer-events-none absolute -bottom-12 -left-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
              <div className="relative flex items-start justify-between">
                <div>
                  <div className="text-[10px] font-bold tracking-[0.22em] uppercase text-white/75">Ray Ecommerce</div>
                  <div className="mt-1 text-xs text-white/80">Virtual Preview</div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-6 w-9 rounded-md bg-white/25 backdrop-blur-sm" />
                  <div className="h-6 w-9 rounded-md bg-white/15 backdrop-blur-sm" />
                </div>
              </div>
              <div className="relative mt-5 font-mono text-base tracking-[0.25em] text-white/95">
                {(pay.cardNumber || "•••• •••• •••• ••••").padEnd(19, " ").slice(0, 19)}
              </div>
              <div className="relative mt-4 flex items-end justify-between text-[11px]">
                <div>
                  <div className="text-white/60 tracking-[0.18em] uppercase text-[9px]">Cardholder</div>
                  <div className="font-semibold uppercase tracking-wider">{pay.cardName || "Your Name"}</div>
                </div>
                <div>
                  <div className="text-white/60 tracking-[0.18em] uppercase text-[9px]">Expires</div>
                  <div className="font-semibold tracking-wider">{pay.exp || "MM/YY"}</div>
                </div>
              </div>
            </div>

            <Field label="Name on card" required>
              <Input value={pay.cardName} onChange={(e) => setPay({ ...pay, cardName: e.target.value })} required className="h-11 rounded-xl" />
            </Field>
            <Field label="Card number" required>
              <div className="relative">
                <Input
                  placeholder="4242 4242 4242 4242"
                  value={pay.cardNumber}
                  onChange={(e) => setPay({ ...pay, cardNumber: e.target.value })}
                  required
                  className="h-11 rounded-xl pr-12 font-mono tracking-wider"
                />
                <CreditCard className="h-4 w-4 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Expiration (MM/YY)" required>
                <Input placeholder="08/28" value={pay.exp} onChange={(e) => setPay({ ...pay, exp: e.target.value })} required className="h-11 rounded-xl font-mono" />
              </Field>
              <Field label="CVC" required>
                <Input placeholder="123" value={pay.cvc} onChange={(e) => setPay({ ...pay, cvc: e.target.value })} required className="h-11 rounded-xl font-mono" />
              </Field>
            </div>
          </div>
        )}
        {pay.method === "paypal" && (
          <div className="rounded-2xl border border-dashed border-primary/30 bg-primary/[0.03] p-6 text-sm text-muted-foreground flex items-start gap-3">
            <Wallet className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <div>
              You'll be securely redirected to PayPal to complete your{" "}
              <span className="font-bold text-foreground">${total.toFixed(2)}</span> payment after submission.
            </div>
          </div>
        )}
        {pay.method === "bank" && (
          <div className="rounded-2xl border border-dashed border-primary/30 bg-primary/[0.03] p-6 text-sm text-muted-foreground flex items-start gap-3">
            <Landmark className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <div>
              Wire & ACH instructions for{" "}
              <span className="font-bold text-foreground">${total.toFixed(2)}</span> will be emailed to{" "}
              <span className="font-semibold text-foreground">{clientEmail || "your email"}</span> within minutes.
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-3 rounded-2xl border border-border bg-muted/30 p-3 text-[10px] font-semibold tracking-wide uppercase text-muted-foreground">
          <div className="flex items-center gap-1.5 justify-center"><Lock className="h-3 w-3 text-success" /> 256-bit SSL</div>
          <div className="flex items-center gap-1.5 justify-center border-x border-border"><ShieldCheck className="h-3 w-3 text-success" /> PCI Compliant</div>
          <div className="flex items-center gap-1.5 justify-center"><Sparkles className="h-3 w-3 text-primary" /> Encrypted</div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-3 pt-1">
          <Button type="button" variant="outline" onClick={onBack} className="rounded-full h-12 px-5">
            <ArrowLeft className="mr-1 h-4 w-4" /> Back
          </Button>
          <Button
            type="submit"
            disabled={processing}
            className="group relative flex-1 brand-gradient text-white rounded-full btn-glow h-12 text-base font-bold overflow-hidden"
          >
            <span className="relative flex items-center justify-center gap-2">
              {processing ? (
                <>
                  <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                  Processing payment…
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  Pay ${total.toFixed(2)} Securely
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </span>
          </Button>
        </div>
      </div>
    </form>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-white/90">
      <span className="text-white/70">{label}</span>
      <span className="font-semibold text-right truncate ml-3 max-w-[60%]">{value}</span>
    </div>
  );
}
