// ============================================================
//  JNEET+ AI — controllers/allIndiaController.js
//    GET  /api/all-india                    this week's mock + last week's
//    POST /api/all-india/:mockId/start      one sitting per student
//    GET  /api/all-india/:mockId/leaderboard
//  See services/allIndiaMock.js for the rules.
// ============================================================

import mongoose from "mongoose";
import AllIndiaMock from "../models/AllIndiaMock.js";
import TestAttempt from "../models/TestAttempt.js";
import { publicQuestion } from "./testController.js";
import { currentWeekKey, previousWeekKey, getOrCreateMock, statusOf, summary, leaderboard } from "../services/allIndiaMock.js";

export const getAllIndia = async (req, res, next) => {
  try {
    const examMode = req.user.examMode;
    const weekKey = currentWeekKey();
    const current = await getOrCreateMock(examMode, weekKey);
    const last = await AllIndiaMock.findOne({ examMode, weekKey: previousWeekKey(weekKey) });
    return res.json({
      success: true,
      current: await summary(current, req.user.id),
      last: await summary(last, req.user.id),
      ...(current ? {} : { error: "Not enough questions yet to make this week's All-India Mock." }),
    });
  } catch (err) { return next(err); }
};

async function loadMock(req, res) {
  const { mockId } = req.params;
  if (!mongoose.isValidObjectId(mockId)) {
    res.status(404).json({ success: false, error: "All-India Mock not found." });
    return null;
  }
  const mock = await AllIndiaMock.findById(mockId);
  if (!mock || mock.examMode !== req.user.examMode) {
    res.status(404).json({ success: false, error: "All-India Mock not found." });
    return null;
  }
  return mock;
}

export const startAllIndia = async (req, res, next) => {
  try {
    const mock = await loadMock(req, res);
    if (!mock) return undefined;

    const existing = await TestAttempt.findOne({ allIndiaMockId: mock._id, userId: req.user.id }).select("_id status").lean();
    if (existing?.status === "submitted") {
      return res.status(409).json({ success: false, error: "You have already taken this week's All-India Mock.", attemptId: existing._id });
    }
    if (existing) return res.json({ success: true, attemptId: existing._id, resumed: true });

    const status = statusOf(mock);
    if (status === "upcoming") return res.status(403).json({ success: false, error: "This All-India Mock has not opened yet." });
    if (status !== "open") return res.status(403).json({ success: false, error: "It is too late to start — there would not be enough time left before it closes." });

    try {
      const attempt = await TestAttempt.create({
        userId: req.user.id,
        examMode: mock.examMode,
        subject: "All Subjects",
        chapter: mock.title,
        mode: "test",
        allIndiaMockId: mock._id,
        maxMarks: mock.maxMarks,
        durationMinutes: mock.durationMinutes,
        questions: mock.questions.map((q) => {
          const o = q.toObject();
          delete o._id;
          return { ...o, selectedIndex: null, textAnswer: null };
        }),
        totalQuestions: mock.questions.length,
        status: "in-progress",
      });
      return res.json({
        success: true,
        attemptId: attempt._id,
        totalQuestions: attempt.totalQuestions,
        maxMarks: attempt.maxMarks,
        durationMinutes: attempt.durationMinutes,
        startedAt: attempt.startedAt,
        questions: attempt.questions.map(publicQuestion),
      });
    } catch (err) {
      if (err?.code === 11000) {   // a second tap / tab started it a moment ago
        const again = await TestAttempt.findOne({ allIndiaMockId: mock._id, userId: req.user.id }).select("_id").lean();
        return res.json({ success: true, attemptId: again._id, resumed: true });
      }
      throw err;
    }
  } catch (err) { return next(err); }
};

export const getLeaderboard = async (req, res, next) => {
  try {
    const mock = await loadMock(req, res);
    if (!mock) return undefined;
    return res.json({ success: true, title: mock.title, ...(await leaderboard(mock, req.user.id)) });
  } catch (err) { return next(err); }
};
