import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { submitOnboarding } from "@/lib/submissions.functions";
import { toast } from "sonner";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Mail, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Stepper,
  PLATFORMS,
  PLATFORM_FULL_NAME,
  totalForPlatforms,
  type PlatformKey,
  type Branch,
} from "@/components/onboarding/shared";
import {
  MultiPlatformExistingForm,
  AccountCreationForm,
} from "@/components/onboarding/PlatformForms";
import { ContractStep } from "@/components/onboarding/ContractStep";
import { PaymentStep } from "@/components/onboarding/PaymentStep";
import { PlatformLogo } from "@/components/site/PlatformLogo";




export const Route = createFileRoute("/seller-onboarding")({
  head: () => ({
    meta: [
      { title: "Seller Onboarding — Ray Ecommerce Marketplace Operations" },
      {
        name: "description",
        content:
          "Premium onboarding for Walmart Marketplace, TikTok Shop, and eBay operations. Choose your package, submit credentials, sign your service agreement, and complete payment.",
      },
      { property: "og:title", content: "Seller Onboarding — Ray Ecommerce" },
      {
        property: "og:description",
        content: "Walmart, TikTok Shop, and eBay operations onboarding from Ray Ecommerce.",
      },
    ],
  }),
  component: Onboarding,
});

type StageKey = "package" | "branch" | "details" | "contract" | "payment" | "done";

const STEPS = ["Package", "Account", "Credentials", "Contract", "Payment"];

const PLATFORM_ORDER: PlatformKey[] = ["walmart", "tiktok", "ebay"];

function Onboarding() {
  const navigate = useNavigate();
  const [stage, setStage] = useState<StageKey>("package");
  const [platforms, setPlatforms] = useState<PlatformKey[]>([]);
  const [branch, setBranch] = useState<Branch | null>(null);
  // Single shared form (used for branch="create" / single-platform existing legacy keys)
  const [form, setForm] = useState<Record<string, string>>({});
  // Per-platform existing-account form state
  const [platformForms, setPlatformForms] = useState<Record<string, Record<string, string>>>({});
  // Per-platform authorization checkbox state
  const [authorized, setAuthorized] = useState<Record<string, boolean>>({});
  const [clientName, setClientName] = useState("");
  const [signature, setSignature] = useState<string | null>(null);
  const [agreed1, setAgreed1] = useState(false);
  const [agreed2, setAgreed2] = useState(false);

  // Preselect plan from pricing CTAs, or jump straight to payment from a profit dashboard CTA
  useEffect(() => {
    try {
      const jump = sessionStorage.getItem("ray_jump_to_payment");
      if (jump) {
        const parsed = JSON.parse(jump) as { platform?: PlatformKey };
        if (parsed.platform && PLATFORMS[parsed.platform]) {
          setPlatforms([parsed.platform]);
          setBranch("existing");
          setStage("payment");
          sessionStorage.removeItem("ray_jump_to_payment");
          return;
        }
        sessionStorage.removeItem("ray_jump_to_payment");
      }

      const stored = sessionStorage.getItem("ray_selected_plan");
      if (!stored) return;
      const matchKey = (Object.entries(PLATFORMS) as [PlatformKey, typeof PLATFORMS[PlatformKey]][])
        .find(([, p]) => p.name === stored)?.[0];
      if (matchKey) {
        setPlatforms([matchKey]);
        setStage("branch");
      }
      sessionStorage.removeItem("ray_selected_plan");
    } catch {}
  }, []);

  const setField = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const setPlatformField = (platform: PlatformKey, k: string, v: string) =>
    setPlatformForms((all) => ({ ...all, [platform]: { ...(all[platform] || {}), [k]: v } }));
  const setPlatformAuthorized = (platform: PlatformKey, v: boolean) =>
    setAuthorized((a) => ({ ...a, [platform]: v }));

  const togglePlatform = (k: PlatformKey) => {
    setPlatforms((prev) => (prev.includes(k) ? prev.filter((p) => p !== k) : [...prev, k]));
  };

  const primaryPlatform: PlatformKey | null = platforms[0] ?? null;
  const total = totalForPlatforms(platforms);

  const stepIndex = useMemo(() => {
    switch (stage) {
      case "package": return 0;
      case "branch": return 1;
      case "details": return 2;
      case "contract": return 3;
      case "payment": return 4;
      default: return 4;
    }
  }, [stage]);

  if (stage === "done" && platforms.length > 0 && branch) {
    return <Confirmation platforms={platforms} branch={branch} navigate={navigate} />;
  }

  // Validate that the existing-account credentials step is complete.
  const existingDetailsValid =
    branch === "existing" &&
    platforms.length > 0 &&
    platforms.every((p) => {
      const s = platformForms[p] || {};
      return (
        !!s.loginEmail &&
        !!s.loginPassword &&
        !!s.displayName &&
        !!s.accountStatus &&
        !!authorized[p]
      );
    });

  return (
    <section className="relative py-12 md:py-20 overflow-hidden">
      {/* ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-brand-glow/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-4xl px-4">
        <div className="text-xs font-bold tracking-[0.2em] uppercase text-primary">Seller Onboarding</div>
        <h1 className="mt-2 text-3xl md:text-5xl font-bold tracking-tight">
          {stage === "package" && "Choose Your Marketplace"}
          {stage === "branch" && primaryPlatform &&
            (platforms.length === 1
              ? `Get Started with ${PLATFORMS[primaryPlatform].name}`
              : `Get Started with ${platforms.length} Marketplaces`)}

          {stage === "details" && branch === "existing" && "Connect Your Existing Seller Account"}
          {stage === "details" && branch === "create" && "Seller Account Creation Details"}
          {stage === "contract" && "Service Agreement"}
          {stage === "payment" && "Complete Your Payment"}
        </h1>
        <p className="mt-3 text-muted-foreground max-w-2xl">
          {stage === "package" && "Pick the marketplace you want to launch on. Walmart Marketplace is recommended for established sellers, TikTok Shop for social-commerce growth, and eBay for beginner-friendly fulfillment."}
          {stage === "branch" && "Tell us whether you already have an active seller account on this platform."}
          {stage === "details" && branch === "existing" && "Provide secure access details so we can manage your seller account on your behalf."}
          {stage === "details" && branch === "create" && "We'll use these details to create and verify your seller account end-to-end."}
          {stage === "contract" && "Review your service agreement, type your legal name, and sign to continue."}
          {stage === "payment" && "Confirm your package and complete payment to start active onboarding."}
        </p>

        <Stepper current={stepIndex} steps={STEPS} />
        <div className="text-sm text-muted-foreground mt-2 mb-8">
          Step {stepIndex + 1} of {STEPS.length} · Your information is encrypted and secure
        </div>

        <div className="rounded-3xl border border-border bg-white/80 backdrop-blur-sm p-6 md:p-8 shadow-[0_10px_40px_-20px_rgba(15,23,42,0.18)]">
          {/* STAGE: PACKAGE */}
          {stage === "package" && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-3 gap-5">
              {PLATFORM_ORDER.map((k) => {
                const p = PLATFORMS[k];
                const selected = platforms.includes(k);
                return (
                  <button
                    key={k}
                    type="button"
                    onClick={() => togglePlatform(k)}
                    className={`group relative text-left rounded-2xl border-2 p-6 transition overflow-hidden ${
                      selected
                        ? "border-primary bg-primary/[0.04] shadow-[0_0_0_4px_rgba(59,130,246,0.1)]"
                        : "border-border bg-white hover:border-primary/40 hover:-translate-y-0.5"
                    }`}
                  >
                    <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${p.accent}`} />
                    <div className="flex items-center justify-between">
                      <div className="inline-flex items-center justify-center rounded-xl bg-white border border-border px-3 py-2 shadow-sm">
                        <PlatformLogo platform={k} className="h-6 w-auto" />
                      </div>
                      <div
                        className={`h-6 w-6 rounded-md border-2 grid place-items-center transition ${
                          selected ? "border-primary bg-primary text-white" : "border-border bg-white text-transparent"
                        }`}
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                    </div>
                    <div className="mt-4 font-bold text-lg">{p.name}</div>
                    <div className="mt-1 text-3xl font-bold text-foreground">
                      ${p.price}
                      <span className="text-sm font-medium text-muted-foreground ml-1">starting</span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{p.tagline}</p>
                    <div
                      className={`mt-5 inline-flex items-center gap-2 text-sm font-semibold ${
                        selected ? "text-primary" : "text-foreground/70 group-hover:text-primary"
                      }`}
                    >
                      {selected ? `${p.name} selected` : `Choose ${p.name}`}
                      <ArrowRight className="h-4 w-4" />
                    </div>

                  </button>
                );
              })}
              </div>

              {/* Selected summary */}
              <div className="rounded-2xl border border-border bg-white p-5 md:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="text-xs font-bold tracking-[0.2em] uppercase text-primary">Selected Packages</div>
                    {platforms.length === 0 ? (
                      <p className="mt-2 text-sm text-muted-foreground">
                        Select one or more marketplace packages to continue. You can combine packages.
                      </p>
                    ) : (
                      <ul className="mt-3 space-y-1.5 text-sm">
                        {platforms.map((k) => (
                          <li key={k} className="flex items-center justify-between gap-4">
                            <span className="font-medium text-foreground">{PLATFORM_FULL_NAME[k]}</span>
                            <span className="font-semibold tabular-nums">${PLATFORMS[k].price}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground">Total</div>
                    <div className="text-2xl md:text-3xl font-bold tabular-nums">${total}</div>
                  </div>
                </div>
                <div className="mt-5 flex justify-end">
                  <Button
                    disabled={platforms.length === 0}
                    onClick={() => setStage("branch")}
                    className="brand-gradient text-white rounded-full btn-glow px-6"
                  >
                    Continue <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* STAGE: BRANCH */}
          {stage === "branch" && primaryPlatform && (
            <div className="space-y-5">
              <div className="text-base font-semibold">
                Do you already have an active seller account for{" "}
                {platforms.length === 1
                  ? PLATFORMS[primaryPlatform].name
                  : `${platforms.length} selected marketplaces`}
                ?
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { k: "existing" as Branch, title: "Yes, I already have an account", desc: "We'll connect to your existing seller account and start managing." },
                  { k: "create" as Branch, title: "No, I need account creation support", desc: "We'll create and verify your seller account end-to-end." },
                ].map((o) => {
                  const sel = branch === o.k;
                  return (
                    <button
                      key={o.k}
                      type="button"
                      onClick={() => setBranch(o.k)}
                      className={`text-left rounded-2xl border-2 p-5 transition ${
                        sel
                          ? "border-primary bg-primary/[0.04] shadow-[0_0_0_4px_rgba(59,130,246,0.1)]"
                          : "border-border bg-white hover:border-primary/40"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-semibold">{o.title}</div>
                        {sel && <CheckCircle2 className="h-5 w-5 text-primary" />}
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{o.desc}</p>
                    </button>
                  );
                })}
              </div>
              {branch === "create" && platforms.length > 1 && (
                <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-xs text-amber-900">
                  Account creation is platform-specific. We'll start the creation flow with{" "}
                  <strong>{PLATFORM_FULL_NAME[primaryPlatform]}</strong>, then coordinate the remaining selected
                  marketplaces with you after onboarding.
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={() => setStage("package")} className="rounded-full">
                  <ArrowLeft className="mr-1 h-4 w-4" /> Back
                </Button>
                <Button
                  disabled={!branch}
                  onClick={() => { setStage("details"); }}
                  className="flex-1 brand-gradient text-white rounded-full btn-glow"
                >
                  Continue <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STAGE: DETAILS */}
          {stage === "details" && primaryPlatform && branch && (
            <div className="space-y-6">
              {branch === "existing" ? (
                <MultiPlatformExistingForm
                  platforms={platforms}
                  forms={platformForms}
                  setField={setPlatformField}
                  authorized={authorized}
                  setAuthorized={setPlatformAuthorized}
                />
              ) : (
                <AccountCreationForm platform={primaryPlatform} state={form} set={setField} />
              )}

              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={() => setStage("branch")} className="rounded-full">
                  <ArrowLeft className="mr-1 h-4 w-4" /> Back
                </Button>
                <Button
                  disabled={branch === "existing" && !existingDetailsValid}
                  onClick={() => {
                    setClientName(form.fullName || clientName);
                    setStage("contract");
                  }}
                  className="flex-1 brand-gradient text-white rounded-full btn-glow"
                >
                  Continue to Contract <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STAGE: CONTRACT */}
          {stage === "contract" && platforms.length > 0 && branch && (
            <ContractStep
              platforms={platforms}
              branch={branch}
              clientName={clientName}
              setClientName={setClientName}
              signature={signature}
              setSignature={setSignature}
              agreed1={agreed1}
              setAgreed1={setAgreed1}
              agreed2={agreed2}
              setAgreed2={setAgreed2}
              onBack={() => setStage("details")}
              onContinue={() => setStage("payment")}
            />
          )}

          {/* STAGE: PAYMENT */}
          {stage === "payment" && platforms.length > 0 && branch && (
            <PaymentStep
              platforms={platforms}
              branch={branch}
              clientName={clientName}
              clientEmail={
                form.email ||
                form.loginEmail ||
                platformForms[platforms[0]]?.loginEmail ||
                ""
              }
              onBack={() => setStage("contract")}
              onComplete={() => setStage("done")}
              onSubmit={async (paymentMethod) => {
                const emailGuess =
                  form.email ||
                  form.loginEmail ||
                  platformForms[platforms[0]]?.loginEmail ||
                  "";
                try {
                  await submitOnboardingFn({
                    data: {
                      clientName: clientName || form.fullName || "Unknown",
                      clientEmail: emailGuess,
                      countryCode: form.countryCode?.split("-")[0] || "+1",
                      phone: form.phone || "0000",
                      platforms,
                      branch,
                      totalAmount: totalForPlatforms(platforms),
                      signatureDataUrl: signature || "data:none",
                      agreedTerms: agreed1,
                      agreedAuthorization: agreed2,
                      paymentMethod: paymentMethod as
                        | "card"
                        | "paypal"
                        | "bank"
                        | "wallet"
                        | "other",
                      businessName: form.businessName || null,
                      addressLine1: form.addressLine1 || null,
                      city: form.city || null,
                      state: form.state || null,
                      zipCode: form.zipCode || null,
                      country: form.country || null,
                      sellerAccountStatus:
                        platformForms[platforms[0]]?.accountStatus || null,
                      notes: null,
                    },
                  });
                } catch (e) {
                  console.error(e);
                  toast.error("Could not complete your submission. Please try again.");
                  throw e;
                }
              }}
            />
          )}
        </div>
      </div>
    </section>
  );
}

function Confirmation({
  platforms,
  branch,
  navigate,
}: {
  platforms: PlatformKey[];
  branch: Branch;
  navigate: ReturnType<typeof useNavigate>;
}) {
  const total = totalForPlatforms(platforms);
  const packagesLabel = platforms.map((k) => PLATFORM_FULL_NAME[k]).join(", ");
  return (
    <section className="py-20">
      <div className="mx-auto max-w-2xl px-4 text-center">
        <div className="mx-auto h-20 w-20 rounded-full brand-gradient grid place-items-center shadow-xl">
          <CheckCircle2 className="h-10 w-10 text-white" />
        </div>
        <h1 className="mt-6 text-3xl md:text-5xl font-bold tracking-tight">Your onboarding request has been received.</h1>
        <p className="mt-3 text-muted-foreground">
          Thank you for choosing Ray Ecommerce. Our team will review your submitted details and contact you to begin active onboarding.
        </p>

        <div className="mt-8 rounded-2xl border border-border bg-white p-6 text-left shadow-[0_8px_30px_-12px_rgba(15,23,42,0.1)]">
          <div className="space-y-3 text-sm">
            <div>
              <div className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">Selected packages</div>
              <ul className="mt-1.5 space-y-1">
                {platforms.map((k) => (
                  <li key={k} className="flex items-center justify-between gap-3 font-semibold">
                    <span>{PLATFORM_FULL_NAME[k]}</span>
                    <span className="tabular-nums">${PLATFORMS[k].price.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 pt-3 border-t border-border flex items-center justify-between font-bold">
                <span>Total paid</span>
                <span className="tabular-nums">${total.toFixed(2)}</span>
              </div>
            </div>
            <Info label="Onboarding type" value={branch === "existing" ? "Existing seller account" : "Account creation support"} />
            <Info label="Next step" value="Ray Ecommerce will review your details and reach out within 1 business day." full />
          </div>
          <div className="sr-only">{packagesLabel}</div>
        </div>


        <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary/5 border border-primary/20 px-4 py-2 text-sm">
          <Mail className="h-4 w-4 text-primary" />
          <span>Questions? Email <a className="font-semibold text-primary" href="mailto:ecommerce@rayadvertising.com">ecommerce@rayadvertising.com</a></span>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild className="rounded-full brand-gradient text-white btn-glow">
            <Link to="/">Back to Home</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/services">Explore More Services</Link>
          </Button>
        </div>

        <div className="mt-10 text-xs text-muted-foreground">
          <Sparkles className="inline h-3 w-3 mr-1 text-primary" />
          Ray Ecommerce · A division of Ray Advertising · 1267 Willis ST STE 200, Redding, CA 96001, USA
        </div>
      </div>
    </section>
  );
}

function Info({ label, value, full }: { label: string; value: string; full?: boolean }) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <div className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-sm font-semibold text-foreground">{value}</div>
    </div>
  );
}
