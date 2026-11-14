// ============================================================
//  JNEET+ AI — utils/plan.js
//  The plan a student ACTUALLY has right now. Every quota and every
//  API response goes through effectivePlan(), so an expired pass
//  drops back to Free the same second it ends — no cron job needed.
// ============================================================

import { calcAge, ADULT_AGE } from "./age.js";

export function effectivePlan(user, now = new Date()) {
  const plan = user?.plan ?? "free";
  if (plan === "free") return "free";
  const end = user.planExpiresAt ? new Date(user.planExpiresAt) : null;
  if (!end) return plan;                    // manual grant, no end date
  return end.getTime() > now.getTime() ? plan : "free";
}

export function planStatus(user, now = new Date()) {
  const plan = effectivePlan(user, now);
  const expiresAt = plan === "free" ? null : (user.planExpiresAt ?? null);
  const lapsed = plan === "free" && (user?.plan ?? "free") !== "free" && user.planExpiresAt
    ? new Date(user.planExpiresAt).toISOString()
    : null;
  return { plan, expiresAt, lapsedAt: lapsed };
}

// Can this account pay by itself? Adults only (a contract with a minor
// is not valid in India) — under-18s send their parent a payment link.
// Age from the date of birth when we have it (a student who turned 18
// since signup counts as an adult), else the age group from signup.
export function canPayDirectly(user, now = new Date()) {
  if (user?.dateOfBirth) {
    const age = calcAge(new Date(user.dateOfBirth), now);
    return age !== null && age >= ADULT_AGE;
  }
  return user?.consent?.ageGroup === "adult";
}
