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
      "Mistake Notebook with spaced revision",
      "Explain with AI on every PYQ",
      "Deeper, step-by-step AI answers",
      "Everything in Free",
    ],
    elite: [
      `${env.AI_DAILY.elite} AI doubts every day`,
      "Deep test analysis (weak chapters, time, negative marks)",
      "Listen to AI answers (voice)",
      `${env.AI_DEEP_MONTHLY_ELITE} "deep solve" answers every month (toughest numericals)`,
      "Everything in Pro",
    ],
  };
}

function rupees(name, fallback) {
  const v = Number.parseInt(env[name] ?? "", 10);
  return (Number.isFinite(v) && v > 0 ? v : fallback) * 100;
}

// Exam passes: one payment, valid till a fixed date (IST end of day).
// Early-bird price for the first N real paid seats (counted in billing).
const DAY = 86_400_000;
export function passConfig() {
  return {
    jee_pass: {
      exam: "JEE", label: "JEE Main 2027 Pass (Jan + April)",
      endsAt: env.JEE_PASS_ENDS || "2027-04-30T18:29:59.000Z",
      amount: rupees("PRICE_JEE_PASS", 699),
      early: { amount: rupees("PRICE_JEE_PASS_EARLY", 599), seats: Number.parseInt(env.JEE_PASS_EARLY_SEATS ?? "", 10) || 500 },
    },
    neet_pass: {
      exam: "NEET", label: "NEET UG 2027 Pass",
      endsAt: env.NEET_PASS_ENDS || "2027-05-31T18:29:59.000Z",
      amount: rupees("PRICE_NEET_PASS", 999),
      early: null,
    },
  };
}

export function planCatalog(now = new Date()) {
  const monthly = [
    { id: "pro_1m",   tier: "pro",   duration: "1m", amount: rupees("PRICE_PRO_1M", 199) },
    { id: "elite_1m", tier: "elite", duration: "1m", amount: rupees("PRICE_ELITE_1M", 349) },
    // Old 4-month plans: kept so past payments still resolve; not sold any more.
    { id: "pro_4m",   tier: "pro",   duration: "4m", amount: rupees("PRICE_PRO_4M", 699), hidden: true },
    { id: "elite_4m", tier: "elite", duration: "4m", amount: rupees("PRICE_ELITE_4M", 1199), hidden: true },
  ].map((p) => ({ ...p, ...DURATIONS[p.duration], currency: "INR" }));
  const passes = Object.entries(passConfig()).map(([id, c]) => {
    const days = Math.ceil((new Date(c.endsAt).getTime() - now.getTime()) / DAY);
    return { id, tier: "pro", duration: "pass", exam: c.exam, label: c.label, endsAt: c.endsAt,
      amount: c.amount, early: c.early, days, months: Math.max(1, Math.round(days / 30)), currency: "INR", hidden: days < 7 };
  });
  return [...monthly, ...passes];
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

// "test" with rzp_test_ keys (no real money), "live" with rzp_live_ keys.
export function paymentsMode() {
  if (!paymentsEnabled()) return "off";
  return String(env.RAZORPAY_KEY_ID).startsWith("rzp_live_") ? "live" : "test";
}

export function publicCatalog() {
  return {
    enabled: paymentsEnabled(),
    mode: paymentsMode(),
    currency: "INR",
    features: tierFeatures(),
    plans: planCatalog().filter((p) => !p.hidden).map(({ id, tier, duration, months, days, amount, exam, label, endsAt, early }) => ({
      id, tier, duration, months, days, amount, exam: exam ?? null, label: label ?? null, endsAt: endsAt ?? null,
      early: early ? { amount: early.amount, seats: early.seats } : null,
      perMonth: Math.round(amount / months),
    })),
  };
}
