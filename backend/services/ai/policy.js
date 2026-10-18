// ============================================================
//  JNEET+ AI — services/ai/policy.js
//  Escalation for 18+ requests. Strict but fair: students get two
//  clear warnings, then a 1-hour pause of the AI chat; if it keeps
//  happening after a pause, a permanent remark is added to the
//  student's Analytics ("Account notices").
//
//    flag 1  → warning
//    flag 2  → final warning
//    flag 3  → AI chat paused for 1 hour
//    flag 4+ → paused again for 1 hour + remark "repeated after pause"
//
//  Flags older than 30 days are forgotten (a clean month resets the count).
//  Only the category and the time are stored — never the message text.
//  Distress messages are never touched by this (see aiController).
// ============================================================

import User from "../../models/User.js";

export const PAUSE_MS = 60 * 60 * 1000;
export const WINDOW_MS = 30 * 24 * 60 * 60 * 1000;
const MAX_EVENTS = 30;

export function levelFor(strikes) {
  if (strikes <= 1) return "warning";
  if (strikes === 2) return "final_warning";
  return "paused";
}

export function policyMessage(level, { strikes, pausedUntil }) {
  if (level === "warning") {
    return "I can't help with that. 18+ / adult content is strictly not allowed on JNEET+ — this space is only for your NEET UG / JEE Mains preparation.\n\n**Warning 1 of 2.** Agar kisi chapter ya concept ka doubt hai, abhi poochho — main yahin hoon. 📚";
  }
  if (level === "final_warning") {
    return "I can't help with that. 18+ content is against our policy, and this is your **final warning (2 of 2)**.\n\nIf it happens again, the AI chat will be paused for 1 hour. Tests, Revision and Notes keep working. Chalo, padhai pe wapas — koi doubt bhejo.";
  }
  const mins = Math.max(1, Math.round((new Date(pausedUntil).getTime() - Date.now()) / 60000));
  return `I can't help with that. Because this broke our 18+ policy again after warnings, the AI chat is **paused for ${mins >= 60 ? "1 hour" : `${mins} minutes`}**${strikes >= 4 ? ". This repeat has also been noted in your Analytics" : ""}.\n\nTests, Revision and Notes keep working. Come back after the break with a study doubt.`;
}

// Records an 18+ flag and returns what the student should be told.
export async function recordAdultFlag(userId, now = new Date()) {
  const user = await User.findById(userId).select("policy").lean();
  const prev = user?.policy ?? {};
  const fresh = !prev.lastFlagAt || now.getTime() - new Date(prev.lastFlagAt).getTime() > WINDOW_MS;
  const strikes = (fresh ? 0 : prev.strikes ?? 0) + 1;
  const level = levelFor(strikes);
  const pausedUntil = level === "paused" ? new Date(now.getTime() + PAUSE_MS) : null;

  const events = [{ at: now, kind: level }];
  if (level === "paused" && strikes >= 4) events.push({ at: now, kind: "repeat_after_pause" });

  const update = {
    $set: {
      "policy.strikes": strikes,
      "policy.lastFlagAt": now,
      ...(pausedUntil ? { "policy.pausedUntil": pausedUntil } : {}),
    },
    $inc: { "policy.flagsTotal": 1 },
    $push: { "policy.events": { $each: events, $slice: -MAX_EVENTS } },
  };
  await User.updateOne({ _id: userId }, update);

  return { level, strikes, pausedUntil, message: policyMessage(level, { strikes, pausedUntil }) };
}

export async function getPolicySummary(userId) {
  const u = await User.findById(userId).select("policy").lean();
  const p = u?.policy ?? {};
  const now = Date.now();
  const stale = p.lastFlagAt && now - new Date(p.lastFlagAt).getTime() > WINDOW_MS;
  return {
    strikes: stale ? 0 : p.strikes ?? 0,
    flagsTotal: p.flagsTotal ?? 0,
    pausedUntil: p.pausedUntil && new Date(p.pausedUntil).getTime() > now ? new Date(p.pausedUntil).toISOString() : null,
    events: (p.events ?? []).slice(-10).reverse().map((e) => ({ at: e.at, kind: e.kind })),
  };
}
