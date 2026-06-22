import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { adminOverview } from "@/lib/admin.functions";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminHome,
});

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <Card className="p-5">
      <div className="text-[11px] font-bold tracking-[0.18em] uppercase text-muted-foreground">{label}</div>
      <div className="mt-1.5 text-3xl font-bold tabular-nums">{value}</div>
      {sub && <div className="mt-1 text-xs text-muted-foreground">{sub}</div>}
    </Card>
  );
}

function AdminHome() {
  const fn = useServerFn(adminOverview);
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "overview"],
    queryFn: () => fn(),
  });

  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
        <p className="text-sm text-muted-foreground">Live snapshot of submissions and revenue.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Plan selections" value={data.counts.plans} />
        <StatCard label="Business profiles" value={data.counts.business} />
        <StatCard label="Contracts" value={data.counts.contracts} />
        <StatCard label="Payments" value={data.counts.payments} />
        <StatCard label="Contact queries" value={data.counts.contacts} />
        <StatCard label="Ray AI leads" value={data.counts.leads} />
        <StatCard label="Revenue (paid)" value={`$${data.totalRevenue.toFixed(2)}`} />
        <StatCard label="Pending revenue" value={`$${data.pendingRevenue.toFixed(2)}`} />
      </div>

      <Card className="p-5">
        <div className="text-base font-bold">Recent Contracts</div>
        <div className="mt-3 divide-y divide-border">
          {data.recentContracts.length === 0 && (
            <div className="py-6 text-sm text-muted-foreground">No contracts yet.</div>
          )}
          {data.recentContracts.map((c: any) => (
            <div key={c.id} className="py-3 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="font-semibold truncate">{c.client_name}</div>
                <div className="text-xs text-muted-foreground truncate">
                  {c.client_email ?? "—"} · {(c.platforms ?? []).join(", ")}
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-semibold tabular-nums">${Number(c.total_amount).toFixed(2)}</div>
                <div className="text-[11px] text-muted-foreground">
                  {new Date(c.created_at).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}