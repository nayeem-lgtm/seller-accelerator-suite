import { supabase } from "@/integrations/supabase/client";

/**
 * Lightweight client-side helpers that insert public form submissions
 * into Supabase. RLS allows anon INSERT only — reads are admin-only.
 */

export type Platform = "walmart" | "tiktok" | "ebay";

export interface ContactQueryInput {
  full_name: string;
  email: string;
  phone_country_code: string;
  phone_number: string;
  selected_service?: string | null;
  query_type?: string | null;
  message: string;
  source_page?: string | null;
}

export interface PlanSelectionInput {
  full_name: string;
  email: string;
  phone_country_code: string;
  phone_number: string;
  platform_selected: Platform;
  plan_selected: string;
  payment_choice: "yes" | "no";
}

export interface BusinessCredentialsInput {
  full_name: string;
  email: string;
  phone_country_code: string;
  phone_number: string;
  business_name: string;
  business_email?: string | null;
  business_phone?: string | null;
  full_business_address?: string | null;
  address_line_1: string;
  address_line_2?: string | null;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  marketplace_platform: Platform | "multiple" | "other";
  seller_account_status?: string | null;
  notes?: string | null;
}

export async function submitContactQuery(input: ContactQueryInput) {
  const { error } = await supabase.from("contact_queries").insert(input);
  if (error) throw error;
}

export async function submitPlanSelection(input: PlanSelectionInput) {
  const { error } = await supabase.from("plan_selections").insert(input);
  if (error) throw error;
}

export async function submitBusinessCredentials(input: BusinessCredentialsInput) {
  const { error } = await supabase.from("business_credentials").insert(input);
  if (error) throw error;
}