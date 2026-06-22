import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQueryClient } from "@tanstack/react-query";
import { updateLeadStatus } from "@/lib/admin.functions";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export const STATUSES = ["new", "contacted", "in_progress", "completed", "rejected"] as const;
export type Status = (typeof STATUSES)[number];

export const STATUS_COLOR: Record<Status, string> = {
  new: "bg-blue-100 text-blue-800",
  contacted: "bg-amber-100 text-amber-800",
  in_progress: "bg-purple-100 text-purple-800",
  completed: "bg-emerald-100 text-emerald-800",
  rejected: "bg-rose-100 text-rose-800",
};

export function StatusBadge({ status }: { status: string }) {
  const cls = STATUS_COLOR[(status as Status) ?? "new"] ?? "bg-slate-100 text-slate-800";
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${cls}`}>
      {status}
    </span>
  );
}

export function StatusEditor({
  id,
  table,
  current,
  queryKey,
}: {
  id: string;
  table: "plan_selections" | "business_credentials" | "contracts" | "contact_queries" | "ai_leads";
  current: string;
  queryKey: string;
}) {
  const fn = useServerFn(updateLeadStatus);
  const qc = useQueryClient();
  const [busy, setBusy] = useState(false);
  return (
    <Select
      value={current}
      onValueChange={async (v) => {
        setBusy(true);
        try {
          await fn({ data: { id, table, status: v as Status } });
          toast.success("Status updated");
          qc.invalidateQueries({ queryKey: ["admin", queryKey] });
          qc.invalidateQueries({ queryKey: ["admin", "overview"] });
        } catch (e) {
          toast.error("Could not update status");
        } finally {
          setBusy(false);
        }
      }}
    >
      <SelectTrigger className="h-8 w-[140px] text-xs" disabled={busy}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {STATUSES.map((s) => (
          <SelectItem key={s} value={s} className="text-xs">
            {s.replace("_", " ")}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

export function fmtDate(d: string) {
  return new Date(d).toLocaleString();
}

export { Button };