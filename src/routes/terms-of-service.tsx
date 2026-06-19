import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms-of-service")({
  head: () => ({
    meta: [
      { title: "Terms of Service | Ray Ecommerce" },
      { name: "description", content: "Terms of service for Ray Ecommerce — use of website, service information, no-guarantee disclaimer, and client responsibilities." },
      { property: "og:title", content: "Terms of Service | Ray Ecommerce" },
      { property: "og:description", content: "Ray Ecommerce terms of service." },
    ],
  }),
  component: () => <Legal />,
});

const SECTIONS = [
  { h: "Use Of Website", p: "By accessing rayecommerce.com you agree to use the website lawfully and for legitimate informational and commercial purposes." },
  { h: "Service Information", p: "Information on the website describes Ray Ecommerce marketplace operations services. Specific terms apply to engagements based on signed proposals or service agreements." },
  { h: "No Guarantee", p: "Ray Ecommerce does not guarantee marketplace approval, sales, revenue, income, profit, rankings, or any specific business outcome. All examples on the website are for illustration only." },
  { h: "Marketplace Approval", p: "Marketplace approval is determined by each marketplace's own policies, processes, and review standards. Ray Ecommerce does not control or guarantee marketplace approval decisions." },
  { h: "Sales, Revenue, Profit", p: "Marketplace sales, revenue, and profit depend on numerous factors including product selection, supplier pricing, account health, customer demand, competition, marketplace rules, and operational execution. Results vary." },
  { h: "Client Responsibility", p: "Clients are responsible for their marketplace accounts, business compliance, applicable taxes, and adherence to marketplace and platform policies." },
  { h: "Marketplace Rules", p: "Clients agree to follow all rules of the marketplaces they operate on. Ray Ecommerce supports operations but does not assume legal responsibility for client account compliance." },
  { h: "Independent Service Provider", p: "Ray Ecommerce, a division of Ray Advertising, is an independent marketplace operations service provider — helping entrepreneurs launch and scale their Walmart Marketplace, TikTok Shop, and eBay stores. Marketplace names and trademarks belong to their respective owners. References to Walmart Marketplace, TikTok Shop, and eBay are for service identification only and do not imply endorsement, sponsorship, partnership, guaranteed approval, guaranteed sales, or guaranteed results." },
  { h: "Limitation Of Liability", p: "To the maximum extent permitted by law, Ray Ecommerce is not liable for indirect, incidental, special, consequential, or punitive damages arising from use of the website or services." },
  { h: "Contact", p: "Ray Ecommerce · 1267 Willis ST STE 200, Redding, CA 96001, USA · +1 (888) 870-9196 · ecommerce@rayadvertising.com" },
];

function Legal() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-3xl px-4">
        <div className="text-xs font-bold tracking-[0.2em] uppercase text-primary">Legal</div>
        <h1 className="mt-2 text-3xl md:text-5xl font-bold tracking-tight">Terms of Service</h1>
        <p className="mt-3 text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
        <div className="mt-10 space-y-8">
          {SECTIONS.map((s) => (
            <div key={s.h}>
              <h2 className="text-xl font-bold">{s.h}</h2>
              <p className="mt-2 text-foreground/80 leading-relaxed">{s.p}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
