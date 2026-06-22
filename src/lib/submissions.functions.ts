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
    const { data: row, error } = await sb.rpc("submit_contact_query", {
      p_full_name: data.fullName,
      p_email: data.email,
      p_country_code: data.countryCode,
      p_phone: data.phone,
      p_marketplace: data.marketplace ?? "",
      p_query_type: data.queryType ?? "",
      p_message: data.message,
      p_source_page: data.sourcePage ?? "",
    });
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
    return { id: row as string };
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
    const { data: result, error } = await sb.rpc("submit_onboarding", {
      p: data as unknown as Record<string, unknown>,
    });
    if (error || !result) {
      console.error("[submitOnboarding]", error);
      throw new Error("Could not save your onboarding submission.");
    }
    const { planId, contractId } = result as { planId: string; contractId: string };

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
    const { data: row, error } = await sb.rpc("submit_ai_lead", {
      p_name: data.name ?? "",
      p_email: data.email ?? "",
      p_phone: data.phone ?? "",
      p_message: data.message,
      p_snippet: data.conversationSnippet ?? "",
      p_source_page: data.sourcePage ?? "",
    });
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
    return { id: row as string };
  });