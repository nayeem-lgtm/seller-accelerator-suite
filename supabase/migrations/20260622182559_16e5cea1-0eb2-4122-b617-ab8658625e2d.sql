
-- ===== contracts =====
CREATE TABLE public.contracts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name text NOT NULL,
  client_email text,
  platforms text[] NOT NULL,
  branch text NOT NULL,
  total_amount numeric(10,2) NOT NULL DEFAULT 0,
  signature_data_url text NOT NULL,
  agreed_terms boolean NOT NULL DEFAULT false,
  agreed_authorization boolean NOT NULL DEFAULT false,
  signed_ip text,
  user_agent text,
  status lead_status NOT NULL DEFAULT 'new',
  plan_selection_id uuid REFERENCES public.plan_selections(id) ON DELETE SET NULL,
  business_credentials_id uuid REFERENCES public.business_credentials(id) ON DELETE SET NULL,
  signed_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT contracts_client_name_check CHECK (length(btrim(client_name)) BETWEEN 1 AND 200),
  CONSTRAINT contracts_branch_check CHECK (branch IN ('existing','create')),
  CONSTRAINT contracts_signature_check CHECK (length(signature_data_url) BETWEEN 10 AND 500000)
);
GRANT INSERT ON public.contracts TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.contracts TO authenticated;
GRANT ALL ON public.contracts TO service_role;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit a contract" ON public.contracts
  FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins can read contracts" ON public.contracts
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update contracts" ON public.contracts
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete contracts" ON public.contracts
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_contracts_updated_at BEFORE UPDATE ON public.contracts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_contracts_created_at ON public.contracts (created_at DESC);
CREATE INDEX idx_contracts_status ON public.contracts (status);

-- ===== payments =====
CREATE TABLE public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name text NOT NULL,
  client_email text,
  platforms text[] NOT NULL,
  amount numeric(10,2) NOT NULL,
  currency text NOT NULL DEFAULT 'USD',
  payment_method text NOT NULL,
  payment_status text NOT NULL DEFAULT 'pending',
  reference_id text,
  notes text,
  plan_selection_id uuid REFERENCES public.plan_selections(id) ON DELETE SET NULL,
  contract_id uuid REFERENCES public.contracts(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT payments_amount_check CHECK (amount >= 0),
  CONSTRAINT payments_method_check CHECK (payment_method IN ('card','bank','wallet','other')),
  CONSTRAINT payments_status_check CHECK (payment_status IN ('pending','paid','failed','refunded'))
);
GRANT INSERT ON public.payments TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.payments TO authenticated;
GRANT ALL ON public.payments TO service_role;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit a payment" ON public.payments
  FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins can read payments" ON public.payments
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update payments" ON public.payments
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete payments" ON public.payments
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_payments_updated_at BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_payments_created_at ON public.payments (created_at DESC);
CREATE INDEX idx_payments_status ON public.payments (payment_status);

-- ===== ai_leads =====
CREATE TABLE public.ai_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  email text,
  phone text,
  message text NOT NULL,
  conversation_snippet text,
  source_page text,
  status lead_status NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT ai_leads_message_check CHECK (length(btrim(message)) BETWEEN 1 AND 5000),
  CONSTRAINT ai_leads_email_check CHECK (email IS NULL OR email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$')
);
GRANT INSERT ON public.ai_leads TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.ai_leads TO authenticated;
GRANT ALL ON public.ai_leads TO service_role;
ALTER TABLE public.ai_leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit an AI lead" ON public.ai_leads
  FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins can read ai leads" ON public.ai_leads
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update ai leads" ON public.ai_leads
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete ai leads" ON public.ai_leads
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_ai_leads_updated_at BEFORE UPDATE ON public.ai_leads
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_ai_leads_created_at ON public.ai_leads (created_at DESC);

-- ===== admin_audit_log =====
CREATE TABLE public.admin_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  admin_email text,
  action text NOT NULL,
  target_table text,
  target_id uuid,
  details jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.admin_audit_log TO authenticated;
GRANT ALL ON public.admin_audit_log TO service_role;
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can read audit log" ON public.admin_audit_log
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE INDEX idx_admin_audit_log_created_at ON public.admin_audit_log (created_at DESC);
