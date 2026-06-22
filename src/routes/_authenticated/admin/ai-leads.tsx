import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { listAiLeads } from "@/lib/admin.functions";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader, StatusEditor, fmtDate } from "@/lib/admin-ui";

export const Route = createFileRoute("/_authenticated/admin/ai-leads")({
  component: AiLeadsAdmin,
});

function AiLeadsAdmin() {
  const fn = useServerFn(listAiLeads);
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "ai_leads"],
    queryFn: () => fn({ data: { limit: 200 } }),
  });

  return (
    <div>
      <PageHeader title="Ray AI Leads" subtitle="Lead captures from the AI assistant." />
      {isLoading ? (
        <Skeleton className="h-40" />
      ) : (
        <div className="space-y-3">
          {(data ?? []).map((l: any) => (
            <Card key={l.id} className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="font-bold">{l.name ?? "Anonymous"}</div>
                  <div className="text-xs text-muted-foreground">
                    {l.email ?? "—"} {l.phone ? `· ${l.phone}` : ""} {l.source_page ? `· ${l.source_page}` : ""}
                  </div>
                </div>
                <StatusEditor id={l.id} table="ai_leads" current={l.status} queryKey="ai_leads" />
              </div>
              <div className="mt-3 text-sm whitespace-pre-wrap text-foreground/90 leading-relaxed">{l.message}</div>
              {l.conversation_snippet && (
                <details className="mt-3">
                  <summary className="text-xs text-muted-foreground cursor-pointer">Conversation transcript</summary>
                  <pre className="mt-2 text-xs bg-muted/40 p-3 rounded-lg whitespace-pre-wrap">{l.conversation_snippet}</pre>
                </details>
              )}
              <div className="mt-2 text-[11px] text-muted-foreground">{fmtDate(l.created_at)}</div>
            </Card>
          ))}
          {(data?.length ?? 0) === 0 && (
            <Card className="p-8 text-center text-muted-foreground">No AI leads yet.</Card>
          )}
        </div>
      )}
    </div>
  );
}