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

type CompareRow = { feature: string; ray: string };
const COMPARE_ROWS: CompareRow[] = [
  { feature: "Marketplace Setup Support", ray: "Included" },
  { feature: "Product Research", ray: "Included" },
  { feature: "Listing Management", ray: "Included" },
  { feature: "Supplier Coordination", ray: "Included" },
  { feature: "Order Management Support", ray: "Included" },
  { feature: "Customer Support Workflow", ray: "Included" },
  { feature: "Content Strategy Guidance", ray: "Included where applicable" },
  { feature: "Dedicated Account Support", ray: "Included" },
  { feature: "Transparent Reporting", ray: "Monthly reporting" },
  { feature: "Scaling Strategy", ray: "Included" },
  { feature: "Ad Management", ray: "Available where applicable" },
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
              {COMPARE_ROWS.map((row, i) => (
                <div
                  key={row.feature}
                  className={`grid grid-cols-12 items-center px-8 py-5 text-sm ${i % 2 === 0 ? "bg-white" : "bg-muted/25"} border-b border-border/50 last:border-b-0`}
                >
                  <div className="col-span-6 font-medium text-foreground">{row.feature}</div>
                  <div className="col-span-3 flex items-center justify-center gap-2 text-foreground/85">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                      <CheckCircle2 className="h-4 w-4" />
                    </span>
                    <span className="font-medium">{row.ray}</span>
                  </div>
                  <div className="col-span-3 flex items-center justify-center text-muted-foreground">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-muted text-muted-foreground shrink-0">
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
          {COMPARE_ROWS.map((row) => (
            <div key={row.feature} className="rounded-2xl border border-border bg-white p-5 shadow-sm">
              <div className="text-sm font-bold text-foreground">{row.feature}</div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="flex flex-col items-center justify-center gap-2 rounded-xl bg-primary/[0.06] border border-primary/15 p-4">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                    <CheckCircle2 className="h-4 w-4" />
                  </span>
                  <div className="text-xs text-center">
                    <div className="font-bold text-primary">Ray Ecommerce</div>
                    <div className="text-foreground/80">{row.ray}</div>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center gap-2 rounded-xl bg-muted/50 border border-border p-4">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground shrink-0">
                    <X className="h-4 w-4" />
                  </span>
                  <div className="text-xs text-center">
                    <div className="font-bold text-foreground/70">Other Providers</div>
                    <div className="text-muted-foreground">—</div>
                  </div>
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
