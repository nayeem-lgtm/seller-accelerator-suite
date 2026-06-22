import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { adminOverview } from "@/lib/admin.functions";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

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
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
            <p className="text-sm text-muted-foreground">Live snapshot of submissions and revenue.</p>
          </div>
          {(data as any).meLevel && (
            <Badge variant="secondary" className="capitalize">
              Signed in as {(data as any).meLevel}
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total users" value={(data.counts as any).users ?? 0} />
        <StatCard label="New (30d)" value={(data.counts as any).newSignups ?? 0} />
        <StatCard label="Leads" value={data.counts.plans} />
        <StatCard label="Contracts" value={data.counts.contracts} />
        <StatCard label="Revenue MTD" value={`$${((data as any).mtdRevenue ?? 0).toFixed(2)}`} sub="Paid, this month" />
        <StatCard label="Revenue (all-time)" value={`$${data.totalRevenue.toFixed(2)}`} />
        <StatCard label="Pending revenue" value={`$${data.pendingRevenue.toFixed(2)}`} />
        <StatCard
          label="Inquiries"
          value={data.counts.contacts}
          sub={`${(data.counts as any).newInquiries ?? 0} new`}
        />
        <StatCard label="Ray AI leads" value={data.counts.leads} />
      </div>

      {(data as any).paymentStatusCounts && (
        <Card className="p-5">
          <div className="text-base font-bold mb-3">Orders by payment status</div>
          <div className="flex flex-wrap gap-2">
            {Object.entries((data as any).paymentStatusCounts as Record<string, number>).map(([k, v]) => (
              <span key={k} className="px-3 py-1.5 rounded-full bg-muted text-xs font-semibold capitalize">
                {k}: <strong className="ml-1">{String(v)}</strong>
              </span>
            ))}
            {Object.keys((data as any).paymentStatusCounts).length === 0 && (
              <span className="text-xs text-muted-foreground">No payments yet.</span>
            )}
          </div>
        </Card>
      )}

      {(data as any).statusCounts && (
        <Card className="p-5">
          <div className="text-base font-bold mb-3">Customer pipeline</div>
          <div className="flex flex-wrap gap-2">
            {Object.entries((data as any).statusCounts as Record<string, number>).map(([k, v]) => (
              <span key={k} className="px-3 py-1.5 rounded-full bg-muted text-xs font-semibold capitalize">
                {k.replace("_", " ")}: <strong className="ml-1">{String(v)}</strong>
              </span>
            ))}
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div className="text-base font-bold">Recent signups</div>
            <Link to="/admin/customers" className="text-xs font-semibold text-primary hover:underline">View all</Link>
          </div>
          <div className="mt-3 divide-y divide-border">
            {((data as any).recentSignups ?? []).length === 0 && (
              <div className="py-6 text-sm text-muted-foreground">No signups yet.</div>
            )}
            {((data as any).recentSignups ?? []).map((u: any) => (
              <div key={u.id} className="py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-semibold truncate">{u.full_name ?? u.email}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {u.email}{u.company_name ? ` · ${u.company_name}` : ""}
                  </div>
                </div>
                <div className="text-[11px] text-muted-foreground shrink-0">
                  {new Date(u.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div className="text-base font-bold">Recent inquiries</div>
            <Link to="/admin/contacts" className="text-xs font-semibold text-primary hover:underline">View all</Link>
          </div>
          <div className="mt-3 divide-y divide-border">
            {((data as any).recentInquiries ?? []).length === 0 && (
              <div className="py-6 text-sm text-muted-foreground">No inquiries yet.</div>
            )}
            {((data as any).recentInquiries ?? []).map((q: any) => (
              <div key={q.id} className="py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-semibold truncate">{q.full_name}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {q.email}
                    {q.selected_service ? ` · ${q.selected_service}` : ""}
                    {q.query_type ? ` · ${q.query_type}` : ""}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <Badge variant={q.status === "new" ? "default" : "secondary"} className="capitalize text-[10px]">
                    {(q.status ?? "new").replace("_", " ")}
                  </Badge>
                  <div className="text-[11px] text-muted-foreground mt-1">
                    {new Date(q.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
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