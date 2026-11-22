// ============================================================
//  JNEET+ AI — services/allIndiaMock.js
//  Weekly All-India Mock: every Sunday 08:00–23:59 IST, one paper per
//  exam (JEE Main / NEET UG), same questions for everyone, then a rank
//  list. The paper is made the first time anyone asks for that week
//  (no cron job needed) and stored, so every sitting is identical.
//  Paper: mostly real PYQs (NTA images + NTA's answer) plus our "tough"
//  bank questions, PYQs used in earlier All-India Mocks avoided.
//  Rank list: marks (high → low), then time taken (short → long). Names
//  are never shown — each student is a code like #K7Q2 (most students
//  are under 18; founder 19 Nov: no names, no prizes for now).
// ============================================================

import crypto from "crypto";
import AllIndiaMock from "../models/AllIndiaMock.js";
import TestAttempt from "../models/TestAttempt.js";
import { buildFullPaper } from "../controllers/testController.js";

const IST_MS = 330 * 60 * 1000;            // India has no daylight saving
const OPEN_HOUR_IST = 8;                    // 08:00 IST Sunday
const GRACE_MS = 10 * 60 * 1000;            // late submit (network) still counts within 10 min

// Mostly PYQs, the rest from our hardest bank questions.
const ALL_INDIA_MIX = {
  JEE:  {
    Mathematics: { mcq: 14, numeric: 5 },
    Physics:     { mcq: 14, numeric: 5 },
    Chemistry:   { mcq: 14, numeric: 5 },
  },
  NEET: { Physics: { mcq: 25 }, Chemistry: { mcq: 25 }, Biology: { mcq: 50 } },
};

const EXAM_TITLE = { JEE: "JEE Main", NEET: "NEET UG" };
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// The Sunday (IST calendar date) whose mock is "current" at `now`: today if it is
// Sunday and that mock has not closed yet, otherwise the next Sunday.
export function currentWeekKey(now = new Date()) {
  const ist = new Date(now.getTime() + IST_MS);
  const day = ist.getUTCDay();               // 0 = Sunday
  const ahead = (7 - day) % 7;
  const sunday = new Date(Date.UTC(ist.getUTCFullYear(), ist.getUTCMonth(), ist.getUTCDate() + ahead));
  return sunday.toISOString().slice(0, 10);
}

export function previousWeekKey(weekKey) {
  const d = new Date(`${weekKey}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - 7);
  return d.toISOString().slice(0, 10);
}

export function windowFor(weekKey, durationMinutes) {
  const midnightIstAsUtc = new Date(`${weekKey}T00:00:00Z`).getTime() - IST_MS;
  const opensAt = new Date(midnightIstAsUtc + OPEN_HOUR_IST * 3600 * 1000);
  const closesAt = new Date(midnightIstAsUtc + 24 * 3600 * 1000 - 1000);   // 23:59:59 IST
  const lastStartAt = new Date(closesAt.getTime() - durationMinutes * 60 * 1000);
  return { opensAt, closesAt, lastStartAt };
}

function prettyDate(weekKey) {
  const [y, m, d] = weekKey.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

export function statusOf(mock, now = new Date()) {
  if (now < mock.opensAt) return "upcoming";
  if (now <= mock.lastStartAt) return "open";
  if (now <= mock.closesAt) return "closing";      // no new starts; running sittings finish
  return "closed";
}

// Finds or makes the mock for `weekKey`. Making it twice at once is safe:
// the unique (examMode, weekKey) index keeps one, the loser re-reads it.
export async function getOrCreateMock(examMode, weekKey) {
  const found = await AllIndiaMock.findOne({ examMode, weekKey });
  if (found) return found;

  const earlier = await AllIndiaMock.find({ examMode }).select("pyqRefs").lean();
  const avoid = new Set(earlier.flatMap((m) => m.pyqRefs ?? []));
  const paper = await buildFullPaper(examMode, { mix: ALL_INDIA_MIX[examMode], avoid, bankFilter: { difficulty: "tough" } });
  if (paper.shortfall) return null;

  const { opensAt, closesAt, lastStartAt } = windowFor(weekKey, paper.durationMinutes);
  try {
    return await AllIndiaMock.create({
      examMode, weekKey,
      title: `${EXAM_TITLE[examMode]} All-India Mock · ${prettyDate(weekKey)}`,
      opensAt, closesAt, lastStartAt,
      durationMinutes: paper.durationMinutes,
      maxMarks: paper.maxMarks,
      questions: paper.questions,
      pyqRefs: paper.questions.map((q) => q.pyqRef).filter(Boolean),
    });
  } catch (err) {
    if (err?.code === 11000) return AllIndiaMock.findOne({ examMode, weekKey });
    throw err;
  }
}

export function studentCode(mockId, userId) {
  const h = crypto.createHash("sha256").update(`${mockId}:${userId}`).digest("hex");
  return `#${parseInt(h.slice(0, 8), 16).toString(36).toUpperCase().padStart(4, "0").slice(-4)}`;
}

// Sittings that count: submitted within the time limit (+ 10 min grace).
async function countedSittings(mock) {
  const rows = await TestAttempt.find({ allIndiaMockId: mock._id, status: "submitted" })
    .select("userId marksObtained startedAt submittedAt").lean();
  const limit = mock.durationMinutes * 60 * 1000 + GRACE_MS;
  return rows
    .filter((r) => r.submittedAt && r.submittedAt - r.startedAt <= limit && r.submittedAt <= mock.closesAt.getTime() + GRACE_MS)
    .map((r) => ({
      userId: String(r.userId),
      marks: r.marksObtained ?? 0,
      ms: Math.max(0, r.submittedAt - r.startedAt),
    }))
    .sort((a, b) => b.marks - a.marks || a.ms - b.ms);
}

export async function leaderboard(mock, userId, now = new Date()) {
  const rows = await countedSittings(mock);
  const n = rows.length;
  const top = rows.slice(0, 10).map((r, i) => ({
    rank: i + 1,
    code: studentCode(mock._id, r.userId),
    marks: r.marks,
    minutes: Math.round(r.ms / 60000),
    you: r.userId === String(userId),
  }));
  const myIndex = rows.findIndex((r) => r.userId === String(userId));
  let me = null;
  if (myIndex >= 0) {
    const mine = rows[myIndex];
    const atOrBelow = rows.filter((r) => r.marks <= mine.marks).length;
    me = {
      rank: myIndex + 1,
      code: studentCode(mock._id, userId),
      marks: mine.marks,
      minutes: Math.round(mine.ms / 60000),
      // NTA's way: share of candidates who scored the same or less, × 100
      percentile: Math.round((atOrBelow / n) * 100 * 100) / 100,
    };
  }
  const avg = n ? Math.round((rows.reduce((s, r) => s + r.marks, 0) / n) * 10) / 10 : null;
  return {
    final: statusOf(mock, now) === "closed",
    participants: n,
    topperMarks: n ? rows[0].marks : null,
    averageMarks: avg,
    maxMarks: mock.maxMarks,
    me,
    top,
  };
}

export async function summary(mock, userId, now = new Date()) {
  if (!mock) return null;
  const mine = await TestAttempt.findOne({ allIndiaMockId: mock._id, userId })
    .select("status marksObtained").lean();
  const participants = await TestAttempt.countDocuments({ allIndiaMockId: mock._id, status: "submitted" });
  return {
    id: mock._id,
    title: mock.title,
    examMode: mock.examMode,
    weekKey: mock.weekKey,
    opensAt: mock.opensAt,
    lastStartAt: mock.lastStartAt,
    closesAt: mock.closesAt,
    durationMinutes: mock.durationMinutes,
    maxMarks: mock.maxMarks,
    totalQuestions: mock.questions.length,
    pyqCount: mock.questions.filter((q) => q.source === "pyq").length,
    status: statusOf(mock, now),
    participants,
    mine: mine ? { attemptId: mine._id, status: mine.status, marksObtained: mine.status === "submitted" ? mine.marksObtained : null } : null,
  };
}
