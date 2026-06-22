import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { listCustomers, exportCustomersCsv } from "@/lib/admin.functions";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader, StatusBadge, STATUSES, fmtDate } from "@/lib/admin-ui";
import { Download, Search, ChevronRight } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/customers")({
  component: CustomersAdmin,
});

function CustomersAdmin() {
  const listFn = useServerFn(listCustomers);
  const exportFn = useServerFn(exportCustomersCsv);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [platform, setPlatform] = useState<string>("all");
  const [exporting, setExporting] = useState(false);

  const filters = {
    search: search.trim() || undefined,
    status: status === "all" ? null : (status as any),
    platform: platform === "all" ? null : platform,
    limit: 200,
  };

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "customers", filters],
    queryFn: () => listFn({ data: filters }),
  });

  async function onExport() {
    setExporting(true);
    try {
      const res = await exportFn({ data: filters });
      const blob = new Blob([res.csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `customers-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(`Exported ${res.count} customers`);
    } catch {
      toast.error("Export failed");
    } finally {
      setExporting(false);
    }
  }

  return (
    <div>
      <PageHeader title="Customers" subtitle="All seller submissions with search, filter, and export." />

      <Card className="p-4 mb-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search name, email, phone…"
            className="pl-9 h-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="h-10 w-[160px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {STATUSES.map((s) => (
              <SelectItem key={s} value={s} className="capitalize">{s.replace("_", " ")}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={platform} onValueChange={setPlatform}>
          <SelectTrigger className="h-10 w-[160px]"><SelectValue placeholder="Platform" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All platforms</SelectItem>
            <SelectItem value="walmart">Walmart</SelectItem>
            <SelectItem value="tiktok">TikTok</SelectItem>
            <SelectItem value="ebay">eBay</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={onExport} variant="outline" disabled={exporting} className="h-10">
          <Download className="h-4 w-4 mr-2" /> {exporting ? "Exporting…" : "Export CSV"}
        </Button>
      </Card>

      <Card className="overflow-hidden">
        {isLoading ? (
          <Skeleton className="h-40" />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-muted/40 text-left">
                <tr>
                  <Th>Customer</Th><Th>Platform</Th><Th>Plan</Th><Th>Pay?</Th><Th>Status</Th><Th>Signed up</Th><Th></Th>
                </tr>
              </thead>
              <tbody>
                {(data ?? []).map((r: any) => (
                  <tr key={r.id} className="border-t border-border hover:bg-muted/30">
                    <Td>
                      <div className="font-semibold">{r.full_name}</div>
                      <div className="text-xs text-muted-foreground">{r.email} · {r.phone_country_code} {r.phone_number}</div>
                    </Td>
                    <Td className="capitalize">{r.platform_selected}</Td>
                    <Td className="text-xs">{r.plan_selected}</Td>
                    <Td className="text-xs uppercase font-bold">{r.payment_choice}</Td>
                    <Td><StatusBadge status={r.status} /></Td>
                    <Td className="text-xs text-muted-foreground">{fmtDate(r.created_at)}</Td>
                    <Td>
                      <Link to="/admin/customers/$id" params={{ id: r.id }} className="text-primary text-sm font-semibold inline-flex items-center hover:underline">
                        Open <ChevronRight className="h-4 w-4" />
                      </Link>
                    </Td>
                  </tr>
                ))}
                {(data?.length ?? 0) === 0 && (
                  <tr><td colSpan={7} className="py-12 text-center text-muted-foreground">No matching customers.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-3 py-2.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{children}</th>;
}
function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-3 py-2.5 align-top ${className}`}>{children}</td>;
}
