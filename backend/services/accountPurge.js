// ============================================================
//  JNEET+ AI — services/accountPurge.js
//  Accounts a student deleted are deactivated immediately and kept
//  for a 30-day grace period (so a mistaken delete can be undone via
//  support). After that this job erases the account and the personal
//  data tied to it. Payment/subscription records are NOT touched —
//  tax law requires keeping those; they hold no chat content.
//  Runs once at boot and then every 6 hours; safe to run repeatedly.
// ============================================================

import User      from "../models/User.js";
import Chat      from "../models/Chat.js";
import Note      from "../models/Note.js";
import TestAttempt from "../models/TestAttempt.js";
import AiUsage   from "../models/AiUsage.js";
import AiDaily   from "../models/AiDaily.js";

export const GRACE_DAYS = 30;
const SIX_HOURS = 6 * 60 * 60 * 1000;

export async function purgeDeletedAccounts(now = new Date()) {
  const cutoff = new Date(now.getTime() - GRACE_DAYS * 24 * 60 * 60 * 1000);
  const users = await User.find({ deletedAt: { $ne: null, $lte: cutoff } }).select("_id").lean();
  let purged = 0;
  for (const { _id } of users) {
    await Promise.all([
      Chat.deleteMany({ userId: _id }),
      Note.deleteMany({ userId: _id }),
      TestAttempt.deleteMany({ userId: _id }),
      AiUsage.deleteMany({ userId: _id }),
      AiDaily.deleteMany({ userId: _id }),
    ]);
    await User.deleteOne({ _id });
    purged += 1;
  }
  return purged;
}

// Abandoned tests (started, never finished) just take up space: each one stores a
// full copy of its questions. Anything still "in-progress" after 14 days is dropped.
export const STALE_ATTEMPT_DAYS = 14;
export async function purgeStaleAttempts(now = new Date()) {
  const cutoff = new Date(now.getTime() - STALE_ATTEMPT_DAYS * 24 * 60 * 60 * 1000);
  const res = await TestAttempt.deleteMany({ status: "in-progress", startedAt: { $lte: cutoff } });
  return res.deletedCount ?? 0;
}

export function startAccountPurgeJob() {
  const run = async () => {
    try {
      const n = await purgeDeletedAccounts();
      if (n) console.log(`[purge] erased ${n} deleted account(s)`);
      const stale = await purgeStaleAttempts();
      if (stale) console.log(`[purge] removed ${stale} abandoned test attempt(s)`);
    } catch (err) {
      console.error("[purge] failed:", err.message);
    }
  };
  run();
  const timer = setInterval(run, SIX_HOURS);
  timer.unref();
  return timer;
}
