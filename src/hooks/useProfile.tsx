import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export type Profile = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  company_name: string | null;
  selected_marketplace: string | null;
  avatar_url: string | null;
  address_line_1: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  country: string | null;
  website_url: string | null;
  onboarding_status: string | null;
  payment_status: string | null;
  password_last_updated_at: string | null;
  created_at: string | null;
  updated_at: string | null;
};

type Ctx = {
  profile: Profile | null;
  avatarUrl: string | null;
  loading: boolean;
  refresh: () => Promise<void>;
};

const ProfileContext = createContext<Ctx>({
  profile: null,
  avatarUrl: null,
  loading: true,
  refresh: async () => {},
});

const SELECT =
  "id,full_name,email,phone,company_name,selected_marketplace,avatar_url,address_line_1,city,state,zip_code,country,website_url,onboarding_status,payment_status,password_last_updated_at,created_at,updated_at";

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setAvatarUrl(null);
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from("profiles")
      .select(SELECT)
      .eq("id", user.id)
      .maybeSingle();
    const p = (data as Profile | null) ?? null;
    setProfile(p);
    if (p?.avatar_url) {
      const { data: signed } = await supabase.storage
        .from("avatars")
        .createSignedUrl(p.avatar_url, 3600);
      setAvatarUrl(signed?.signedUrl ?? null);
    } else {
      setAvatarUrl(null);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    setLoading(true);
    load();
  }, [load]);

  return (
    <ProfileContext.Provider value={{ profile, avatarUrl, loading, refresh: load }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  return useContext(ProfileContext);
}

export function initialsOf(name?: string | null, email?: string | null) {
  const src = (name || email || "?").trim();
  const parts = src.split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return src.slice(0, 2).toUpperCase();
}