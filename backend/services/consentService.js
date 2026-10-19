// ============================================================
//  JNEET+ AI — services/consentService.js
//  Parental approval for users under 18 (DPDP Act 2023 treats
//  everyone under 18 as a child).
//
//  Flow:
//    1. Student (under 18) signs up and gives a parent/guardian email.
//    2. After the student verifies their own email, a single-use,
//       7-day approval link is emailed to the parent.
//    3. The parent opens the link, confirms they are an adult
//       parent/guardian and approves. We record timestamp, IP,
//       user-agent, notice version and method.
//    4. The parent gets a confirmation mail with a withdraw link.
//       Withdrawing switches the AI mentor off again.
//
//  Until approval, only the AI mentor is locked (it sends the
//  student's text to a third-party AI provider). Mock tests,
//  revision and notes keep working.
//
//  NOTE: this is "email-link consent". It is a reasonable, auditable
//  first step — it is NOT a government-ID-grade verification of the
//  parent. Have a lawyer confirm it satisfies DPDP Rule 10 before
//  the child-data provisions take effect (expected May 2027).
// ============================================================

import crypto from "crypto";
import User from "../models/User.js";
import { env } from "../config/env.js";
import { PARENT_CONSENT_TTL_MS, PRIVACY_VERSION } from "../config/legal.js";
import { normalizeEmail } from "../utils/email.js";
import {
  sendParentConsentRequest,
  sendParentConsentConfirmation,
} from "./emailService.js";

export const PARENT_RESEND_COOLDOWN_MS = 5 * 60 * 1000;

export function hashToken(raw) {
  return crypto.createHash("sha256").update(String(raw)).digest("hex");
}

function newRawToken() {
  return crypto.randomBytes(32).toString("hex");
}

export function approveUrl(rawToken) {
  return `${env.APP_URL}/parent-consent/${rawToken}`;
}
export function revokeUrl(rawToken) {
  return `${env.APP_URL}/parent-consent/revoke/${rawToken}`;
}

// Creates a fresh approval link and emails it to the parent.
// Returns { sent: boolean, error?: string }. Never throws for mail errors.
export async function requestParentConsent(user, { parentEmail } = {}) {
  const email = (parentEmail ?? user.consent?.parentEmail ?? "").toLowerCase().trim();
  if (!email) return { sent: false, error: "No parent email on file." };

  const raw = newRawToken();
  user.consent.parentEmail = email;
  user.consent.parentStatus = "pending";
  user.consent.parentRequestedAt = new Date();
  user.consent.parentTokenHash = hashToken(raw);
  user.consent.parentTokenExpiresAt = new Date(Date.now() + PARENT_CONSENT_TTL_MS);
  user.consent.parentRevokeTokenHash = null;
  await user.save({ validateBeforeSave: false });

  try {
    await sendParentConsentRequest(email, {
      studentName: user.name,
      approveUrl: approveUrl(raw),
    });
    return { sent: true };
  } catch (err) {
    console.error("[Consent] Failed to email parent:", err.message);
    return { sent: false, error: "We couldn't email your parent right now. Please try again in a few minutes." };
  }
}

async function findByApproveToken(raw) {
  if (!raw || typeof raw !== "string" || raw.length < 32) return null;
  return User.findOne({ "consent.parentTokenHash": hashToken(raw) }).select(
    "+consent.parentTokenHash +consent.parentTokenExpiresAt +consent.parentRevokeTokenHash"
  );
}

async function findByRevokeToken(raw) {
  if (!raw || typeof raw !== "string" || raw.length < 32) return null;
  return User.findOne({ "consent.parentRevokeTokenHash": hashToken(raw) }).select(
    "+consent.parentTokenHash +consent.parentTokenExpiresAt +consent.parentRevokeTokenHash"
  );
}

function firstName(name) {
  return String(name ?? "").trim().split(/\s+/)[0] || "your child";
}

// Public, read-only summary shown on the parent page.
export async function describeApproveToken(raw) {
  const user = await findByApproveToken(raw);
  if (!user || !user.isActive) return { state: "invalid" };
  if (user.consent.parentStatus === "granted") return { state: "already_granted", studentName: firstName(user.name) };
  if (!user.consent.parentTokenExpiresAt || user.consent.parentTokenExpiresAt.getTime() < Date.now()) {
    return { state: "expired", studentName: firstName(user.name) };
  }
  return {
    state: "ready",
    studentName: firstName(user.name),
    examMode: user.examMode,
  };
}

export async function approveWithToken(raw, { ip, userAgent }) {
  const user = await findByApproveToken(raw);
  if (!user || !user.isActive) return { ok: false, status: 404, error: "This approval link is not valid." };

  if (!user.consent.parentTokenExpiresAt || user.consent.parentTokenExpiresAt.getTime() < Date.now()) {
    return { ok: false, status: 410, error: "This approval link has expired. Ask your child to send a new one from the app." };
  }

  const revokeRaw = newRawToken();

  user.consent.parentStatus = "granted";
  user.consent.parentDecidedAt = new Date();
  user.consent.parentDecidedIp = ip ?? null;
  user.consent.parentDecidedUa = (userAgent ?? "").slice(0, 300);
  user.consent.parentMethod = "email_link";
  user.consent.parentNoticeVersion = PRIVACY_VERSION;
  user.consent.parentTokenHash = null;
  user.consent.parentTokenExpiresAt = null;
  user.consent.parentRevokeTokenHash = hashToken(revokeRaw);
  await user.save({ validateBeforeSave: false });

  // Best effort — approval is already recorded even if this mail fails.
  sendParentConsentConfirmation(user.consent.parentEmail, {
    studentName: user.name,
    revokeUrl: revokeUrl(revokeRaw),
  }).catch((err) => console.error("[Consent] Confirmation mail failed:", err.message));

  return { ok: true, studentName: firstName(user.name) };
}

export async function describeRevokeToken(raw) {
  const user = await findByRevokeToken(raw);
  if (!user || !user.isActive) return { state: "invalid" };
  return { state: "ready", studentName: firstName(user.name) };
}

export async function revokeWithToken(raw, { ip, userAgent }) {
  const user = await findByRevokeToken(raw);
  if (!user || !user.isActive) return { ok: false, status: 404, error: "This link is not valid or was already used." };

  user.consent.parentStatus = "revoked";
  user.consent.parentDecidedAt = new Date();
  user.consent.parentDecidedIp = ip ?? null;
  user.consent.parentDecidedUa = (userAgent ?? "").slice(0, 300);
  user.consent.parentMethod = "email_link_revoke";
  user.consent.parentRevokeTokenHash = null;
  await user.save({ validateBeforeSave: false });

  return { ok: true, studentName: firstName(user.name) };
}

// Used when a student (re)sets the parent's email: must differ from
// the student's own mailbox, otherwise "parent approval" is self-approval.
export function parentEmailIsSelf(studentEmail, parentEmail) {
  return normalizeEmail(studentEmail) === normalizeEmail(parentEmail);
}
