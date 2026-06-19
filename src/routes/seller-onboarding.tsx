import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Mail, Sparkles, Store, ShoppingBag, Tv } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Stepper, PLATFORMS, type PlatformKey, type Branch } from "@/components/onboarding/shared";
import { ExistingAccountForm, AccountCreationForm } from "@/components/onboarding/PlatformForms";
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

const PLATFORM_LIST: { k: PlatformKey; Icon: typeof Store }[] = [
  { k: "walmart", Icon: Store },
  { k: "tiktok", Icon: Tv },
  { k: "ebay", Icon: ShoppingBag },
];

function Onboarding() {
  const navigate = useNavigate();
  const [stage, setStage] = useState<StageKey>("package");
  const [platform, setPlatform] = useState<PlatformKey | null>(null);
  const [branch, setBranch] = useState<Branch | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
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
          setPlatform(parsed.platform);
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
        setPlatform(matchKey);
        setStage("branch");
      }
      sessionStorage.removeItem("ray_selected_plan");
    } catch {}
  }, []);

  const setField = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

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

  if (stage === "done" && platform && branch) {
    return <Confirmation platform={platform} branch={branch} navigate={navigate} />;
  }

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
          {stage === "branch" && platform && `Get Started with ${PLATFORMS[platform].name}`}

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
            <div className="grid md:grid-cols-3 gap-5">
              {PLATFORM_LIST.map(({ k }) => {
                const p = PLATFORMS[k];
                const selected = platform === k;
                return (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setPlatform(k)}
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
                      {selected && <CheckCircle2 className="h-6 w-6 text-primary" />}
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
                      Choose {p.name}
                      <ArrowRight className="h-4 w-4" />
                    </div>

                  </button>
                );
              })}
              <div className="md:col-span-3 flex justify-end">
                <Button
                  disabled={!platform}
                  onClick={() => setStage("branch")}
                  className="brand-gradient text-white rounded-full btn-glow px-6"
                >
                  Continue <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STAGE: BRANCH */}
          {stage === "branch" && platform && (
            <div className="space-y-5">
              <div className="text-base font-semibold">
                Do you already have an active seller account for {PLATFORMS[platform].name}?
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
              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={() => setStage("package")} className="rounded-full">
                  <ArrowLeft className="mr-1 h-4 w-4" /> Back
                </Button>
                <Button
                  disabled={!branch}
                  onClick={() => { setForm({}); setStage("details"); }}
                  className="flex-1 brand-gradient text-white rounded-full btn-glow"
                >
                  Continue <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STAGE: DETAILS */}
          {stage === "details" && platform && branch && (
            <div className="space-y-6">
              {branch === "existing" ? (
                <ExistingAccountForm platform={platform} state={form} set={setField} />
              ) : (
                <AccountCreationForm platform={platform} state={form} set={setField} />
              )}

              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={() => setStage("branch")} className="rounded-full">
                  <ArrowLeft className="mr-1 h-4 w-4" /> Back
                </Button>
                <Button
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
          {stage === "contract" && platform && branch && (
            <ContractStep
              platform={platform}
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
          {stage === "payment" && platform && branch && (
            <PaymentStep
              platform={platform}
              branch={branch}
              clientName={clientName}
              clientEmail={form.email || form.loginEmail || ""}
              onBack={() => setStage("contract")}
              onComplete={() => setStage("done")}
            />
          )}
        </div>
      </div>
    </section>
  );
}

function Confirmation({
  platform,
  branch,
  navigate,
}: {
  platform: PlatformKey;
  branch: Branch;
  navigate: ReturnType<typeof useNavigate>;
}) {
  const p = PLATFORMS[platform];
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
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <Info label="Selected package" value={p.name} />
            <Info label="Amount paid" value={`$${p.price.toFixed(2)}`} />
            <Info label="Onboarding type" value={branch === "existing" ? "Existing seller account" : "Account creation support"} />
            <Info label="Next step" value="Ray Ecommerce will review your details and reach out within 1 business day." full />
          </div>
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
