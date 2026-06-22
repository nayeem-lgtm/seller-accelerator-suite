import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { listContactQueries } from "@/lib/admin.functions";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { PageHeader, StatusEditor, fmtDate } from "./_shared";

export const Route = createFileRoute("/_authenticated/admin/contacts")({
  component: ContactsAdmin,
});

function ContactsAdmin() {
  const fn = useServerFn(listContactQueries);
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "contact_queries"],
    queryFn: () => fn({ data: { limit: 200 } }),
  });

  return (
    <div>
      <PageHeader title="Contact Inbox" subtitle="Queries from the contact page." />
      {isLoading ? (
        <Skeleton className="h-40" />
      ) : (
        <div className="space-y-3">
          {(data ?? []).map((c: any) => (
            <Card key={c.id} className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="font-bold">{c.full_name}</div>
                  <div className="text-xs text-muted-foreground">
                    {c.email} · {c.phone_country_code} {c.phone_number}
                    {c.selected_service && ` · ${c.selected_service}`}
                    {c.query_type && ` · ${c.query_type}`}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <StatusEditor id={c.id} table="contact_queries" current={c.status} queryKey="contact_queries" />
                  <Button size="sm" variant="outline" asChild>
                    <a href={`mailto:${c.email}?subject=Re: your query to Ray Ecommerce`}>
                      <Mail className="h-3.5 w-3.5 mr-1.5" /> Reply
                    </a>
                  </Button>
                </div>
              </div>
              <div className="mt-3 text-sm whitespace-pre-wrap text-foreground/90 leading-relaxed">{c.message}</div>
              <div className="mt-2 text-[11px] text-muted-foreground">{fmtDate(c.created_at)}</div>
            </Card>
          ))}
          {(data?.length ?? 0) === 0 && (
            <Card className="p-8 text-center text-muted-foreground">No queries yet.</Card>
          )}
        </div>
      )}
    </div>
  );
}