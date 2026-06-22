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
  netProfit: "$40.00",
  margin: "40%",
  roi: "114%",
  rayShare: "$16.00",
  clientShare: "$24.00",
  categories: [
    {
      title: "Home Essentials Seller",
      description: "Everyday home goods with steady repeat demand.",
      monthlyOrders: 850,
      grossRevenue: "$85,000",
      platformFee: "$12,750",
      shipping: "$5,100",
      productCost: "$29,750",
      warehouse: "$3,400",
      netProfit: "$34,000",
      rayShare: "$13,600",
      clientShare: "$20,400",
    },
    {
      title: "Kitchen & Storage Seller",
      description: "High-volume kitchen and storage essentials.",
      monthlyOrders: 950,
      grossRevenue: "$95,000",
      platformFee: "$14,250",
      shipping: "$5,700",
      productCost: "$33,250",
      warehouse: "$3,800",
      netProfit: "$38,000",
      rayShare: "$15,200",
      clientShare: "$22,800",
    },
    {
      title: "Pet Supplies Seller",
      description: "Recurring pet category with loyal buyers.",
      monthlyOrders: 1200,
      grossRevenue: "$120,000",
      platformFee: "$18,000",
      shipping: "$7,200",
      productCost: "$42,000",
      warehouse: "$4,800",
      netProfit: "$48,000",
      rayShare: "$19,200",
      clientShare: "$28,800",
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
      title: "Beauty & Skincare Seller",
      description: "Trend-led beauty and skincare products with viral discovery.",
      monthlyOrders: 650,
      grossRevenue: "$65,000",
      platformFee: "$7,800",
      shipping: "$3,250",
      productCost: "$20,800",
      warehouse: "$0",
      netProfit: "$33,150",
      rayShare: "$13,260",
      clientShare: "$19,890",
    },
    {
      title: "Home Gadgets Seller",
      description: "Compact home gadgets fueled by short-form content.",
      monthlyOrders: 750,
      grossRevenue: "$75,000",
      platformFee: "$9,000",
      shipping: "$3,750",
      productCost: "$24,000",
      warehouse: "$0",
      netProfit: "$38,250",
      rayShare: "$15,300",
      clientShare: "$22,950",
    },
    {
      title: "Trending Products Seller",
      description: "Discovery-driven viral trending products.",
      monthlyOrders: 850,
      grossRevenue: "$85,000",
      platformFee: "$10,200",
      shipping: "$4,250",
      productCost: "$27,200",
      warehouse: "$0",
      netProfit: "$43,350",
      rayShare: "$17,340",
      clientShare: "$26,010",
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
      title: "Electronics Accessories Seller",
      description: "Cables, chargers, and compact electronics add-ons.",
      monthlyOrders: 250,
      grossRevenue: "$25,000",
      platformFee: "$3,250",
      shipping: "$1,750",
      productCost: "$8,500",
      warehouse: "$0",
      netProfit: "$11,500",
      rayShare: "$4,600",
      clientShare: "$6,900",
    },
    {
      title: "Collectibles Seller",
      description: "Niche collectibles with passionate repeat buyers.",
      monthlyOrders: 300,
      grossRevenue: "$30,000",
      platformFee: "$3,900",
      shipping: "$2,100",
      productCost: "$10,200",
      warehouse: "$0",
      netProfit: "$13,800",
      rayShare: "$5,520",
      clientShare: "$8,280",
    },
    {
      title: "Automotive Parts Seller",
      description: "Practical automotive parts and upgrades with broad appeal.",
      monthlyOrders: 350,
      grossRevenue: "$35,000",
      platformFee: "$4,550",
      shipping: "$2,450",
      productCost: "$11,900",
      warehouse: "$0",
      netProfit: "$16,100",
      rayShare: "$6,440",
      clientShare: "$9,660",
    },
  ],
};
