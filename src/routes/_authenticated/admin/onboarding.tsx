import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { listPlanSelections, listBusinessCredentials } from "@/lib/admin.functions";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader, StatusEditor, fmtDate } from "./_shared";

export const Route = createFileRoute("/_authenticated/admin/onboarding")({
  component: OnboardingAdmin,
});

function OnboardingAdmin() {
  const listPlansFn = useServerFn(listPlanSelections);
  const listBcFn = useServerFn(listBusinessCredentials);
  const plans = useQuery({
    queryKey: ["admin", "plan_selections"],
    queryFn: () => listPlansFn({ data: { limit: 100 } }),
  });
  const bc = useQuery({
    queryKey: ["admin", "business_credentials"],
    queryFn: () => listBcFn({ data: { limit: 100 } }),
  });

  return (
    <div>
      <PageHeader title="Onboarding" subtitle="Plan selections and business credentials submissions." />
      <Tabs defaultValue="plans">
        <TabsList>
          <TabsTrigger value="plans">Plan selections ({plans.data?.length ?? 0})</TabsTrigger>
          <TabsTrigger value="business">Business profiles ({bc.data?.length ?? 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="mt-4">
          <Card className="overflow-hidden">
            {plans.isLoading ? (
              <Skeleton className="h-40" />
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-muted/40 text-left">
                    <tr>
                      <Th>Name</Th><Th>Email</Th><Th>Phone</Th><Th>Platform</Th><Th>Plan</Th><Th>Pay?</Th><Th>Status</Th><Th>Submitted</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {(plans.data ?? []).map((r: any) => (
                      <tr key={r.id} className="border-t border-border">
                        <Td className="font-semibold">{r.full_name}</Td>
                        <Td>{r.email}</Td>
                        <Td>{r.phone_country_code} {r.phone_number}</Td>
                        <Td className="capitalize">{r.platform_selected}</Td>
                        <Td>{r.plan_selected}</Td>
                        <Td className="uppercase text-xs font-bold">{r.payment_choice}</Td>
                        <Td>
                          <StatusEditor id={r.id} table="plan_selections" current={r.status} queryKey="plan_selections" />
                        </Td>
                        <Td className="text-xs text-muted-foreground">{fmtDate(r.created_at)}</Td>
                      </tr>
                    ))}
                    {(plans.data?.length ?? 0) === 0 && (
                      <tr><td colSpan={8} className="py-8 text-center text-muted-foreground">No submissions yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="business" className="mt-4">
          <Card className="overflow-hidden">
            {bc.isLoading ? (
              <Skeleton className="h-40" />
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-muted/40 text-left">
                    <tr>
                      <Th>Business</Th><Th>Contact</Th><Th>Platform</Th><Th>Address</Th><Th>Status</Th><Th>Submitted</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {(bc.data ?? []).map((r: any) => (
                      <tr key={r.id} className="border-t border-border">
                        <Td className="font-semibold">{r.business_name}</Td>
                        <Td>
                          <div>{r.full_name}</div>
                          <div className="text-xs text-muted-foreground">{r.email}</div>
                        </Td>
                        <Td className="capitalize">{r.marketplace_platform}</Td>
                        <Td className="max-w-[260px] text-xs">
                          {r.address_line_1}, {r.city}, {r.state} {r.zip_code}, {r.country}
                        </Td>
                        <Td>
                          <StatusEditor id={r.id} table="business_credentials" current={r.status} queryKey="business_credentials" />
                        </Td>
                        <Td className="text-xs text-muted-foreground">{fmtDate(r.created_at)}</Td>
                      </tr>
                    ))}
                    {(bc.data?.length ?? 0) === 0 && (
                      <tr><td colSpan={6} className="py-8 text-center text-muted-foreground">No business profiles yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-3 py-2.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{children}</th>;
}
function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-3 py-2.5 align-top ${className}`}>{children}</td>;
}