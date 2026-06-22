import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

/**
 * Public submission endpoints.
 * - Use the publishable (anon) key — RLS allows INSERT to anon on these tables.
 * - Email notifications are loaded inside the handler so the server-only helper
 *   never leaks into the client bundle.
 */
function getServerClient() {
  return createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
  );
}

/* ---------------- Contact form ---------------- */
const ContactInput = z.object({
  fullName: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(320),
  countryCode: z.string().trim().min(1).max(10),
  phone: z.string().trim().min(4).max(30),
  marketplace: z.string().trim().max(100).optional().nullable(),
  queryType: z.string().trim().max(100).optional().nullable(),
  message: z.string().trim().min(1).max(5000),
  sourcePage: z.string().trim().max(200).optional().nullable(),
});

export const submitContactQuery = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ContactInput.parse(input))
  .handler(async ({ data }) => {
    const sb = getServerClient();
    const { data: row, error } = await sb
      .from("contact_queries")
      .insert({
        full_name: data.fullName,
        email: data.email,
        phone_country_code: data.countryCode,
        phone_number: data.phone,
        selected_service: data.marketplace ?? null,
        query_type: data.queryType ?? null,
        message: data.message,
        source_page: data.sourcePage ?? null,
      })
      .select("id")
      .single();
    if (error) {
      console.error("[submitContactQuery]", error);
      throw new Error("Could not submit your query. Please try again.");
    }
    try {
      const { notifyContactQuery } = await import("./notify.server");
      await notifyContactQuery({
        fullName: data.fullName,
        email: data.email,
        phone: `${data.countryCode} ${data.phone}`,
        marketplace: data.marketplace ?? null,
        queryType: data.queryType ?? null,
        message: data.message,
      });
    } catch (e) {
      console.error("[notify] contact failed", e);
    }
    return { id: row.id };
  });

/* ---------------- Seller onboarding bundle ---------------- */
const PlatformEnum = z.enum(["walmart", "tiktok", "ebay"]);

const OnboardingInput = z.object({
  // identity / contact
  clientName: z.string().trim().min(1).max(200),
  clientEmail: z.string().trim().email().max(320),
  countryCode: z.string().trim().min(1).max(10).default("+1"),
  phone: z.string().trim().min(4).max(30),
  // selections
  platforms: z.array(PlatformEnum).min(1),
  branch: z.enum(["existing", "create"]),
  totalAmount: z.number().min(0),
  // contract
  signatureDataUrl: z.string().min(10).max(500000),
  agreedTerms: z.boolean(),
  agreedAuthorization: z.boolean(),
  // payment
  paymentMethod: z.enum(["card", "paypal", "bank", "wallet", "other"]).transform((v) =>
    v === "paypal" ? "wallet" : v,
  ),
  // optional business credentials (existing-account flow may not collect address)
  businessName: z.string().trim().max(200).optional().nullable(),
  addressLine1: z.string().trim().max(200).optional().nullable(),
  city: z.string().trim().max(100).optional().nullable(),
  state: z.string().trim().max(100).optional().nullable(),
  zipCode: z.string().trim().max(20).optional().nullable(),
  country: z.string().trim().max(100).optional().nullable(),
  sellerAccountStatus: z.string().trim().max(100).optional().nullable(),
  notes: z.string().trim().max(5000).optional().nullable(),
});

export const submitOnboarding = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => OnboardingInput.parse(input))
  .handler(async ({ data }) => {
    const sb = getServerClient();
    const platformLabel = data.platforms.length === 1 ? data.platforms[0] : "multiple";

    // 1) plan selection
    const planRes = await sb
      .from("plan_selections")
      .insert({
        full_name: data.clientName,
        email: data.clientEmail,
        phone_country_code: data.countryCode,
        phone_number: data.phone,
        platform_selected: data.platforms[0],
        plan_selected: data.platforms.join("+"),
        payment_choice: "yes",
      })
      .select("id")
      .single();
    if (planRes.error) {
      console.error("[submitOnboarding plan]", planRes.error);
      throw new Error("Could not save your plan selection.");
    }
    const planId = planRes.data.id;

    // 2) business credentials (only when address fields present)
    let bcId: string | null = null;
    if (data.addressLine1 && data.city && data.state && data.zipCode && data.country) {
      const bcRes = await sb
        .from("business_credentials")
        .insert({
          full_name: data.clientName,
          email: data.clientEmail,
          phone_country_code: data.countryCode,
          phone_number: data.phone,
          business_name: data.businessName ?? data.clientName,
          address_line_1: data.addressLine1,
          city: data.city,
          state: data.state,
          zip_code: data.zipCode,
          country: data.country,
          marketplace_platform: platformLabel,
          seller_account_status: data.sellerAccountStatus ?? null,
          notes: data.notes ?? null,
        })
        .select("id")
        .single();
      if (!bcRes.error) bcId = bcRes.data.id;
      else console.error("[submitOnboarding bc]", bcRes.error);
    }

    // 3) contract
    const contractRes = await sb
      .from("contracts")
      .insert({
        client_name: data.clientName,
        client_email: data.clientEmail,
        platforms: data.platforms,
        branch: data.branch,
        total_amount: data.totalAmount,
        signature_data_url: data.signatureDataUrl,
        agreed_terms: data.agreedTerms,
        agreed_authorization: data.agreedAuthorization,
        plan_selection_id: planId,
        business_credentials_id: bcId,
      })
      .select("id")
      .single();
    if (contractRes.error) {
      console.error("[submitOnboarding contract]", contractRes.error);
      throw new Error("Could not save your signed agreement.");
    }
    const contractId = contractRes.data.id;

    // 4) payment record (pending until reconciled manually)
    const payRes = await sb.from("payments").insert({
      client_name: data.clientName,
      client_email: data.clientEmail,
      platforms: data.platforms,
      amount: data.totalAmount,
      currency: "USD",
      payment_method: data.paymentMethod,
      payment_status: "pending",
      plan_selection_id: planId,
      contract_id: contractId,
    });
    if (payRes.error) console.error("[submitOnboarding payment]", payRes.error);

    try {
      const { notifyOnboardingSubmission } = await import("./notify.server");
      await notifyOnboardingSubmission({
        clientName: data.clientName,
        clientEmail: data.clientEmail,
        platforms: data.platforms,
        branch: data.branch,
        total: data.totalAmount,
        paymentMethod: data.paymentMethod,
        paymentStatus: "pending",
      });
    } catch (e) {
      console.error("[notify] onboarding failed", e);
    }

    return { planId, contractId };
  });

/* ---------------- AI lead capture ---------------- */
const AiLeadInput = z.object({
  name: z.string().trim().max(200).optional().nullable(),
  email: z.string().trim().email().max(320).optional().nullable(),
  phone: z.string().trim().max(30).optional().nullable(),
  message: z.string().trim().min(1).max(5000),
  conversationSnippet: z.string().trim().max(20000).optional().nullable(),
  sourcePage: z.string().trim().max(200).optional().nullable(),
});

export const submitAiLead = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => AiLeadInput.parse(input))
  .handler(async ({ data }) => {
    const sb = getServerClient();
    const { data: row, error } = await sb
      .from("ai_leads")
      .insert({
        name: data.name ?? null,
        email: data.email ?? null,
        phone: data.phone ?? null,
        message: data.message,
        conversation_snippet: data.conversationSnippet ?? null,
        source_page: data.sourcePage ?? null,
      })
      .select("id")
      .single();
    if (error) {
      console.error("[submitAiLead]", error);
      throw new Error("Could not save your request.");
    }
    try {
      const { notifyAiLead } = await import("./notify.server");
      await notifyAiLead({
        name: data.name ?? null,
        email: data.email ?? null,
        message: data.message,
      });
    } catch (e) {
      console.error("[notify] ai lead failed", e);
    }
    return { id: row.id };
  });