// ============================================================
//  JNEET+ AI — services/emailService.js  (NEW)
//  Sends transactional emails via Brevo's SMTP relay using
//  Nodemailer. Currently only used for the Forgot Password OTP
//  flow, but written generically (sendEmail helper) so any future
//  transactional email (e.g. welcome email, receipt) can reuse the
//  same transporter without duplicating SMTP setup.
//
//  Credentials come from Brevo dashboard → Settings → SMTP & API →
//  SMTP tab. EMAIL_FROM should be an address on your verified
//  domain (e.g. noreply@jneetai.com) — requires domain verification
//  in Brevo (adds DNS TXT records, free) for best deliverability;
//  until that's done, Brevo's own sending address will work too.
// ============================================================

import nodemailer from "nodemailer";
import { env } from "../config/env.js";

const transporter = nodemailer.createTransport({
  host: env.BREVO_SMTP_HOST,
  port: Number(env.BREVO_SMTP_PORT),
  secure: false, // Brevo uses STARTTLS on port 587, not implicit TLS
  auth: {
    user: env.BREVO_SMTP_USER,
    pass: env.BREVO_SMTP_PASS,
  },
});

async function sendEmail({ to, subject, html, text }) {
  await transporter.sendMail({
    from: `"JNEET+ AI" <${env.EMAIL_FROM}>`,
    to,
    subject,
    html,
    text,
  });
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