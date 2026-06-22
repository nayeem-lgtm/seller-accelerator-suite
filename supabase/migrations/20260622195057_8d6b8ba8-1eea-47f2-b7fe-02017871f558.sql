DROP POLICY IF EXISTS "Anyone can submit a contact query" ON public.contact_queries;
CREATE POLICY "public_insert_contact_queries" ON public.contact_queries FOR INSERT TO anon, authenticated WITH CHECK (true);
NOTIFY pgrst, 'reload schema';