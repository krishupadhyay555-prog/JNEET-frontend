// ─────────────────────────────────────────────────────────────
//  JNEET+ AI — services/ai/monthlyCap.js
//  Fair-use cap on what one student's AI use may cost us per IST
//  month (all kinds: chat, explain, voice). Keeps every plan
//  profitable even for the heaviest user. Cached for a minute.
// ─────────────────────────────────────────────────────────────
import mongoose from "mongoose";
import AiUsage from "../../models/AiUsage.js";
import { istDayKey } from "./quota.js";

export const MONTHLY_CAP_INR = { free: 10, pro: 50, elite: 100, pass: 30 };
const cache = new Map();

export function capFor(user) {
  if (user?.planPass) return MONTHLY_CAP_INR.pass;
  return MONTHLY_CAP_INR[user?.plan] ?? MONTHLY_CAP_INR.free;
}

export async function monthSpendInr(userId, now = new Date()) {
  const key = String(userId);
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < 60_000) return hit.inr;
  const monthStart = `${istDayKey(now).slice(0, 7)}-01`;
  const [row] = await AiUsage.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(key), day: { $gte: monthStart } } },
    { $group: { _id: null, inr: { $sum: { $ifNull: ["$costInr", 0] } } } },
  ]);
  const inr = row?.inr ?? 0;
  cache.set(key, { inr, at: Date.now() });
  return inr;
}

/** { ok, spent, cap } */
export async function checkMonthlyCap(user) {
  const cap = capFor(user);
  const spent = await monthSpendInr(user.id);
  return { ok: spent < cap, spent, cap };
}

export function _resetCapCache() { cache.clear(); }
