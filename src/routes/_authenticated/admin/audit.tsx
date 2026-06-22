import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { listAuditLog } from "@/lib/admin.functions";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader, fmtDate } from "./_shared";

export const Route = createFileRoute("/_authenticated/admin/audit")({
  component: AuditAdmin,
});

function AuditAdmin() {
  const fn = useServerFn(listAuditLog);
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "audit_log"],
    queryFn: () => fn(),
  });

  return (
    <div>
      <PageHeader title="Audit Log" subtitle="Admin actions across the system." />
      <Card className="overflow-hidden">
        {isLoading ? (
          <Skeleton className="h-40" />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-muted/40 text-left">
                <tr>
                  <Th>When</Th><Th>Admin</Th><Th>Action</Th><Th>Target</Th><Th>Details</Th>
                </tr>
              </thead>
              <tbody>
                {(data ?? []).map((l: any) => (
                  <tr key={l.id} className="border-t border-border">
                    <Td className="text-xs text-muted-foreground whitespace-nowrap">{fmtDate(l.created_at)}</Td>
                    <Td className="text-xs">{l.admin_email ?? l.admin_user_id ?? "—"}</Td>
                    <Td className="font-semibold text-xs">{l.action}</Td>
                    <Td className="text-xs">{l.target_table ? `${l.target_table}/${l.target_id ?? ""}` : "—"}</Td>
                    <Td className="text-xs"><pre className="whitespace-pre-wrap">{l.details ? JSON.stringify(l.details) : ""}</pre></Td>
                  </tr>
                ))}
                {(data?.length ?? 0) === 0 && (
                  <tr><td colSpan={5} className="py-8 text-center text-muted-foreground">No actions yet.</td></tr>
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