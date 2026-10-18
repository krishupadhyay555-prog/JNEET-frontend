// ============================================================
//  JNEET+ AI — services/ai/quota.js
//  Daily doubt limits per plan (IST day) and monthly deep-solve
//  limits, enforced with ONE atomic upsert so concurrent requests
//  can never slip past the limit.
// ============================================================

import AiDaily from "../../models/AiDaily.js";
import { env } from "../../config/env.js";

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

function istDate(now = new Date()) {
  return new Date(now.getTime() + IST_OFFSET_MS);
}

export function istDayKey(now = new Date()) {
  return istDate(now).toISOString().slice(0, 10);
}

export function istMonthKey(now = new Date()) {
  return istDate(now).toISOString().slice(0, 7);
}

// Next IST midnight as an ISO instant (when the daily limit resets).
export function nextIstMidnight(now = new Date()) {
  const ist = istDate(now);
  const next = Date.UTC(ist.getUTCFullYear(), ist.getUTCMonth(), ist.getUTCDate() + 1);
  return new Date(next - IST_OFFSET_MS).toISOString();
}

export function nextIstMonthStart(now = new Date()) {
  const ist = istDate(now);
  const next = Date.UTC(ist.getUTCFullYear(), ist.getUTCMonth() + 1, 1);
  return new Date(next - IST_OFFSET_MS).toISOString();
}

export function dailyLimitFor(plan) {
  return env.AI_DAILY[plan] ?? env.AI_DAILY.free;
}

// Atomically take one unit if the user is under `limit`.
// Returns { ok, used, limit }.
async function takeUnit(userId, kind, key, limit) {
  if (limit <= 0) return { ok: false, used: 0, limit };

  try {
    const doc = await AiDaily.findOneAndUpdate(
      { userId, kind, key, count: { $lt: limit } },
      { $inc: { count: 1 }, $setOnInsert: { createdAt: new Date() } },
      { upsert: true, returnDocument: "after" }
    ).lean();
    return { ok: true, used: doc.count, limit };
  } catch (err) {
    // Filter didn't match (already at the limit) so the upsert tried to
    // insert a duplicate (userId, kind, key) → E11000. That means "full".
    if (err?.code === 11000) return { ok: false, used: limit, limit };
    throw err;
  }
}

async function giveBack(userId, kind, key) {
  await AiDaily.updateOne(
    { userId, kind, key, count: { $gt: 0 } },
    { $inc: { count: -1 } }
  ).catch((err) => console.warn("[AI] quota refund failed:", err.message));
}

export async function reserveDoubt(userId, plan, now = new Date()) {
  const key = istDayKey(now);
  const limit = dailyLimitFor(plan);
  const res = await takeUnit(userId, "day", key, limit);
  return {
    ...res,
    remaining: Math.max(0, limit - res.used),
    resetsAt: nextIstMidnight(now),
    release: () => giveBack(userId, "day", key),
  };
}

export async function reserveDeepSolve(userId, plan, now = new Date()) {
  const key = istMonthKey(now);
  const limit = plan === "elite" ? env.AI_DEEP_MONTHLY_ELITE : 0;
  const res = await takeUnit(userId, "deep_month", key, limit);
  return {
    ...res,
    remaining: Math.max(0, limit - res.used),
    resetsAt: nextIstMonthStart(now),
    release: () => giveBack(userId, "deep_month", key),
  };
}

export async function getUsageSnapshot(userId, plan, now = new Date()) {
  const [day, deep] = await Promise.all([
    AiDaily.findOne({ userId, kind: "day", key: istDayKey(now) }).lean(),
    AiDaily.findOne({ userId, kind: "deep_month", key: istMonthKey(now) }).lean(),
  ]);
  const limit = dailyLimitFor(plan);
  const used = day?.count ?? 0;
  const deepLimit = plan === "elite" ? env.AI_DEEP_MONTHLY_ELITE : 0;
  return {
    plan,
    daily: { used, limit, remaining: Math.max(0, limit - used), resetsAt: nextIstMidnight(now) },
    deep:  { used: deep?.count ?? 0, limit: deepLimit, remaining: Math.max(0, deepLimit - (deep?.count ?? 0)), resetsAt: nextIstMonthStart(now) },
  };
}
