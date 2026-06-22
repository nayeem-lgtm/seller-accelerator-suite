# Admin Invite (Pre-create + Temp Password)

Owner invites someone by email at the **Owner** level. The system creates the auth account immediately with a generated temp password, grants the Owner role, and emails the credentials with a link to sign in and reset their password.

## User flow

1. Owner opens `/admin/users` → new **"Invite admin"** button (Owner-only).
2. Dialog: email + optional full name. Level is fixed to **Owner**.
3. Server fn `inviteAdmin` (Owner-only):
   - Generates a 16-char temp password (crypto random, mixed case + digits + symbol).
   - Calls `supabaseAdmin.auth.admin.createUser({ email, password, email_confirm: true, user_metadata: { full_name, invited_by } })`.
   - Inserts `user_roles` (admin) + `admin_profiles` (level=`owner`, is_active=true) for the new user id.
   - Inserts an `admin_audit_log` row.
   - Sends an email via Resend (`notifyAdminInvite`) with: temp password, **Sign in** link to `/login?reset=1`, and a note that they must change the password on first login.
4. Login route detects `?reset=1` → after successful login, redirects to `/reset-password` (existing page) to force a new password.
5. If the email already exists in auth, return a friendly error ("user already exists — grant admin from the Users list instead").

## UI changes

- `src/routes/_authenticated/admin/users.tsx`:
  - Add Owner-only **"Invite admin"** button + shadcn `Dialog` with `Input` (email), `Input` (full name, optional), Submit.
  - On success, toast and invalidate the users list.
- Keep the existing Grant/Revoke/Level/Active controls unchanged.

## Server functions (`src/lib/admin.functions.ts`)

- `inviteAdmin({ email, fullName? })`:
  - `requireSupabaseAuth` + Owner check (existing `is_owner` / `has_role`).
  - Dynamic `await import('@/integrations/supabase/client.server')` inside handler.
  - `auth.admin.createUser` → on duplicate, throw clear message.
  - Insert user_roles + admin_profiles (idempotent `ON CONFLICT DO NOTHING`).
  - Audit log entry: action=`admin_invited`, target_user_id, by=context.userId.
  - Call `notifyAdminInvite` and return `{ userId }`.

## Email (`src/lib/notify.server.ts`)

Add `notifyAdminInvite({ to, fullName, tempPassword, loginUrl })` using the existing branded `wrap()` template. Contents:
- Greeting with name.
- "You've been granted Owner access to Ray Ecommerce admin."
- Monospace box with email + temp password.
- CTA button → `loginUrl` (`https://<site>/login?reset=1`).
- Security note: change password immediately.

Site URL comes from `process.env.SITE_URL` with fallback to request origin via `getRequestHost()`.

## Login redirect (`src/routes/login.tsx`)

Read `?reset=1` from search params. On successful sign-in, if present, `navigate({ to: '/reset-password' })` instead of the default destination. No other behavior changes.

## Database

No new tables. Uses existing `user_roles`, `admin_profiles`, `admin_audit_log`. No migration required unless `admin_audit_log` lacks an `admin_invited` action — current schema accepts free-form action text, so no change needed.

## Security notes

- Temp password generated server-side with `crypto.randomBytes`, never logged.
- Only Owners can call `inviteAdmin` (server-side role check + RLS-backed `is_owner`).
- New account is created with `email_confirm: true` so the invitee can log in immediately; we still strongly prompt password reset on first login via `?reset=1`.
- The temp password is included in the email body once and never stored beyond the auth row's hash.
- Audit log records who invited whom.

## Out of scope

- Inviting at Manager / Support levels (current request: Owner only).
- Magic-link or tokenized signup flows.
- Bulk invite / CSV.
- Forcing password reset via Supabase's "must change password" flag (not natively supported; we use the `?reset=1` redirect instead).