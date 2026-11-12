// ============================================================
//  JNEET+ AI — services/ai/policy.js
//  What happens when a student breaks the chat rules (18+ content or
//  abusive language). Strict, clear and fair — every message tells the
//  student exactly what the next step would be.
//
//    strike 1  → warning
//    strike 2  → final warning
//    strike 3  → AI chat paused for 1 hour
//    strike 4  → AI chat paused for 24 hours + remark in Analytics
//    strike 5  → AI chat LOCKED + remark
//                  · 18+ student: can unlock it after 24 hours by
//                    accepting the rules again
//                  · under-18 student: the parent/guardian gets ONE email
//                    with an approval link; the chat unlocks when they
//                    approve (the student can ask for the link again at
//                    most once every 24 hours)
//
//  A clean month (30 days without a strike) resets the count. A lock
//  stays until it is unlocked. After an unlock the count restarts at 4,
//  so one more strike locks the chat again.
//  Only the category and the time are stored — never the message text.
//  Distress messages are never touched by this (see safety.js).
// ============================================================

import crypto from "crypto";
import User from "../../models/User.js";
import { env } from "../../config/env.js";
import { sendParentSafetyLock } from "../emailService.js";

export const PAUSE_MS = 60 * 60 * 1000;
export const LONG_PAUSE_MS = 24 * 60 * 60 * 1000;
export const SELF_UNLOCK_AFTER_MS = 24 * 60 * 60 * 1000;
export const PARENT_LINK_TTL_MS = 7 * 24 * 60 * 60 * 1000;
export const PARENT_RESEND_COOLDOWN_MS = 24 * 60 * 60 * 1000;
export const WINDOW_MS = 30 * 24 * 60 * 60 * 1000;
export const STRIKES_AFTER_UNLOCK = 4;
const MAX_EVENTS = 30;

export function levelFor(strikes) {
  if (strikes <= 1) return "warning";
  if (strikes === 2) return "final_warning";
  if (strikes === 3) return "paused";
  if (strikes === 4) return "paused_24h";
  return "locked";
}

const WHAT = {
  adult: "18+ / adult content",
  abuse: "gaali / abusive language",
};

function ladder(minor) {
  return `**Aage ka niyam:** 2nd baar → final warning · 3rd → 1 ghanta chat band · 4th → 24 ghante band + Analytics mein remark · 5th → chat lock${minor ? " aur parent/guardian ko email" : ""}.`;
}

export function policyMessage(level, { category = "adult", minor = false } = {}) {
  const what = WHAT[category] ?? WHAT.adult;
  const keep = "Tests, Revision aur Notes chalte rahenge.";
  if (level === "warning") {
    return `I can't help with that. ${what} JNEET+ pe strictly allowed nahi hai — ye jagah sirf NEET UG / JEE Main ki padhai ke liye hai.\n\n**Warning 1 of 2.** ${ladder(minor)}\n\nKisi chapter ya concept ka doubt hai? Abhi poochho — main yahin hoon. 📚`;
  }
  if (level === "final_warning") {
    return `I can't help with that. ${what} hamari policy ke khilaaf hai — ye aapki **final warning (2 of 2)** hai.\n\nAgli baar AI chat **1 ghante ke liye band** ho jayegi. Uske baad bhi hua to 24 ghante band + Analytics remark, aur phir **chat lock**${minor ? " — saath mein aapke parent/guardian ko email jayega" : ""}.\n\n${keep} Chalo, padhai pe wapas — koi doubt bhejo.`;
  }
  if (level === "paused") {
    return `I can't help with that. Warnings ke baad bhi ${what} — isliye AI chat **1 ghante ke liye band** hai.\n\nAgli baar 24 ghante band + Analytics mein remark lagega, aur uske baad chat lock${minor ? " + parent/guardian ko email" : ""}. ${keep}`;
  }
  if (level === "paused_24h") {
    return `I can't help with that. Ye phir hua, isliye AI chat **24 ghante ke liye band** hai aur aapke Analytics mein ek **remark** jud gaya hai.\n\n**Agli baar chat lock ho jayegi**${minor ? " aur aapke parent/guardian ko email jayega" : ""}. ${keep}`;
  }
  return minor
    ? `I can't help with that. Baar-baar policy todne ki wajah se AI chat **lock** ho gayi hai, aur Analytics mein remark jud gaya hai.\n\nAapke parent/guardian ko ek email bheja gaya hai — unki approval ke baad chat khul jayegi. ${keep}`
    : `I can't help with that. Baar-baar policy todne ki wajah se AI chat **lock** ho gayi hai, aur Analytics mein remark jud gaya hai.\n\n24 ghante baad aap chat screen se rules dobara accept karke **unlock request** kar sakte ho. ${keep}`;
}

// ── helpers ─────────────────────────────────────────────────────
export function hashToken(raw) {
  return crypto.createHash("sha256").update(String(raw)).digest("hex");
}
export function parentUnlockUrl(raw) {
  return `${env.APP_URL}/parent-unlock/${raw}`;
}
const isMinor = (u) => u?.consent?.ageGroup === "minor";
const parentOf = (u) => (isMinor(u) && u?.consent?.parentStatus === "granted" ? u.consent.parentEmail : null);

// Creates a fresh single-use link and emails the parent. Never throws.
async function emailParentUnlock(userId, { studentName, parentEmail }, now) {
  const raw = crypto.randomBytes(32).toString("hex");
  await User.updateOne(
    { _id: userId },
    {
      $set: {
        "policy.unlockTokenHash": hashToken(raw),
        "policy.unlockTokenExpiresAt": new Date(now.getTime() + PARENT_LINK_TTL_MS),
        "policy.parentEmailedAt": now,
      },
    }
  );
  try {
    await sendParentSafetyLock(parentEmail, { studentName, approveUrl: parentUnlockUrl(raw) });
    return true;
  } catch (err) {
    console.error("[Policy] could not email parent about the lock:", err.message);
    return false;
  }
}

// Records a strike and returns what the student should be told.
export async function recordFlag(userId, { category = "adult", now = new Date() } = {}) {
  const user = await User.findById(userId).select("name policy consent").lean();
  const prev = user?.policy ?? {};
  const fresh = !prev.lastFlagAt || now.getTime() - new Date(prev.lastFlagAt).getTime() > WINDOW_MS;
  const strikes = (fresh ? 0 : prev.strikes ?? 0) + 1;
  const level = levelFor(strikes);
  const minor = isMinor(user);

  const pausedUntil =
    level === "paused" ? new Date(now.getTime() + PAUSE_MS)
    : level === "paused_24h" ? new Date(now.getTime() + LONG_PAUSE_MS)
    : null;

  const events = [{ at: now, kind: level, category }];
  const set = {
    "policy.strikes": strikes,
    "policy.lastFlagAt": now,
    ...(pausedUntil ? { "policy.pausedUntil": pausedUntil } : {}),
  };
  if (level === "locked") {
    Object.assign(set, { "policy.locked": true, "policy.lockedAt": now, "policy.pausedUntil": null });
  }

  await User.updateOne(
    { _id: userId },
    {
      $set: set,
      $inc: { "policy.flagsTotal": 1 },
      $push: { "policy.events": { $each: events, $slice: -MAX_EVENTS } },
    }
  );

  let parentEmailed = false;
  const parentEmail = level === "locked" ? parentOf(user) : null;
  if (parentEmail) parentEmailed = await emailParentUnlock(userId, { studentName: user.name, parentEmail }, now);

  return {
    level,
    strikes,
    category,
    pausedUntil,
    locked: level === "locked",
    parentEmailed,
    message: policyMessage(level, { category, minor }),
  };
}

// Back-compat name used by older code paths.
export const recordAdultFlag = (userId, now = new Date()) => recordFlag(userId, { category: "adult", now });

function lockState(user, now = Date.now()) {
  const p = user?.policy ?? {};
  if (!p.locked) return null;
  const minor = isMinor(user);
  const viaParent = Boolean(parentOf(user));
  const selfAt = p.lockedAt ? new Date(p.lockedAt).getTime() + SELF_UNLOCK_AFTER_MS : now;
  const lastMail = p.parentEmailedAt ? new Date(p.parentEmailedAt).getTime() : 0;
  return {
    lockedAt: p.lockedAt ? new Date(p.lockedAt).toISOString() : null,
    unlockVia: viaParent ? "parent" : "self",
    minor,
    unlockAvailableAt: viaParent ? null : new Date(selfAt).toISOString(),
    parentEmailedAt: viaParent && lastMail ? new Date(lastMail).toISOString() : null,
    canResendAt: viaParent ? new Date(lastMail + PARENT_RESEND_COOLDOWN_MS).toISOString() : null,
  };
}

export async function getLockState(userId) {
  const u = await User.findById(userId).select("policy consent").lean();
  return lockState(u);
}

async function unlock(userId, now, how) {
  await User.updateOne(
    { _id: userId },
    {
      $set: {
        "policy.locked": false,
        "policy.lockedAt": null,
        "policy.pausedUntil": null,
        "policy.strikes": STRIKES_AFTER_UNLOCK,
        "policy.lastFlagAt": now,
        "policy.unlockTokenHash": null,
        "policy.unlockTokenExpiresAt": null,
      },
      $push: { "policy.events": { $each: [{ at: now, kind: how }], $slice: -MAX_EVENTS } },
    }
  );
}

// Student asks to unlock. Adults: after 24 h. Minors: (re)send the parent link.
export async function requestUnlock(userId, now = new Date()) {
  const user = await User.findById(userId).select("name policy consent").lean();
  const state = lockState(user, now.getTime());
  if (!state) return { ok: false, status: 400, code: "NOT_LOCKED", error: "Your AI chat is not locked." };

  if (state.unlockVia === "parent") {
    const lastMail = state.parentEmailedAt ? new Date(state.parentEmailedAt).getTime() : 0;
    if (lastMail && now.getTime() - lastMail < PARENT_RESEND_COOLDOWN_MS) {
      return {
        ok: false, status: 429, code: "PARENT_ALREADY_EMAILED",
        error: "Aapke parent/guardian ko approval link pehle hi bheja ja chuka hai. Unse email check karne ko kaho.",
        lock: state,
      };
    }
    const sent = await emailParentUnlock(userId, { studentName: user.name, parentEmail: user.consent.parentEmail }, now);
    if (!sent) return { ok: false, status: 503, code: "EMAIL_FAILED", error: "Email abhi nahi ja paya. Thodi der baad dobara try karo." };
    await User.updateOne({ _id: userId }, { $push: { "policy.events": { $each: [{ at: now, kind: "unlock_requested" }], $slice: -MAX_EVENTS } } });
    return { ok: true, unlocked: false, sentToParent: true, lock: await getLockState(userId) };
  }

  if (now.getTime() < new Date(state.unlockAvailableAt).getTime()) {
    return {
      ok: false, status: 409, code: "UNLOCK_NOT_YET",
      error: "Lock ke 24 ghante baad hi unlock ho sakta hai.",
      lock: state,
    };
  }
  await unlock(userId, now, "unlocked");
  return { ok: true, unlocked: true };
}

// Parent link (public page).
async function findByUnlockToken(raw) {
  if (!raw || typeof raw !== "string" || raw.length < 32) return null;
  return User.findOne({ "policy.unlockTokenHash": hashToken(raw) })
    .select("name isActive policy.locked policy.unlockTokenExpiresAt")
    .lean();
}

const firstName = (name) => String(name ?? "").trim().split(/\s+/)[0] || "your child";

export async function describeParentUnlock(raw, now = new Date()) {
  const u = await findByUnlockToken(raw);
  if (!u || u.isActive === false) return { state: "invalid" };
  if (!u.policy?.locked) return { state: "already_unlocked", studentName: firstName(u.name) };
  if (!u.policy.unlockTokenExpiresAt || new Date(u.policy.unlockTokenExpiresAt).getTime() < now.getTime()) {
    return { state: "expired", studentName: firstName(u.name) };
  }
  return { state: "ready", studentName: firstName(u.name) };
}

export async function approveParentUnlock(raw, now = new Date()) {
  const u = await findByUnlockToken(raw);
  if (!u || u.isActive === false) return { ok: false, status: 404, error: "This link is not valid." };
  if (!u.policy?.locked) return { ok: true, alreadyUnlocked: true, studentName: firstName(u.name) };
  if (!u.policy.unlockTokenExpiresAt || new Date(u.policy.unlockTokenExpiresAt).getTime() < now.getTime()) {
    return { ok: false, status: 410, error: "This link has expired. Your child can ask for a new one from the app." };
  }
  await unlock(u._id, now, "unlocked_by_parent");
  return { ok: true, studentName: firstName(u.name) };
}

export async function getPolicySummary(userId) {
  const u = await User.findById(userId).select("policy consent").lean();
  const p = u?.policy ?? {};
  const now = Date.now();
  const stale = p.lastFlagAt && now - new Date(p.lastFlagAt).getTime() > WINDOW_MS;
  return {
    strikes: stale && !p.locked ? 0 : p.strikes ?? 0,
    flagsTotal: p.flagsTotal ?? 0,
    pausedUntil: p.pausedUntil && new Date(p.pausedUntil).getTime() > now ? new Date(p.pausedUntil).toISOString() : null,
    lock: lockState(u, now),
    events: (p.events ?? []).slice(-10).reverse().map((e) => ({ at: e.at, kind: e.kind, category: e.category ?? null })),
  };
}
