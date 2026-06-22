import { createFileRoute } from "@tanstack/react-router";
import { PricingSection } from "@/components/site/PricingSection";

import { FinalCTA } from "@/components/site/FinalCTA";
import { Section, Disclaimer } from "@/components/site/Section";
import { CheckCircle2, Sparkles, X } from "lucide-react";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Marketplace Plan Pricing | Ray Ecommerce" },
      { name: "description", content: "Transparent pricing for Walmart Marketplace, TikTok Shop, and eBay operations plans from Ray Ecommerce." },
      { property: "og:title", content: "Marketplace Plan Pricing | Ray Ecommerce" },
      { property: "og:description", content: "Walmart $499, TikTok $299, eBay $99 starting plans." },
    ],
  }),
  component: PricingPage,
});

const COMPARE_FEATURES: string[] = [
  "Marketplace Setup Support",
  "Product Research",
  "Listing Management",
  "Supplier Coordination",
  "Order Management Support",
  "Customer Support Workflow",
  "Content Strategy Guidance",
  "Dedicated Account Support",
  "Transparent Reporting",
  "Scaling Strategy",
  "Ad Management",
];

function PricingPage() {
  return (
    <>
      <section className="brand-gradient-soft">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 py-20 md:py-28 text-center">
          <div className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-primary">PLANS</div>
          <h1 className="mt-3 text-4xl md:text-6xl font-bold tracking-tight max-w-4xl mx-auto leading-[1.05]">Marketplace Plans That Match Your Strategy</h1>
          <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">Walmart Marketplace is our primary plan. TikTok Shop and eBay plans support multi-channel expansion.</p>
        </div>
      </section>

      <PricingSection />

      <Section
        eyebrow="Service Comparison"
        title="Why Sellers Choose Ray Ecommerce Over Typical Marketplace Help"
        subtitle="Compare the level of structure, transparency, and management support Ray Ecommerce provides compared with basic marketplace support providers."
      >
        {/* Desktop table */}
        <div className="hidden md:block">
          <div className="rounded-3xl border border-border bg-white shadow-[0_24px_80px_-30px_rgba(15,23,42,0.18)] overflow-hidden">
            <div className="grid grid-cols-12 bg-gradient-to-r from-primary/[0.08] via-primary/[0.03] to-white px-8 py-5 border-b border-border items-center">
              <div className="col-span-6 text-[11px] font-bold tracking-[0.2em] uppercase text-muted-foreground">What's Included</div>
              <div className="col-span-3 flex items-center justify-center gap-2 text-sm font-bold text-primary">
                <Sparkles className="h-4 w-4" /> Ray Ecommerce
              </div>
              <div className="col-span-3 text-center text-sm font-bold text-foreground/70">Other Providers</div>
            </div>
            <div>
              {COMPARE_FEATURES.map((feature, i) => (
                <div
                  key={feature}
                  className={`grid grid-cols-12 items-center px-8 py-5 text-sm ${i % 2 === 0 ? "bg-white" : "bg-muted/25"} border-b border-border/50 last:border-b-0`}
                >
                  <div className="col-span-6 font-medium text-foreground">{feature}</div>
                  <div className="col-span-3 flex items-center justify-center text-foreground/85">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0" aria-label="Included">
                      <CheckCircle2 className="h-4 w-4" />
                    </span>
                  </div>
                  <div className="col-span-3 flex items-center justify-center text-muted-foreground">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-muted text-muted-foreground shrink-0" aria-label="Not included">
                      <X className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile stacked cards */}
        <div className="md:hidden space-y-3">
          {COMPARE_FEATURES.map((feature) => (
            <div key={feature} className="rounded-2xl border border-border bg-white p-5 shadow-sm">
              <div className="text-sm font-bold text-foreground">{feature}</div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="flex flex-col items-center justify-center gap-2 rounded-xl bg-primary/[0.06] border border-primary/15 p-4">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0" aria-label="Included">
                    <CheckCircle2 className="h-4 w-4" />
                  </span>
                  <div className="text-xs font-bold text-primary">Ray Ecommerce</div>
                </div>
                <div className="flex flex-col items-center justify-center gap-2 rounded-xl bg-muted/50 border border-border p-4">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground shrink-0" aria-label="Not included">
                    <X className="h-4 w-4" />
                  </span>
                  <div className="text-xs font-bold text-foreground/70">Other Providers</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Disclaimer>
          Prices may represent setup, onboarding, or management package starting points. Marketplace fees, supplier costs, advertising costs, software tools, and other operational expenses may apply separately.
        </Disclaimer>
      </Section>

      <FinalCTA />
    </>
  );
}
