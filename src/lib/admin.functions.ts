import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

/**
 * Admin-only server functions.
 * Every handler verifies has_role(uid, 'admin') before touching data.
 */

async function assertAdmin(ctx: { supabase: any; userId: string; claims: any }) {
  const { data, error } = await ctx.supabase.rpc("has_role", {
    _user_id: ctx.userId,
    _role: "admin",
  });
  if (error || !data) throw new Error("Forbidden");
}

async function logAudit(
  ctx: { supabase: any; userId: string; claims: any },
  action: string,
  target_table?: string,
  target_id?: string,
  details?: Record<string, unknown>,
) {
  try {
    await ctx.supabase.from("admin_audit_log").insert({
      admin_user_id: ctx.userId,
      admin_email: ctx.claims?.email ?? null,
      action,
      target_table: target_table ?? null,
      target_id: target_id ?? null,
      details: details ?? null,
    });
  } catch (e) {
    console.error("[audit]", e);
  }
}

/* -------- Overview -------- */
export const adminOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const sb = context.supabase;
    const [plans, biz, contracts, payments, contacts, leads] = await Promise.all([
      sb.from("plan_selections").select("*", { count: "exact", head: true }),
      sb.from("business_credentials").select("*", { count: "exact", head: true }),
      sb.from("contracts").select("*", { count: "exact", head: true }),
      sb.from("payments").select("*", { count: "exact", head: true }),
      sb.from("contact_queries").select("*", { count: "exact", head: true }),
      sb.from("ai_leads").select("*", { count: "exact", head: true }),
    ]);
    const { data: revenueRows } = await sb
      .from("payments")
      .select("amount, payment_status");
    const totalRevenue = (revenueRows ?? [])
      .filter((r: any) => r.payment_status === "paid")
      .reduce((s: number, r: any) => s + Number(r.amount ?? 0), 0);
    const pendingRevenue = (revenueRows ?? [])
      .filter((r: any) => r.payment_status === "pending")
      .reduce((s: number, r: any) => s + Number(r.amount ?? 0), 0);

    const { data: recent } = await sb
      .from("contracts")
      .select("id, client_name, client_email, platforms, total_amount, created_at, status")
      .order("created_at", { ascending: false })
      .limit(5);
    return {
      counts: {
        plans: plans.count ?? 0,
        business: biz.count ?? 0,
        contracts: contracts.count ?? 0,
        payments: payments.count ?? 0,
        contacts: contacts.count ?? 0,
        leads: leads.count ?? 0,
      },
      totalRevenue,
      pendingRevenue,
      recentContracts: recent ?? [],
    };
  });

/* -------- Generic list endpoints -------- */
const ListInput = z.object({
  limit: z.number().int().min(1).max(200).default(100),
  status: z.string().optional().nullable(),
});

export const listPlanSelections = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => ListInput.parse(i ?? {}))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    let q = context.supabase
      .from("plan_selections")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(data.limit);
    if (data.status) q = q.eq("status", data.status);
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const listBusinessCredentials = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => ListInput.parse(i ?? {}))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    let q = context.supabase
      .from("business_credentials")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(data.limit);
    if (data.status) q = q.eq("status", data.status);
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const listContracts = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => ListInput.parse(i ?? {}))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    let q = context.supabase
      .from("contracts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(data.limit);
    if (data.status) q = q.eq("status", data.status);
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const listPayments = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => ListInput.parse(i ?? {}))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    let q = context.supabase
      .from("payments")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(data.limit);
    if (data.status) q = q.eq("payment_status", data.status);
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const listContactQueries = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => ListInput.parse(i ?? {}))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    let q = context.supabase
      .from("contact_queries")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(data.limit);
    if (data.status) q = q.eq("status", data.status);
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const listAiLeads = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => ListInput.parse(i ?? {}))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    let q = context.supabase
      .from("ai_leads")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(data.limit);
    if (data.status) q = q.eq("status", data.status);
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

/* -------- Status updates -------- */
const StatusInput = z.object({
  id: z.string().uuid(),
  table: z.enum([
    "plan_selections",
    "business_credentials",
    "contracts",
    "contact_queries",
    "ai_leads",
  ]),
  status: z.enum(["new", "contacted", "qualified", "won", "lost", "spam"]),
});

export const updateLeadStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => StatusInput.parse(i))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const { error } = await context.supabase
      .from(data.table)
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    await logAudit(context, "update_status", data.table, data.id, { status: data.status });
    return { ok: true };
  });

const PayStatusInput = z.object({
  id: z.string().uuid(),
  status: z.enum(["pending", "paid", "failed", "refunded"]),
  referenceId: z.string().max(200).optional().nullable(),
});

export const updatePaymentStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => PayStatusInput.parse(i))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const { error } = await context.supabase
      .from("payments")
      .update({
        payment_status: data.status,
        ...(data.referenceId ? { reference_id: data.referenceId } : {}),
      })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    await logAudit(context, "update_payment_status", "payments", data.id, {
      status: data.status,
      referenceId: data.referenceId,
    });
    return { ok: true };
  });

/* -------- Users + roles -------- */
export const listAdminUsers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { data: profiles, error } = await context.supabase
      .from("profiles")
      .select("id, email, full_name, company_name, created_at")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw new Error(error.message);
    const { data: roles } = await context.supabase
      .from("user_roles")
      .select("user_id, role");
    const roleMap = new Map<string, string[]>();
    (roles ?? []).forEach((r: any) => {
      const arr = roleMap.get(r.user_id) ?? [];
      arr.push(r.role);
      roleMap.set(r.user_id, arr);
    });
    return (profiles ?? []).map((p: any) => ({
      ...p,
      roles: roleMap.get(p.id) ?? [],
    }));
  });

const GrantInput = z.object({
  userId: z.string().uuid(),
  role: z.enum(["admin", "moderator", "user"]),
  grant: z.boolean(),
});

export const setUserRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => GrantInput.parse(i))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    if (data.grant) {
      const { error } = await context.supabase
        .from("user_roles")
        .upsert({ user_id: data.userId, role: data.role }, { onConflict: "user_id,role" });
      if (error) throw new Error(error.message);
    } else {
      const { error } = await context.supabase
        .from("user_roles")
        .delete()
        .eq("user_id", data.userId)
        .eq("role", data.role);
      if (error) throw new Error(error.message);
    }
    await logAudit(context, data.grant ? "grant_role" : "revoke_role", "user_roles", data.userId, {
      role: data.role,
    });
    return { ok: true };
  });

/* -------- Audit log -------- */
export const listAuditLog = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { data, error } = await context.supabase
      .from("admin_audit_log")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

/* -------- Current user role check (for gating UI) -------- */
export const meIsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    return { isAdmin: Boolean(data), email: context.claims?.email ?? null };
  });