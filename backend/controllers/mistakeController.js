import mongoose from "mongoose";
import MistakeEntry from "../models/MistakeEntry.js";
import { hasTier } from "../middleware/requireTier.js";
import { mistakeSummary, publicMistake, isRight, nextState } from "../services/mistakes.js";

const STATUSES = new Set(["due", "open", "cleared"]);

// Counts for everyone (free users see what is waiting for them).
export const summary = async (req, res, next) => {
  try {
    const s = await mistakeSummary(req.user.id);
    res.json({ success: true, ...s, unlocked: hasTier(req.user.plan, "pro") });
  } catch (err) { next(err); }
};

export const list = async (req, res, next) => {
  try {
    const status = STATUSES.has(req.query.status) ? req.query.status : "due";
    const subject = typeof req.query.subject === "string" ? req.query.subject.slice(0, 40) : "";
    const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 20, 1), 50);
    const now = new Date();
    const filter = { userId: req.user.id };
    if (status === "cleared") filter.resolvedAt = { $ne: null };
    else filter.resolvedAt = null;
    if (status === "due") filter.nextReviewAt = { $lte: now };
    if (subject) filter.subject = subject;
    const sort = status === "cleared" ? { resolvedAt: -1 } : { nextReviewAt: 1, wrongCount: -1 };
    const rows = await MistakeEntry.find(filter).sort(sort).limit(limit).lean();
    res.json({ success: true, items: rows.map(publicMistake) });
  } catch (err) { next(err); }
};

async function own(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) { res.status(404).json({ success: false, error: "Not found." }); return null; }
  const m = await MistakeEntry.findOne({ _id: req.params.id, userId: req.user.id });
  if (!m) res.status(404).json({ success: false, error: "Not found." });
  return m;
}

export const answer = async (req, res, next) => {
  try {
    const m = await own(req, res);
    if (!m) return;
    const right = isRight(m.q, req.body);
    Object.assign(m, nextState(m, right));
    await m.save();
    res.json({
      success: true, correct: right,
      correctIndex: m.q.correctIndex, answers: m.q.answers ?? [], explanation: m.q.explanation ?? "",
      mistake: publicMistake(m.toObject()),
    });
  } catch (err) { next(err); }
};

export const master = async (req, res, next) => {
  try {
    const m = await own(req, res);
    if (!m) return;
    m.resolvedAt = new Date();
    await m.save();
    res.json({ success: true, mistake: publicMistake(m.toObject()) });
  } catch (err) { next(err); }
};
