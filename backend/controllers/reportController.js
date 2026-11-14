// ============================================================
//  JNEET+ AI — controllers/reportController.js
//    POST  /api/test/report            student flags a question
//    GET   /api/admin/reports          founder: grouped list
//    PATCH /api/admin/reports/:id      founder: mark fixed / dismissed
//  A student can only report a question that is in one of THEIR own
//  attempts. Max 30 reports a day per student. When a question
//  reaches 3 open reports the founder gets one alert email.
// ============================================================

import mongoose from "mongoose";
import QuestionReport from "../models/QuestionReport.js";
import TestAttempt from "../models/TestAttempt.js";
import Question from "../models/Question.js";
import { sendAdminAlert } from "../services/emailService.js";

const DAILY_LIMIT = 30;
const ALERT_AT = 3;
const REASON_LABEL = {
  wrong_answer: "Answer key is wrong", wrong_question: "Question is wrong or unclear", typo: "Typo / formatting",
  out_of_syllabus: "Out of syllabus", other: "Other",
};

export const reportQuestion = async (req, res, next) => {
  try {
    const { attemptId, questionId, reason, note } = req.body;
    const attempt = await TestAttempt.findOne({ _id: attemptId, userId: req.user.id }).lean();
    const q = attempt?.questions?.find((x) => String(x.questionId) === questionId);
    if (!q) return res.status(404).json({ success: false, error: "Question not found in your tests." });

    const existing = await QuestionReport.findOne({ userId: req.user.id, questionId }).select("_id").lean();
    if (!existing) {
      const today = await QuestionReport.countDocuments({ userId: req.user.id, createdAt: { $gte: new Date(Date.now() - 86400000) } });
      if (today >= DAILY_LIMIT) {
        return res.status(429).json({ success: false, error: "You have sent a lot of reports today — thank you! Please try again tomorrow." });
      }
    }

    const live = await Question.findById(questionId).select("examMode subject chapter").lean();
    const snapshot = {
      examMode: live?.examMode || attempt.examMode, subject: q.subject, chapter: q.chapter, type: q.type || "mcq",
      questionText: q.questionText, options: q.options || [], correctIndex: q.correctIndex,
      answers: q.answers || [], explanation: q.explanation || "",
    };
    await QuestionReport.updateOne(
      { userId: req.user.id, questionId },
      { $set: { attemptId, reason, note: note || "", status: "open", snapshot }, $unset: { resolvedAt: 1 } },
      { upsert: true }
    );

    if (!existing) {
      const open = await QuestionReport.countDocuments({ questionId, status: "open" });
      if (open === ALERT_AT) {
        sendAdminAlert(`A question has ${ALERT_AT} reports`, [
          `${snapshot.examMode || ""} ${snapshot.subject} — ${snapshot.chapter}`,
          `Q: ${snapshot.questionText}`,
          `Latest reason: ${REASON_LABEL[reason]}${note ? ` — "${note}"` : ""}`,
          "Open the admin dashboard → Reported questions.",
        ], { area: "questions" }).catch(() => {});
      }
    }
    return res.status(existing ? 200 : 201).json({ success: true, message: "Thanks! We will check this question." });
  } catch (err) { return next(err); }
};

// Grouped by question, most-reported first.
export const listReports = async (req, res, next) => {
  try {
    const status = ["open", "fixed", "dismissed"].includes(req.query.status) ? req.query.status : "open";
    const groups = await QuestionReport.aggregate([
      { $match: { status } },
      { $sort: { createdAt: -1 } },
      { $group: {
          _id: "$questionId", count: { $sum: 1 }, latestAt: { $first: "$createdAt" },
          snapshot: { $first: "$snapshot" }, reportIds: { $push: "$_id" },
          reasons: { $push: "$reason" }, notes: { $push: "$note" },
      } },
      { $sort: { count: -1, latestAt: -1 } },
      { $limit: 100 },
    ]);
    const [openCount, fixedCount, dismissedCount] = await Promise.all(
      ["open", "fixed", "dismissed"].map((s) => QuestionReport.countDocuments({ status: s }))
    );
    const items = groups.map((g) => ({
      questionId: g._id, count: g.count, latestAt: g.latestAt, snapshot: g.snapshot, reportIds: g.reportIds,
      reasons: Object.entries(g.reasons.reduce((m, r) => ({ ...m, [r]: (m[r] || 0) + 1 }), {})).map(([reason, n]) => ({ reason, label: REASON_LABEL[reason], n })),
      notes: g.notes.filter(Boolean).slice(0, 5),
    }));
    return res.json({ success: true, status, counts: { open: openCount, fixed: fixedCount, dismissed: dismissedCount }, items });
  } catch (err) { return next(err); }
};

// Marks every report of that question with the new status.
export const updateReports = async (req, res, next) => {
  try {
    const { questionId } = req.params;
    if (!mongoose.isValidObjectId(questionId)) return res.status(404).json({ success: false, error: "Not found." });
    const { status } = req.body;
    const r = await QuestionReport.updateMany(
      { questionId },
      status === "open" ? { $set: { status }, $unset: { resolvedAt: 1 } } : { $set: { status, resolvedAt: new Date() } }
    );
    if (!r.matchedCount) return res.status(404).json({ success: false, error: "Not found." });
    return res.json({ success: true, updated: r.modifiedCount });
  } catch (err) { return next(err); }
};
