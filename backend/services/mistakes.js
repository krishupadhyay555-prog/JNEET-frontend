// ─────────────────────────────────────────────────────────────
//  JNEET+ AI — services/mistakes.js
//  Mistake Notebook: copies wrong (and, in full tests, skipped)
//  questions from a submitted attempt, schedules revision
//  (1 day → 3 days → 7 → 15) and checks review answers on the server.
//  Two right answers in a row clear a mistake; a wrong one sends it
//  back to "tomorrow".
// ─────────────────────────────────────────────────────────────
import mongoose from "mongoose";
import MistakeEntry from "../models/MistakeEntry.js";
import TestAttempt from "../models/TestAttempt.js";
import { sameNumber } from "./pyqPool.js";
import { isBlankCorrect } from "./blankAnswer.js";

const DAY = 86_400_000;
export const INTERVAL_DAYS = [1, 3, 7, 15];
export const CLEAR_AFTER = 2;

const SNAP = ["questionId", "subject", "chapter", "type", "source", "pyqRef", "pyqLabel", "questionText",
  "options", "correctIndex", "answers", "imageUrl", "imageW", "figUrl", "optionImages", "optionImageW",
  "optionsInImage", "explanation"];
const HIDDEN = ["correctIndex", "answers", "explanation"];

const keyOf = (q) => (q.source === "pyq" && q.pyqRef ? `pyq:${q.pyqRef}` : `bank:${q.questionId}`);

function snapshot(q) {
  const out = {};
  for (const k of SNAP) if (q[k] !== undefined && q[k] !== null) out[k] = q[k];
  return out;
}

/** Copy an attempt's wrong (and full-test skipped) questions. Idempotent per attempt. */
export async function recordMistakes(attempt, now = new Date()) {
  if (!attempt || attempt.status !== "submitted" || attempt.mistakesLogged) return 0;
  const ops = [];
  for (const q of attempt.questions) {
    const skipped = q.selectedIndex === null || q.selectedIndex === undefined;
    const wrong = !skipped && q.selectedIndex !== q.correctIndex;
    if (!wrong && !(skipped && attempt.mode === "test")) continue;
    ops.push({
      updateOne: {
        filter: { userId: attempt.userId, key: keyOf(q) },
        update: {
          $set: {
            examMode: attempt.examMode, subject: q.subject, chapter: q.chapter, q: snapshot(q),
            nextReviewAt: new Date(now.getTime() + INTERVAL_DAYS[0] * DAY),
            resolvedAt: null, streak: 0, stage: 0, lastAttemptId: attempt._id,
            ...(wrong ? { reason: "wrong" } : {}),
          },
          ...(wrong ? {} : { $setOnInsert: { reason: "skipped" } }),
          $inc: wrong ? { wrongCount: 1 } : { skipCount: 1 },
        },
        upsert: true,
      },
    });
  }
  if (ops.length) await MistakeEntry.bulkWrite(ops, { ordered: false });
  await TestAttempt.updateOne({ _id: attempt._id }, { $set: { mistakesLogged: true } });
  return ops.length;
}

/** Same rules as the test screen: MCQ index, numeric value, fill-in-the-blank text. */
export function isRight(q, { selectedIndex = null, textAnswer = null } = {}) {
  if (q.type === "numeric") return typeof textAnswer === "string" && (q.answers ?? []).some((a) => sameNumber(textAnswer.trim(), a));
  if (q.type === "fill_blank") return typeof textAnswer === "string" && isBlankCorrect(textAnswer, q.answers ?? []);
  return Number.isInteger(selectedIndex) && selectedIndex === q.correctIndex;
}

/** Apply one review answer to the schedule (pure — returns the fields to save). */
export function nextState(m, right, now = new Date()) {
  if (!right) {
    return { streak: 0, stage: 0, lastReviewedAt: now, resolvedAt: null,
      nextReviewAt: new Date(now.getTime() + INTERVAL_DAYS[0] * DAY), wrongCount: (m.wrongCount ?? 0) + 1 };
  }
  const streak = (m.streak ?? 0) + 1;
  const stage = Math.min((m.stage ?? 0) + 1, INTERVAL_DAYS.length - 1);
  return {
    streak, stage, lastReviewedAt: now,
    resolvedAt: streak >= CLEAR_AFTER ? now : null,
    nextReviewAt: new Date(now.getTime() + INTERVAL_DAYS[stage] * DAY),
  };
}

export function publicMistake(m) {
  const q = { ...m.q };
  for (const k of HIDDEN) delete q[k];
  return {
    id: String(m._id), subject: m.subject, chapter: m.chapter, reason: m.reason,
    wrongCount: m.wrongCount ?? 0, skipCount: m.skipCount ?? 0, streak: m.streak ?? 0,
    nextReviewAt: m.nextReviewAt, resolvedAt: m.resolvedAt, q,
  };
}

export async function mistakeSummary(userId, now = new Date()) {
  const uid = new mongoose.Types.ObjectId(String(userId));
  const [row] = await MistakeEntry.aggregate([
    { $match: { userId: uid } },
    { $facet: {
      open: [{ $match: { resolvedAt: null } }, { $group: { _id: "$subject", n: { $sum: 1 }, due: { $sum: { $cond: [{ $lte: ["$nextReviewAt", now] }, 1, 0] } } } }],
      cleared: [{ $match: { resolvedAt: { $ne: null } } }, { $group: { _id: null, n: { $sum: 1 }, week: { $sum: { $cond: [{ $gte: ["$resolvedAt", new Date(now.getTime() - 7 * DAY)] }, 1, 0] } } } }],
    } },
  ]);
  const bySubject = (row?.open ?? []).map((r) => ({ subject: r._id, open: r.n, due: r.due })).sort((a, b) => b.open - a.open);
  return {
    open: bySubject.reduce((s, r) => s + r.open, 0),
    due: bySubject.reduce((s, r) => s + r.due, 0),
    cleared: row?.cleared?.[0]?.n ?? 0,
    clearedThisWeek: row?.cleared?.[0]?.week ?? 0,
    bySubject,
  };
}
