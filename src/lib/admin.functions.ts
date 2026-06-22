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

async function assertOwner(ctx: { supabase: any; userId: string; claims: any }) {
  const { data, error } = await ctx.supabase.rpc("is_owner", { _uid: ctx.userId });
  if (error || !data) throw new Error("Forbidden: owner only");
}

async function getLevel(ctx: { supabase: any; userId: string }): Promise<"owner" | "manager" | "support" | null> {
  const { data } = await ctx.supabase.rpc("get_admin_level", { _uid: ctx.userId });
  return (data ?? null) as any;
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
    const [plans, biz, contracts, payments, contacts, leads, profilesCount] = await Promise.all([
      sb.from("plan_selections").select("*", { count: "exact", head: true }),
      sb.from("business_credentials").select("*", { count: "exact", head: true }),
      sb.from("contracts").select("*", { count: "exact", head: true }),
      sb.from("payments").select("*", { count: "exact", head: true }),
      sb.from("contact_queries").select("*", { count: "exact", head: true }),
      sb.from("ai_leads").select("*", { count: "exact", head: true }),
      sb.from("profiles").select("*", { count: "exact", head: true }),
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

    // Customer status breakdown (sum across plan_selections, the canonical lead table)
    const { data: statusRows } = await sb.from("plan_selections").select("status");
    const statusCounts: Record<string, number> = {};
    (statusRows ?? []).forEach((r: any) => {
      statusCounts[r.status] = (statusCounts[r.status] ?? 0) + 1;
    });

    // Last 30 days signups
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const { count: newSignups } = await sb
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .gte("created_at", since);

    const { data: recent } = await sb
      .from("contracts")
      .select("id, client_name, client_email, platforms, total_amount, created_at, status")
      .order("created_at", { ascending: false })
      .limit(5);
    return {
      counts: {
        users: profilesCount.count ?? 0,
        newSignups: newSignups ?? 0,
        plans: plans.count ?? 0,
        business: biz.count ?? 0,
        contracts: contracts.count ?? 0,
        payments: payments.count ?? 0,
        contacts: contacts.count ?? 0,
        leads: leads.count ?? 0,
      },
      statusCounts,
      totalRevenue,
      pendingRevenue,
      recentContracts: recent ?? [],
    };
  });

/* -------- Generic list endpoints -------- */
const LEAD_STATUSES = [
  "new",
  "contacted",
  "pending",
  "active",
  "in_progress",
  "completed",
  "rejected",
  "archived",
] as const;
type LeadStatus = (typeof LEAD_STATUSES)[number];

const ListInput = z.object({
  limit: z.number().int().min(1).max(200).default(100),
  status: z.enum(LEAD_STATUSES).optional().nullable(),
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
  status: z.enum(LEAD_STATUSES),
});

export const updateLeadStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => StatusInput.parse(i))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    // capture previous status for history
    const { data: prev } = await context.supabase
      .from(data.table)
      .select("status")
      .eq("id", data.id)
      .maybeSingle();
    const { error } = await context.supabase
      .from(data.table)
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    await context.supabase.from("status_history").insert({
      target_table: data.table,
      target_id: data.id,
      from_status: prev?.status ?? null,
      to_status: data.status,
      admin_user_id: context.userId,
      admin_email: context.claims?.email ?? null,
    });
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
    const { data: levels } = await context.supabase
      .from("admin_profiles")
      .select("user_id, level, is_active");
    const roleMap = new Map<string, string[]>();
    (roles ?? []).forEach((r: any) => {
      const arr = roleMap.get(r.user_id) ?? [];
      arr.push(r.role);
      roleMap.set(r.user_id, arr);
    });
    const levelMap = new Map<string, { level: string; is_active: boolean }>();
    (levels ?? []).forEach((l: any) => levelMap.set(l.user_id, { level: l.level, is_active: l.is_active }));
    const me = await getLevel(context);
    return (profiles ?? []).map((p: any) => ({
      ...p,
      roles: roleMap.get(p.id) ?? [],
      adminLevel: levelMap.get(p.id)?.level ?? null,
      adminActive: levelMap.get(p.id)?.is_active ?? null,
      meLevel: me,
    }));
  });

const GrantInput = z.object({
  userId: z.string().uuid(),
  role: z.enum(["admin", "user"]),
  grant: z.boolean(),
  level: z.enum(["owner", "manager", "support"]).optional(),
});

export const setUserRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => GrantInput.parse(i))
  .handler(async ({ context, data }) => {
    // Only owners can grant/revoke admin access
    await assertOwner(context);
    if (data.userId === context.userId && !data.grant) {
      throw new Error("You cannot revoke your own admin access.");
    }
    if (data.grant) {
      const { error } = await context.supabase
        .from("user_roles")
        .upsert({ user_id: data.userId, role: data.role }, { onConflict: "user_id,role" });
      if (error) throw new Error(error.message);
      if (data.role === "admin") {
        await context.supabase
          .from("admin_profiles")
          .upsert(
            { user_id: data.userId, level: data.level ?? "support", is_active: true, created_by: context.userId },
            { onConflict: "user_id" },
          );
      }
    } else {
      const { error } = await context.supabase
        .from("user_roles")
        .delete()
        .eq("user_id", data.userId)
        .eq("role", data.role);
      if (error) throw new Error(error.message);
      if (data.role === "admin") {
        await context.supabase.from("admin_profiles").delete().eq("user_id", data.userId);
      }
    }
    await logAudit(context, data.grant ? "grant_role" : "revoke_role", "user_roles", data.userId, {
      role: data.role,
      level: data.level,
    });
    return { ok: true };
  });

/* -------- Admin level / activate / deactivate (owner only) -------- */
const LevelInput = z.object({
  userId: z.string().uuid(),
  level: z.enum(["owner", "manager", "support"]),
});
export const setAdminLevel = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => LevelInput.parse(i))
  .handler(async ({ context, data }) => {
    await assertOwner(context);
    const { error } = await context.supabase
      .from("admin_profiles")
      .update({ level: data.level })
      .eq("user_id", data.userId);
    if (error) throw new Error(error.message);
    await logAudit(context, "set_admin_level", "admin_profiles", data.userId, { level: data.level });
    return { ok: true };
  });

const ActiveInput = z.object({ userId: z.string().uuid(), active: z.boolean() });
export const setAdminActive = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => ActiveInput.parse(i))
  .handler(async ({ context, data }) => {
    await assertOwner(context);
    if (data.userId === context.userId && !data.active) {
      throw new Error("You cannot deactivate your own admin account.");
    }
    const { error } = await context.supabase
      .from("admin_profiles")
      .update({ is_active: data.active })
      .eq("user_id", data.userId);
    if (error) throw new Error(error.message);
    await logAudit(context, data.active ? "activate_admin" : "deactivate_admin", "admin_profiles", data.userId);
    return { ok: true };
  });

/* -------- Notes -------- */
const NoteListInput = z.object({
  targetTable: z.string().min(1).max(64),
  targetId: z.string().uuid(),
});
export const listNotes = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => NoteListInput.parse(i))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const { data: rows, error } = await context.supabase
      .from("admin_notes")
      .select("*")
      .eq("target_table", data.targetTable)
      .eq("target_id", data.targetId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

const AddNoteInput = z.object({
  targetTable: z.enum([
    "plan_selections",
    "business_credentials",
    "contracts",
    "payments",
    "contact_queries",
    "ai_leads",
    "profiles",
  ]),
  targetId: z.string().uuid(),
  note: z.string().trim().min(1).max(5000),
});
export const addNote = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => AddNoteInput.parse(i))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const { data: row, error } = await context.supabase
      .from("admin_notes")
      .insert({
        target_table: data.targetTable,
        target_id: data.targetId,
        note: data.note,
        admin_user_id: context.userId,
        admin_email: context.claims?.email ?? null,
      })
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const deleteNote = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const { error } = await context.supabase.from("admin_notes").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* -------- Status history -------- */
export const listStatusHistory = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) =>
    z.object({ targetTable: z.string(), targetId: z.string().uuid() }).parse(i),
  )
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const { data: rows } = await context.supabase
      .from("status_history")
      .select("*")
      .eq("target_table", data.targetTable)
      .eq("target_id", data.targetId)
      .order("created_at", { ascending: false });
    return rows ?? [];
  });

/* -------- Customers (unified view across profile + leads) -------- */
const CustomersInput = z.object({
  search: z.string().trim().max(200).optional(),
  status: z.enum(LEAD_STATUSES).optional().nullable(),
  platform: z.string().trim().max(50).optional().nullable(),
  limit: z.number().int().min(1).max(500).default(200),
});
export const listCustomers = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => CustomersInput.parse(i ?? {}))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const sb = context.supabase;
    let q = sb
      .from("plan_selections")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(data.limit);
    if (data.status) q = q.eq("status", data.status);
    if (data.platform) q = q.eq("platform_selected", data.platform);
    if (data.search) {
      const s = `%${data.search}%`;
      q = q.or(`full_name.ilike.${s},email.ilike.${s},phone_number.ilike.${s}`);
    }
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const getCustomerDetail = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const sb = context.supabase;
    const { data: plan } = await sb.from("plan_selections").select("*").eq("id", data.id).maybeSingle();
    if (!plan) throw new Error("Not found");
    const [bc, contracts, payments, notes, history] = await Promise.all([
      sb.from("business_credentials").select("*").eq("email", plan.email).order("created_at", { ascending: false }),
      sb.from("contracts").select("*").eq("plan_selection_id", data.id).order("created_at", { ascending: false }),
      sb.from("payments").select("*").eq("plan_selection_id", data.id).order("created_at", { ascending: false }),
      sb.from("admin_notes").select("*").eq("target_table", "plan_selections").eq("target_id", data.id).order("created_at", { ascending: false }),
      sb.from("status_history").select("*").eq("target_table", "plan_selections").eq("target_id", data.id).order("created_at", { ascending: false }),
    ]);
    return {
      plan,
      businessCredentials: bc.data ?? [],
      contracts: contracts.data ?? [],
      payments: payments.data ?? [],
      notes: notes.data ?? [],
      history: history.data ?? [],
    };
  });

/* -------- CSV export -------- */
function toCsv(rows: any[]): string {
  if (rows.length === 0) return "";
  const keys = Object.keys(rows[0]);
  const esc = (v: any) => {
    if (v === null || v === undefined) return "";
    const s = typeof v === "string" ? v : JSON.stringify(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [keys.join(","), ...rows.map((r) => keys.map((k) => esc(r[k])).join(","))].join("\n");
}

export const exportCustomersCsv = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => CustomersInput.parse(i ?? {}))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const sb = context.supabase;
    let q = sb.from("plan_selections").select("*").order("created_at", { ascending: false }).limit(5000);
    if (data.status) q = q.eq("status", data.status);
    if (data.platform) q = q.eq("platform_selected", data.platform);
    if (data.search) {
      const s = `%${data.search}%`;
      q = q.or(`full_name.ilike.${s},email.ilike.${s},phone_number.ilike.${s}`);
    }
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    await logAudit(context, "export_customers_csv", "plan_selections", undefined, { count: rows?.length ?? 0 });
    return { csv: toCsv(rows ?? []), count: rows?.length ?? 0 };
  });

/* -------- Delete / archive a customer record -------- */
const DeleteInput = z.object({
  table: z.enum(["plan_selections", "business_credentials", "contracts", "contact_queries", "ai_leads"]),
  id: z.string().uuid(),
});
export const deleteRecord = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => DeleteInput.parse(i))
  .handler(async ({ context, data }) => {
    // owners + managers can delete
    const level = await getLevel(context);
    if (level !== "owner" && level !== "manager") {
      // fall back to plain admin (legacy admins without admin_profiles)
      await assertAdmin(context);
    }
    const { error } = await context.supabase.from(data.table).delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    await logAudit(context, "delete_record", data.table, data.id);
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