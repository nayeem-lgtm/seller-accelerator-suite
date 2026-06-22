
-- Grant Data API access to public-submission tables (RLS policies already exist).
GRANT INSERT ON public.contact_queries TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.contact_queries TO authenticated;
GRANT ALL ON public.contact_queries TO service_role;

GRANT INSERT ON public.ai_leads TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.ai_leads TO authenticated;
GRANT ALL ON public.ai_leads TO service_role;

GRANT INSERT ON public.plan_selections TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.plan_selections TO authenticated;
GRANT ALL ON public.plan_selections TO service_role;

GRANT INSERT ON public.business_credentials TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.business_credentials TO authenticated;
GRANT ALL ON public.business_credentials TO service_role;

GRANT INSERT ON public.contracts TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.contracts TO authenticated;
GRANT ALL ON public.contracts TO service_role;

GRANT INSERT ON public.payments TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.payments TO authenticated;
GRANT ALL ON public.payments TO service_role;
