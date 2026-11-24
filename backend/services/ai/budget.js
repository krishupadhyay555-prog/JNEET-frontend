// ============================================================
//  JNEET+ AI — services/ai/budget.js
//  Global circuit breaker. If total AI spend for the IST day passes
//  AI_DAILY_BUDGET_INR, new questions are refused (with a friendly
//  message) instead of silently running up the bill — protects you
//  from a bug, a viral spike or an abuse wave. 0 / unset = disabled.
//  The day's spend is re-read from the usage ledger at most once a
//  minute, so the check costs nothing per request.
// ============================================================

import AiUsage from "../../models/AiUsage.js";
import { istDayKey } from "./quota.js";
import { sendAdminAlert } from "../emailService.js";

const CACHE_MS = 60_000;
let cache = { day: null, spendInr: 0, at: 0 };

export function dailyBudgetInr() {
  const v = Number(process.env.AI_DAILY_BUDGET_INR);
  return Number.isFinite(v) && v > 0 ? v : 0;
}

export async function todaysSpendInr(now = new Date()) {
  const day = istDayKey(now);
  if (cache.day === day && now.getTime() - cache.at < CACHE_MS) return cache.spendInr;

  const rows = await AiUsage.aggregate([
    { $match: { day } },
    { $group: { _id: null, total: { $sum: { $ifNull: ["$costInr", 0] } } } },
  ]);
  cache = { day, spendInr: rows[0]?.total ?? 0, at: now.getTime() };
  return cache.spendInr;
}

// One-switch kill switch: set AI_PAUSED=1 on Render (Environment →
// Save; Render restarts in ~1 min, no code deploy) and every AI call stops
// — chat, explain, voice, titles, recap. Distress messages still get a
// fixed helpline reply. Remove the variable (or set 0) to turn AI back on.
export function aiPaused() {
  return /^(1|true|yes|on)$/i.test(String(process.env.AI_PAUSED ?? "").trim());
}

export async function isOverBudget() {
  if (aiPaused()) return true;
  const budget = dailyBudgetInr();
  if (!budget) return false;
  try {
    const spend = await todaysSpendInr();
    maybeAlert(spend, budget);
    return spend >= budget;
  } catch (err) {
    console.warn("[AI] budget check failed (allowing request):", err.message);
    return false;
  }
}

export function _resetBudgetCache() {
  cache = { day: null, spendInr: 0, at: 0 };
}

// Money alert: one email to the founder per IST day when AI spend passes
// 80% of the daily budget, and one more when it hits 100% (AI stops).
const alerted = new Map(); // "day|level" → true
function maybeAlert(spend, budget, day = istDayKey()) {
  const level = spend >= budget ? 100 : spend >= 0.8 * budget ? 80 : 0;
  if (!level || alerted.has(`${day}|${level}`)) return;
  alerted.set(`${day}|${level}`, true);
  if (alerted.size > 20) alerted.delete(alerted.keys().next().value);
  sendAdminAlert(level === 100 ? "AI daily budget reached — AI paused for today" : "AI spend at 80% of today's budget", [
    `Today's AI spend: ₹${spend.toFixed(2)} of ₹${budget} (AI_DAILY_BUDGET_INR).`,
    level === 100
      ? "New AI questions are refused until midnight IST (distress replies still work)."
      : "If this is unexpected, set AI_PAUSED=1 on Render to stop all AI at once.",
  ], { area: "ai" }).catch((err) => console.warn("[AI] budget alert email failed:", err.message));
}
export function _resetBudgetAlerts() { alerted.clear(); }
