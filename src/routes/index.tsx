import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowRight, BarChart3, Boxes, CheckCircle2, ChevronRight, Layers,
  LineChart, Package, ShieldCheck, Sparkles, Store, Truck, MessageCircle, TrendingUp, Star, DollarSign,
  ShoppingBag, Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Section, Disclaimer } from "@/components/site/Section";
import { PricingSection } from "@/components/site/PricingSection";
import { FreeSampleSection } from "@/components/site/FreeSampleSection";


import { FinalCTA } from "@/components/site/FinalCTA";
import { ApprovedSolutionProviderCard } from "@/components/site/TrustBadge";
import { PoweredByRayTrust, CompanyBackingSection } from "@/components/site/PoweredByRay";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ray Ecommerce | Marketplace Operations for Walmart, TikTok Shop & eBay" },
      { name: "description", content: "Ray Ecommerce supports sellers with structured marketplace operations across Walmart, TikTok Shop, and eBay — workflows, supplier coordination, reporting, and brand-safe support." },
      { property: "og:title", content: "Ray Ecommerce | Marketplace Operations for Walmart, TikTok Shop & eBay" },
      { property: "og:description", content: "Launch and manage Walmart, TikTok Shop, and eBay stores with Ray Ecommerce." },

    ],
  }),
  component: Home,
});

function useCounter(target: number, ms = 1400) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / ms);
      setN(Math.floor(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return n;
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 brand-gradient-soft" />
        <div className="absolute inset-0 hero-grid opacity-[0.35]" />
        <div className="absolute top-10 -left-24 h-96 w-96 rounded-full bg-primary/20 blur-3xl animate-blob" />
        <div className="absolute -bottom-16 right-0 h-[28rem] w-[28rem] rounded-full bg-brand-glow/20 blur-3xl animate-blob" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/3 right-1/3 h-72 w-72 rounded-full bg-primary/15 blur-3xl animate-blob" style={{ animationDelay: "4s" }} />
      </div>
      <div className="mx-auto max-w-7xl px-4 lg:px-8 pt-14 pb-24 md:pt-24 md:pb-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur border border-primary/20 text-xs font-semibold text-primary shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-success opacity-75 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
              </span>
              Trusted Marketplace Operations Ecosystem
              <span className="hidden sm:inline text-foreground/60">· now onboarding</span>
            </div>
            <h1 className="mt-5 text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.02]">
              Built Around{" "}
              <span className="relative inline-block">
                <span className="relative z-10 brand-gradient bg-clip-text text-transparent" style={{ WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  Verified Marketplace
                </span>
              </span>{" "}
              Operations
            </h1>
            <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-xl">
              Ray Ecommerce supports sellers with structured marketplace operations across{" "}
              <strong className="text-foreground">Walmart</strong>, <strong className="text-foreground">TikTok Shop</strong>, and{" "}
              <strong className="text-foreground">eBay</strong> — organized workflows, supplier coordination, reporting systems, and brand-safe marketplace support.
            </p>
            <ul className="mt-6 grid sm:grid-cols-2 gap-2 text-sm">
              {[
                "Walmart-first strategy",
                "You own the account",
                "No inventory storage",
                "Hands-free operations",
                "Transparent reporting",
                "Multi-channel growth",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-success mt-0.5 shrink-0" /> {t}</li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full brand-gradient text-white btn-glow px-6">
                <Link to="/seller-onboarding">Launch Your Store <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full px-6 bg-white/70 backdrop-blur">
                <a href="#free-sample">Schedule Strategy call{"\n"}</a>
              </Button>
            </div>

            <div className="mt-8">
              <ApprovedSolutionProviderCard />
              <p className="mt-3 text-xs md:text-[13px] text-muted-foreground max-w-xl leading-snug">
                Structured marketplace setup, management support, and reporting — with account ownership remaining with the seller.
              </p>
            </div>
          </div>
          <div className="relative">
            <DashboardMock />
          </div>
        </div>
      </div>
      <MarqueeStrip />
    </section>
  );
}

function MarqueeStrip() {
  const items = ["Walmart Marketplace", "TikTok Shop", "eBay", "Hands-free Ops", "Transparent Reporting", "US-Based Support", "Walmart-First"];
  return (
    <div className="relative border-y border-border bg-white/60 backdrop-blur py-4 overflow-hidden">
      <div className="flex gap-12 animate-marquee whitespace-nowrap">
        {[...items, ...items, ...items].map((t, i) => (
          <span key={i} className="text-sm font-semibold tracking-wide text-foreground/70 flex items-center gap-3">
            <Sparkles className="h-3.5 w-3.5 text-primary" /> {t}
          </span>
        ))}
      </div>
    </div>
  );
}

function DashboardMock() {
  return (
    <div className="relative">
      <div className="relative rounded-3xl glass-card p-5 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-muted-foreground">Walmart Marketplace</div>
            <div className="text-lg font-bold">Store Performance</div>
          </div>
          <div className="text-[10px] font-bold px-2 py-1 rounded-full brand-gradient text-white">LIVE</div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {[
            { l: "Revenue", v: "$505,421", i: TrendingUp, c: "text-success" },
            { l: "Orders", v: "5054+", i: Package, c: "text-primary" },
            { l: "Payout", v: "$429,608", i: DollarSign, c: "text-primary" },
          ].map(({ l, v, i: I, c }) => (
            <div key={l} className="rounded-xl border border-border bg-white p-3">
              <I className={`h-4 w-4 ${c}`} />
              <div className="text-[10px] text-muted-foreground mt-1">{l}</div>
              <div className="text-sm font-bold">{v}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-xl border border-border bg-white p-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Monthly Growth</span>
            <span className="text-success font-semibold">+24.6%</span>
          </div>
          <svg viewBox="0 0 300 100" className="mt-2 w-full h-24">
            <defs>
              <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.623 0.214 259.8)" stopOpacity="0.4" />
                <stop offset="100%" stopColor="oklch(0.623 0.214 259.8)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0,80 C40,60 70,70 100,50 C130,30 160,55 190,40 C220,25 250,35 300,15 L300,100 L0,100 Z" fill="url(#g)" />
            <path d="M0,80 C40,60 70,70 100,50 C130,30 160,55 190,40 C220,25 250,35 300,15" fill="none" stroke="oklch(0.623 0.214 259.8)" strokeWidth="2.5" />
          </svg>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
          <div className="rounded-xl border border-border p-3 bg-white">
            <div className="text-muted-foreground">Supplier+Fee Cost</div>
            <div className="font-bold text-base">$290,500</div>
          </div>
          <div className="rounded-xl border border-border p-3 bg-white">
            <div className="text-muted-foreground">Est. Net Profit</div>
            <div className="font-bold text-base text-success">$116,200</div>
          </div>
        </div>
      </div>
      <div className="absolute -top-3 -right-3 brand-gradient text-white px-3 py-2 rounded-2xl text-xs font-bold shadow-lg animate-float">Walmart Marketplace</div>
      <div className="absolute -bottom-3 left-6 bg-white border border-border px-3 py-2 rounded-2xl text-xs font-bold shadow-lg animate-float" style={{ animationDelay: "1s" }}>TikTok Shop</div>
      <div className="absolute top-1/2 -right-6 bg-white border border-border px-3 py-2 rounded-2xl text-xs font-bold shadow-lg animate-float" style={{ animationDelay: "2s" }}>eBay</div>
    </div>
  );
}

function TrustMetrics() {
  const yrs = useCounter(7);
  const stores = useCounter(500);
  const metrics = [
    { Icon: Star, v: `${yrs}+`, l: "Years Experience" },
    { Icon: ShoppingBag, v: `${stores}+`, l: "Stores Managed" },
    { Icon: Share2, v: "Multi-Channel", l: "Marketplace Operations" },
    { Icon: ShieldCheck, v: "Transparent", l: "Reporting Process" },
  ];
  return (
    <section className="relative bg-white py-10 md:py-14 overflow-hidden">
      {/* Decorative background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-24 md:w-40 opacity-40"
        style={{
          backgroundImage: "radial-gradient(circle, #bfdbfe 1px, transparent 1px)",
          backgroundSize: "16px 16px",
          maskImage: "linear-gradient(to right, black, transparent)",
          WebkitMaskImage: "linear-gradient(to right, black, transparent)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-24 md:w-40 opacity-40"
        style={{
          backgroundImage: "radial-gradient(circle, #bfdbfe 1px, transparent 1px)",
          backgroundSize: "16px 16px",
          maskImage: "linear-gradient(to left, black, transparent)",
          WebkitMaskImage: "linear-gradient(to left, black, transparent)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-16 -left-16 w-[320px] h-[320px] rounded-full blur-3xl opacity-30"
        style={{ background: "radial-gradient(circle, #3B82F6 0%, transparent 70%)" }}
      />
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 w-full h-28 opacity-[0.06]"
        viewBox="0 0 1440 200"
        fill="none"
        preserveAspectRatio="none"
      >
        <path d="M0,150 C300,20 800,180 1440,40" stroke="#2563EB" strokeWidth="1.5" fill="none" />
      </svg>

      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center mx-auto max-w-3xl mb-8 md:mb-12 animate-fade-in">
          <h2 className="font-bold text-slate-900 tracking-tight text-2xl sm:text-3xl md:text-4xl" style={{ lineHeight: 1.2 }}>
            Marketplace Operations Built For{" "}
            <span className="text-slate-900">Serious Entrepreneurs</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {metrics.map(({ Icon, v, l }, idx) => (
            <div
              key={l}
              className="group relative rounded-2xl bg-white border border-blue-100/80 shadow-[0_4px_20px_-8px_rgba(37,99,235,0.12)] p-5 flex flex-col items-center justify-center text-center min-h-[180px] md:min-h-[200px] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_36px_-12px_rgba(37,99,235,0.25)] hover:border-blue-300 animate-fade-in"
              style={{ animationDelay: `${idx * 120}ms`, animationFillMode: "both" }}
            >
              <div className="relative mb-3">
                <div className="absolute inset-0 rounded-full bg-blue-400/30 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative w-11 h-11 rounded-full bg-blue-50 flex items-center justify-center ring-1 ring-blue-100">
                  <Icon className="w-5 h-5 text-blue-600" strokeWidth={1.75} />
                </div>
              </div>
              <div className="text-xl md:text-2xl font-bold text-blue-600 leading-tight">
                {v}
              </div>
              <div className="mt-1 text-sm font-semibold text-slate-900">
                {l}
              </div>
              <div className="mt-2 h-[2px] w-8 rounded-full bg-blue-500/80" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MarketplaceStrip() {
  const markets = [
    {
      label: "WALMART FIRST",
      titleDark: "Walmart",
      titleLight: "",
      tag: "PRIME FOCUS",
      desc: "Our flagship channel. Walmart Marketplace offers serious sellers access to a high-trust retail environment with qualified buyer intent and enterprise-level positioning.",
    },
    {
      label: "GROWTH CHANNEL",
      titleDark: "TikTok",
      titleLight: "Shop",
      tag: "GROWTH PLAY",
      desc: "Where discovery turns into demand. We structure your listings, content strategy, and order flow so your products tap into TikTok's social-commerce momentum and reach a whole new wave of buyers",
    },
    {
      label: "STARTER MARKETPLACE",
      titleDark: "eBay",
      titleLight: "",
      tag: "EASY START",
      desc: "A proven starting point for marketplace sellers. eBay provides immediate access to a global buyer base with flexible listing and selling options.",
    },
  ];
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  useEffect(() => {
    if (hovered !== null) return;
    const id = setInterval(() => setActive((a) => (a + 1) % markets.length), 3200);
    return () => clearInterval(id);
  }, [hovered, markets.length]);
  const current = hovered ?? active;
  return (
    <Section eyebrow="Marketplace Priority" title="One Strategy. Three Marketplaces. Walmart First.">
      <div className="grid md:grid-cols-3 gap-5 items-stretch">
        {markets.map((m, i) => {
          const isActive = i === current;
          return (
            <div
              key={m.label}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className={`relative rounded-3xl p-7 border cursor-pointer flex flex-col h-full transition-all duration-700 ease-out will-change-transform ${
                isActive
                  ? "brand-gradient text-white border-transparent shadow-2xl shadow-primary/30 -translate-y-2 scale-[1.03]"
                  : "bg-white border-border shadow-sm hover:shadow-md text-foreground"
              }`}
            >
              {isActive && (
                <>
                  <div className="pointer-events-none absolute -inset-px rounded-3xl ring-1 ring-white/30" />
                  <div className="absolute top-5 right-5 h-2.5 w-2.5 rounded-full bg-white/80 animate-pulse" />
                </>
              )}
              <div className="text-center mb-5">
                <div className={`text-[10px] font-bold tracking-widest uppercase mb-2 transition-colors duration-700 ${
                  isActive ? "text-white/70" : "text-primary"
                }`}>
                  {m.label}
                </div>
                <div className="text-3xl font-bold leading-tight">
                  <span className={`transition-colors duration-700 ${isActive ? "text-white" : "text-navy"}`}>
                    {m.titleDark}
                  </span>{" "}
                  <span className={`transition-colors duration-700 ${isActive ? "text-blue-200" : "text-primary"}`}>
                    {m.titleLight}
                  </span>
                </div>
              </div>
              <div className={`inline-flex self-start text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full transition-colors duration-700 ${
                isActive ? "bg-white/20 text-white" : "bg-primary/10 text-primary"
              }`}>
                {m.tag}
              </div>
              <div className={`mt-3 text-sm leading-relaxed flex-grow transition-colors duration-700 ${isActive ? "text-white/85" : "text-muted-foreground"}`}>
                {m.desc}
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

function WhyWalmart() {
  const cards = [
    { i: ShieldCheck, t: "Enterprise Marketplace Positioning", d: "Walmart Marketplace gives sellers access to a high-trust retail environment." },
    { i: Layers, t: "Operational Complexity Managed", d: "Ray Ecommerce helps manage setup, product research, listings, suppliers, orders, and support." },
    { i: TrendingUp, t: "Multi-Channel Growth Path", d: "Start with Walmart Marketplace, then expand into TikTok Shop and eBay where appropriate." },
  ];
  return (
    <Section
      eyebrow="Walmart First"
      title="Why Walmart Marketplace Comes First"
      subtitle="Walmart Marketplace gives qualified sellers access to a trusted retail ecosystem, serious buyer intent, and a professional marketplace environment. Ray Ecommerce helps clients navigate the operational side with a structured, transparent management process."
    >
      <div className="grid md:grid-cols-3 gap-5">
        {cards.map(({ i: Icon, t, d }) => (
          <div key={t} className="rounded-3xl glass-card p-7 hover:-translate-y-1 transition">
            <div className="h-12 w-12 rounded-2xl brand-gradient grid place-items-center text-white"><Icon className="h-6 w-6" /></div>
            <h3 className="mt-4 text-lg font-bold">{t}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{d}</p>
          </div>
        ))}
      </div>
      <Disclaimer>
        Marketplace approval, performance, sales, and profitability are not guaranteed. Results vary based on store status, product selection, supplier pricing, marketplace rules, demand, competition, and operational factors.
      </Disclaimer>
    </Section>
  );
}


function MoneyFlow() {
  const steps = ["Supplier", "Marketplace Store", "Customer Purchase", "Marketplace Deposit", "Your Account", "Profit Review"];
  return (
    <Section eyebrow="Money Flow" title="See How The Money Flows">
      <div className="rounded-3xl glass-card p-6 md:p-10">
        {[
          { name: "Walmart Marketplace", featured: true },
          { name: "TikTok Shop" },
          { name: "eBay" },
        ].map((m) => (
          <div key={m.name} className={`mb-5 last:mb-0 rounded-2xl p-4 ${m.featured ? "bg-primary/5 border border-primary/20" : "bg-white border border-border"}`}>
            <div className="text-xs font-semibold text-primary mb-3">{m.name}</div>
            <div className="flex flex-wrap items-center gap-2">
              {steps.map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-3 py-2 rounded-full bg-white border border-border">{s}</span>
                  {i < steps.length - 1 && (
                    <ChevronRight
                      className="h-4 w-4 text-primary animate-flow-forward"
                      style={{ animationDelay: `${i * 200}ms` }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
        <ul className="mt-6 grid md:grid-cols-2 gap-2 text-sm text-muted-foreground">
          {[
            "You own the marketplace account.",
            "Marketplace payouts typically go to your account.",
            "Ray Ecommerce manages day-to-day operations.",
            "Supplier and fulfillment costs are tracked transparently.",
            "Profit share is calculated after estimated costs.",
            "No inventory storage is required in most managed workflows.",
          ].map((t) => (
            <li key={t} className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-success mt-0.5 shrink-0" /> {t}</li>
          ))}
        </ul>
        <p className="mt-5 text-xs text-muted-foreground italic">
          Example flow is for explanation only. Marketplace payout timing, fees, rules, and account requirements vary by platform.
        </p>
      </div>
    </Section>
  );
}

function ProfitBreakdown() {
  const data = {
    walmart: { fee: 15, payout: 85, cost: 50, name: "Walmart Marketplace" },
    tiktok: { fee: 12, payout: 88, cost: 50, name: "TikTok Shop" },
    ebay: { fee: 14, payout: 86, cost: 50, name: "eBay" },
  } as const;
  type K = keyof typeof data;
  const [mk, setMk] = useState<K>("walmart");
  const d = data[mk];
  const profit = +(d.payout - d.cost).toFixed(2);
  const client = +(profit * 0.6).toFixed(2);
  const ray = +(profit * 0.4).toFixed(2);

  return (
    <Section id="profit-breakdown" eyebrow="Transparent Example" title="A Single $100 Marketplace Sale, Clearly Broken Down" subtitle="No confusion. No hidden math. See how revenue, estimated marketplace fees, supplier costs, marketplace payout, gross profit, and profit share can flow through a managed marketplace store.">
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-3xl glass-card p-7">
          <div className="text-[10px] font-bold tracking-widest uppercase text-primary">The Sale</div>
          <h3 className="mt-2 text-xl font-bold">Customer buys an item from your marketplace store</h3>
          <Tabs value={mk} onValueChange={(v) => setMk(v as K)} className="mt-5">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="walmart">Walmart</TabsTrigger>
              <TabsTrigger value="tiktok">TikTok</TabsTrigger>
              <TabsTrigger value="ebay">eBay</TabsTrigger>
            </TabsList>
            <TabsContent value={mk} className="mt-5">
              <dl className="space-y-2 text-sm">
                {[
                  ["Sale Price", "$100.00"],
                  ["Estimated Marketplace Fee", `$${d.fee.toFixed(2)}`],
                  ["Marketplace Releases To You", `$${d.payout.toFixed(2)}`],
                  ["Supplier + Fulfillment Cost", `$${d.cost.toFixed(2)}`],
                  ["Estimated Gross Profit", `$${profit.toFixed(2)}`],
                ].map(([l, v]) => (
                  <div key={l} className="flex justify-between border-b border-border py-2">
                    <dt className="text-muted-foreground">{l}</dt>
                    <dd className="font-semibold">{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-4 rounded-xl bg-primary/5 border border-primary/20 p-4 text-center font-mono text-sm">
                ${d.payout.toFixed(2)} − ${d.cost.toFixed(2)} = <span className="text-success font-bold">${profit.toFixed(2)}</span>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        <div className="rounded-3xl brand-gradient text-white p-7">
          <div className="text-[10px] font-bold tracking-widest uppercase text-white/80">The Profit</div>
          <h3 className="mt-2 text-xl font-bold">Estimated payout minus estimated cost ({d.name})</h3>
          <div className="mt-6 text-center">
            <div className="text-sm text-white/80">Estimated Gross Profit</div>
            <div className="text-6xl font-bold mt-1">${profit.toFixed(2)}</div>
          </div>
          <div className="mt-6">
            <div className="text-xs text-white/80 mb-2">Split</div>
            <div className="h-4 rounded-full overflow-hidden flex bg-white/20">
              <div className="bg-white" style={{ width: "60%" }} />
              <div className="bg-spark" style={{ width: "40%" }} />
            </div>
            <div className="mt-2 flex justify-between text-xs"><span>Client 60%</span><span>Ray 40%</span></div>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-white/15 p-4">
              <div className="text-xs text-white/80">You Keep</div>
              <div className="text-2xl font-bold">${client.toFixed(2)}</div>
            </div>
            <div className="rounded-xl bg-white/15 p-4">
              <div className="text-xs text-white/80">Ray Ecommerce</div>
              <div className="text-2xl font-bold">${ray.toFixed(2)}</div>
            </div>
          </div>
          <p className="mt-5 text-xs text-white/80">
            Multiply this across consistent product sales, multiple listings, and carefully managed marketplace channels. This is an example only, not a guarantee.
          </p>
          <Button asChild className="mt-5 w-full rounded-full bg-white text-primary hover:bg-white/90">
            <a href="#pricing">See Marketplace Plans <ArrowRight className="ml-1 h-4 w-4" /></a>
          </Button>
        </div>
      </div>
      <Disclaimer>
        Examples are for illustration only. Marketplace fees, supplier costs, shipping, taxes, payout timing, customer demand, and profit margins may vary. Profit is not guaranteed.
      </Disclaimer>
    </Section>
  );
}


function VerifiedNetwork() {
  const cards = [
    { t: "Walmart Marketplace", b: "PRIME FOCUS", d: "Ray Ecommerce prioritizes Walmart Marketplace operations for serious sellers, including setup support, product research, listing support, supplier coordination, order processing, and transparent reporting." },
    { t: "TikTok Shop", b: "GROWTH PLAY", d: "Where attention becomes revenue. We engineer your listings, content, and order flow to capture TikTok's social-commerce momentum and reach a new generation of buyers." },
    { t: "eBay", b: "EASY START", d: "eBay operations support gives sellers a lean marketplace path with product research, listing management, order coordination, customer support, and monthly reporting." },
    { t: "Supplier Network Coordination", b: "Fulfillment Support", d: "Ray Ecommerce helps coordinate supplier workflows, product availability checks, order updates, tracking details, and fulfillment communication." },
    { t: "Reporting & Profit Tracking Tools", b: "Transparent Dashboard", d: "Clients receive clear updates on orders, estimated costs, marketplace payouts, product performance, and sample profit breakdowns." },
    { t: "Customer Support Workflow", b: "Operational Support", d: "Ray Ecommerce helps organize customer support processes, order issue tracking, response workflows, and store communication." },
  ];
  return (
    <Section id="verified-partners" eyebrow="Trusted Operations Ecosystem" title="Built Around Verified Marketplace Operations" subtitle="Ray Ecommerce supports sellers with structured marketplace operations across Walmart Marketplace, TikTok Shop, and eBay, using organized workflows, supplier coordination, reporting systems, and brand-safe marketplace support.">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map((c) => (
          <div key={c.t} className="rounded-3xl border border-border bg-white p-6 hover:shadow-xl transition">
            <div className="text-[10px] font-bold tracking-widest uppercase text-primary">{c.b}</div>
            <h3 className="mt-2 text-lg font-bold">{c.t}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{c.d}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}


function Stories() {
  const cards = [
    { n: "Marcus T.", s: "Home & Kitchen", m: "Walmart Marketplace", k: "Improved listing workflow", q: "The operations cadence and reporting transparency completely changed how I run my Walmart store." },
    { n: "Priya R.", s: "Beauty & Personal Care", m: "TikTok Shop", k: "Clearer marketplace reporting", q: "Ray Ecommerce gave me a real structure for managing TikTok Shop listings and orders without burning out." },
    { n: "Jordan K.", s: "Electronics Accessories", m: "Multi-channel", k: "Expanded to multi-channel operations", q: "Started lean on eBay, expanded into Walmart with their team's playbook. Operations are night-and-day better." },
  ];
  return (
    <section className="relative overflow-hidden py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 mb-4 text-[11px] font-bold tracking-[0.15em] text-primary uppercase bg-primary/10 rounded-full">
            TESTIMONIALS
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy tracking-tight">
            Real Operators.{" "}
            <span className="text-primary">Real Marketplace Growth Stories.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {cards.map((c) => (
            <div
              key={c.n}
              className="group relative bg-white p-7 lg:p-8 rounded-[2rem] border border-border/60 shadow-[0_4px_24px_-8px_rgba(59,130,246,0.12)] hover:shadow-[0_16px_48px_-12px_rgba(59,130,246,0.25)] hover:-translate-y-1.5 transition-all duration-400 ease-out"
            >
              <div className="absolute -top-3 left-7">
                <span className="inline-flex items-center bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
                  {c.m}
                </span>
              </div>

              <div className="flex gap-1 text-spark mb-5 pt-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>

              <p className="text-sm md:text-[15px] text-foreground/80 leading-relaxed mb-8">
                "{c.q}"
              </p>

              <div className="flex items-center gap-3.5">
                <div className="h-11 w-11 rounded-full brand-gradient grid place-items-center text-white font-bold text-sm shadow-md">
                  {c.n[0]}
                </div>
                <div>
                  <div className="text-sm font-bold text-navy">{c.n}</div>
                  <div className="text-xs text-muted-foreground">
                    {c.s} · {c.m}
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-5 border-t border-border/40">
                <span className="text-[11px] font-semibold text-primary tracking-wide">{c.k}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-primary/[0.04] blur-[120px] rounded-full pointer-events-none -z-10" />
    </section>
  );
}


function Home() {
  return (
    <>
      <Hero />
      <PoweredByRayTrust />
      <TrustMetrics />
      <MarketplaceStrip />
      <WhyWalmart />
      <MoneyFlow />
      <ProfitBreakdown />
      <PricingSection />
      <VerifiedNetwork />
      <CompanyBackingSection />
      <FreeSampleSection />
      <Stories />
      
      <FinalCTA />
    </>
  );
}
