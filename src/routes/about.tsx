import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, Sparkles, Target, Users, Compass, Award, CheckCircle2, Store, Tv, ShoppingBag, Heart, Eye, Handshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/site/Section";
import { PlatformLogo } from "@/components/site/PlatformLogo";
import { BackedByRaySection } from "@/components/site/PoweredByRay";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Ray Ecommerce — Marketplace Operations Experts" },
      { name: "description", content: "Ray Ecommerce, a division of Ray Advertising, is an independent marketplace operations service provider helping entrepreneurs launch and scale Walmart Marketplace, TikTok Shop, and eBay stores." },
      { property: "og:title", content: "About Ray Ecommerce" },
      { property: "og:description", content: "Independent marketplace operations service provider for Walmart, TikTok Shop, and eBay." },
    ],
  }),
  component: AboutPage,
});

const WHY_US = [
  { Icon: ShieldCheck, t: "Walmart Marketplace Approved Solution Provider", d: "Trusted operational partner aligned with Walmart Marketplace standards." },
  { Icon: Award, t: "7+ Years of Marketplace Experience", d: "Hands-on operations across Walmart, TikTok Shop, and eBay." },
  { Icon: Users, t: "Dedicated Account Support", d: "A real operations team, not a templated dashboard." },
  { Icon: Target, t: "Walmart-First Growth Strategy", d: "Anchor on Walmart, expand to TikTok Shop and eBay when ready." },
  { Icon: Sparkles, t: "Full Store Management", d: "Setup, listings, suppliers, orders, support, and reporting handled end-to-end." },
  { Icon: Compass, t: "Transparent Reporting", d: "Clear profit breakdowns and honest performance visibility." },
];

const VALUES = [
  { Icon: Heart, t: "Founder-Focused", d: "We treat every seller's store with the same care as our own." },
  { Icon: Eye, t: "Radical Transparency", d: "No inflated promises. Real numbers, real expectations, real progress." },
  { Icon: Handshake, t: "Operational Discipline", d: "Process-driven workflows so nothing slips between launch and scale." },
];

const PROCESS = [
  { n: "01", t: "Discovery", d: "We learn your goals, budget, and the marketplace that best fits your business." },
  { n: "02", t: "Setup", d: "Compliant store launch with structured product research and conversion-ready listings." },
  { n: "03", t: "Operations", d: "Daily order processing, supplier coordination, and customer support." },
  { n: "04", t: "Growth", d: "Optimization, reporting, and channel expansion across Walmart, TikTok Shop, and eBay." },
];

function AboutPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 brand-gradient-soft" />
        <div className="mx-auto max-w-7xl px-4 lg:px-8 py-20 md:py-28 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/70 backdrop-blur px-4 py-1.5 text-xs font-bold tracking-[0.2em] uppercase text-primary">
            <Sparkles className="h-3.5 w-3.5" /> About Us
          </div>
          <h1 className="mt-4 text-4xl md:text-6xl font-bold tracking-tight max-w-4xl mx-auto leading-[1.05]">
            About <span className="bg-clip-text text-transparent brand-gradient">Ray Ecommerce</span>
          </h1>
          <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Ray Ecommerce, a division of Ray Advertising, is an independent marketplace operations service provider — helping entrepreneurs launch and scale Walmart Marketplace, TikTok Shop, and eBay stores.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="rounded-full brand-gradient text-white btn-glow">
              <Link to="/pricing">View Plans <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full">
              <Link to="/contact">Schedule Strategy Call</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* WHO WE ARE */}
      <Section>
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="text-xs font-bold tracking-[0.2em] uppercase text-primary">Who We Are</div>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight">A focused marketplace operations team</h2>
            <p className="mt-4 text-muted-foreground">
              We're operators, not influencers. Ray Ecommerce is built around one thing: running real seller accounts on Walmart Marketplace, TikTok Shop, and eBay — with structured processes, honest reporting, and a Walmart-first growth strategy.
            </p>
            <p className="mt-3 text-muted-foreground">
              Our team handles the work most sellers don't have time to do well: product research, listing creation, supplier coordination, order processing, customer support, and channel expansion.
            </p>
            <div className="mt-6 grid sm:grid-cols-3 gap-3">
              {[
                { k: "7+", v: "Years of marketplace operations" },
                { k: "3", v: "Major platforms supported" },
                { k: "US", v: "Market-focused operations" },
              ].map((s) => (
                <div key={s.k} className="rounded-2xl border border-border bg-white p-4 text-center shadow-sm">
                  <div className="text-2xl font-bold text-primary">{s.k}</div>
                  <div className="text-xs text-muted-foreground mt-1">{s.v}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-white p-6 md:p-8 shadow-[0_10px_40px_-20px_rgba(15,23,42,0.18)]">
            <div className="text-xs font-bold tracking-[0.2em] uppercase text-primary">Marketplaces We Operate</div>
            <div className="mt-4 space-y-3">
              {[
                { k: "walmart" as const, t: "Walmart Marketplace", d: "Our anchor channel — full store operations." },
                { k: "tiktok" as const, t: "TikTok Shop", d: "Social commerce setup and growth." },
                { k: "ebay" as const, t: "eBay", d: "Beginner-friendly marketplace launch path." },
              ].map((m) => (
                <div key={m.k} className="flex items-center gap-4 rounded-2xl border border-border bg-gradient-to-br from-primary/[0.02] to-transparent p-4 hover:-translate-y-0.5 hover:shadow-md transition">
                  <div className="inline-flex items-center justify-center rounded-xl bg-white border border-border px-3 py-2 shadow-sm">
                    <PlatformLogo platform={m.k} className="h-6 w-auto" />
                  </div>
                  <div>
                    <div className="font-bold text-sm">{m.t}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{m.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* TRUST POSITIONING */}
      <Section>
        <div className="mx-auto max-w-3xl rounded-2xl border border-[#0071DC]/20 bg-gradient-to-r from-[#0071DC]/[0.04] via-white to-white px-5 py-4 md:px-7 md:py-5 shadow-[0_8px_30px_-18px_rgba(0,113,220,0.35)]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[#FFC220] text-2xl leading-none font-black">✲</span>
              <span className="text-[#0071DC] text-xl font-extrabold tracking-tight">Walmart</span>
            </div>
            <div className="hidden sm:block h-10 w-px bg-border/70" />
            <div className="flex items-start gap-3 flex-1">
              <div className="h-9 w-9 rounded-lg bg-[#0071DC]/10 text-[#0071DC] grid place-items-center shrink-0">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-base md:text-lg font-bold tracking-tight text-foreground">Walmart Marketplace approved Solution Provider</h3>
                <p className="mt-0.5 text-sm text-muted-foreground">Officially listed Solution Provider for Walmart Marketplace seller growth.</p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* BACKED BY RAY ADVERTISING */}
      <BackedByRaySection />

      {/* WHY SELLERS CHOOSE US */}
      <Section>
        <div className="text-center max-w-2xl mx-auto">
          <div className="text-xs font-bold tracking-[0.2em] uppercase text-primary">Why Sellers Choose Us</div>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight">Built for serious marketplace sellers</h2>
          <p className="mt-3 text-muted-foreground">A practical operations partner that handles the work, reports honestly, and stays focused on outcomes.</p>
        </div>
        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {WHY_US.map(({ Icon, t, d }) => (
            <div key={t} className="rounded-3xl border border-border bg-white p-6 hover:-translate-y-1 hover:shadow-xl transition">
              <div className="h-11 w-11 rounded-2xl brand-gradient grid place-items-center text-white shadow-md">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-bold">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* OUR PROCESS */}
      <Section>
        <div className="text-center max-w-2xl mx-auto">
          <div className="text-xs font-bold tracking-[0.2em] uppercase text-primary">Our Process</div>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight">From discovery to growth</h2>
        </div>
        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {PROCESS.map((s) => (
            <div key={s.n} className="relative rounded-3xl border border-border bg-white p-6 hover:-translate-y-1 hover:shadow-xl transition">
              <div className="text-4xl font-bold bg-clip-text text-transparent brand-gradient">{s.n}</div>
              <h3 className="mt-3 font-bold">{s.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* VALUES */}
      <Section>
        <div className="grid md:grid-cols-3 gap-5">
          {VALUES.map(({ Icon, t, d }) => (
            <div key={t} className="rounded-3xl border border-border bg-gradient-to-br from-primary/[0.03] to-transparent p-6 hover:-translate-y-1 hover:shadow-xl transition">
              <div className="h-11 w-11 rounded-2xl bg-primary/10 text-primary grid place-items-center">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-bold">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <div className="relative overflow-hidden rounded-3xl brand-gradient text-white p-10 md:p-14 shadow-2xl">
          <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="relative grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/80">Ready to launch?</div>
              <h2 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight">Let Ray Ecommerce run your marketplace store.</h2>
              <p className="mt-3 text-white/85 max-w-xl">Choose a plan or talk to our team. Anchor on Walmart. Grow on TikTok. Expand on eBay.</p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Button asChild size="lg" className="rounded-full bg-white text-primary hover:bg-white/90">
                <Link to="/pricing">View Plans <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full border-white text-white bg-white/10 hover:bg-white/20 hover:text-white">
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
