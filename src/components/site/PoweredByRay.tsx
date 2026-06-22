import { Award, Briefcase, Globe2, Headphones, LineChart, ShieldCheck, Sparkles, Users } from "lucide-react";
import { Section } from "@/components/site/Section";
import rayLogo from "@/assets/ray-advertising-logo.png.asset.json";

/**
 * Small inline "Powered by Ray Advertising" badge.
 * Used in the header bar and footer.
 */
export function PoweredByRayBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-white/80 backdrop-blur px-2.5 py-1 text-[11px] font-semibold text-primary shadow-sm ${className}`}
    >
      <Sparkles className="h-3 w-3" />
      Powered by <span className="font-bold tracking-tight">Ray Advertising</span>
    </span>
  );
}

/**
 * Thin top announcement bar — sits above the SiteHeader.
 */
export function PoweredByRayBar() {
  return (
    <div className="w-full border-b border-primary/10 bg-gradient-to-r from-primary/[0.06] via-white to-primary/[0.06]">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-1.5 text-[11px] font-medium text-foreground/70 lg:px-8">
        <Sparkles className="h-3 w-3 text-primary" />
        <span>
          A division of <span className="font-bold text-primary">Ray Advertising</span> — global performance marketing &amp; business growth.
        </span>
      </div>
    </div>
  );
}

/**
 * Premium trust section — placed under the homepage hero.
 */
export function PoweredByRayTrust() {
  const pillars = [
    { Icon: Award, t: "Years of Industry Experience", d: "Backed by a marketing team with a long track record across digital growth and operations." },
    { Icon: Globe2, t: "Global Business Presence", d: "Ray Advertising supports brands across multiple markets and verticals worldwide." },
    { Icon: Headphones, t: "Professional Support", d: "Real people, structured processes, and dependable communication on every account." },
    { Icon: Users, t: "Dedicated Team Manager", d: "A specialized team handles strategy, operations, and ongoing client support." },
  ];
  return (
    <section className="relative bg-white py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-primary/15 bg-white p-8 md:p-12 shadow-[0_20px_60px_-30px_rgba(37,99,235,0.35)]">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
          <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-brand-glow/10 blur-3xl" />

          <div className="relative grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.06] px-3 py-1.5 text-[11px] font-bold tracking-[0.18em] uppercase text-primary">
                <ShieldCheck className="h-3.5 w-3.5" />
                Trusted By Businesses Through Ray Advertising
              </div>
              <h2 className="mt-4 text-3xl md:text-4xl lg:text-[2.6rem] font-bold tracking-tight leading-[1.1]">
                Powered By The Experience Of{" "}
                <span className="bg-clip-text text-transparent brand-gradient">Ray Advertising</span>
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed max-w-xl">
                This service is backed by the team behind Ray Advertising, a global performance marketing
                and business growth company focused on helping businesses grow through strategy, technology,
                and digital solutions.
              </p>

              <div className="mt-6 inline-flex items-center gap-3 rounded-2xl border border-border bg-gradient-to-br from-white to-primary/[0.04] px-4 py-3 shadow-sm">
                <div className="h-10 w-10 rounded-xl bg-white border border-border grid place-items-center shadow-sm overflow-hidden p-1">
                  <img src={rayLogo.url} alt="Ray Advertising logo" className="h-full w-full object-contain" />
                </div>
                <div className="leading-tight">
                  <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground">Parent Company</div>
                  <div className="text-sm font-bold text-foreground">Ray Advertising</div>
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {pillars.map(({ Icon, t, d }) => (
                <div
                  key={t}
                  className="group rounded-2xl border border-border bg-white p-5 shadow-[0_4px_18px_-10px_rgba(37,99,235,0.18)] hover:-translate-y-1 hover:shadow-[0_12px_32px_-14px_rgba(37,99,235,0.3)] hover:border-primary/30 transition-all"
                >
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary grid place-items-center group-hover:brand-gradient group-hover:text-white transition-colors">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-3 text-sm font-bold text-foreground">{t}</h3>
                  <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Optional premium "Company Backing" section.
 */
export function CompanyBackingSection() {
  const cards = [
    { Icon: Briefcase, t: "Business Strategy", d: "Strategic guidance shaped by years of business growth experience across industries." },
    { Icon: LineChart, t: "Marketing Experience", d: "Performance marketing know-how applied to positioning, messaging, and customer acquisition." },
    { Icon: Headphones, t: "Professional Support", d: "Dependable communication and a structured support process for every client." },
    { Icon: Sparkles, t: "Growth Solutions", d: "Operational systems and digital solutions designed to support sustainable growth." },
  ];
  return (
    <Section
      eyebrow="Company Backing"
      title="Built Independently. Supported By Ray Advertising."
      subtitle="This business operates with its own identity while benefiting from the experience, systems, and professional support of Ray Advertising."
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map(({ Icon, t, d }) => (
          <div
            key={t}
            className="group rounded-3xl border border-border bg-white p-6 shadow-[0_6px_24px_-14px_rgba(37,99,235,0.18)] hover:-translate-y-1 hover:shadow-[0_16px_40px_-18px_rgba(37,99,235,0.3)] hover:border-primary/30 transition-all"
          >
            <div className="h-11 w-11 rounded-2xl brand-gradient grid place-items-center text-white shadow-md">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-bold text-foreground">{t}</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{d}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

/**
 * About-page subsection: "Backed By Ray Advertising".
 */
export function BackedByRaySection() {
  const points = [
    { Icon: Globe2, t: "Established Global Company" },
    { Icon: LineChart, t: "Performance-Driven Approach" },
    { Icon: Briefcase, t: "Business Growth Expertise" },
    { Icon: Headphones, t: "Professional Support Team" },
  ];
  return (
    <Section>
      <div className="grid lg:grid-cols-2 gap-10 items-stretch">
        <div className="rounded-3xl border border-primary/15 bg-gradient-to-br from-white to-primary/[0.04] p-8 md:p-10 shadow-[0_12px_40px_-20px_rgba(37,99,235,0.25)]">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white px-3 py-1.5 text-[11px] font-bold tracking-[0.18em] uppercase text-primary">
            <ShieldCheck className="h-3.5 w-3.5" /> Backed By Ray Advertising
          </div>
          <h2 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight leading-[1.1]">
            The strategic foundation behind this business
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Ray Advertising provides the strategic foundation behind this business. From digital growth and
            performance marketing to operational support and customer experience, the team behind Ray Advertising
            helps deliver a professional experience to every client.
          </p>

          <div className="mt-6 inline-flex items-center gap-3 rounded-2xl border border-border bg-white px-4 py-3 shadow-sm">
            <div className="h-10 w-10 rounded-xl bg-white border border-border grid place-items-center shadow-sm overflow-hidden p-1">
              <img src={rayLogo.url} alt="Ray Advertising logo" className="h-full w-full object-contain" />
            </div>
            <div className="leading-tight">
              <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground">Parent Company</div>
              <div className="text-sm font-bold text-foreground">Ray Advertising</div>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {points.map(({ Icon, t }) => (
            <div
              key={t}
              className="rounded-2xl border border-border bg-white p-5 shadow-[0_4px_18px_-10px_rgba(37,99,235,0.18)] hover:-translate-y-1 hover:shadow-[0_12px_32px_-14px_rgba(37,99,235,0.3)] hover:border-primary/30 transition-all flex flex-col"
            >
              <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary grid place-items-center">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-3 text-sm font-bold text-foreground">{t}</h3>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}