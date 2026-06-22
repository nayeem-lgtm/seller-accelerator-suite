# Native Backend + Admin Panel — Build Plan

Building entirely on Lovable Cloud (Postgres + RLS + server functions). No external VPS needed. Super Admin and notifications: `mithon.rayadvertising@gmail.com`.

## What already exists
- Tables: `profiles`, `user_roles`, `plan_selections`, `business_credentials`, `contact_queries`
- RLS + admin policies via `has_role(user_id, 'admin')`
- Auto-grant admin trigger for `mithon.rayadvertising@gmail.com`
- Auth (email/password) + `/dashboard` (customer-side)

## What's missing (will build)

### Phase 1 — Database (one migration)
- `contracts` — signed service agreements (client name, signature data URL, agreed flags, platforms, total, IP, user agent, signed_at)
- `payments` — payment intents/records (amount, method, status, client name/email, platforms, reference id)
- `ai_leads` — Ray AI lead captures (name, email, message, source)
- `admin_audit_log` — admin actions (who, what, target table, target id, timestamp)
- All with proper GRANTs, RLS (admin read/update, anon insert where appropriate), and timestamp triggers

### Phase 2 — Wire existing frontend forms to persist + email
- `/contact` → insert into `contact_queries` + email notify
- `/seller-onboarding` PaymentStep → insert into `plan_selections` + `business_credentials` + `contracts` + `payments` + email notify
- Ray AI lead capture → insert into `ai_leads` + email notify
- Server functions in `src/lib/*.functions.ts` (anon-callable for public forms)

### Phase 3 — Email notifications
- Connect Resend connector for transactional emails
- Send to `mithon.rayadvertising@gmail.com` on every new submission with full details
- Send customer confirmation email back to the submitter

### Phase 4 — Admin Panel at `/admin` (gated by `has_role('admin')`)
- `/admin` — overview dashboard (counts, recent activity, charts)
- `/admin/onboarding` — plan selections + business credentials submissions, status workflow (new → contacted → qualified → won/lost), detail view
- `/admin/contracts` — signed contracts list, view signature, download
- `/admin/payments` — payments list, mark paid/refunded, filters
- `/admin/contacts` — contact queries inbox, reply via mailto, status
- `/admin/ai-leads` — Ray AI lead captures
- `/admin/users` — list profiles, grant/revoke admin role
- `/admin/audit` — admin action log

All admin pages live under `src/routes/_authenticated/admin/` with a `has_role('admin')` gate that redirects non-admins.

### Phase 5 — Production polish
- SEO meta on every admin page (noindex)
- Rate limiting note on public insert endpoints (RLS-only acceptable for low-volume)
- Documentation: how to add new admins, where data lives, how to deploy

## Tech approach (frontend stays untouched)
- All form components keep current UI; only their submit handlers gain a server-function call
- Server functions use the publishable client for anon inserts and `requireSupabaseAuth` + role check for admin reads/updates
- Admin panel is built fresh with the existing shadcn/Tailwind tokens — same look as the marketing site (white/blue brand)

## Starting now: Phase 1 migration
Proceeding with the database migration for `contracts`, `payments`, `ai_leads`, `admin_audit_log` next.
