import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { listPayments, updatePaymentStatus } from "@/lib/admin.functions";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader, fmtDate } from "@/lib/admin-ui";
import { toast } from "sonner";
import { useState } from "react";

const STATUSES = ["pending", "paid", "failed", "refunded"] as const;

const COLOR: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  paid: "bg-emerald-100 text-emerald-800",
  failed: "bg-rose-100 text-rose-800",
  refunded: "bg-slate-200 text-slate-800",
};

export const Route = createFileRoute("/_authenticated/admin/payments")({
  component: PaymentsAdmin,
});

function PaymentsAdmin() {
  const fn = useServerFn(listPayments);
  const upd = useServerFn(updatePaymentStatus);
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "payments"],
    queryFn: () => fn({ data: { limit: 200 } }),
  });
  const [busy, setBusy] = useState<string | null>(null);

  return (
    <div>
      <PageHeader title="Payments" subtitle="Payment records — mark as paid once funds clear." />
      <Card className="overflow-hidden">
        {isLoading ? (
          <Skeleton className="h-40" />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-muted/40 text-left">
                <tr>
                  <Th>Client</Th><Th>Platforms</Th><Th>Amount</Th><Th>Method</Th><Th>Status</Th><Th>Submitted</Th>
                </tr>
              </thead>
              <tbody>
                {(data ?? []).map((p: any) => (
                  <tr key={p.id} className="border-t border-border">
                    <Td>
                      <div className="font-semibold">{p.client_name}</div>
                      <div className="text-xs text-muted-foreground">{p.client_email ?? "—"}</div>
                    </Td>
                    <Td className="text-xs">{(p.platforms ?? []).join(", ")}</Td>
                    <Td className="font-bold tabular-nums">${Number(p.amount).toFixed(2)}</Td>
                    <Td className="capitalize text-xs">{p.payment_method}</Td>
                    <Td>
                      <Select
                        value={p.payment_status}
                        onValueChange={async (v) => {
                          setBusy(p.id);
                          try {
                            await upd({ data: { id: p.id, status: v as any } });
                            toast.success("Payment updated");
                            qc.invalidateQueries({ queryKey: ["admin", "payments"] });
                            qc.invalidateQueries({ queryKey: ["admin", "overview"] });
                          } catch {
                            toast.error("Update failed");
                          } finally {
                            setBusy(null);
                          }
                        }}
                      >
                        <SelectTrigger className={`h-8 w-[130px] text-xs ${COLOR[p.payment_status] ?? ""}`} disabled={busy === p.id}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUSES.map((s) => (
                            <SelectItem key={s} value={s} className="text-xs capitalize">{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Td>
                    <Td className="text-xs text-muted-foreground">{fmtDate(p.created_at)}</Td>
                  </tr>
                ))}
                {(data?.length ?? 0) === 0 && (
                  <tr><td colSpan={6} className="py-8 text-center text-muted-foreground">No payments yet.</td></tr>
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