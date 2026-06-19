import { useState } from "react";
import { ArrowLeft, CreditCard, Lock, ShieldCheck, Sparkles } from "lucide-react";
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
}: {
  platforms: PlatformKey[];
  branch: Branch;
  clientName: string;
  clientEmail: string;
  fulfillmentLabel?: string;
  onBack: () => void;
  onComplete: () => void;
}) {
  const total = totalForPlatforms(platforms);
  const headline =
    platforms.length === 1
      ? PLATFORM_FULL_NAME[platforms[0]]
      : `${platforms.length} Marketplace Packages`;
  const [pay, setPay] = useState({ method: "card", cardName: clientName, cardNumber: "", exp: "", cvc: "" });
  const [processing, setProcessing] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      onComplete();
    }, 1400);
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

      <div className="rounded-3xl border border-border bg-white p-6 md:p-8 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.1)] space-y-5">
        <div className="grid grid-cols-3 gap-2 rounded-full bg-muted p-1 text-sm font-semibold">
          {[
            { k: "card", label: "Card" },
            { k: "paypal", label: "PayPal" },
            { k: "bank", label: "Bank Transfer" },
          ].map((t) => (
            <button
              key={t.k}
              type="button"
              onClick={() => setPay({ ...pay, method: t.k })}
              className={`py-2 rounded-full transition ${pay.method === t.k ? "bg-white shadow text-primary" : "text-muted-foreground"}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {pay.method === "card" && (
          <div className="space-y-4">
            <Field label="Name on card" required>
              <Input value={pay.cardName} onChange={(e) => setPay({ ...pay, cardName: e.target.value })} required />
            </Field>
            <Field label="Card number" required>
              <div className="relative">
                <Input
                  placeholder="4242 4242 4242 4242"
                  value={pay.cardNumber}
                  onChange={(e) => setPay({ ...pay, cardNumber: e.target.value })}
                  required
                />
                <CreditCard className="h-4 w-4 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Expiration (MM/YY)" required>
                <Input placeholder="08/28" value={pay.exp} onChange={(e) => setPay({ ...pay, exp: e.target.value })} required />
              </Field>
              <Field label="CVC" required>
                <Input placeholder="123" value={pay.cvc} onChange={(e) => setPay({ ...pay, cvc: e.target.value })} required />
              </Field>
            </div>
          </div>
        )}
        {pay.method === "paypal" && (
          <div className="rounded-2xl border border-border bg-muted/40 p-5 text-sm text-muted-foreground">
            You'll be redirected to PayPal to securely complete your ${total.toFixed(2)} payment after submission.
          </div>
        )}
        {pay.method === "bank" && (
          <div className="rounded-2xl border border-border bg-muted/40 p-5 text-sm text-muted-foreground">
            Bank transfer instructions for ${total.toFixed(2)} will be emailed to{" "}
            <span className="font-semibold text-foreground">{clientEmail || "your email"}</span> after submission.
          </div>
        )}

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="h-4 w-4 text-success" /> Your payment details are encrypted. This is a demo payment form.
        </div>

        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={onBack} className="rounded-full">
            <ArrowLeft className="mr-1 h-4 w-4" /> Back
          </Button>
          <Button
            type="submit"
            disabled={processing}
            className="flex-1 brand-gradient text-white rounded-full btn-glow"
          >
            {processing ? "Processing…" : `Pay $${total.toFixed(2)} & Start Onboarding`}
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
