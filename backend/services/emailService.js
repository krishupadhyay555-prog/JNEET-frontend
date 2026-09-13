// ============================================================
//  JNEET+ AI — services/emailService.js  (v2 — Brevo HTTPS API)
//  REWRITTEN: no longer uses Nodemailer + SMTP. Render's free tier
//  blocks all outbound traffic on SMTP ports (25/465/587), which
//  made the previous SMTP-based version silently unreachable in
//  production. This version calls Brevo's transactional email
//  REST API directly over plain HTTPS (port 443), which is never
//  blocked by any hosting provider. Uses Node's built-in fetch
//  (available natively since Node 18+, no extra dependency needed
//  — nodemailer can be uninstalled: `npm uninstall nodemailer`).
//
//  Get your API key from: Brevo dashboard → Settings → SMTP & API
//  → API Keys tab (NOT the SMTP tab — different key, different
//  purpose). EMAIL_FROM should be an address on your verified
//  sender/domain (until jneetai.com is domain-verified in Brevo,
//  use the email address your Brevo account itself is registered
//  under — Brevo allows sending from your own account email
//  immediately, no extra verification needed for that one address).
// ============================================================

import { env } from "../config/env.js";

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

async function sendEmail({ to, subject, html, text }) {
  if (!env.BREVO_API_KEY || !env.EMAIL_FROM) {
    throw new Error(
      "Email service is not configured (missing BREVO_API_KEY or EMAIL_FROM in environment variables)."
    );
  }

  const response = await fetch(BREVO_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "api-key": env.BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: { name: "JNEET+ AI", email: env.EMAIL_FROM },
      to: [{ email: to }],
      subject,
      htmlContent: html,
      textContent: text,
    }),
  });

  if (!response.ok) {
    const errBody = await response.text().catch(() => "");
    throw new Error(`Brevo API error (${response.status}): ${errBody}`);
  }
}

export async function sendPasswordResetOtp(toEmail, otp, studentName) {
  const safeName = studentName?.split(" ")[0] || "Student";

  const html = `
    <div style="font-family: 'DM Sans', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; color: #1a1a1a;">
      <h2 style="color: #7c3aed; margin-bottom: 4px;">JNEET+ AI</h2>
      <p>Hi ${safeName},</p>
      <p>We received a request to reset your password. Use the code below to continue:</p>
      <div style="background: #f4f0ff; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0;">
        <span style="font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #7c3aed;">${otp}</span>
      </div>
      <p style="font-size: 13px; color: #666;">This code is valid for <strong>10 minutes</strong>. If you didn't request a password reset, you can safely ignore this email — your password will not be changed.</p>
      <p style="font-size: 13px; color: #999; margin-top: 32px;">— The JNEET+ AI Team</p>
    </div>
  `;

  const text = `Hi ${safeName},\n\nYour JNEET+ AI password reset code is: ${otp}\n\nThis code is valid for 10 minutes. If you didn't request this, you can safely ignore this email.\n\n— The JNEET+ AI Team`;

  await sendEmail({
    to: toEmail,
    subject: "Your JNEET+ AI password reset code",
    html,
    text,
  });
}