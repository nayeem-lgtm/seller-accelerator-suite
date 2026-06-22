import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { listContracts } from "@/lib/admin.functions";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PageHeader, StatusEditor, fmtDate } from "./_shared";

export const Route = createFileRoute("/_authenticated/admin/contracts")({
  component: ContractsAdmin,
});

function ContractsAdmin() {
  const fn = useServerFn(listContracts);
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "contracts"],
    queryFn: () => fn({ data: { limit: 200 } }),
  });
  const [open, setOpen] = useState<any | null>(null);

  return (
    <div>
      <PageHeader title="Contracts" subtitle="Signed service agreements." />
      <Card className="overflow-hidden">
        {isLoading ? (
          <Skeleton className="h-40" />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-muted/40 text-left">
                <tr>
                  <Th>Client</Th><Th>Platforms</Th><Th>Type</Th><Th>Total</Th><Th>Signed</Th><Th>Status</Th><Th></Th>
                </tr>
              </thead>
              <tbody>
                {(data ?? []).map((c: any) => (
                  <tr key={c.id} className="border-t border-border">
                    <Td>
                      <div className="font-semibold">{c.client_name}</div>
                      <div className="text-xs text-muted-foreground">{c.client_email ?? "—"}</div>
                    </Td>
                    <Td className="text-xs">{(c.platforms ?? []).join(", ")}</Td>
                    <Td className="text-xs capitalize">{c.branch}</Td>
                    <Td className="font-bold tabular-nums">${Number(c.total_amount).toFixed(2)}</Td>
                    <Td className="text-xs text-muted-foreground">{fmtDate(c.signed_at ?? c.created_at)}</Td>
                    <Td>
                      <StatusEditor id={c.id} table="contracts" current={c.status} queryKey="contracts" />
                    </Td>
                    <Td>
                      <Button size="sm" variant="outline" onClick={() => setOpen(c)}>View</Button>
                    </Td>
                  </tr>
                ))}
                {(data?.length ?? 0) === 0 && (
                  <tr><td colSpan={7} className="py-8 text-center text-muted-foreground">No contracts yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Dialog open={!!open} onOpenChange={(v) => !v && setOpen(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Contract · {open?.client_name}</DialogTitle></DialogHeader>
          {open && (
            <div className="space-y-4 text-sm">
              <Row label="Email" value={open.client_email ?? "—"} />
              <Row label="Platforms" value={(open.platforms ?? []).join(", ")} />
              <Row label="Total" value={`$${Number(open.total_amount).toFixed(2)}`} />
              <Row label="Type" value={open.branch} />
              <Row label="Terms agreed" value={open.agreed_terms ? "Yes" : "No"} />
              <Row label="Authorization agreed" value={open.agreed_authorization ? "Yes" : "No"} />
              <Row label="Signed at" value={fmtDate(open.signed_at ?? open.created_at)} />
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Signature</div>
                {open.signature_data_url?.startsWith("data:image") ? (
                  <img src={open.signature_data_url} alt="signature" className="rounded-lg border border-border bg-white max-h-40" />
                ) : (
                  <div className="text-xs text-muted-foreground italic">No signature image</div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Th({ children }: { children?: React.ReactNode }) {
  return <th className="px-3 py-2.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{children}</th>;
}
function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-3 py-2.5 align-top ${className}`}>{children}</td>;
}
function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      <span className="font-semibold text-right break-all">{value}</span>
    </div>
  );
}