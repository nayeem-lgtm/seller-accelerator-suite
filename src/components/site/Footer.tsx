import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Linkedin, Twitter, Youtube, Phone, Mail, MapPin } from "lucide-react";
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
    <footer className="mt-20 border-t border-border bg-gradient-to-b from-white to-[oklch(0.97_0.01_250)]">
      <div className="mx-auto max-w-7xl px-4 lg:px-8 py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <img src={logoAsset.url} alt="Ray Ecommerce" className="h-8 md:h-9 w-auto object-contain" />
            <p className="mt-4 text-sm text-muted-foreground max-w-md">
              Ray Ecommerce, a division of Ray Advertising, is an independent marketplace
              operations service provider — helping entrepreneurs launch and scale their Walmart
              Marketplace, TikTok Shop, and eBay stores.
            </p>
            <div className="mt-5 space-y-2 text-sm text-foreground/80">
              <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /> +1 (888) 870-9196</p>
              <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /> ecommerce@rayadvertising.com</p>
              <p className="flex items-start gap-2"><MapPin className="h-4 w-4 text-primary mt-0.5" /> 1267 Willis ST STE 200, Redding, CA 96001, USA</p>
            </div>
            <div className="mt-5 flex gap-3">
              {[Facebook, Instagram, Twitter, Linkedin, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social link"
                  className="grid place-items-center h-9 w-9 rounded-full border border-border bg-white hover:brand-gradient hover:text-white transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-4 text-foreground">Marketplaces</h4>
            <ul className="space-y-2 text-sm">
              {PLATFORM_LINKS.map((l) => (
                <li key={l.to}>
                  <Link to={l.to as never} className="text-muted-foreground hover:text-primary">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-4 text-foreground">Company</h4>
            <ul className="space-y-2 text-sm">
              {COMPANY_LINKS.map((l) => (
                <li key={l.to}>
                  <Link to={l.to as never} className="text-muted-foreground hover:text-primary">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border space-y-5">
          <div>
            <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground mb-3">Marketplaces We Support</div>
            <div className="flex flex-wrap items-center gap-3">
              {(["walmart", "tiktok", "ebay"] as const).map((p) => (
                <div key={p} className="inline-flex items-center justify-center rounded-xl bg-white border border-border px-4 py-2 shadow-sm transition hover:shadow-md hover:-translate-y-0.5">
                  <PlatformLogo platform={p} className="h-6 w-auto" />
                </div>
              ))}
            </div>
          </div>
          <div className="text-xs text-muted-foreground space-y-3">
            <p className="rounded-xl border border-[#0071DC]/15 bg-[#0071DC]/5 px-3 py-2 text-[#0071DC]">
              Ray Ecommerce is a Walmart Marketplace approved Solution Provider. Marketplace approval, sales, profit, or performance results are not guaranteed.
            </p>
            <p>
              All trademarks and logos belong to their respective owners. Ray Ecommerce provides marketplace
              support services and is not owned by or affiliated with these platforms unless explicitly stated.
            </p>
            <p>
              Ray Ecommerce is an independent marketplace operations service provider. References to Walmart,
              TikTok Shop, and eBay are for service identification only and do not imply endorsement, sponsorship,
              partnership, guaranteed approval, guaranteed sales, or guaranteed results.
            </p>
            <p>© {new Date().getFullYear()} Ray Ecommerce — A Ray Advertising company. All rights reserved.</p>
          </div>
        </div>

      </div>
    </footer>
  );
}
