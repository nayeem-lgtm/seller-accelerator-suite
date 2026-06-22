// Server-only email notification helper.
// Sends transactional emails via Resend if RESEND_API_KEY is set; otherwise no-ops.
// Never import from client-reachable modules at module scope.

const ADMIN_EMAIL = "mithon.rayadvertising@gmail.com";
const FROM_EMAIL = "Ray Ecommerce <onboarding@resend.dev>";

type SendOpts = {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
};

async function sendEmail({ to, subject, html, replyTo }: SendOpts): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn("[notify] RESEND_API_KEY not set — skipping email:", subject);
    return;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
    });
    if (!res.ok) {
      const t = await res.text();
      console.error("[notify] Resend error:", res.status, t);
    }
  } catch (err) {
    console.error("[notify] send failed:", err);
  }
}

function escape(s: unknown): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function table(rows: Array<[string, unknown]>): string {
  return `<table style="border-collapse:collapse;width:100%;font-family:-apple-system,Segoe UI,Roboto,sans-serif;font-size:14px">${rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 12px;border-bottom:1px solid #eee;color:#64748b;width:200px">${escape(
          k,
        )}</td><td style="padding:8px 12px;border-bottom:1px solid #eee;color:#0f172a"><strong>${escape(v)}</strong></td></tr>`,
    )
    .join("")}</table>`;
}

function wrap(title: string, body: string): string {
  return `<div style="background:#f8fafc;padding:24px;font-family:-apple-system,Segoe UI,Roboto,sans-serif">
    <div style="max-width:640px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0">
      <div style="background:linear-gradient(135deg,#2563eb,#1d4ed8);color:#fff;padding:20px 24px">
        <div style="font-size:11px;letter-spacing:.2em;text-transform:uppercase;opacity:.85">Ray Ecommerce</div>
        <div style="font-size:18px;font-weight:700;margin-top:4px">${escape(title)}</div>
      </div>
      <div style="padding:24px">${body}</div>
      <div style="padding:16px 24px;border-top:1px solid #e2e8f0;font-size:12px;color:#94a3b8">Ray Ecommerce · ecommerce@rayadvertising.com</div>
    </div>
  </div>`;
}

export async function notifyContactQuery(data: {
  fullName: string;
  email: string;
  phone: string;
  marketplace?: string | null;
  queryType?: string | null;
  message: string;
}): Promise<void> {
  await sendEmail({
    to: ADMIN_EMAIL,
    subject: `New contact query: ${data.fullName}`,
    replyTo: data.email,
    html: wrap(
      "New Contact Query",
      table([
        ["Name", data.fullName],
        ["Email", data.email],
        ["Phone", data.phone],
        ["Marketplace", data.marketplace ?? "—"],
        ["Query Type", data.queryType ?? "—"],
      ]) +
        `<div style="margin-top:16px"><div style="font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#64748b;margin-bottom:6px">Message</div><div style="padding:12px;background:#f8fafc;border-radius:8px;color:#0f172a;line-height:1.5;white-space:pre-wrap">${escape(
          data.message,
        )}</div></div>`,
    ),
  });
}

export async function notifyOnboardingSubmission(data: {
  clientName: string;
  clientEmail: string;
  platforms: string[];
  branch: string;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
}): Promise<void> {
  await sendEmail({
    to: ADMIN_EMAIL,
    subject: `New onboarding: ${data.clientName} — $${data.total.toFixed(2)}`,
    replyTo: data.clientEmail || undefined,
    html: wrap(
      "New Seller Onboarding",
      table([
        ["Client", data.clientName],
        ["Email", data.clientEmail || "—"],
        ["Platforms", data.platforms.join(", ")],
        ["Account type", data.branch === "existing" ? "Existing seller account" : "Account creation support"],
        ["Total", `$${data.total.toFixed(2)}`],
        ["Payment method", data.paymentMethod],
        ["Payment status", data.paymentStatus],
      ]),
    ),
  });
  if (data.clientEmail) {
    await sendEmail({
      to: data.clientEmail,
      subject: "We received your onboarding request",
      html: wrap(
        "Thank you — we received your request",
        `<p style="margin:0 0 12px;color:#0f172a;font-size:14px;line-height:1.6">Hi ${escape(
          data.clientName,
        )},</p>
         <p style="margin:0 0 12px;color:#0f172a;font-size:14px;line-height:1.6">Thanks for choosing Ray Ecommerce. Our team is reviewing your submission and will reach out within 1 business day to begin active onboarding.</p>
         ${table([
           ["Platforms", data.platforms.join(", ")],
           ["Total", `$${data.total.toFixed(2)}`],
         ])}
         <p style="margin:16px 0 0;color:#64748b;font-size:13px">Questions? Reply to this email or write to ecommerce@rayadvertising.com.</p>`,
      ),
    });
  }
}

export async function notifyAiLead(data: {
  name?: string | null;
  email?: string | null;
  message: string;
}): Promise<void> {
  await sendEmail({
    to: ADMIN_EMAIL,
    subject: `New Ray AI lead${data.email ? `: ${data.email}` : ""}`,
    replyTo: data.email ?? undefined,
    html: wrap(
      "New Ray AI Lead",
      table([
        ["Name", data.name ?? "—"],
        ["Email", data.email ?? "—"],
      ]) +
        `<div style="margin-top:16px"><div style="font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#64748b;margin-bottom:6px">Message</div><div style="padding:12px;background:#f8fafc;border-radius:8px;color:#0f172a;line-height:1.5;white-space:pre-wrap">${escape(
          data.message,
        )}</div></div>`,
    ),
  });
}