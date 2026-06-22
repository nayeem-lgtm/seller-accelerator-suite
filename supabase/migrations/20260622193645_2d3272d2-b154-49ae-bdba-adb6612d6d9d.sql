
-- 1) Expand status values: convert lead_status enum columns to text + CHECK so the workflow can evolve safely.
ALTER TABLE public.plan_selections      ALTER COLUMN status DROP DEFAULT;
ALTER TABLE public.business_credentials ALTER COLUMN status DROP DEFAULT;
ALTER TABLE public.contracts            ALTER COLUMN status DROP DEFAULT;
ALTER TABLE public.contact_queries      ALTER COLUMN status DROP DEFAULT;
ALTER TABLE public.ai_leads             ALTER COLUMN status DROP DEFAULT;

ALTER TABLE public.plan_selections      ALTER COLUMN status TYPE text USING status::text;
ALTER TABLE public.business_credentials ALTER COLUMN status TYPE text USING status::text;
ALTER TABLE public.contracts            ALTER COLUMN status TYPE text USING status::text;
ALTER TABLE public.contact_queries      ALTER COLUMN status TYPE text USING status::text;
ALTER TABLE public.ai_leads             ALTER COLUMN status TYPE text USING status::text;

ALTER TABLE public.plan_selections      ALTER COLUMN status SET DEFAULT 'new';
ALTER TABLE public.business_credentials ALTER COLUMN status SET DEFAULT 'new';
ALTER TABLE public.contracts            ALTER COLUMN status SET DEFAULT 'new';
ALTER TABLE public.contact_queries      ALTER COLUMN status SET DEFAULT 'new';
ALTER TABLE public.ai_leads             ALTER COLUMN status SET DEFAULT 'new';

DO $$ BEGIN
  ALTER TABLE public.plan_selections      ADD CONSTRAINT plan_selections_status_check      CHECK (status IN ('new','contacted','in_progress','pending','active','completed','rejected','archived'));
  ALTER TABLE public.business_credentials ADD CONSTRAINT business_credentials_status_check CHECK (status IN ('new','contacted','in_progress','pending','active','completed','rejected','archived'));
  ALTER TABLE public.contracts            ADD CONSTRAINT contracts_status_check            CHECK (status IN ('new','contacted','in_progress','pending','active','completed','rejected','archived'));
  ALTER TABLE public.contact_queries      ADD CONSTRAINT contact_queries_status_check      CHECK (status IN ('new','contacted','in_progress','pending','active','completed','rejected','archived'));
  ALTER TABLE public.ai_leads             ADD CONSTRAINT ai_leads_status_check             CHECK (status IN ('new','contacted','in_progress','pending','active','completed','rejected','archived'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 2) admin_profiles: owner/manager/support tier on top of the 'admin' role gate
CREATE TABLE IF NOT EXISTS public.admin_profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  level text NOT NULL DEFAULT 'support' CHECK (level IN ('owner','manager','support')),
  is_active boolean NOT NULL DEFAULT true,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.admin_profiles TO authenticated;
GRANT ALL ON public.admin_profiles TO service_role;
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_owner(_uid uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS(SELECT 1 FROM public.admin_profiles WHERE user_id = _uid AND level = 'owner' AND is_active);
$$;

CREATE OR REPLACE FUNCTION public.get_admin_level(_uid uuid)
RETURNS text LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT level FROM public.admin_profiles WHERE user_id = _uid AND is_active LIMIT 1;
$$;

CREATE POLICY "Admins can read admin_profiles" ON public.admin_profiles
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Owners can manage admin_profiles" ON public.admin_profiles
  FOR ALL TO authenticated
  USING (public.is_owner(auth.uid()))
  WITH CHECK (public.is_owner(auth.uid()));

CREATE TRIGGER trg_admin_profiles_updated_at
  BEFORE UPDATE ON public.admin_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Backfill: every existing admin becomes an Owner (so something can grant access to others)
INSERT INTO public.admin_profiles (user_id, level, is_active)
SELECT user_id, 'owner', true FROM public.user_roles WHERE role = 'admin'
ON CONFLICT (user_id) DO NOTHING;

-- Allowlisted email auto-grants admin role + owner level
CREATE OR REPLACE FUNCTION public.grant_admin_if_allowlisted()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF lower(NEW.email) IN ('mithon.rayadvertising@gmail.com') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin')
      ON CONFLICT (user_id, role) DO NOTHING;
    INSERT INTO public.admin_profiles (user_id, level, is_active) VALUES (NEW.id, 'owner', true)
      ON CONFLICT (user_id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

-- 3) admin_notes: internal notes on any customer record
CREATE TABLE IF NOT EXISTS public.admin_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  target_table text NOT NULL CHECK (target_table IN ('plan_selections','business_credentials','contracts','payments','contact_queries','ai_leads','profiles')),
  target_id uuid NOT NULL,
  note text NOT NULL CHECK (length(btrim(note)) BETWEEN 1 AND 5000),
  admin_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  admin_email text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_admin_notes_target ON public.admin_notes(target_table, target_id);
CREATE INDEX IF NOT EXISTS idx_admin_notes_created_at ON public.admin_notes(created_at DESC);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.admin_notes TO authenticated;
GRANT ALL ON public.admin_notes TO service_role;
ALTER TABLE public.admin_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read notes" ON public.admin_notes
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins write notes" ON public.admin_notes
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete notes" ON public.admin_notes
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- 4) status_history: track every status change
CREATE TABLE IF NOT EXISTS public.status_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  target_table text NOT NULL,
  target_id uuid NOT NULL,
  from_status text,
  to_status text NOT NULL,
  admin_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  admin_email text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_status_history_target ON public.status_history(target_table, target_id);

GRANT SELECT, INSERT ON public.status_history TO authenticated;
GRANT ALL ON public.status_history TO service_role;
ALTER TABLE public.status_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read history" ON public.status_history
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins write history" ON public.status_history
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
