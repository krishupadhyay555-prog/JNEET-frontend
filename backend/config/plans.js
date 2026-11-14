// ============================================================
//  JNEET+ AI — config/plans.js
//  ONE source of truth for what can be bought (B4, 14 Nov 2026).
//    - Tiers: Free / Pro / Elite (names fixed by the founder, 12 Nov).
//    - Durations: 1 month (30 days) and 4 months (120 days).
//    - Prepaid passes, never auto-renew, non-refundable (ROADMAP §0).
//    - Prices are in PAISE and can be changed from Render env vars
//      (PRICE_PRO_1M, PRICE_PRO_4M, PRICE_ELITE_1M, PRICE_ELITE_4M,
//      whole rupees) without a code change. Defaults below are
//      placeholders until the founder confirms final prices (§9).
//  The browser never sends a price: it sends a planId and the server
//  looks the amount up here.
// ============================================================

import { env } from "./env.js";

export const TIER_RANK = { free: 0, pro: 1, elite: 2 };

export const DURATIONS = {
  "1m": { months: 1, days: 30 },
  "4m": { months: 4, days: 120 },
};

// What each tier gives. Shown on the Plans page; the AI numbers come
// from the same env vars the quota code uses, so they can never drift.
export function tierFeatures() {
  return {
    free: [
      `${env.AI_DAILY.free} AI doubts every day`,
      "Mock tests, revision and fill-in-the-blanks",
      "OneShot chapter notes",
      "Notes, WMS and progress tracking",
    ],
    pro: [
      `${env.AI_DAILY.pro} AI doubts every day`,
      "Deeper, step-by-step AI answers",
      "Everything in Free",
    ],
    elite: [
      `${env.AI_DAILY.elite} AI doubts every day`,
      `${env.AI_DEEP_MONTHLY_ELITE} "deep solve" answers every month (toughest numericals)`,
      "Everything in Pro",
    ],
  };
}

function rupees(name, fallback) {
  const v = Number.parseInt(env[name] ?? "", 10);
  return (Number.isFinite(v) && v > 0 ? v : fallback) * 100;
}

export function planCatalog() {
  return [
    { id: "pro_1m",   tier: "pro",   duration: "1m", amount: rupees("PRICE_PRO_1M", 199) },
    { id: "pro_4m",   tier: "pro",   duration: "4m", amount: rupees("PRICE_PRO_4M", 699) },
    { id: "elite_1m", tier: "elite", duration: "1m", amount: rupees("PRICE_ELITE_1M", 349) },
    { id: "elite_4m", tier: "elite", duration: "4m", amount: rupees("PRICE_ELITE_4M", 1199) },
  ].map((p) => ({ ...p, ...DURATIONS[p.duration], currency: "INR" }));
}

export function getPlan(planId) {
  return planCatalog().find((p) => p.id === planId) ?? null;
}

// Value of one day of a tier, in paise (from its 1-month price). Used to
// convert unused days fairly when a student moves from Pro to Elite.
export function dailyValue(tier) {
  if (tier === "free") return 0;
  const monthly = getPlan(`${tier}_1m`);
  return monthly ? monthly.amount / monthly.days : 0;
}

// Payments switch on only when BOTH Razorpay keys are set on Render.
export function paymentsEnabled() {
  return Boolean(env.RAZORPAY_KEY_ID && env.RAZORPAY_KEY_SECRET);
}

export function publicCatalog() {
  return {
    enabled: paymentsEnabled(),
    currency: "INR",
    features: tierFeatures(),
    plans: planCatalog().map(({ id, tier, duration, months, days, amount }) => ({
      id, tier, duration, months, days, amount,
      perMonth: Math.round(amount / months),
    })),
  };
}
