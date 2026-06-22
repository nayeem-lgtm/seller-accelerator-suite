# Ray Ecommerce — Production Backend & Admin Panel

## Architecture

Single full-stack app on Lovable Cloud (Postgres + Auth + edge runtime). No
separate VPS, no Express server. All backend logic runs as TanStack server
functions (`src/lib/*.functions.ts`). Frontend design was not modified —
only submit handlers were wired.

## Database schema

| Table | Purpose | Public insert? |
|---|---|---|
| `profiles` | One row per auth user (auto-created on signup) | No |
| `user_roles` | Role grants (`admin`, `user`). | Admin only |
| `plan_selections` | Pricing CTA submissions | ✅ |
| `business_credentials` | Onboarding business details + address | ✅ |
| `contracts` | Signed service agreements + signature image | ✅ |
| `payments` | Payment records (pending → paid/refunded) | ✅ |
| `contact_queries` | Contact form messages | ✅ |
| `ai_leads` | Ray AI lead captures | ✅ |
| `admin_audit_log` | Every admin action | Server only |

All admin-side reads/writes require `has_role(uid, 'admin')`. Public insert
policies are scoped to the form-submit columns only; reads are blocked.

## Server functions

### Public (called by forms)
`src/lib/submissions.functions.ts`
- `submitContactQuery` — wired to `/contact`
- `submitOnboarding` — wired to `/seller-onboarding` PaymentStep (creates
  plan_selection + business_credentials + contract + payment row in one
  atomic flow + sends admin and customer emails)
- `submitAiLead` — available; wire into Ray AI when ready

### Admin (require `has_role('admin')`)
`src/lib/admin.functions.ts`
- `adminOverview` — counts + revenue
- `listPlanSelections`, `listBusinessCredentials`, `listContracts`,
  `listPayments`, `listContactQueries`, `listAiLeads`
- `updateLeadStatus` — change status across all lead tables
- `updatePaymentStatus` — mark pending → paid/refunded
- `listAdminUsers`, `setUserRole` — manage admins
- `listAuditLog`, `meIsAdmin`

## Admin panel

Lives at `/admin` (protected by `_authenticated` + `has_role('admin')`).
Pages:

- `/admin` — overview (counts, revenue, recent contracts)
- `/admin/onboarding` — plan selections + business profiles tabs
- `/admin/contracts` — signed agreements with signature viewer
- `/admin/payments` — payments with pending/paid/refunded toggle
- `/admin/contacts` — contact inbox with reply-via-mailto
- `/admin/ai-leads` — AI lead captures
- `/admin/users` — grant/revoke admin role
- `/admin/audit` — every admin action logged

## Bootstrapping the first admin

The database trigger `grant_admin_if_allowlisted` auto-grants the `admin`
role to any user that signs up with `mithon.rayadvertising@gmail.com`. To
become admin:

1. Sign up at `/signup` using `mithon.rayadvertising@gmail.com`.
2. Log in — you'll see "Open Admin Panel" on `/dashboard`.

To add another admin: from the panel go to **Users & Roles → Grant admin**.
To add another seed email, edit the `grant_admin_if_allowlisted` function.

## Email notifications

`src/lib/notify.server.ts` sends transactional emails via Resend when the
`RESEND_API_KEY` env var is set. If unset, it logs a warning and skips the
email — the form still completes successfully.

Recipients:
- **Admin (`mithon.rayadvertising@gmail.com`)** — gets every new contact,
  onboarding, and AI lead.
- **Customer** — gets a thank-you confirmation after completing onboarding.

### To enable email

Connect the Resend connector in Lovable (Settings → Workspace → Connectors
→ Resend) OR set `RESEND_API_KEY` via the Add Secret tool. After connecting,
update `FROM_EMAIL` in `notify.server.ts` to a verified Resend domain
(currently uses the test sender `onboarding@resend.dev`).

## Security model

- Row-Level Security on every table
- Server functions validate every input with Zod
- `requireSupabaseAuth` middleware injects the user's RLS-bound client
- All admin reads/updates double-check `has_role(uid, 'admin')` before any
  DB access
- Admin actions are written to `admin_audit_log` with admin id + email
- Service-role client (`client.server.ts`) is NOT used for admin operations
  — RLS does the enforcement
- Anonymous inserts are scoped to the columns the public form populates

## What's deployed where

- Frontend + server functions: Lovable's edge runtime (`*.lovable.app`)
- Database + auth: Lovable Cloud (managed Postgres)
- No VPS, no PM2, no Nginx required

## What you still need to do before going live

1. **Sign up with `mithon.rayadvertising@gmail.com`** to claim the
   Super Admin role.
2. **Enable email sending** — connect Resend (one-click) and verify your
   sending domain (e.g. `noreply@rayadvertising.com`) inside Resend, then
   update `FROM_EMAIL` in `src/lib/notify.server.ts`.
3. **Real payment processing** — current PaymentStep records a *pending*
   payment in the DB and shows confirmation. To actually charge cards,
   integrate Stripe via the Lovable Stripe connector and update
   `submitOnboarding` to create a Stripe PaymentIntent before insert.
4. **Custom domain** — connect via Project Settings → Domain.
5. **Publish** — click Publish in Lovable. App becomes live at your
   custom domain.

## Files connected to the backend

- `src/routes/contact.tsx` — `submitContactQuery`
- `src/routes/seller-onboarding.tsx` (via `PaymentStep`) — `submitOnboarding`
- `src/routes/dashboard.tsx` — added "Open Admin Panel" link for admins
- `src/routes/_authenticated/route.tsx` — auth gate
- `src/routes/_authenticated/admin/*` — admin panel (8 pages)
- `src/lib/submissions.functions.ts` — public submit endpoints
- `src/lib/admin.functions.ts` — admin endpoints
- `src/lib/notify.server.ts` — email helper
- `src/lib/admin-ui.tsx` — admin UI helpers

## Frontend left untouched

No changes to: branding, colors, typography, layouts, hero sections, pricing
presentation, marketing pages, the AI chatbot UI, or any visual styling.
The only diff to user-visible code is wiring submit handlers + adding the
admin link on `/dashboard`.