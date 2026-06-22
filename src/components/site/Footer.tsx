import { Link } from "@tanstack/react-router";
import {
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  Phone,
  Mail,
  MapPin,
  ArrowUpRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import logoAsset from "@/assets/ray-logo.asset.json";
import { PlatformLogo } from "@/components/site/PlatformLogo";

const COMPANY_LINKS: { to: string; label: string }[] = [
  { to: "/services", label: "Services" },
  { to: "/pricing", label: "Plans" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact Us" },
  { to: "/seller-onboarding", label: "Seller Onboarding" },
  { to: "/privacy-policy", label: "Privacy Policy" },
  { to: "/terms-of-service", label: "Terms of Service" },
];

const PLATFORM_LINKS: { to: string; label: string }[] = [
  { to: "/walmart", label: "Walmart Marketplace" },
  { to: "/tiktok-shop", label: "TikTok Shop" },
  { to: "/ebay", label: "eBay" },
];

export function SiteFooter() {
  return (
    <footer className="relative mt-24 overflow-hidden bg-[oklch(0.16_0.04_260)] text-white/80">
      {/* Decorative background layers */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "linear-gradient(to right, color-mix(in oklab, var(--brand-glow) 22%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklab, var(--brand-glow) 22%, transparent) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(ellipse at top, black 30%, transparent 75%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full blur-3xl opacity-40"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in oklab, var(--brand-glow) 55%, transparent), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -right-20 h-[420px] w-[420px] rounded-full blur-3xl opacity-30"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in oklab, var(--brand) 60%, transparent), transparent 70%)",
        }}
      />
      {/* Top brand hairline */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, color-mix(in oklab, var(--brand-glow) 70%, transparent), transparent)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 lg:px-8 pt-20 pb-10">
        {/* CTA banner */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-7 md:p-10 mb-16">
          <div
            aria-hidden
            className="absolute inset-0 -z-10 opacity-90"
            style={{
              background:
                "linear-gradient(135deg, color-mix(in oklab, var(--brand) 18%, transparent), transparent 55%, color-mix(in oklab, var(--brand-glow) 14%, transparent))",
            }}
          />
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-bold tracking-[0.22em] uppercase text-white/80">
                <Sparkles className="h-3 w-3" /> Marketplace Operations, Refined
              </div>
              <h3 className="mt-3 text-2xl md:text-3xl font-semibold tracking-tight text-white max-w-xl leading-tight">
                Ready to launch and scale on{" "}
                <span className="bg-clip-text text-transparent brand-gradient">
                  Walmart, TikTok Shop & eBay
                </span>
                ?
              </h3>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/seller-onboarding"
                className="group inline-flex items-center gap-2 rounded-full brand-gradient px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_-10px_color-mix(in_oklab,var(--brand)_70%,transparent)] transition hover:-translate-y-0.5"
              >
                Start Onboarding
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10 transition"
              >
                Talk to a Specialist
              </Link>
            </div>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="inline-flex items-center rounded-xl bg-white/95 px-3 py-2 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.5)]">
              <img
                src={logoAsset.url}
                alt="Ray Ecommerce"
                className="h-8 md:h-9 w-auto object-contain"
              />
            </div>
            <p className="mt-6 text-sm text-white/65 leading-relaxed max-w-md">
              Ray Ecommerce, a division of Ray Advertising, is an independent
              marketplace operations service provider — helping entrepreneurs
              launch and scale their Walmart Marketplace, TikTok Shop, and eBay
              stores.
            </p>

            <div className="mt-7 space-y-3 text-sm">
              <a
                href="tel:+18888709196"
                className="group flex items-center gap-3 text-white/80 hover:text-white transition"
              >
                <span className="grid place-items-center h-9 w-9 rounded-xl border border-white/10 bg-white/[0.04] text-white/90 group-hover:border-white/20 group-hover:bg-white/[0.08] transition">
                  <Phone className="h-4 w-4" />
                </span>
                +1 (888) 870-9196
              </a>
              <a
                href="mailto:ecommerce@rayadvertising.com"
                className="group flex items-center gap-3 text-white/80 hover:text-white transition"
              >
                <span className="grid place-items-center h-9 w-9 rounded-xl border border-white/10 bg-white/[0.04] text-white/90 group-hover:border-white/20 group-hover:bg-white/[0.08] transition">
                  <Mail className="h-4 w-4" />
                </span>
                ecommerce@rayadvertising.com
              </a>
              <p className="flex items-start gap-3 text-white/80">
                <span className="grid place-items-center h-9 w-9 rounded-xl border border-white/10 bg-white/[0.04] text-white/90 shrink-0">
                  <MapPin className="h-4 w-4" />
                </span>
                <span className="pt-1.5 leading-relaxed">
                  1267 Willis ST STE 200, Redding, CA 96001, USA
                </span>
              </p>
            </div>

            <div className="mt-7 flex gap-2.5">
              {[
                { Icon: Facebook, label: "Facebook" },
                { Icon: Instagram, label: "Instagram" },
                { Icon: Twitter, label: "Twitter" },
                { Icon: Linkedin, label: "LinkedIn" },
                { Icon: Youtube, label: "YouTube" },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="grid place-items-center h-10 w-10 rounded-full border border-white/10 bg-white/[0.04] text-white/80 hover:text-white hover:border-white/20 hover:bg-white/[0.1] transition"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3">
            <h4 className="text-[11px] font-bold tracking-[0.22em] uppercase text-white/50 mb-5">
              Marketplaces
            </h4>
            <ul className="space-y-3 text-sm">
              {PLATFORM_LINKS.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to as never}
                    className="group inline-flex items-center gap-2 text-white/75 hover:text-white transition"
                  >
                    <span className="h-px w-4 bg-white/20 group-hover:w-8 group-hover:bg-[color:var(--brand-glow)] transition-all" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4">
            <h4 className="text-[11px] font-bold tracking-[0.22em] uppercase text-white/50 mb-5">
              Company
            </h4>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              {COMPANY_LINKS.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to as never}
                    className="text-white/75 hover:text-white transition"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Marketplaces + disclaimers */}
        <div className="mt-16 pt-10 border-t border-white/10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="text-[10px] font-bold tracking-[0.24em] uppercase text-white/45 mb-4">
                Marketplaces We Support
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {(["walmart", "tiktok", "ebay"] as const).map((p) => (
                  <div
                    key={p}
                    className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/95 px-4 py-2.5 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.6)] transition hover:-translate-y-0.5 hover:bg-white"
                  >
                    <PlatformLogo platform={p} className="h-6 w-auto" />
                  </div>
                ))}
              </div>
            </div>
            <div className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-xs text-white/75 max-w-md">
              <ShieldCheck className="h-5 w-5 shrink-0 text-[color:var(--brand-glow)]" />
              <span className="leading-relaxed">
                Walmart Marketplace approved Solution Provider. Approval, sales,
                profit, or performance results are not guaranteed.
              </span>
            </div>
          </div>

          <div className="mt-10 text-[11.5px] text-white/45 space-y-3 leading-relaxed max-w-5xl">
            <p>
              All trademarks and logos belong to their respective owners. Ray
              Ecommerce provides marketplace support services and is not owned
              by or affiliated with these platforms unless explicitly stated.
            </p>
            <p>
              Ray Ecommerce is an independent marketplace operations service
              provider. References to Walmart, TikTok Shop, and eBay are for
              service identification only and do not imply endorsement,
              sponsorship, partnership, guaranteed approval, guaranteed sales,
              or guaranteed results.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs text-white/55">
            <p>
              © {new Date().getFullYear()} Ray Ecommerce — A Ray Advertising
              company. All rights reserved.
            </p>
            <div className="flex items-center gap-5">
              <Link to="/privacy-policy" className="hover:text-white transition">
                Privacy
              </Link>
              <Link to="/terms-of-service" className="hover:text-white transition">
                Terms
              </Link>
              <Link to="/contact" className="hover:text-white transition">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
