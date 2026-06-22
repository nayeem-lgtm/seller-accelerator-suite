
-- =====================================================================
-- ENUMS
-- =====================================================================
CREATE TYPE public.app_role AS ENUM ('admin', 'user');
CREATE TYPE public.lead_status AS ENUM ('new', 'contacted', 'in_progress', 'completed', 'rejected');

-- =====================================================================
-- USER ROLES (separate table — never store roles on profiles)
-- =====================================================================
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security-definer helper to avoid RLS recursion
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can read own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can read all roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- =====================================================================
-- SHARED updated_at trigger function (reuse existing if present)
-- =====================================================================
-- public.update_updated_at_column() already exists per project context.

-- =====================================================================
-- CONTACT QUERIES
-- =====================================================================
CREATE TABLE public.contact_queries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL CHECK (length(btrim(full_name)) BETWEEN 1 AND 200),
  email text NOT NULL CHECK (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' AND length(email) <= 320),
  phone_country_code text NOT NULL CHECK (length(phone_country_code) BETWEEN 1 AND 10),
  phone_number text NOT NULL CHECK (length(btrim(phone_number)) BETWEEN 4 AND 30),
  selected_service text CHECK (selected_service IS NULL OR length(selected_service) <= 100),
  query_type text CHECK (query_type IS NULL OR length(query_type) <= 100),
  message text NOT NULL CHECK (length(btrim(message)) BETWEEN 1 AND 5000),
  source_page text CHECK (source_page IS NULL OR length(source_page) <= 200),
  status public.lead_status NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.contact_queries TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.contact_queries TO authenticated;
GRANT ALL ON public.contact_queries TO service_role;

ALTER TABLE public.contact_queries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a contact query"
  ON public.contact_queries FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can read contact queries"
  ON public.contact_queries FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update contact queries"
  ON public.contact_queries FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete contact queries"
  ON public.contact_queries FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_contact_queries_updated_at
  BEFORE UPDATE ON public.contact_queries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_contact_queries_created_at ON public.contact_queries (created_at DESC);
CREATE INDEX idx_contact_queries_status ON public.contact_queries (status);

-- =====================================================================
-- PLAN SELECTIONS
-- =====================================================================
CREATE TABLE public.plan_selections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL CHECK (length(btrim(full_name)) BETWEEN 1 AND 200),
  email text NOT NULL CHECK (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' AND length(email) <= 320),
  phone_country_code text NOT NULL CHECK (length(phone_country_code) BETWEEN 1 AND 10),
  phone_number text NOT NULL CHECK (length(btrim(phone_number)) BETWEEN 4 AND 30),
  platform_selected text NOT NULL CHECK (platform_selected IN ('walmart', 'tiktok', 'ebay')),
  plan_selected text NOT NULL CHECK (length(plan_selected) BETWEEN 1 AND 100),
  payment_choice text NOT NULL CHECK (payment_choice IN ('yes', 'no')),
  status public.lead_status NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.plan_selections TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.plan_selections TO authenticated;
GRANT ALL ON public.plan_selections TO service_role;

ALTER TABLE public.plan_selections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a plan selection"
  ON public.plan_selections FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can read plan selections"
  ON public.plan_selections FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update plan selections"
  ON public.plan_selections FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete plan selections"
  ON public.plan_selections FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_plan_selections_updated_at
  BEFORE UPDATE ON public.plan_selections
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_plan_selections_created_at ON public.plan_selections (created_at DESC);
CREATE INDEX idx_plan_selections_status ON public.plan_selections (status);
CREATE INDEX idx_plan_selections_platform ON public.plan_selections (platform_selected);

-- =====================================================================
-- BUSINESS CREDENTIALS
-- =====================================================================
CREATE TABLE public.business_credentials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL CHECK (length(btrim(full_name)) BETWEEN 1 AND 200),
  email text NOT NULL CHECK (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' AND length(email) <= 320),
  phone_country_code text NOT NULL CHECK (length(phone_country_code) BETWEEN 1 AND 10),
  phone_number text NOT NULL CHECK (length(btrim(phone_number)) BETWEEN 4 AND 30),
  business_name text NOT NULL CHECK (length(btrim(business_name)) BETWEEN 1 AND 200),
  business_email text CHECK (business_email IS NULL OR (business_email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' AND length(business_email) <= 320)),
  business_phone text CHECK (business_phone IS NULL OR length(btrim(business_phone)) BETWEEN 4 AND 30),
  full_business_address text CHECK (full_business_address IS NULL OR length(full_business_address) <= 500),
  address_line_1 text NOT NULL CHECK (length(btrim(address_line_1)) BETWEEN 1 AND 200),
  address_line_2 text CHECK (address_line_2 IS NULL OR length(address_line_2) <= 200),
  city text NOT NULL CHECK (length(btrim(city)) BETWEEN 1 AND 100),
  state text NOT NULL CHECK (length(btrim(state)) BETWEEN 1 AND 100),
  zip_code text NOT NULL CHECK (length(btrim(zip_code)) BETWEEN 2 AND 20),
  country text NOT NULL CHECK (length(btrim(country)) BETWEEN 2 AND 100),
  marketplace_platform text NOT NULL CHECK (marketplace_platform IN ('walmart', 'tiktok', 'ebay', 'multiple', 'other')),
  seller_account_status text CHECK (seller_account_status IS NULL OR length(seller_account_status) <= 100),
  notes text CHECK (notes IS NULL OR length(notes) <= 5000),
  status public.lead_status NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.business_credentials TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.business_credentials TO authenticated;
GRANT ALL ON public.business_credentials TO service_role;

ALTER TABLE public.business_credentials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit business credentials"
  ON public.business_credentials FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can read business credentials"
  ON public.business_credentials FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update business credentials"
  ON public.business_credentials FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete business credentials"
  ON public.business_credentials FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_business_credentials_updated_at
  BEFORE UPDATE ON public.business_credentials
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_business_credentials_created_at ON public.business_credentials (created_at DESC);
CREATE INDEX idx_business_credentials_status ON public.business_credentials (status);
CREATE INDEX idx_business_credentials_platform ON public.business_credentials (marketplace_platform);

-- =====================================================================
-- AUTO-GRANT ADMIN ROLE TO MITHON ON SIGNUP
-- =====================================================================
CREATE OR REPLACE FUNCTION public.grant_admin_if_allowlisted()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF lower(NEW.email) IN ('mithon.rayadvertising@gmail.com') THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_grant_admin ON auth.users;
CREATE TRIGGER on_auth_user_created_grant_admin
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.grant_admin_if_allowlisted();

-- Also grant admin to mithon if the account already exists
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role
FROM auth.users
WHERE lower(email) = 'mithon.rayadvertising@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;
