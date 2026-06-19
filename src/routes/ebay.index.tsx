import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Store, Search, ClipboardList, Truck, MessageCircle, LineChart, ShieldCheck, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section, Disclaimer } from "@/components/site/Section";
import { PricingSection } from "@/components/site/PricingSection";


import { FinalCTA } from "@/components/site/FinalCTA";
import { HowItWorks, ebaySteps } from "@/components/site/HowItWorks";
import { PlatformSalesBreakdown, ebayBreakdown } from "@/components/site/PlatformSalesBreakdown";

export const Route = createFileRoute("/ebay/")({
  head: () => ({
    meta: [
      { title: "eBay | Ray Ecommerce" },
      { name: "description", content: "Ray Ecommerce supports lean eBay marketplace operations with store setup support, product research, listing management, customer support, and reporting." },
      { property: "og:title", content: "eBay | Ray Ecommerce" },
      { property: "og:description", content: "Lean marketplace operations for eBay sellers." },
    ],
  }),
  component: EbayPage,
});

function FeatureGrid({ items }: { items: { i: React.ComponentType<{ className?: string }>; t: string; d: string }[] }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
      {items.map(({ i: Icon, t, d }) => (
        <div key={t} className="rounded-3xl border border-border bg-white p-6 hover:-translate-y-1 hover:shadow-xl transition">
          <div className="h-11 w-11 rounded-2xl brand-gradient grid place-items-center text-white"><Icon className="h-5 w-5" /></div>
          <h3 className="mt-4 font-bold">{t}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{d}</p>
        </div>
      ))}
    </div>
  );
}

function EbayPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 brand-gradient-soft" />
        <div className="mx-auto max-w-7xl px-4 lg:px-8 py-20 md:py-28 text-center">
          <div className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-primary">eBay</div>
          <h1 className="mt-3 text-4xl md:text-6xl font-bold tracking-tight max-w-4xl mx-auto leading-[1.05]">eBay For Lean Marketplace Operations</h1>
          <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">Ray Ecommerce supports lean eBay marketplace operations with store setup support, product research, listing management, order coordination, customer support, and reporting.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="rounded-full brand-gradient text-white btn-glow"><Link to="/seller-onboarding">Start eBay Store <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
            <Button asChild size="lg" variant="outline" className="rounded-full"><a href="/contact">Schedule Strategy Call</a></Button>
          </div>
        </div>
      </section>

      <HowItWorks steps={ebaySteps} />

      <PlatformSalesBreakdown data={ebayBreakdown} />

      <Section eyebrow="How It Works" title="A Lean Path To Marketplace Operations">
        <FeatureGrid items={[
          { i: Store, t: "Store Setup", d: "Account preparation and structural setup for eBay listings." },
          { i: Search, t: "Product Research", d: "Demand and margin-driven research aligned to eBay audiences." },
          { i: ClipboardList, t: "Listing Management", d: "Optimized listings with clean structure and pricing strategy." },
          { i: Truck, t: "Order Coordination", d: "Supplier and shipping workflows for clean fulfillment." },
          { i: MessageCircle, t: "Customer Support", d: "Response workflows and issue handling." },
          { i: LineChart, t: "Monthly Reporting", d: "Clear monthly visibility into performance and operations." },
        ]} />
      </Section>

      <Section eyebrow="Money Flow" title="eBay Revenue Flow">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-border bg-white px-6 py-5 shadow-sm md:px-10 md:py-6">
            <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm text-muted-foreground md:text-base">
              <span>Supplier</span>
              <span className="text-primary">→</span>
              <span className="font-semibold text-foreground">eBay Store</span>
              <span className="text-primary">→</span>
              <span>Customer Purchase</span>
              <span className="text-primary">→</span>
              <span>eBay Payout</span>
              <span className="text-primary">→</span>
              <span>Your Account</span>
              <span className="text-primary">→</span>
              <span>Net Profit Review</span>
            </p>
          </div>
        </div>
      </Section>

      <Section eyebrow="Benefits" title="Benefits Of eBay Store Operations">
        <FeatureGrid items={[
          { i: ShieldCheck, t: "Lean Entry", d: "Lower-cost starting point compared to other marketplace channels." },
          { i: BarChart3, t: "Operational Clarity", d: "Structured workflows for orders, listings, and reporting." },
          { i: LineChart, t: "Pathway To Multi-Channel", d: "Expand into Walmart Marketplace and TikTok Shop over time." },
        ]} />
      </Section>

      <PricingSection />

      <FinalCTA />
    </>
  );
}
