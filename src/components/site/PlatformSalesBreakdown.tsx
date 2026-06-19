import { Section, Disclaimer } from "@/components/site/Section";
import { TrendingUp, Percent, Users } from "lucide-react";

export type BreakdownLine = { label: string; value: string; deduction?: boolean };

export type CategoryExample = {
  title: string;
  description: string;
  monthlyOrders: number;
  grossRevenue: string;
  platformFee: string;
  shipping: string;
  productCost: string;
  warehouse: string;
  netProfit: string;
  rayShare: string;
  clientShare: string;
};

export type PlatformBreakdownData = {
  platform: string;
  sectionTitle: string;
  lines: BreakdownLine[];
  netProfit: string;
  margin: string;
  roi: string;
  rayShare: string;
  clientShare: string;
  categories: CategoryExample[];
};

function Row({ label, value, deduction, highlight }: { label: string; value: string; deduction?: boolean; highlight?: boolean }) {
  return (
    <div
      className={`flex items-center justify-between py-3.5 border-b border-border/60 last:border-b-0 ${
        highlight ? "rounded-xl bg-primary/5 px-4 -mx-2 my-1 border-b-0" : ""
      }`}
    >
      <span className={`text-sm md:text-base ${highlight ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
        {label}
      </span>
      <span
        className={`text-sm md:text-base font-semibold tabular-nums ${
          highlight ? "text-primary text-lg md:text-xl" : deduction ? "text-foreground/80" : "text-foreground"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function StatPill({ icon: Icon, label, value, accent }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; accent?: boolean }) {
  return (
    <div
      className={`rounded-2xl border p-4 text-center transition hover:-translate-y-0.5 hover:shadow-md ${
        accent ? "border-primary/30 bg-primary/5" : "border-border bg-white"
      }`}
    >
      <div className={`mx-auto h-9 w-9 rounded-xl grid place-items-center mb-2 ${accent ? "bg-primary text-white" : "bg-primary/10 text-primary"}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`mt-1 text-lg font-bold tabular-nums ${accent ? "text-primary" : "text-foreground"}`}>{value}</div>
    </div>
  );
}

function CategoryCard({ platform, cat }: { platform: string; cat: CategoryExample }) {
  const rows: [string, string][] = [
    ["Avg. sale price", "$100"],
    ["Monthly orders", String(cat.monthlyOrders)],
    ["Gross revenue", cat.grossRevenue],
    ["Platform fee", `-${cat.platformFee}`],
    ["Shipping", `-${cat.shipping}`],
    ["Product cost", `-${cat.productCost}`],
    ["Warehouse", cat.warehouse === "$0" ? "$0.00" : `-${cat.warehouse}`],
  ];
  return (
    <div className="group rounded-3xl border border-border bg-white p-6 shadow-sm hover:-translate-y-1 hover:shadow-xl transition flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase text-primary">
          {platform}
        </span>
        <span className="text-xs text-muted-foreground">{cat.monthlyOrders} orders / mo</span>
      </div>
      <h3 className="text-lg font-bold leading-tight">{cat.title}</h3>
      <p className="mt-1.5 text-sm text-muted-foreground">{cat.description}</p>

      <div className="mt-5 space-y-0.5">
        {rows.map(([l, v]) => (
          <div key={l} className="flex justify-between text-sm py-1.5 border-b border-border/50 last:border-0">
            <span className="text-muted-foreground">{l}</span>
            <span className="font-medium tabular-nums">{v}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-xl bg-primary/5 border border-primary/20 px-4 py-3 flex justify-between items-center">
        <span className="text-sm font-semibold">Net profit before split</span>
        <span className="text-lg font-bold text-primary tabular-nums">{cat.netProfit}</span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-border px-3 py-2.5 text-center">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Ray 40%</div>
          <div className="mt-0.5 font-bold tabular-nums">{cat.rayShare}</div>
        </div>
        <div className="rounded-xl bg-primary/10 border border-primary/20 px-3 py-2.5 text-center">
          <div className="text-[10px] uppercase tracking-wider text-primary/80">Client 60%</div>
          <div className="mt-0.5 font-bold text-primary tabular-nums">{cat.clientShare}</div>
        </div>
      </div>
    </div>
  );
}

export function PlatformSalesBreakdown({ data }: { data: PlatformBreakdownData }) {
  return (
    <Section
      eyebrow="Illustrative Sales Model"
      title={data.sectionTitle}
      subtitle="An illustrative $100 product sale model showing estimated costs, net profit, and client share."
    >
      <div className="mx-auto max-w-3xl">
        <div className="rounded-3xl border border-border bg-white shadow-[0_10px_40px_-15px_rgba(0,0,0,0.15)] p-6 md:p-10">
          <div className="text-center mb-6">
            <div className="text-xs uppercase tracking-[0.2em] text-primary font-bold">Per $100 Sale</div>
            <div className="mt-2 text-3xl md:text-4xl font-bold">{data.platform}</div>
          </div>
          <div className="divide-y divide-border/60">
            {data.lines.map((l) => (
              <Row key={l.label} label={l.label} value={l.value} deduction={l.deduction} />
            ))}
            <Row label="Estimated net profit" value={data.netProfit} highlight />
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <StatPill icon={Percent} label="Margin" value={data.margin} />
            <StatPill icon={TrendingUp} label="ROI" value={data.roi} />
            <StatPill icon={Users} label="Client 60%" value={data.clientShare} accent />
          </div>

          <p className="mt-5 text-center text-xs text-muted-foreground">
            Per-sale split — Ray Ecommerce 40% ({data.rayShare}) / Client 60% ({data.clientShare}).
          </p>
        </div>
      </div>

      <div className="mt-14">
        <div className="text-center mb-8">
          <div className="inline-block text-xs font-semibold tracking-[0.18em] uppercase text-primary mb-3">
            Category Examples
          </div>
          <h3 className="text-2xl md:text-3xl font-bold">Category-wise Sales Snapshots</h3>
          <p className="mt-2 text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
            Illustrative monthly snapshots across different {data.platform} seller categories.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {data.categories.map((c) => (
            <CategoryCard key={c.title} platform={data.platform} cat={c} />
          ))}
        </div>
      </div>

      <Disclaimer>
        Disclaimer: These are illustrative examples based on estimated costs and assumed monthly order volume. Actual results depend on product selection, supplier cost, marketplace approval, demand, shipping cost, account health, refund rate, competition, pricing, and execution. Sales, profit, approval, or performance results are not guaranteed.
      </Disclaimer>
    </Section>
  );
}

// ----- Platform-specific data -----

export const walmartBreakdown: PlatformBreakdownData = {
  platform: "Walmart",
  sectionTitle: "Walmart Sales Breakdown",
  lines: [
    { label: "Sale price", value: "$100.00" },
    { label: "Platform fee", value: "-$15.00", deduction: true },
    { label: "Shipping charge", value: "-$6.00", deduction: true },
    { label: "Warehouse fee", value: "-$4.00", deduction: true },
    { label: "Product cost", value: "-$35.00", deduction: true },
    { label: "Hidden charge", value: "$0.00" },
  ],
  netProfit: "$100.00",
  margin: "40%",
  roi: "114%",
  rayShare: "$16.00",
  clientShare: "$24.00",
  categories: [
    {
      title: "Home Essentials Seller",
      description: "Everyday home goods with steady repeat demand.",
      monthlyOrders: 120,
      grossRevenue: "$12,000",
      platformFee: "$1,800",
      shipping: "$720",
      productCost: "$4,200",
      warehouse: "$480",
      netProfit: "$4,800",
      rayShare: "$1,920",
      clientShare: "$2,880",
    },
    {
      title: "Kitchen & Storage Seller",
      description: "High-volume kitchen and storage essentials.",
      monthlyOrders: 160,
      grossRevenue: "$16,000",
      platformFee: "$2,400",
      shipping: "$1,120",
      productCost: "$6,080",
      warehouse: "$640",
      netProfit: "$5,760",
      rayShare: "$2,304",
      clientShare: "$3,456",
    },
    {
      title: "Pet Supplies Seller",
      description: "Recurring pet category with loyal buyers.",
      monthlyOrders: 140,
      grossRevenue: "$14,000",
      platformFee: "$2,100",
      shipping: "$1,120",
      productCost: "$4,480",
      warehouse: "$420",
      netProfit: "$5,880",
      rayShare: "$2,352",
      clientShare: "$3,528",
    },
  ],
};

export const tiktokBreakdown: PlatformBreakdownData = {
  platform: "TikTok Shop",
  sectionTitle: "TikTok Shop Sales Breakdown",
  lines: [
    { label: "Sale price", value: "$100.00" },
    { label: "Platform fee", value: "-$12.00", deduction: true },
    { label: "Shipping charge", value: "-$5.00", deduction: true },
    { label: "Warehouse fee", value: "$0.00" },
    { label: "Product cost", value: "-$32.00", deduction: true },
    { label: "Hidden charge", value: "$0.00" },
  ],
  netProfit: "$51.00",
  margin: "51%",
  roi: "159%",
  rayShare: "$20.40",
  clientShare: "$30.60",
  categories: [
    {
      title: "Beauty Accessories Seller",
      description: "Trend-led beauty tools with viral discovery.",
      monthlyOrders: 180,
      grossRevenue: "$18,000",
      platformFee: "$2,160",
      shipping: "$900",
      productCost: "$5,760",
      warehouse: "$0",
      netProfit: "$9,180",
      rayShare: "$3,672",
      clientShare: "$5,508",
    },
    {
      title: "Fitness Gadgets Seller",
      description: "Compact fitness gadgets fueled by short-form content.",
      monthlyOrders: 150,
      grossRevenue: "$15,000",
      platformFee: "$1,800",
      shipping: "$975",
      productCost: "$5,100",
      warehouse: "$0",
      netProfit: "$7,125",
      rayShare: "$2,850",
      clientShare: "$4,275",
    },
    {
      title: "Viral Kitchen Products Seller",
      description: "Discovery-driven kitchen problem-solvers.",
      monthlyOrders: 220,
      grossRevenue: "$22,000",
      platformFee: "$2,640",
      shipping: "$1,320",
      productCost: "$7,920",
      warehouse: "$0",
      netProfit: "$10,120",
      rayShare: "$4,048",
      clientShare: "$6,072",
    },
  ],
};

export const ebayBreakdown: PlatformBreakdownData = {
  platform: "eBay",
  sectionTitle: "eBay Sales Breakdown",
  lines: [
    { label: "Sale price", value: "$100.00" },
    { label: "Platform fee", value: "-$13.00", deduction: true },
    { label: "Shipping charge", value: "-$7.00", deduction: true },
    { label: "Warehouse fee", value: "$0.00" },
    { label: "Product cost", value: "-$34.00", deduction: true },
    { label: "Hidden charge", value: "$0.00" },
  ],
  netProfit: "$46.00",
  margin: "46%",
  roi: "135%",
  rayShare: "$18.40",
  clientShare: "$27.60",
  categories: [
    {
      title: "Home Office Products Seller",
      description: "Steady demand from remote-work buyers.",
      monthlyOrders: 130,
      grossRevenue: "$13,000",
      platformFee: "$1,690",
      shipping: "$910",
      productCost: "$4,420",
      warehouse: "$0",
      netProfit: "$5,980",
      rayShare: "$2,392",
      clientShare: "$3,588",
    },
    {
      title: "Auto Accessories Seller",
      description: "Practical car upgrades with broad appeal.",
      monthlyOrders: 170,
      grossRevenue: "$17,000",
      platformFee: "$2,210",
      shipping: "$1,360",
      productCost: "$6,630",
      warehouse: "$0",
      netProfit: "$6,800",
      rayShare: "$2,720",
      clientShare: "$4,080",
    },
    {
      title: "Electronics Accessories Seller",
      description: "Cables, chargers, and compact electronics add-ons.",
      monthlyOrders: 160,
      grossRevenue: "$16,000",
      platformFee: "$2,080",
      shipping: "$800",
      productCost: "$5,280",
      warehouse: "$0",
      netProfit: "$7,840",
      rayShare: "$3,136",
      clientShare: "$4,704",
    },
  ],
};
