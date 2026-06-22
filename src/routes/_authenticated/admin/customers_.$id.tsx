import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  getCustomerDetail,
  addNote,
  deleteNote,
  updateLeadStatus,
  deleteRecord,
} from "@/lib/admin.functions";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader, STATUSES, StatusBadge, fmtDate } from "@/lib/admin-ui";
import { ArrowLeft, Trash2, Mail, Phone } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/customers_/$id")({
  component: CustomerDetail,
});

function CustomerDetail() {
  const { id } = Route.useParams();
  const fn = useServerFn(getCustomerDetail);
  const updFn = useServerFn(updateLeadStatus);
  const addFn = useServerFn(addNote);
  const delNoteFn = useServerFn(deleteNote);
  const delRecFn = useServerFn(deleteRecord);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "customer", id],
    queryFn: () => fn({ data: { id } }),
  });

  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  if (isLoading || !data) return <Skeleton className="h-40" />;

  const p = data.plan;
  const bc = data.businessCredentials?.[0];

  async function updateStatus(s: string) {
    setBusy(true);
    try {
      await updFn({ data: { id, table: "plan_selections", status: s as any } });
      toast.success("Status updated");
      qc.invalidateQueries({ queryKey: ["admin", "customer", id] });
      qc.invalidateQueries({ queryKey: ["admin", "customers"] });
    } catch (e: any) {
      toast.error(e.message ?? "Failed");
    } finally { setBusy(false); }
  }

  async function submitNote() {
    if (!note.trim()) return;
    setBusy(true);
    try {
      await addFn({ data: { targetTable: "plan_selections", targetId: id, note: note.trim() } });
      setNote("");
      qc.invalidateQueries({ queryKey: ["admin", "customer", id] });
    } catch { toast.error("Could not save note"); }
    finally { setBusy(false); }
  }

  async function removeNote(noteId: string) {
    await delNoteFn({ data: { id: noteId } });
    qc.invalidateQueries({ queryKey: ["admin", "customer", id] });
  }

  async function archiveCustomer() {
    if (!confirm("Delete this customer record? This cannot be undone.")) return;
    try {
      await delRecFn({ data: { table: "plan_selections", id } });
      toast.success("Customer deleted");
      window.location.href = "/admin/customers";
    } catch (e: any) { toast.error(e.message ?? "Delete failed"); }
  }

  return (
    <div>
      <Link to="/admin/customers" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-3">
        <ArrowLeft className="h-4 w-4" /> Back to customers
      </Link>
      <PageHeader title={p.full_name} subtitle={`${p.email} · ${p.phone_country_code} ${p.phone_number}`} />

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <Card className="p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Status</div>
                <div className="mt-1.5"><StatusBadge status={p.status} /></div>
              </div>
              <Select value={p.status} onValueChange={updateStatus} disabled={busy}>
                <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => (
                    <SelectItem key={s} value={s} className="capitalize">{s.replace("_", " ")}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </Card>

          <Card className="p-5">
            <div className="text-base font-bold mb-3">Plan</div>
            <Grid rows={[
              ["Platform", p.platform_selected],
              ["Plan", p.plan_selected],
              ["Payment choice", p.payment_choice],
              ["Submitted", fmtDate(p.created_at)],
            ]} />
          </Card>

          {bc && (
            <Card className="p-5">
              <div className="text-base font-bold mb-3">Business profile</div>
              <Grid rows={[
                ["Business name", bc.business_name],
                ["Address", `${bc.address_line_1}, ${bc.city}, ${bc.state} ${bc.zip_code}, ${bc.country}`],
                ["Marketplace", bc.marketplace_platform],
                ["Seller account", bc.seller_account_status ?? "—"],
              ]} />
            </Card>
          )}

          {data.contracts.length > 0 && (
            <Card className="p-5">
              <div className="text-base font-bold mb-3">Contracts ({data.contracts.length})</div>
              <ul className="space-y-2 text-sm">
                {data.contracts.map((c: any) => (
                  <li key={c.id} className="flex justify-between border-b border-border pb-2">
                    <span>{(c.platforms ?? []).join(", ")} · {c.branch}</span>
                    <span className="font-bold tabular-nums">${Number(c.total_amount).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {data.payments.length > 0 && (
            <Card className="p-5">
              <div className="text-base font-bold mb-3">Payments ({data.payments.length})</div>
              <ul className="space-y-2 text-sm">
                {data.payments.map((pay: any) => (
                  <li key={pay.id} className="flex justify-between border-b border-border pb-2">
                    <span className="capitalize">{pay.payment_method} · {pay.payment_status}</span>
                    <span className="font-bold tabular-nums">${Number(pay.amount).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          <Card className="p-5">
            <div className="text-base font-bold mb-3">Status history</div>
            {data.history.length === 0 ? (
              <div className="text-sm text-muted-foreground">No status changes yet.</div>
            ) : (
              <ul className="space-y-1 text-sm">
                {data.history.map((h: any) => (
                  <li key={h.id} className="flex justify-between border-b border-border py-1.5">
                    <span><strong>{h.from_status ?? "—"}</strong> → <strong>{h.to_status}</strong> by {h.admin_email ?? "system"}</span>
                    <span className="text-xs text-muted-foreground">{fmtDate(h.created_at)}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <div className="space-y-5">
          <Card className="p-5">
            <div className="text-base font-bold mb-3">Quick actions</div>
            <div className="flex flex-col gap-2">
              <Button asChild variant="outline" size="sm"><a href={`mailto:${p.email}`}><Mail className="h-4 w-4 mr-2"/>Email customer</a></Button>
              <Button asChild variant="outline" size="sm"><a href={`tel:${p.phone_country_code}${p.phone_number}`}><Phone className="h-4 w-4 mr-2"/>Call customer</a></Button>
              <Button variant="destructive" size="sm" onClick={archiveCustomer}><Trash2 className="h-4 w-4 mr-2"/>Delete record</Button>
            </div>
          </Card>

          <Card className="p-5">
            <div className="text-base font-bold mb-3">Internal notes</div>
            <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a private note about this customer…" rows={3} />
            <Button onClick={submitNote} disabled={busy || !note.trim()} className="mt-2 w-full">Add note</Button>
            <ul className="mt-4 space-y-3">
              {data.notes.map((n: any) => (
                <li key={n.id} className="rounded-lg bg-muted/40 p-3 text-sm">
                  <div className="whitespace-pre-wrap">{n.note}</div>
                  <div className="mt-1.5 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>{n.admin_email ?? "admin"} · {fmtDate(n.created_at)}</span>
                    <button onClick={() => removeNote(n.id)} className="hover:text-rose-600">Delete</button>
                  </div>
                </li>
              ))}
              {data.notes.length === 0 && <li className="text-xs text-muted-foreground">No notes yet.</li>}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Grid({ rows }: { rows: Array<[string, any]> }) {
  return (
    <dl className="grid grid-cols-[160px_1fr] gap-y-2 text-sm">
      {rows.map(([k, v]) => (
        <div key={k} className="contents">
          <dt className="text-xs uppercase tracking-wider text-muted-foreground">{k}</dt>
          <dd className="font-semibold break-words">{String(v ?? "—")}</dd>
        </div>
      ))}
    </dl>
  );
}
