# Customer Dashboard → Premium Client Portal

Rebuild `/dashboard` as a sidebar-based client portal with Overview, Profile, Security, and section anchors. No document upload anywhere. All data scoped to logged-in user via existing RLS.

## Routes (new)

```
src/routes/_authenticated/dashboard.tsx        → layout (sidebar + Outlet)
src/routes/_authenticated/dashboard.index.tsx  → Overview (current dashboard content, upgraded)
src/routes/_authenticated/dashboard.profile.tsx
src/routes/_authenticated/dashboard.security.tsx
```

Old `src/routes/dashboard.tsx` is replaced — moved under `_authenticated/` so route gate handles auth redirect (removes manual redirect logic + flash).

## Layout

- Reuse site `Header` at top (unchanged public nav).
- Add `DashboardSidebar` component:
  - Brand block: "Ray Ecommerce / Client Portal" + user email
  - Menu: Overview, Profile, Security, Onboarding (#anchor on overview), Selected Service (#), Payments (#), Support (#), Recent Activity (#), Sign out
  - Active item = blue pill; collapses to Sheet drawer on mobile via `Sheet` from shadcn.
- Content area = max-w-6xl, spacious cards (reuse existing premium styling).

## Overview page

Keep current upgraded dashboard content (welcome, 4 summary cards, onboarding tracker [6 steps, no Documents], next action, selected service / payment / account detail, recent activity, support). Section IDs added for sidebar anchors.

## Profile page

- Header card: avatar (initials fallback), name, email, status badge, Change/Remove Photo buttons.
- Editable form (react-hook-form + zod): full_name, email (read-only), phone, company_name, selected_marketplace (Walmart / TikTok Shop / eBay).
- Business info (added to profiles): address_line_1, city, state, zip_code, country, website_url.
- Save → `supabase.from('profiles').update().eq('id', user.id)` + toast.
- Avatar: upload to `avatars` storage bucket (new, public), path `${user.id}/avatar.${ext}`, save URL to `profiles.avatar_url`. 2 MB max, jpg/png/webp.

## Security page

- Change Password card: current + new + confirm. Verify current via `signInWithPassword(email, current)`; on success call `updateUser({ password })`. Strength meter + show/hide. Toast results.
- Login Security card: last_sign_in_at, created_at, email_confirmed_at, password_last_updated_at (new column).
- Helper text card with security tips.
- "Forgot password" link → existing `/forgot-password`.

## Backend (one migration)

```sql
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS avatar_url text,
  ADD COLUMN IF NOT EXISTS address_line_1 text,
  ADD COLUMN IF NOT EXISTS city text,
  ADD COLUMN IF NOT EXISTS state text,
  ADD COLUMN IF NOT EXISTS zip_code text,
  ADD COLUMN IF NOT EXISTS country text,
  ADD COLUMN IF NOT EXISTS website_url text,
  ADD COLUMN IF NOT EXISTS password_last_updated_at timestamptz;
```

Existing profile RLS already lets user select/update own row — verify, no policy change needed.

Create public `avatars` storage bucket + RLS: anyone can read, owner can insert/update/delete their `${auth.uid()}/*` files.

## Bug-fix sweep

- Remove all document upload references project-wide (search `Documents`, `Upload`, `document`).
- Convert manual auth redirect in dashboard → use `_authenticated/` gate (fixes refresh flash, login-redirect issues).
- Guard null/undefined profile fields with `—` everywhere.
- Fix SVG hydration mismatch in PlatformLogo (`y1` precision) — round coords to 4 decimals.

## Technical notes

- Sidebar uses shadcn `Sidebar` primitives (already installed) with `SidebarProvider` wrapping only the dashboard layout, not the whole app.
- Forms: react-hook-form + zod (already in deps).
- Toasts: existing `sonner`.
- All file edits scoped to dashboard; public site, admin, onboarding flows untouched.

## Out of scope (per request)

- 2FA, logout-all-sessions (only add if fully functional → skip).
- Public website redesign.
- Admin panel changes (admin already reads profile fields; new columns flow through).

Please confirm and I'll implement.
