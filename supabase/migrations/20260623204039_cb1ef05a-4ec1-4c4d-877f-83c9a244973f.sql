-- Add shahibuzzaman.rayadvertising@gmail.com as a Super Admin (owner)
-- 1. Update allowlist trigger to include the new email for future signups
CREATE OR REPLACE FUNCTION public.grant_admin_if_allowlisted()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF lower(NEW.email) IN (
    'mithon.rayadvertising@gmail.com',
    'shahibuzzaman.rayadvertising@gmail.com'
  ) THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin')
      ON CONFLICT (user_id, role) DO NOTHING;
    INSERT INTO public.admin_profiles (user_id, level, is_active) VALUES (NEW.id, 'owner', true)
      ON CONFLICT (user_id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$function$;

-- 2. If the user already exists in auth.users, grant Owner access now (idempotent)
DO $$
DECLARE v_uid uuid;
BEGIN
  SELECT id INTO v_uid FROM auth.users
   WHERE lower(email) = 'shahibuzzaman.rayadvertising@gmail.com'
   LIMIT 1;

  IF v_uid IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role)
      VALUES (v_uid, 'admin')
      ON CONFLICT (user_id, role) DO NOTHING;

    INSERT INTO public.admin_profiles (user_id, level, is_active)
      VALUES (v_uid, 'owner', true)
      ON CONFLICT (user_id) DO UPDATE
        SET level = 'owner', is_active = true;

    INSERT INTO public.admin_audit_log (actor_id, action, target_type, target_id, metadata)
      VALUES (v_uid, 'admin_seeded', 'user', v_uid::text,
              jsonb_build_object('email','shahibuzzaman.rayadvertising@gmail.com','level','owner'));
  END IF;
END $$;