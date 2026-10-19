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

export async function isOverBudget() {
  const budget = dailyBudgetInr();
  if (!budget) return false;
  try {
    return (await todaysSpendInr()) >= budget;
  } catch (err) {
    console.warn("[AI] budget check failed (allowing request):", err.message);
    return false;
  }
}

export function _resetBudgetCache() {
  cache = { day: null, spendInr: 0, at: 0 };
}
