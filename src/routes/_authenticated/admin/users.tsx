import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { listAdminUsers, setUserRole, setAdminLevel, setAdminActive } from "@/lib/admin.functions";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useState } from "react";
import { PageHeader, fmtDate } from "@/lib/admin-ui";

export const Route = createFileRoute("/_authenticated/admin/users")({
  component: UsersAdmin,
});

function UsersAdmin() {
  const fn = useServerFn(listAdminUsers);
  const grant = useServerFn(setUserRole);
  const setLevelFn = useServerFn(setAdminLevel);
  const setActiveFn = useServerFn(setAdminActive);
  const qc = useQueryClient();
  const [busy, setBusy] = useState<string | null>(null);
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: () => fn(),
  });

  const meLevel = (data as any[] | undefined)?.[0]?.meLevel ?? null;
  const canManageAdmins = meLevel === "owner";

  async function toggleAdmin(userId: string, isAdmin: boolean) {
    setBusy(userId);
    try {
      await grant({ data: { userId, role: "admin", grant: !isAdmin, level: "support" } });
      toast.success(isAdmin ? "Admin revoked" : "Admin granted");
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
    } catch (e: any) {
      toast.error(e?.message ?? "Action failed");
    } finally {
      setBusy(null);
    }
  }

  async function changeLevel(userId: string, level: "owner" | "manager" | "support") {
    setBusy(userId);
    try {
      await setLevelFn({ data: { userId, level } });
      toast.success("Level updated");
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
    } catch (e: any) {
      toast.error(e?.message ?? "Action failed");
    } finally {
      setBusy(null);
    }
  }

  async function toggleActive(userId: string, active: boolean) {
    setBusy(userId);
    try {
      await setActiveFn({ data: { userId, active } });
      toast.success(active ? "Activated" : "Deactivated");
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
    } catch (e: any) {
      toast.error(e?.message ?? "Action failed");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div>
      <PageHeader
        title="Users & Roles"
        subtitle={
          canManageAdmins
            ? "Owner controls: grant/revoke admin access, assign Owner/Manager/Support, activate or deactivate."
            : "Only Owners can grant or revoke admin access."
        }
      />
      <Card className="overflow-hidden">
        {isLoading ? (
          <Skeleton className="h-40" />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-muted/40 text-left">
                <tr>
                  <Th>User</Th><Th>Company</Th><Th>Roles</Th><Th>Admin level</Th><Th>Active</Th><Th>Created</Th><Th></Th>
                </tr>
              </thead>
              <tbody>
                {(data ?? []).map((u: any) => {
                  const isAdmin = u.roles?.includes("admin");
                  return (
                    <tr key={u.id} className="border-t border-border">
                      <Td>
                        <div className="font-semibold">{u.full_name ?? "—"}</div>
                        <div className="text-xs text-muted-foreground">{u.email}</div>
                      </Td>
                      <Td>{u.company_name ?? "—"}</Td>
                      <Td>
                        {(u.roles ?? []).length === 0
                          ? <span className="text-xs text-muted-foreground">user</span>
                          : (u.roles as string[]).map((r) => (
                              <Badge key={r} variant={r === "admin" ? "default" : "secondary"} className="mr-1">{r}</Badge>
                            ))
                        }
                      </Td>
                      <Td>
                        {isAdmin ? (
                          canManageAdmins ? (
                            <Select
                              value={u.adminLevel ?? "support"}
                              onValueChange={(v) => changeLevel(u.id, v as any)}
                              disabled={busy === u.id}
                            >
                              <SelectTrigger className="h-8 w-[130px] text-xs"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="owner">Owner</SelectItem>
                                <SelectItem value="manager">Manager</SelectItem>
                                <SelectItem value="support">Support</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <span className="text-xs capitalize">{u.adminLevel ?? "—"}</span>
                          )
                        ) : <span className="text-xs text-muted-foreground">—</span>}
                      </Td>
                      <Td>
                        {isAdmin ? (
                          <Badge variant={u.adminActive ? "default" : "secondary"}>
                            {u.adminActive ? "Active" : "Inactive"}
                          </Badge>
                        ) : <span className="text-xs text-muted-foreground">—</span>}
                      </Td>
                      <Td className="text-xs text-muted-foreground">{fmtDate(u.created_at)}</Td>
                      <Td>
                        {canManageAdmins && (
                          <div className="flex gap-1.5">
                            <Button
                              size="sm"
                              variant={isAdmin ? "destructive" : "default"}
                              disabled={busy === u.id}
                              onClick={() => toggleAdmin(u.id, isAdmin)}
                            >
                              {isAdmin ? "Revoke" : "Grant admin"}
                            </Button>
                            {isAdmin && (
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={busy === u.id}
                                onClick={() => toggleActive(u.id, !u.adminActive)}
                              >
                                {u.adminActive ? "Deactivate" : "Activate"}
                              </Button>
                            )}
                          </div>
                        )}
                      </Td>
                    </tr>
                  );
                })}
                {(data?.length ?? 0) === 0 && (
                  <tr><td colSpan={7} className="py-8 text-center text-muted-foreground">No users yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

function Th({ children }: { children?: React.ReactNode }) {
  return <th className="px-3 py-2.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{children}</th>;
}
function Td({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
  return <td className={`px-3 py-2.5 align-top ${className}`}>{children}</td>;
}