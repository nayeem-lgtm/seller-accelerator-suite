import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Store, Search, ClipboardList, Truck, MessageCircle, LineChart, ShieldCheck, Sparkles, BarChart3, Package, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section, Disclaimer } from "@/components/site/Section";
import { PricingSection } from "@/components/site/PricingSection";

import { FinalCTA } from "@/components/site/FinalCTA";
import { HowItWorks, walmartSteps } from "@/components/site/HowItWorks";
import { TrustBadge } from "@/components/site/TrustBadge";
import { PlatformSalesBreakdown, walmartBreakdown } from "@/components/site/PlatformSalesBreakdown";

export const Route = createFileRoute("/walmart/")({
  head: () => ({
    meta: [
      { title: "Walmart | Ray Ecommerce" },
      { name: "description", content: "Launch and manage Walmart Marketplace operations with Ray Ecommerce. Get support for setup, product research, listings, suppliers, orders, customer support, and reporting." },
      { property: "og:title", content: "Walmart | Ray Ecommerce" },
      { property: "og:description", content: "Walmart-first marketplace operations for serious sellers." },
    ],
  }),
  component: WalmartPage,
});

function PageHero({ eyebrow, title, subtitle, cta1, cta2, badge }: { eyebrow: string; title: React.ReactNode; subtitle: string; cta1: { label: string; to: string }; cta2: { label: string; href: string }; badge?: boolean }) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 brand-gradient-soft" />
      <div className="mx-auto max-w-7xl px-4 lg:px-8 py-20 md:py-28 text-center">
        <div className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-primary">{eyebrow}</div>
        <h1 className="mt-3 text-4xl md:text-6xl font-bold tracking-tight max-w-4xl mx-auto leading-[1.05]">{title}</h1>
        <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
        {badge && <div className="mt-6 flex justify-center"><TrustBadge /></div>}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg" className="rounded-full brand-gradient text-white btn-glow"><Link to={cta1.to}>{cta1.label} <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
          <Button asChild size="lg" variant="outline" className="rounded-full"><a href={cta2.href}>{cta2.label}</a></Button>
        </div>
      </div>
    </section>
  );
}

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

function WalmartPage() {
  return (
    <>
      <PageHero
        eyebrow="Walmart Marketplace"
        title={<>Walmart Built For Serious Sellers</>}
        subtitle="Launch and manage your Walmart Marketplace path with Ray Ecommerce — a Walmart Marketplace approved Solution Provider helping sellers with readiness review, product research, listing support, fulfillment planning, and reporting."
        cta1={{ label: "Start Walmart Store", to: "/seller-onboarding" }}
        cta2={{ label: "Schedule Strategy Call", href: "/contact" }}
        badge
      />

      <HowItWorks steps={walmartSteps} />

      <PlatformSalesBreakdown data={walmartBreakdown} />

      <Section eyebrow="Why Walmart" title="A Trusted Marketplace For Premium Sellers" subtitle="Walmart Marketplace combines high consumer trust with professional seller standards — the right environment for a Walmart-first marketplace strategy.">
        <FeatureGrid items={[
          { i: ShieldCheck, t: "High-Trust Retail Environment", d: "Buyers shop Walmart with confidence, supporting professional listings and serious operations." },
          { i: BarChart3, t: "Serious Buyer Intent", d: "Marketplace search traffic skews toward intent-driven, conversion-ready shoppers." },
          { i: Layers, t: "Structured Compliance", d: "Walmart maintains standards that reward sellers with operationally clean stores." },
        ]} />
      </Section>

      <Section eyebrow="Process" title="Walmart Process">
        <FeatureGrid items={[
          { i: Sparkles, t: "1. Strategy Review", d: "We discuss your goals and recommend the right Walmart entry path." },
          { i: Store, t: "2. Store Setup Support", d: "Account preparation, structural setup, and policy alignment." },
          { i: Search, t: "3. Product Research", d: "Demand-driven product research using market and margin signals." },
          { i: ClipboardList, t: "4. Listing Optimization", d: "Conversion-focused titles, descriptions, attributes, and pricing." },
          { i: Truck, t: "5. Supplier & Orders", d: "Supplier coordination, order processing, and tracking workflows." },
          { i: LineChart, t: "6. Reporting", d: "Transparent updates on orders, payouts, costs, and profit estimates." },
        ]} />
      </Section>

      <Section eyebrow="Money Flow" title="Walmart Revenue Flow">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-border bg-white px-6 py-5 shadow-sm md:px-10 md:py-6">
            <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm text-muted-foreground md:text-base">
              <span>Supplier</span>
              <span className="text-primary">→</span>
              <span className="font-semibold text-foreground">Walmart Store</span>
              <span className="text-primary">→</span>
              <span>Customer Purchase</span>
              <span className="text-primary">→</span>
              <span>Walmart Deposit</span>
              <span className="text-primary">→</span>
              <span>Your Account</span>
              <span className="text-primary">→</span>
              <span>Profit Review</span>
            </p>
          </div>
        </div>
      </Section>

      <Section title="Walmart Reporting Dashboard" eyebrow="Transparency">
        <FeatureGrid items={[
          { i: BarChart3, t: "Revenue & Orders", d: "Clear visibility into store sales activity." },
          { i: Package, t: "Supplier Cost Tracking", d: "Estimated cost of goods alongside payouts." },
          { i: MessageCircle, t: "Customer Support Log", d: "Open issues, response time, resolution status." },
        ]} />
      </Section>

      <PricingSection />
      

      <Section>
        <Disclaimer>
          Ray Ecommerce does not guarantee Walmart Marketplace approval, sales, revenue, rankings, or profit. Results vary based on product selection, supplier pricing, marketplace rules, customer demand, competition, and operational factors.
        </Disclaimer>
        <div className="mt-6 flex justify-center gap-3">
          <Button asChild className="rounded-full brand-gradient text-white btn-glow"><Link to="/seller-onboarding">Start Walmart Store <CheckCircle2 className="ml-1 h-4 w-4" /></Link></Button>
        </div>
      </Section>

      <FinalCTA />
    </>
  );
}
