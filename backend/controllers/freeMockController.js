// ============================================================
//  JNEET+ AI — controllers/freeMockController.js
//    POST /api/free-mock/start          { exam, captchaToken, source? } → paper (no key)
//    GET  /api/free-mock/:id            resume an unfinished sitting (no key)
//    POST /api/free-mock/:id/submit     { answers } → result (no key, ever)
//    GET  /api/free-mock/:id/result     result again
//    POST /api/free-mock/claim          (signed in) move this device's sittings into the account
//  The guest is identified by a signed httpOnly cookie (jneet_guest).
//  There is NO endpoint that returns answers or lists the pool.
// ============================================================
import crypto from "crypto";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import GuestAttempt from "../models/GuestAttempt.js";
import TestAttempt from "../models/TestAttempt.js";
import { env } from "../config/env.js";
import { baseCookieOptions } from "../utils/authCookie.js";
import { QUICK_CONFIG, buildQuickPaper, guestQuestion, scoreQuick, maxMarksFor, questionKey } from "../services/quickMock.js";
import { recordMistakes } from "../services/mistakes.js";

export const GUEST_COOKIE = "jneet_guest";
const GUEST_DAYS = 30;
const GRACE_MS = 2 * 60 * 1000;

function readGuest(req) {
  const t = req.cookies?.[GUEST_COOKIE];
  if (!t) return null;
  try {
    const d = jwt.verify(String(t), env.JWT_SECRET, { audience: "jneet-guest" });
    return typeof d.gid === "string" && /^[a-f0-9]{32}$/.test(d.gid) ? d.gid : null;
  } catch { return null; }
}
function ensureGuest(req, res) {
  const existing = readGuest(req);
  if (existing) return existing;
  const gid = crypto.randomBytes(16).toString("hex");
  const token = jwt.sign({ gid }, env.JWT_SECRET, { audience: "jneet-guest", expiresIn: `${GUEST_DAYS}d` });
  res.cookie(GUEST_COOKIE, token, { ...baseCookieOptions(), maxAge: GUEST_DAYS * 24 * 3600 * 1000 });
  return gid;
}
async function ownAttempt(req, res) {
  const gid = readGuest(req);
  const id = req.params.id;
  if (!gid || !mongoose.isValidObjectId(id)) { res.status(404).json({ success: false, error: "This test was not found on this device." }); return null; }
  const a = await GuestAttempt.findOne({ _id: id, guestId: gid });
  if (!a) res.status(404).json({ success: false, error: "This test was not found on this device." });
  return a;
}

function paperResponse(a) {
  return {
    success: true, attemptId: a._id, exam: a.examMode,
    durationMinutes: a.durationMinutes, maxMarks: a.maxMarks,
    startedAt: a.startedAt, endsAt: a.endsAt, serverNow: new Date(),
    questions: a.questions.map(guestQuestion),
  };
}

export const startFreeMock = async (req, res, next) => {
  try {
    const exam = req.body.exam;
    const gid = ensureGuest(req, res);
    const recent = await GuestAttempt.find({ guestId: gid, examMode: exam }).sort({ startedAt: -1 }).limit(5).select("questions.pyqRef questions.questionId").lean();
    const seen = new Set(recent.flatMap((r) => r.questions.map(questionKey)));
    const questions = await buildQuickPaper(exam, seen);
    const expected = QUICK_CONFIG[exam].subjects.reduce((n, s) => n + s.count, 0);
    if (questions.length < expected) {
      return res.status(503).json({ success: false, error: "The free mock isn't ready right now. Please try again in a little while." });
    }
    const now = new Date();
    const cfg = QUICK_CONFIG[exam];
    const a = await GuestAttempt.create({
      guestId: gid, examMode: exam, questions, durationMinutes: cfg.durationMinutes, maxMarks: maxMarksFor(exam),
      startedAt: now, endsAt: new Date(now.getTime() + cfg.durationMinutes * 60 * 1000), source: req.body.source ?? null,
    });
    return res.status(201).json(paperResponse(a));
  } catch (err) { next(err); }
};

export const getFreeMock = async (req, res, next) => {
  try {
    const a = await ownAttempt(req, res);
    if (!a) return;
    if (a.status === "submitted") return res.json({ success: true, attemptId: a._id, exam: a.examMode, submitted: true, result: a.result, claimed: Boolean(a.claimedBy) });
    return res.json(paperResponse(a));
  } catch (err) { next(err); }
};

export const submitFreeMock = async (req, res, next) => {
  try {
    const gid = readGuest(req);
    if (!gid || !mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ success: false, error: "This test was not found on this device." });
    const now = new Date();
    // One submit only (double-tap / slow network retry gets the same result).
    const a = await GuestAttempt.findOneAndUpdate(
      { _id: req.params.id, guestId: gid, status: "in-progress",
        $or: [{ submittingAt: null }, { submittingAt: { $lt: new Date(now.getTime() - 30_000) } }] },
      { $set: { submittingAt: now } }, { new: true }
    );
    if (!a) {
      const done = await GuestAttempt.findOne({ _id: req.params.id, guestId: gid }).select("status result").lean();
      if (done?.status === "submitted") return res.json({ success: true, result: done.result, alreadySubmitted: true });
      if (done) return res.status(409).json({ success: false, error: "Your answers are being saved. Please wait a moment." });
      return res.status(404).json({ success: false, error: "This test was not found on this device." });
    }
    const submittedAt = now > new Date(a.endsAt.getTime() + GRACE_MS) ? new Date(a.endsAt.getTime() + GRACE_MS) : now;
    const { scored, result } = scoreQuick(a.questions, req.body.answers, {
      exam: a.examMode, startedAt: a.startedAt, submittedAt, durationMinutes: a.durationMinutes,
    });
    const questions = a.questions.map((q, i) => ({ ...q, selectedIndex: scored[i].selectedIndex, textAnswer: scored[i].textAnswer, timeSpentSec: scored[i].timeSec }));
    await GuestAttempt.updateOne({ _id: a._id }, { $set: { questions, result, status: "submitted", submittedAt: now } });
    return res.json({ success: true, result });
  } catch (err) { next(err); }
};

export const freeMockResult = async (req, res, next) => {
  try {
    const a = await ownAttempt(req, res);
    if (!a) return;
    if (a.status !== "submitted") return res.status(409).json({ success: false, error: "Submit the test to see your result." });
    return res.json({ success: true, exam: a.examMode, result: a.result, claimed: Boolean(a.claimedBy), testAttemptId: a.testAttemptId });
  } catch (err) { next(err); }
};

// Moves every finished, unclaimed sitting of this device (same exam as the
// account) into the account: a normal TestAttempt → answers + solutions,
// Mistake Notebook, history. Atomic per sitting (claimed exactly once).
export async function claimGuestAttempts(userId, examMode, gid) {
  if (!gid) return [];
  const moved = [];
  const candidates = await GuestAttempt.find({ guestId: gid, status: "submitted", claimedBy: null, examMode }).select("_id").lean();
  for (const { _id } of candidates) {
    const g = await GuestAttempt.findOneAndUpdate({ _id, claimedBy: null }, { $set: { claimedBy: userId, claimedAt: new Date() } }, { new: true }).lean();
    if (!g) continue;
    const r = g.result;
    const t = await TestAttempt.create({
      userId, examMode: g.examMode, subject: "All Subjects", chapter: `${g.examMode} Free Quick Mock`, mode: "test",
      maxMarks: g.maxMarks, durationMinutes: g.durationMinutes,
      questions: g.questions.map(({ pyqRef, ...q }) => ({ ...q, ...(pyqRef ? { pyqRef } : {}) })),
      totalQuestions: g.questions.length, correctCount: r.correct, wrongCount: r.wrong, unattemptedCount: r.skipped,
      score: Math.round((r.correct / g.questions.length) * 100), marksObtained: r.marks,
      status: "submitted", startedAt: g.startedAt, submittedAt: g.submittedAt,
    });
    await GuestAttempt.updateOne({ _id: g._id }, { $set: { testAttemptId: t._id } });
    await recordMistakes(t).catch((e) => console.error("[free-mock] mistakes:", e.message));
    moved.push(String(t._id));
  }
  return moved;
}

export const claimFreeMock = async (req, res, next) => {
  try {
    const moved = await claimGuestAttempts(req.user.id, req.user.examMode, readGuest(req));
    return res.json({ success: true, moved, latest: moved[moved.length - 1] ?? null });
  } catch (err) { next(err); }
};
