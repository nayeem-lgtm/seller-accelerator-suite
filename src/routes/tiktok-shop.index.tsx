import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Video, Search, ClipboardList, Truck, MessageCircle, LineChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/site/Section";
import { PricingSection } from "@/components/site/PricingSection";


import { FinalCTA } from "@/components/site/FinalCTA";
import { HowItWorks, tiktokSteps } from "@/components/site/HowItWorks";
import { PlatformSalesBreakdown, tiktokBreakdown } from "@/components/site/PlatformSalesBreakdown";

export const Route = createFileRoute("/tiktok-shop/")({
  head: () => ({
    meta: [
      { title: "TikTok Shop | Ray Ecommerce" },
      { name: "description", content: "Ray Ecommerce helps entrepreneurs prepare and manage TikTok Shop operations with product research, listing support, order coordination, customer support, and reporting." },
      { property: "og:title", content: "TikTok Shop | Ray Ecommerce" },
      { property: "og:description", content: "Creator-commerce growth, professionally managed." },
    ],
  }),
  component: TikTokPage,
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

function TikTokPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 brand-gradient-soft" />
        <div className="mx-auto max-w-7xl px-4 lg:px-8 py-20 md:py-28 text-center">
          <div className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-primary">TikTok Shop</div>
          <h1 className="mt-3 text-4xl md:text-6xl font-bold tracking-tight max-w-4xl mx-auto leading-[1.05]">TikTok Shop For Creator-Commerce Growth</h1>
          <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">Ray Ecommerce helps entrepreneurs prepare and manage TikTok Shop operations with product research, listing setup, content strategy guidance, order support, customer support, and reporting.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="rounded-full brand-gradient text-white btn-glow"><Link to="/seller-onboarding">Start TikTok Store <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
            <Button asChild size="lg" variant="outline" className="rounded-full"><a href="/contact">Schedule Strategy Call</a></Button>
          </div>
        </div>
      </section>

      <HowItWorks steps={tiktokSteps} />

      <PlatformSalesBreakdown data={tiktokBreakdown} />

      <Section eyebrow="Money Flow" title="TikTok Shop Revenue Flow">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-border bg-white px-6 py-5 shadow-sm md:px-10 md:py-6">
            <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm text-muted-foreground md:text-base">
              <span>Supplier</span>
              <span className="text-primary">→</span>
              <span className="font-semibold text-foreground">TikTok Shop Store</span>
              <span className="text-primary">→</span>
              <span>Customer Purchase</span>
              <span className="text-primary">→</span>
              <span>TikTok Shop Deposit</span>
              <span className="text-primary">→</span>
              <span>Your Account</span>
              <span className="text-primary">→</span>
              <span>Net Profit Review</span>
            </p>
          </div>
        </div>
      </Section>

      <Section eyebrow="Overview" title="A Marketplace Built For Discovery">
        <FeatureGrid items={[
          { i: Sparkles, t: "Creator-Commerce", d: "Reach buyers in a discovery-first environment with strong engagement signals." },
          { i: Video, t: "Content + Catalog", d: "Listing-and-content workflows aligned to TikTok Shop standards." },
          { i: LineChart, t: "Growth Reporting", d: "Transparent updates on listings, orders, and operational health." },
        ]} />
      </Section>

      <Section eyebrow="Operations" title="What Ray Ecommerce Helps Manage">
        <FeatureGrid items={[
          { i: Search, t: "Product Research", d: "Demand-aligned research for the TikTok Shop audience." },
          { i: ClipboardList, t: "Listing Setup", d: "Compliant listings with conversion-ready structure." },
          { i: Video, t: "Content Strategy Guidance", d: "Direction for content-led marketplace growth." },
          { i: Truck, t: "Order Fulfillment Support", d: "Supplier and shipping coordination workflows." },
          { i: MessageCircle, t: "Customer Support", d: "Response workflows and issue resolution support." },
          { i: LineChart, t: "Growth Reporting", d: "Visibility into product, order, and operations performance." },
        ]} />
      </Section>

      <PricingSection />

      <FinalCTA />
    </>
  );
}
