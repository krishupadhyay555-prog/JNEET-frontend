// ============================================================
//  JNEET+ AI — services/emailService.js  (v4 — reliable delivery)
//  CHANGED vs v3:
//    - 10s timeout + 1 retry on network errors / 5xx / 429 (Brevo
//      occasionally hiccups; a single retry removes most "OTP never
//      came" reports).
//    - sendEmail() now RETURNS { messageId } and throws a typed
//      EmailDeliveryError (with .status) so callers can show an
//      honest message instead of pretending the mail was sent.
//    - HTML-escapes every dynamic value (the student's name used to
//      be injected into the HTML raw).
//    - One shared, mobile-friendly template for every mail.
//    - New mails: login code, parent-consent request, parent-consent
//      confirmation (with a withdraw link).
//  Brevo HTTPS API is still used (Render blocks SMTP ports).
// ============================================================

import { env } from "../config/env.js";

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";
const REQUEST_TIMEOUT_MS = 10_000;
const MAX_ATTEMPTS = 2;

export class EmailDeliveryError extends Error {
  constructor(message, { status = null, retryable = false } = {}) {
    super(message);
    this.name = "EmailDeliveryError";
    this.status = status;
    this.retryable = retryable;
  }
}

export function isEmailConfigured() {
  return Boolean(env.BREVO_API_KEY && env.EMAIL_FROM);
}

export function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function firstName(name) {
  return (String(name ?? "").trim().split(/\s+/)[0] || "Student").slice(0, 30);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function sendEmail({ to, subject, html, text }) {
  if (!isEmailConfigured()) {
    throw new EmailDeliveryError(
      "Email service is not configured (missing BREVO_API_KEY or EMAIL_FROM).",
      { retryable: false }
    );
  }

  let lastError;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(BREVO_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "api-key": env.BREVO_API_KEY,
        },
        body: JSON.stringify({
          sender: { name: env.EMAIL_FROM_NAME, email: env.EMAIL_FROM },
          to: [{ email: to }],
          subject,
          htmlContent: html,
          textContent: text,
        }),
        signal: controller.signal,
      });

      if (response.ok) {
        const body = await response.json().catch(() => ({}));
        return { messageId: body?.messageId ?? null };
      }

      const retryable = response.status === 429 || response.status >= 500;
      const errBody = await response.text().catch(() => "");
      // Never log the api-key; Brevo's error body is safe to log.
      lastError = new EmailDeliveryError(
        `Brevo API error (${response.status}): ${errBody.slice(0, 300)}`,
        { status: response.status, retryable }
      );
      if (!retryable) throw lastError;
    } catch (err) {
      if (err instanceof EmailDeliveryError && !err.retryable) throw err;
      lastError =
        err instanceof EmailDeliveryError
          ? err
          : new EmailDeliveryError(
              err?.name === "AbortError" ? "Brevo request timed out." : `Network error: ${err?.message}`,
              { retryable: true }
            );
    } finally {
      clearTimeout(timer);
    }

    if (attempt < MAX_ATTEMPTS) await sleep(400 * attempt);
  }

  throw lastError;
}

// ── Shared template ─────────────────────────────────────────────
function layout({ preheader, heading, bodyHtml, footerHtml = "" }) {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;background:#f6f4fb;">
<span style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f4fb;padding:24px 12px;">
<tr><td align="center">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#ffffff;border-radius:16px;border:1px solid #ece6f5;font-family:'DM Sans',Arial,Helvetica,sans-serif;color:#1f1b2d;">
    <tr><td style="padding:28px 28px 8px;">
      <table role="presentation" cellpadding="0" cellspacing="0"><tr>
        <td style="padding-right:10px;vertical-align:middle;">
          <img src="${escapeHtml(env.APP_URL)}/icon-192.png" width="36" height="36" alt="JNEET+ AI" style="display:block;border-radius:9px;border:0;">
        </td>
        <td style="vertical-align:middle;font-size:18px;font-weight:700;color:#5b6ee1;">JNEET+ AI</td>
      </tr></table>
    </td></tr>
    <tr><td style="padding:8px 28px 4px;font-size:20px;font-weight:700;">${escapeHtml(heading)}</td></tr>
    <tr><td style="padding:8px 28px 24px;font-size:15px;line-height:1.55;">${bodyHtml}</td></tr>
    <tr><td style="padding:0 28px 28px;font-size:12px;line-height:1.5;color:#7a7590;">${footerHtml}<br>— Team JNEET+ AI</td></tr>
  </table>
</td></tr></table></body></html>`;
}

function codeBlock(code) {
  return `<div style="background:#f1efff;border-radius:12px;padding:18px;text-align:center;margin:18px 0;">
    <span style="font-size:32px;font-weight:700;letter-spacing:8px;color:#4b3fd1;font-family:'Courier New',monospace;">${escapeHtml(code)}</span>
  </div>`;
}

function button(href, label) {
  return `<p style="margin:22px 0;"><a href="${escapeHtml(href)}" style="background:#4b3fd1;color:#ffffff;text-decoration:none;padding:12px 22px;border-radius:10px;font-weight:600;display:inline-block;">${escapeHtml(label)}</a></p>
  <p style="font-size:12px;color:#7a7590;word-break:break-all;">Or paste this link into your browser:<br>${escapeHtml(href)}</p>`;
}

// ── OTP mails ───────────────────────────────────────────────────
export async function sendVerificationOtp(toEmail, otp, studentName) {
  const name = firstName(studentName);
  const html = layout({
    preheader: `Your JNEET+ AI verification code is ${otp}`,
    heading: "Verify your email",
    bodyHtml: `<p>Hi ${escapeHtml(name)}, welcome to JNEET+ AI! Enter this code to activate your account:</p>${codeBlock(otp)}
      <p>This code is valid for <strong>10 minutes</strong>.</p>`,
    footerHtml: "If you didn't create an account, you can safely ignore this email.",
  });
  const text = `Hi ${name},\n\nYour JNEET+ AI verification code is: ${otp}\n\nIt is valid for 10 minutes. If you didn't create an account, ignore this email.\n\n— Team JNEET+ AI`;
  return sendEmail({ to: toEmail, subject: `${otp} is your JNEET+ AI verification code`, html, text });
}

export async function sendPasswordResetOtp(toEmail, otp, studentName) {
  const name = firstName(studentName);
  const html = layout({
    preheader: `Your JNEET+ AI password reset code is ${otp}`,
    heading: "Reset your password",
    bodyHtml: `<p>Hi ${escapeHtml(name)}, use this code to reset your password:</p>${codeBlock(otp)}
      <p>This code is valid for <strong>10 minutes</strong>.</p>`,
    footerHtml: "If you didn't request this, ignore this email — your password will not change.",
  });
  const text = `Hi ${name},\n\nYour JNEET+ AI password reset code is: ${otp}\n\nIt is valid for 10 minutes. If you didn't request this, ignore this email.\n\n— Team JNEET+ AI`;
  return sendEmail({ to: toEmail, subject: `${otp} is your JNEET+ AI password reset code`, html, text });
}

export async function sendLoginOtp(toEmail, otp, studentName) {
  const name = firstName(studentName);
  const html = layout({
    preheader: `Your JNEET+ AI login code is ${otp}`,
    heading: "Your login code",
    bodyHtml: `<p>Hi ${escapeHtml(name)}, use this code to log in to JNEET+ AI:</p>${codeBlock(otp)}
      <p>This code is valid for <strong>10 minutes</strong>. Never share it with anyone.</p>`,
    footerHtml: "If you didn't try to log in, you can ignore this email — but consider changing your password.",
  });
  const text = `Hi ${name},\n\nYour JNEET+ AI login code is: ${otp}\n\nIt is valid for 10 minutes. Never share it. If this wasn't you, ignore this email.\n\n— Team JNEET+ AI`;
  return sendEmail({ to: toEmail, subject: `${otp} is your JNEET+ AI login code`, html, text });
}

// ── Parental consent mails ──────────────────────────────────────
export async function sendParentConsentRequest(parentEmail, { studentName, approveUrl }) {
  const student = firstName(studentName);
  const html = layout({
    preheader: `${student} wants to use JNEET+ AI — your approval is needed`,
    heading: "Parent / guardian approval needed",
    bodyHtml: `<p><strong>${escapeHtml(student)}</strong> signed up for <strong>JNEET+ AI</strong>, a NEET/JEE preparation app with practice tests, revision and an AI study mentor.</p>
      <p>Because ${escapeHtml(student)} is under 18, we need a parent or guardian to review and approve how the account works before the AI mentor can be used. Mock tests, revision and notes work without approval.</p>
      ${button(approveUrl, "Review and approve")}
      <p>The link is valid for <strong>7 days</strong>. You can withdraw approval at any time.</p>`,
    footerHtml: "If you don't know this student, ignore this email — no approval is recorded unless you open the link and confirm.",
  });
  const text = `${student} signed up for JNEET+ AI (NEET/JEE preparation app). Because they are under 18, a parent or guardian must approve before the AI mentor can be used.\n\nReview and approve: ${approveUrl}\n\nThe link is valid for 7 days. If you don't know this student, ignore this email.\n\n— Team JNEET+ AI`;
  return sendEmail({ to: parentEmail, subject: `Approval needed: ${student} signed up for JNEET+ AI`, html, text });
}

export async function sendParentConsentConfirmation(parentEmail, { studentName, revokeUrl }) {
  const student = firstName(studentName);
  const html = layout({
    preheader: "Approval recorded",
    heading: "Approval recorded",
    bodyHtml: `<p>Thank you. You approved ${escapeHtml(student)}'s use of JNEET+ AI, including the AI study mentor.</p>
      <p>You can withdraw this approval at any time using the link below. Withdrawing turns the AI mentor off for the account.</p>
      ${button(revokeUrl, "Withdraw approval")}`,
    footerHtml: "Keep this email — the link above is your way to withdraw approval later.",
  });
  const text = `You approved ${student}'s use of JNEET+ AI, including the AI study mentor.\n\nTo withdraw approval at any time: ${revokeUrl}\n\n— Team JNEET+ AI`;
  return sendEmail({ to: parentEmail, subject: "Approval recorded — JNEET+ AI", html, text });
}
