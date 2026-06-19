# Ray Ecommerce — Content, Flow & Onboarding Update

I'll keep the existing visual identity (premium SaaS, rounded cards, blue accents, soft shadows). Only the content, layout, routes, forms, and flow logic listed below change.

## 1. Homepage Trust Badge
- Replace `TrustBadge` content in `src/routes/index.tsx` hero with a wide approved-Solution-Provider card: Walmart spark + bold title on the left, shield + supporting line on the right.
- Add small microcopy under it. Fully responsive (stacks on mobile).

## 2. Services Dropdown
- In `src/components/site/Header.tsx`: remove the "View all services" item, swap icons to real `PlatformLogo` marks for Walmart / TikTok Shop / eBay, keep heading "PLATFORMS WE MANAGE", links → `/walmart`, `/tiktok-shop`, `/ebay`.
- Leave `src/routes/services.tsx` in place (still reachable from footer/SEO) but unlink from the dropdown. Won't delete the route to avoid breaking other links.

## 3. Marketplace Subpages (`/walmart`, `/tiktok-shop`, `/ebay`)
- `HowItWorks.tsx`: rewrite Step 1 title/body per platform with the new package prices ($499 / $299 / $99) and "you retain full ownership" copy.
- Step 6: replace all "gross profit" wording with the new "net profit" paragraph; remove "minus fees" parentheticals on all three platforms.
- Revenue Flow section: rewrite copy in each `*.index.tsx` so flow line reads "Supplier → {Platform} Store → Customer Purchase → {Platform} Deposit/Payout → Your Account → Net Profit Review" with heading "{Platform} Revenue Flow", using the existing card style.
- Remove the standalone centered disclaimer + single CTA section (rendered by `FinalCTA`) from the three marketplace subpages only. Footer disclaimers stay.

## 4. Plans Page (`src/routes/pricing.tsx`)
- Remove "Plan Comparison" and "What May Cost Extra" sections.
- Add new "SERVICE COMPARISON" section: 3-column table (What's Included / Ray Ecommerce / Other Providers) with the 11 rows spec'd, blue check vs gray minus icons, responsive stacked cards on mobile.

## 5. Blog (`src/routes/blog.tsx`, `src/lib/blog-data.ts`, `src/routes/blog_.$slug.tsx`)
- Extend category filter chips with: Store Management, Seller Growth, Ad Management, Success Stories.
- Add 3 Success Stories posts + 2 Ad Management posts to `blog-data.ts` with unique titles, excerpts, categories, hero images (existing stock-style assets / image-gen if needed), and unique article bodies with disclaimers.
- Add "SELLER PROGRESS STORIES" section on the blog index showing Success Stories cards.
- Verify "Read Article" / "Read Story" buttons route to `/blog/:slug` (fix if they currently point to `/contact`).

## 6. Contact Page (`src/routes/contact.tsx`)
- Two-column layout on desktop: Calendly left, new query form right. Stacks on mobile (booking first).
- Query form fields per spec (Full Name, Email, Phone, Interested Marketplace, Query Type, Message, Preferred Contact Method) with zod validation, "Send Query" button, success state.
- Form submit: local toast success only (no backend wiring requested). Validation prevents empty/malformed submissions.

## 7. Seller Onboarding — Multi-package "Yes" path
This is the biggest change. Updates in `seller-onboarding.tsx`, `shared.tsx`, `PlatformForms.tsx`, `ContractStep.tsx`, `PaymentStep.tsx`:

- **State refactor**: replace single `platform: PlatformKey | null` with `platforms: PlatformKey[]`. Branch + per-platform form state keyed by platform.
- **Step 1 (Package)**: cards become multi-select with checkbox indicator, blue border on selected, dynamic selected-summary footer with line items + running total. Continue disabled until ≥1 selected.
- **Branch step**: unchanged (Yes / No).
- **Step 3 Credentials (Yes path only)**:
  - Remove `inviteEmail` field, replace with `loginPassword` (password input with eye-icon show/hide toggle), per platform.
  - Render one platform card section per selected platform (Walmart / TikTok Shop / eBay) using the spec'd fields (email, password, business display name, store URL, account status, notes).
  - Remove "Upload supporting documents" entirely from this Yes path. Keep doc uploads in the "No / create account" path unchanged.
  - Replace authorization checkbox text with the long spec'd wording, one checkbox per selected platform. Continue gated on all checked.
  - Replace the privacy/security note with the new spec'd wording (single combined note when multiple platforms selected).
- **Step 4 Contract**: new 12-section agreement body (Scope, Responsibilities, Compliance, Fee, Profit Sharing 60/40, Account Access & Ownership, Confidentiality, Term, Liability, Governing Law, Entire Agreement, Acceptance), dynamic platform names + legal name substitution, signature + name + acceptance checkboxes preserved.
- **Step 5 Payment**: order summary card lists each selected package with line price + computed total; Pay button shows total; confirmation screen lists each package.
- **Compatibility**: single-selection still works exactly like before; the "No" account-creation path remains single-platform (creation flow is platform-specific by design) and unchanged.

## Out of scope / explicit non-changes
- No global redesign, no font/color/token changes.
- Footer disclaimers untouched.
- `services.tsx` route stays as-is content-wise.
- Auth, database, payments backend wiring not added — payment step remains the existing demo form.
- No fake claims, no guarantees added anywhere.

## Verification after build
- Visit `/`, `/walmart`, `/tiktok-shop`, `/ebay`, `/pricing`, `/blog`, `/blog/<new-slug>`, `/contact`, `/seller-onboarding` to confirm visuals, links, mobile layout, console clean.
- Run the onboarding flow with 2 platforms selected end-to-end: Package → Branch (Yes) → Credentials (two cards, passwords toggle) → Contract (both platforms listed) → Payment (sum total).

If you approve, I'll execute these in batched edits. Want any change to scope before I start?