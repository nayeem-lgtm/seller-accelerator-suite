import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Store, Search, ClipboardList, Truck, Package, MessageCircle, LineChart, TrendingUp, BarChart3, Layers, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section, Disclaimer } from "@/components/site/Section";
import { FinalCTA } from "@/components/site/FinalCTA";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Marketplace Operations Services | Ray Ecommerce" },
      { name: "description", content: "Full-service marketplace operations from Ray Ecommerce: Walmart, TikTok Shop, and eBay setup, product research, listings, supplier coordination, support, and reporting." },
      { property: "og:title", content: "Marketplace Operations Services | Ray Ecommerce" },
      { property: "og:description", content: "Everything managed for marketplace sellers." },
    ],
  }),
  component: ServicesPage,
});

const SERVICES = [
  { i: Store, t: "Walmart Marketplace Store Setup Support", d: "Account preparation, structural setup, and policy alignment for Walmart sellers." },
  { i: Sparkles, t: "TikTok Shop Setup Support", d: "Compliant creator-commerce setup tailored to TikTok Shop workflows." },
  { i: ShieldCheck, t: "eBay Store Setup Support", d: "Lean store launch path with structured operational preparation." },
  { i: Search, t: "Product Research", d: "Demand, margin, and competition-driven research for marketplace sellers." },
  { i: ClipboardList, t: "Listing Creation", d: "Conversion-focused listings with clean titles, attributes, and pricing." },
  { i: Truck, t: "Supplier Coordination", d: "Supplier workflows, availability checks, and fulfillment communication." },
  { i: Package, t: "Order Processing Support", d: "Order intake, status tracking, and operational updates." },
  { i: MessageCircle, t: "Customer Support", d: "Response workflows, issue tracking, and store communications." },
  { i: TrendingUp, t: "Store Optimization", d: "Listing refinement, pricing review, and performance tuning." },
  { i: LineChart, t: "Growth Reporting", d: "Transparent updates on orders, payouts, costs, and opportunities." },
  { i: BarChart3, t: "Profit Breakdown Education", d: "Clear, example-driven walk-throughs of marketplace economics." },
  { i: Layers, t: "Marketplace Expansion Planning", d: "Structured roadmap from one channel to multi-channel operations." },
];

function ServicesPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 brand-gradient-soft" />
        <div className="mx-auto max-w-7xl px-4 lg:px-8 py-20 md:py-28 text-center">
          <div className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-primary">Services</div>
          <h1 className="mt-3 text-4xl md:text-6xl font-bold tracking-tight max-w-4xl mx-auto leading-[1.05]">A Complete Marketplace Operations System</h1>
          <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">Everything Ray Ecommerce manages for serious marketplace sellers across Walmart Marketplace, TikTok Shop, and eBay.</p>
          <div className="mt-8">
            <Button asChild size="lg" className="rounded-full brand-gradient text-white btn-glow"><Link to="/seller-onboarding">Launch Your Store <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
          </div>
        </div>
      </section>

      <Section>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map(({ i: Icon, t, d }) => (
            <div key={t} className="rounded-3xl border border-border bg-white p-6 hover:-translate-y-1 hover:shadow-xl transition">
              <div className="h-11 w-11 rounded-2xl brand-gradient grid place-items-center text-white"><Icon className="h-5 w-5" /></div>
              <h3 className="mt-4 font-bold">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
        <Disclaimer>
          Marketplace approval, sales, revenue, and profit are not guaranteed. Results vary based on product selection, supplier pricing, marketplace rules, customer demand, competition, and operational factors.
        </Disclaimer>
      </Section>

      <FinalCTA />
    </>
  );
}
