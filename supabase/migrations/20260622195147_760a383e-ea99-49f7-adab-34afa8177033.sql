
-- Public submission RPCs (SECURITY DEFINER bypass RLS while still validating input).
CREATE OR REPLACE FUNCTION public.submit_contact_query(
  p_full_name text, p_email text, p_country_code text, p_phone text,
  p_marketplace text, p_query_type text, p_message text, p_source_page text
) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE v_id uuid;
BEGIN
  IF coalesce(length(trim(p_full_name)),0) = 0 OR coalesce(length(trim(p_email)),0) = 0
     OR coalesce(length(trim(p_phone)),0) = 0 OR coalesce(length(trim(p_message)),0) = 0 THEN
    RAISE EXCEPTION 'Missing required fields';
  END IF;
  IF length(p_message) > 5000 OR length(p_full_name) > 200 OR length(p_email) > 320 THEN
    RAISE EXCEPTION 'Field too long';
  END IF;
  INSERT INTO public.contact_queries(full_name,email,phone_country_code,phone_number,selected_service,query_type,message,source_page)
  VALUES(trim(p_full_name),lower(trim(p_email)),trim(p_country_code),trim(p_phone),
         NULLIF(trim(p_marketplace),''),NULLIF(trim(p_query_type),''),trim(p_message),NULLIF(trim(p_source_page),''))
  RETURNING id INTO v_id;
  RETURN v_id;
END $$;
REVOKE ALL ON FUNCTION public.submit_contact_query(text,text,text,text,text,text,text,text) FROM public;
GRANT EXECUTE ON FUNCTION public.submit_contact_query(text,text,text,text,text,text,text,text) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.submit_ai_lead(
  p_name text, p_email text, p_phone text, p_message text, p_snippet text, p_source_page text
) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE v_id uuid;
BEGIN
  IF coalesce(length(trim(p_message)),0) = 0 THEN RAISE EXCEPTION 'Missing message'; END IF;
  IF length(p_message) > 5000 THEN RAISE EXCEPTION 'Message too long'; END IF;
  INSERT INTO public.ai_leads(name,email,phone,message,conversation_snippet,source_page)
  VALUES(NULLIF(trim(p_name),''),NULLIF(lower(trim(p_email)),''),NULLIF(trim(p_phone),''),
         trim(p_message),NULLIF(p_snippet,''),NULLIF(trim(p_source_page),''))
  RETURNING id INTO v_id;
  RETURN v_id;
END $$;
REVOKE ALL ON FUNCTION public.submit_ai_lead(text,text,text,text,text,text) FROM public;
GRANT EXECUTE ON FUNCTION public.submit_ai_lead(text,text,text,text,text,text) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.submit_onboarding(p jsonb)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE
  v_plan_id uuid; v_bc_id uuid; v_contract_id uuid;
  v_platforms text[]; v_platform_label text;
BEGIN
  v_platforms := ARRAY(SELECT jsonb_array_elements_text(p->'platforms'));
  IF coalesce(array_length(v_platforms,1),0) = 0 THEN RAISE EXCEPTION 'No platforms'; END IF;
  v_platform_label := CASE WHEN array_length(v_platforms,1)=1 THEN v_platforms[1] ELSE 'multiple' END;

  INSERT INTO public.plan_selections(full_name,email,phone_country_code,phone_number,platform_selected,plan_selected,payment_choice)
  VALUES(p->>'clientName', lower(p->>'clientEmail'), p->>'countryCode', p->>'phone',
         v_platforms[1], array_to_string(v_platforms,'+'), 'yes')
  RETURNING id INTO v_plan_id;

  IF coalesce(p->>'addressLine1','')<>'' AND coalesce(p->>'city','')<>'' AND coalesce(p->>'state','')<>''
     AND coalesce(p->>'zipCode','')<>'' AND coalesce(p->>'country','')<>'' THEN
    INSERT INTO public.business_credentials(full_name,email,phone_country_code,phone_number,business_name,
      address_line_1,city,state,zip_code,country,marketplace_platform,seller_account_status,notes)
    VALUES(p->>'clientName', lower(p->>'clientEmail'), p->>'countryCode', p->>'phone',
           coalesce(NULLIF(p->>'businessName',''), p->>'clientName'),
           p->>'addressLine1', p->>'city', p->>'state', p->>'zipCode', p->>'country',
           v_platform_label, NULLIF(p->>'sellerAccountStatus',''), NULLIF(p->>'notes',''))
    RETURNING id INTO v_bc_id;
  END IF;

  INSERT INTO public.contracts(client_name,client_email,platforms,branch,total_amount,signature_data_url,
    agreed_terms,agreed_authorization,plan_selection_id,business_credentials_id)
  VALUES(p->>'clientName', lower(p->>'clientEmail'), v_platforms, p->>'branch',
         (p->>'totalAmount')::numeric, p->>'signatureDataUrl',
         (p->>'agreedTerms')::boolean, (p->>'agreedAuthorization')::boolean, v_plan_id, v_bc_id)
  RETURNING id INTO v_contract_id;

  INSERT INTO public.payments(client_name,client_email,platforms,amount,currency,payment_method,
    payment_status,plan_selection_id,contract_id)
  VALUES(p->>'clientName', lower(p->>'clientEmail'), v_platforms, (p->>'totalAmount')::numeric, 'USD',
         p->>'paymentMethod', 'pending', v_plan_id, v_contract_id);

  RETURN jsonb_build_object('planId', v_plan_id, 'contractId', v_contract_id);
END $$;
REVOKE ALL ON FUNCTION public.submit_onboarding(jsonb) FROM public;
GRANT EXECUTE ON FUNCTION public.submit_onboarding(jsonb) TO anon, authenticated;

DROP FUNCTION IF EXISTS public.whoami();
NOTIFY pgrst, 'reload schema';
