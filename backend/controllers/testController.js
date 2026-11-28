// ============================================================
//  JNEET+ AI — controllers/testController.js  (v3 — instant-
//  feedback answer endpoint for Revision mode)
//  ADDED: answerQuestion() — POST /test/:attemptId/answer. Records
//  ONE answer (or skip, selectedIndex: null) into the attempt
//  document immediately (so progress survives a refresh/crash) and
//  returns { isCorrect, correctIndex, explanation } right away —
//  this is what powers the "instant red/green feedback" revision
//  flow, distinct from the existing submit-at-end Mock Test flow.
//  Explicitly rejects mode "test" (720/300-mark full mocks must
//  stay submit-at-end, no mid-test answer leaking) and an already-
//  submitted attempt.
//  Does NOT touch correctCount/wrongCount/score/status — those are
//  still computed by the EXISTING submitTest() below, which the
//  frontend calls once at the very end of a revision session with
//  the full accumulated answers array. No duplicate scoring logic.
//  Everything else in this file — UNCHANGED from v2.
// ============================================================

import { env } from "../config/env.js";
import Question    from "../models/Question.js";
import TestAttempt from "../models/TestAttempt.js";
import { recordMistakes } from "../services/mistakes.js";
import { analyseAttempt } from "../services/testAnalysis.js";
import AllIndiaMock from "../models/AllIndiaMock.js";
import { isBlankCorrect } from "../services/blankAnswer.js";
import { samplePyq, samplePyqChapter, pyqChapterCounts, pyqSnapshot, sameNumber } from "../services/pyqPool.js";

const SUBJECTS_BY_EXAM = {
  NEET: ["Physics", "Chemistry", "Biology"],
  JEE:  ["Physics", "Chemistry", "Mathematics"],
};

const FULL_TEST_CONFIG = {
  NEET: {
    maxMarks: 720,
    durationMinutes: 200,   // NTA: 3h 20m
    subjects: [
      { subject: "Physics",   count: 45 },
      { subject: "Chemistry", count: 45 },
      { subject: "Biology",   count: 90 },
    ],
  },
  JEE: {
    maxMarks: 300,
    durationMinutes: 180,   // NTA: 3h
    // NTA's JEE Main paper order (2024–2026 papers): Mathematics, Physics, Chemistry.
    subjects: [
      { subject: "Mathematics", count: 25 },
      { subject: "Physics",     count: 25 },
      { subject: "Chemistry",   count: 25 },
    ],
  },
};

// Real PYQs mixed into every full mock (founder, 19 Nov 2026). Per section:
// `mcq` PYQ MCQs + `numeric` PYQ numericals (JEE Section B: 5 per subject,
// NTA marking +4/−1); the rest of the section comes from our question bank.
// If the PYQ pool runs short, the bank fills the gap.
const PYQ_MIX = {
  NEET: { Physics: { mcq: 15 }, Chemistry: { mcq: 15 }, Biology: { mcq: 30 } },
  JEE:  {
    Mathematics: { mcq: 10, numeric: 5 },
    Physics:     { mcq: 10, numeric: 5 },
    Chemistry:   { mcq: 10, numeric: 5 },
  },
};

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function shuffleOptions(q) {
  const order = shuffleArray([0, 1, 2, 3]);
  return {
    ...q,
    options: order.map((i) => q.options[i]),
    correctIndex: order.indexOf(q.correctIndex),
  };
}

// Only Main-level MCQs are served by default. JEE Advanced questions sit
// in the bank (level: "advanced") until the Advanced pack launches, and
// fill-in-the-blanks are Revision-only (a caller that wants them passes
// type: "fill_blank" in its own filter, which overrides this one).
// $ne also matches older documents that have no level / type field.
export const SERVABLE = { level: { $ne: "advanced" }, type: { $ne: "fill_blank" } };

const normText = (t) => String(t ?? "").toLowerCase().replace(/\s+/g, " ").trim();

// Random sample of `count` questions with NO repeats inside one paper.
// $sample can return the same document twice, and the bank holds a few
// questions with identical text under different ids — both are filtered
// out here. Recently-seen questions (`excludeIds`) are avoided first and
// only used as a fallback when the pool is too small.
async function sampleUnique(filter, count, excludeIds = []) {
  if (count <= 0) return [];
  const picked = [];
  const ids = new Set();
  const texts = new Set();

  const add = (questions) => {
    for (const q of questions) {
      const id = String(q._id);
      const text = normText(q.questionText);
      if (ids.has(id) || texts.has(text)) continue;
      ids.add(id);
      texts.add(text);
      picked.push(q);
      if (picked.length >= count) break;
    }
  };

  for (const avoid of [excludeIds, []]) {
    for (let round = 0; round < 3 && picked.length < count; round++) {
      const more = await Question.aggregate([
        { $match: { ...SERVABLE, ...filter, _id: { $nin: [...avoid, ...picked.map((q) => q._id)] } } },
        { $sample: { size: count - picked.length } },
      ]);
      if (more.length === 0) break;
      add(more);
    }
    if (picked.length >= count) break;
  }
  return picked;
}

function pickForDifficulty(baseFilter, difficulty, count, excludeIds) {
  return sampleUnique({ ...baseFilter, difficulty }, count, excludeIds);
}

function pickRandomForSubject(examMode, subject, count, excludeIds) {
  return sampleUnique({ examMode, subject }, count, excludeIds);
}

// Drops repeats (same id or same text) across several picks.
function dedupe(questions) {
  const seen = new Set();
  return questions.filter((q) => {
    const keys = [String(q._id), normText(q.questionText)];
    if (keys.some((k) => seen.has(k))) return false;
    keys.forEach((k) => seen.add(k));
    return true;
  });
}

// One question as stored inside an attempt (a snapshot — later edits
// to the bank never change an attempt the student already has).
function snapshot(q) {
  if (q.type === "fill_blank") {
    return {
      questionId: q._id, subject: q.subject, chapter: q.chapter, type: "fill_blank",
      questionText: q.questionText, options: [], correctIndex: 0, selectedIndex: null,
      answers: q.answers, textAnswer: null, imageUrl: q.imageUrl || null, explanation: q.explanation || "",
    };
  }
  const s = shuffleOptions(q);
  return {
    questionId: s._id, subject: s.subject, chapter: s.chapter, type: "mcq",
    questionText: s.questionText, options: s.options, correctIndex: s.correctIndex, selectedIndex: null,
    imageUrl: s.imageUrl || null, explanation: s.explanation || "",
  };
}

// What the student may see of an unanswered question: never the answer.
export function publicQuestion(q) {
  const out = {
    questionId: q.questionId,
    type: q.type ?? "mcq",
    subject: q.subject,
    chapter: q.chapter,
    questionText: q.questionText ?? "",
    options: q.options ?? [],
    imageUrl: q.imageUrl ?? null,
  };
  if (q.source === "pyq") {
    Object.assign(out, {
      source: "pyq", pyqLabel: q.pyqLabel, imageW: q.imageW ?? null, figUrl: q.figUrl ?? null,
      optionImages: q.optionImages ?? [], optionImageW: q.optionImageW ?? [], optionsInImage: q.optionsInImage === true,
    });
  }
  return out;
}

// Shared by chapter Revision and the chat "Pichli baar ka recap".
export async function createRevisionAttempt({ userId, examMode, subject, chapter, difficultyMix, questions }) {
  // PYQs arrive already as snapshots (services/pyqPool.js pyqSnapshot)
  const snaps = questions.map((q) => (q.source === "pyq" ? q : snapshot(q)));
  return TestAttempt.create({
    userId, examMode, subject, chapter,
    mode: "revision",
    difficultyMix: difficultyMix ?? { easy: 0, moderate: 0, tough: 0 },
    questions: snaps,
    totalQuestions: snaps.length,
    status: "in-progress",
  });
}

export function revisionStartResponse(attempt) {
  return {
    success: true,
    attemptId: attempt._id,
    totalQuestions: attempt.totalQuestions,
    questions: attempt.questions.map(publicQuestion),
  };
}

export const startTest = async (req, res, next) => {
  try {
    const { subject, chapter, easy = 0, moderate = 0, tough = 0, blanks = 0, pyq = 0 } = req.body;
    const examMode = req.user.examMode;

    const validSubjects = SUBJECTS_BY_EXAM[examMode] ?? SUBJECTS_BY_EXAM.NEET;
    if (!validSubjects.includes(subject)) {
      return res.status(400).json({
        success: false,
        error: `${subject} is not part of the ${examMode} syllabus.`,
      });
    }

    const baseFilter = { examMode, subject, chapter };

    const lastAttempt = await TestAttempt.findOne({
      userId: req.user.id, examMode, subject, chapter, mode: "revision", status: "submitted",
    })
      .sort({ submittedAt: -1 })
      .select("questions.questionId questions.pyqRef")
      .lean();

    const excludeIds = lastAttempt
      ? lastAttempt.questions.filter((q) => !q.pyqRef).map((q) => q.questionId)
      : [];
    const avoidPyq = new Set((lastAttempt?.questions ?? []).map((q) => q.pyqRef).filter(Boolean));

    const [easyQ, moderateQ, toughQ, blankQ] = await Promise.all([
      pickForDifficulty(baseFilter, "easy",     easy,     excludeIds),
      pickForDifficulty(baseFilter, "moderate", moderate, excludeIds),
      pickForDifficulty(baseFilter, "tough",    tough,    excludeIds),
      sampleUnique({ ...baseFilter, type: "fill_blank" }, blanks, excludeIds),
    ]);

    const pyqQ = samplePyqChapter(examMode, subject, chapter, pyq, avoidPyq).map(pyqSnapshot);
    const combined = shuffleArray([...dedupe([...easyQ, ...moderateQ, ...toughQ, ...blankQ]), ...pyqQ]);

    if (combined.length === 0) {
      return res.status(404).json({
        success: false,
        error: `No questions available yet for ${chapter} (${subject}). Check back once more content is added.`,
      });
    }

    const attempt = await createRevisionAttempt({
      userId: req.user.id, examMode, subject, chapter,
      difficultyMix: { easy, moderate, tough },
      questions: combined,
    });

    return res.json(revisionStartResponse(attempt));

  } catch (err) {
    next(err);
  }
};

// One full NTA-pattern paper as attempt snapshots. Shared by the student's own
// full mock and the weekly All-India Mock (services/allIndiaMock.js).
//   mix:        per-subject PYQ counts (PYQ_MIX shape)
//   avoid:      PYQ refs to avoid while enough fresh ones are left
//   bankFilter: extra filter for bank questions (All-India: { difficulty: "tough" } first)
// Returns { questions } or { shortfall: "Physics (need 10, have 3), …" }.
export async function buildFullPaper(examMode, { mix = PYQ_MIX[examMode] ?? {}, avoid = new Set(), bankFilter = null } = {}) {
  const config = FULL_TEST_CONFIG[examMode] ?? FULL_TEST_CONFIG.NEET;
  const plan = config.subjects.map((s) => {
    const m = mix[s.subject] ?? {};
    const numeric = samplePyq(examMode, s.subject, "numeric", Math.min(m.numeric ?? 0, s.count), avoid);
    const mcq = samplePyq(examMode, s.subject, "mcq", Math.min(m.mcq ?? 0, s.count - numeric.length), avoid);
    return { ...s, pyqMcq: mcq, pyqNumeric: numeric, bankCount: s.count - mcq.length - numeric.length };
  });

  const shortfalls = [];
  for (const s of plan) {
    const available = await Question.countDocuments({ examMode, subject: s.subject, ...SERVABLE });
    if (available < s.bankCount) shortfalls.push(`${s.subject} (need ${s.bankCount}, have ${available})`);
  }
  if (shortfalls.length > 0) return { shortfall: shortfalls.join(", ") };

  // Like the real NTA paper: one section per subject in NTA's order, MCQs
  // first (bank + PYQ shuffled together), then the numericals (Section B).
  const toSnap = (q) => {
    const o = shuffleOptions(q);
    return {
      questionId: o._id, source: "bank", subject: o.subject, chapter: o.chapter, type: "mcq",
      questionText: o.questionText, options: o.options, correctIndex: o.correctIndex, selectedIndex: null,
      imageUrl: o.imageUrl || null, explanation: o.explanation || "",
    };
  };
  const snaps = [];
  for (const s of plan) {
    let bankQs = [];
    if (bankFilter) bankQs = await sampleUnique({ examMode, subject: s.subject, ...bankFilter }, s.bankCount);
    if (bankQs.length < s.bankCount) {
      const more = await pickRandomForSubject(examMode, s.subject, s.bankCount - bankQs.length, bankQs.map((q) => q._id));
      bankQs = [...bankQs, ...more];
    }
    const mcqs = shuffleArray([...bankQs.map(toSnap), ...s.pyqMcq.map(pyqSnapshot)]);
    snaps.push(...mcqs, ...s.pyqNumeric.map(pyqSnapshot));
  }
  const seen = new Set();
  const questions = snaps.filter((q) => {
    const key = String(q.questionId);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  return { questions, maxMarks: config.maxMarks, durationMinutes: config.durationMinutes };
}

export const startFullTest = async (req, res, next) => {
  try {
    const examMode = req.user.examMode;

    // PYQs the student met in the last 10 mocks are avoided while enough are left.
    const recent = await TestAttempt.find({ userId: req.user.id, examMode, mode: "test" })
      .sort({ startedAt: -1 }).limit(10).select("questions.pyqRef").lean();
    const avoid = new Set(recent.flatMap((t) => t.questions.map((q) => q.pyqRef).filter(Boolean)));

    const paper = await buildFullPaper(examMode, { avoid });
    if (paper.shortfall) {
      return res.status(404).json({
        success: false,
        error: `Not enough questions yet for a full ${examMode} test. Missing: ${paper.shortfall}.`,
      });
    }
    const { questions } = paper;

    const attempt = await TestAttempt.create({
      userId: req.user.id,
      examMode,
      subject: "All Subjects",
      chapter: `${examMode} Full Test`,
      mode: "test",
      maxMarks: paper.maxMarks,
      durationMinutes: paper.durationMinutes,
      questions,
      totalQuestions: questions.length,
      status: "in-progress",
    });

    return res.json({
      success: true,
      attemptId: attempt._id,
      totalQuestions: attempt.totalQuestions,
      maxMarks: attempt.maxMarks,
      durationMinutes: attempt.durationMinutes,
      startedAt: attempt.startedAt,
      pyqCount: questions.filter((q) => q.source === "pyq").length,
      questions: attempt.questions.map(publicQuestion),
    });

  } catch (err) {
    next(err);
  }
};

// ── NEW: POST /test/:attemptId/answer — instant per-question
// feedback (revision mode only) ────────────────────────────────
export const answerQuestion = async (req, res, next) => {
  try {
    const { attemptId } = req.params;
    const { questionId, selectedIndex = null, textAnswer = null } = req.body;

    const attempt = await TestAttempt.findOne({ _id: attemptId, userId: req.user.id });
    if (!attempt) {
      return res.status(404).json({ success: false, error: "Test attempt not found." });
    }

    if (attempt.mode !== "revision") {
      return res.status(400).json({
        success: false,
        error: "Instant feedback is only available in revision mode.",
      });
    }

    if (attempt.status === "submitted") {
      return res.status(409).json({ success: false, error: "This revision was already finished." });
    }

    const question = attempt.questions.find(
      (q) => q.questionId.toString() === questionId
    );
    if (!question) {
      return res.status(404).json({ success: false, error: "Question not found in this attempt." });
    }
    // One answer per question: once the key has been shown, it can't be re-answered.
    if (question.selectedIndex !== null && question.selectedIndex !== undefined) {
      return res.status(409).json({ success: false, code: "ALREADY_ANSWERED", error: "You've already answered this question." });
    }

    if (question.type === "fill_blank") {
      const typed = typeof textAnswer === "string" ? textAnswer.trim() : "";
      const isCorrect = typed ? isBlankCorrect(typed, question.answers) : false;
      question.textAnswer = typed || null;
      question.selectedIndex = typed ? (isCorrect ? 0 : 1) : null;
      await attempt.save();
      return res.json({
        success: true,
        type: "fill_blank",
        isCorrect,
        selectedIndex: question.selectedIndex,
        correctIndex: 0,
        correctAnswer: question.answers?.[0] ?? "",
        acceptedAnswers: question.answers ?? [],
        explanation: question.explanation || "",
      });
    }

    if (question.type === "numeric") {
      // A PYQ numerical: the typed number against NTA's value(s).
      const typed = typeof textAnswer === "string" ? textAnswer.trim().slice(0, 20) : "";
      const isCorrect = typed ? (question.answers ?? []).some((a) => sameNumber(typed, a)) : false;
      question.textAnswer = typed || null;
      question.selectedIndex = typed ? (isCorrect ? 0 : 1) : null;
      await attempt.save();
      return res.json({
        success: true,
        type: "numeric",
        isCorrect,
        selectedIndex: question.selectedIndex,
        correctIndex: 0,
        correctAnswer: question.answers?.[0] ?? "",
        acceptedAnswers: question.answers ?? [],
        explanation: question.explanation || "",
      });
    }

    question.selectedIndex = selectedIndex;
    await attempt.save();

    return res.json({
      success: true,
      type: "mcq",
      isCorrect: selectedIndex !== null && selectedIndex === question.correctIndex,
      correctIndex: question.correctIndex,
      explanation: question.explanation || "",
    });

  } catch (err) {
    next(err);
  }
};

export const submitTest = async (req, res, next) => {
  try {
    const { attemptId } = req.params;
    const { answers } = req.body;

    // Claim the attempt atomically: only ONE submit can score it.
    const now = new Date();
    const attempt = await TestAttempt.findOneAndUpdate(
      { _id: attemptId, userId: req.user.id, status: { $ne: "submitted" },
        $or: [{ submittingAt: null }, { submittingAt: { $lt: new Date(now.getTime() - 30_000) } }] },
      { $set: { submittingAt: now } },
      { new: true }
    );
    if (!attempt) {
      const exists = await TestAttempt.exists({ _id: attemptId, userId: req.user.id });
      if (!exists) return res.status(404).json({ success: false, error: "Test attempt not found." });
      return res.status(409).json({ success: false, error: "This test was already submitted." });
    }

    const answerMap = new Map(
      answers.map((a) => [a.questionId, a.selectedIndex])
    );
    const textMap = new Map(answers.map((a) => [a.questionId, a.textAnswer]));
    const timeMap = new Map(answers.filter((a) => Number.isInteger(a.timeSec)).map((a) => [a.questionId, a.timeSec]));

    let correctCount = 0, wrongCount = 0, unattemptedCount = 0;

    attempt.questions.forEach((q) => {
      const key = q.questionId.toString();
      // Fill-in-the-blank: the server already recorded 0 / 1 / null in /answer.
      let selected;
      if (q.type === "fill_blank") selected = q.selectedIndex;
      else if (q.type === "numeric" && attempt.mode === "revision") selected = q.selectedIndex;   // checked in /answer
      // Revision MCQ already answered in /answer (key shown): keep THAT answer.
      else if (attempt.mode === "revision" && q.selectedIndex !== null && q.selectedIndex !== undefined) selected = q.selectedIndex;
      else if (q.type === "numeric") {
        // A typed number: kept as typed, marked 0 (right) / 1 (wrong) / null (left blank).
        const typed = typeof textMap.get(key) === "string" ? textMap.get(key).trim().slice(0, 20) : "";
        q.textAnswer = typed || null;
        selected = typed ? ((q.answers ?? []).some((a) => sameNumber(typed, a)) ? 0 : 1) : null;
      } else selected = answerMap.has(key) ? answerMap.get(key) : null;
      q.selectedIndex = selected;
      if (attempt.mode === "test" && timeMap.has(key)) q.timeSpentSec = Math.min(timeMap.get(key), 3600);

      if (selected === null || selected === undefined) {
        unattemptedCount += 1;
      } else if (selected === q.correctIndex) {
        correctCount += 1;
      } else {
        wrongCount += 1;
      }
    });

    attempt.correctCount     = correctCount;
    attempt.wrongCount       = wrongCount;
    attempt.unattemptedCount = unattemptedCount;
    attempt.score            = Math.round((correctCount / attempt.totalQuestions) * 100);
    attempt.marksObtained    = correctCount * 4 - wrongCount * 1;

    attempt.status      = "submitted";
    attempt.submittedAt = new Date();

    await attempt.save();

    // Mistake Notebook (All-India: only after the mock closes — see getAttempt).
    if (!attempt.allIndiaMockId) await recordMistakes(attempt).catch((e) => console.error("[mistakes]", e.message));

    if (attempt.allIndiaMockId) {
      // Never send the answer key back while the mock is still open.
      const { questions: _q, ...rest } = attempt.toObject();
      return res.json({ success: true, attempt: rest });
    }
    return res.json({ success: true, attempt });

  } catch (err) {
    next(err);
  }
};

export const getAttempt = async (req, res, next) => {
  try {
    const attempt = await TestAttempt.findOne({
      _id: req.params.attemptId,
      userId: req.user.id,
    }).lean();

    if (!attempt) {
      return res.status(404).json({ success: false, error: "Test attempt not found." });
    }

    if (attempt.status !== "submitted") {
      return res.json({
        success: true,
        attempt: {
          ...attempt,
          questions: attempt.questions.map((q) => ({
            ...publicQuestion(q),
            selectedIndex: q.selectedIndex,
            textAnswer:    q.textAnswer ?? null,
          })),
        },
      });
    }

    // All-India Mock: answers stay hidden until the mock closes for everyone,
    // so a student who finished early cannot pass them on.
    if (attempt.allIndiaMockId) {
      const mock = await AllIndiaMock.findById(attempt.allIndiaMockId).select("closesAt").lean();
      if (mock && Date.now() <= mock.closesAt.getTime()) {
        return res.json({
          success: true,
          attempt: {
            ...attempt,
            reviewOpensAt: mock.closesAt,
            questions: attempt.questions.map((q) => ({
              ...publicQuestion(q),
              selectedIndex: q.type === "numeric" || q.type === "fill_blank" ? null : q.selectedIndex,
              textAnswer: q.textAnswer ?? null,
            })),
          },
        });
      }
      if (!attempt.mistakesLogged) await recordMistakes(attempt).catch((e) => console.error("[mistakes]", e.message));
    }

    return res.json({ success: true, attempt });

  } catch (err) {
    next(err);
  }
};

// GET /api/test/:attemptId/analysis — Elite deep analysis (route is tier-gated).
export const getAnalysis = async (req, res, next) => {
  try {
    const attempt = await TestAttempt.findOne({ _id: req.params.attemptId, userId: req.user.id }).lean();
    if (!attempt || attempt.status !== "submitted") {
      return res.status(404).json({ success: false, error: "Submitted test not found." });
    }
    if (attempt.allIndiaMockId) {
      const mock = await AllIndiaMock.findById(attempt.allIndiaMockId).select("closesAt").lean();
      if (mock && Date.now() <= mock.closesAt.getTime()) {
        return res.status(409).json({ success: false, code: "REVIEW_LOCKED", reviewOpensAt: mock.closesAt, error: "Analysis opens when the All-India Mock closes." });
      }
    }
    return res.json({ success: true, analysis: await analyseAttempt(attempt) });
  } catch (err) {
    next(err);
  }
};

// The chapter list only changes when the question bank is re-seeded, but
// building it scans the whole bank (two aggregations, ~300 ms). Load test
// 14 Nov 2026: this one route was 30× slower than every other page, so the
// result is kept in memory for 10 minutes per exam + subject.
const CHAPTER_CACHE_MS = env.NODE_ENV === "test" ? 0 : 10 * 60 * 1000;
const chapterCache = new Map();
async function chapterCounts(match) {
  const key = JSON.stringify(match);
  const hit = chapterCache.get(key);
  if (hit && Date.now() - hit.at < CHAPTER_CACHE_MS) return hit.value;
  const [rows, blankRows] = await Promise.all([
    Question.aggregate([
      { $match: match },
      { $group: { _id: { subject: "$subject", chapter: "$chapter", difficulty: "$difficulty" }, count: { $sum: 1 } } },
    ]),
    Question.aggregate([
      { $match: { ...match, type: "fill_blank" } },
      { $group: { _id: { subject: "$subject", chapter: "$chapter" }, count: { $sum: 1 } } },
    ]),
  ]);
  const value = { rows, blankRows };
  if (CHAPTER_CACHE_MS) chapterCache.set(key, { at: Date.now(), value });
  return value;
}

export const getAvailableChapters = async (req, res, next) => {
  try {
    const { subject } = req.query;
    const examMode = req.user.examMode;

    const validSubjects = SUBJECTS_BY_EXAM[examMode] ?? SUBJECTS_BY_EXAM.NEET;
    if (subject && !validSubjects.includes(subject)) {
      return res.status(400).json({
        success: false,
        error: `${subject} is not part of the ${examMode} syllabus.`,
      });
    }

    const match = { examMode, ...SERVABLE };
    if (subject) match.subject = subject;

    const { rows, blankRows } = await chapterCounts(match);

    const chapterMap = {};
    for (const row of rows) {
      const key = `${row._id.subject}::${row._id.chapter}`;
      if (!chapterMap[key]) {
        chapterMap[key] = {
          subject: row._id.subject,
          chapter: row._id.chapter,
          easy: 0, moderate: 0, tough: 0, total: 0,
        };
      }
      chapterMap[key][row._id.difficulty] = row.count;
      chapterMap[key].total += row.count;
    }

    for (const row of blankRows) {
      const key = `${row._id.subject}::${row._id.chapter}`;
      if (chapterMap[key]) chapterMap[key].blanks = row.count;
    }
    for (const c of Object.values(chapterMap)) c.blanks = c.blanks ?? 0;
    const pyqCounts = pyqChapterCounts(examMode);
    for (const c of Object.values(chapterMap)) c.pyq = pyqCounts[`${c.subject}::${c.chapter}`] ?? 0;

    return res.json({ success: true, chapters: Object.values(chapterMap) });

  } catch (err) {
    next(err);
  }
};

export const getHistory = async (req, res, next) => {
  try {
    // Each exam keeps its own history: a student who switches NEET <-> JEE
    // must not see (or have averaged in) the other exam's attempts.
    const filter = { userId: req.user.id, examMode: req.user.examMode, status: "submitted" };

    const [attempts, total] = await Promise.all([
      TestAttempt.find(filter)
        .select("-questions")
        .sort({ submittedAt: -1 })
        .limit(50)
        .lean(),
      TestAttempt.countDocuments(filter),
    ]);

    return res.json({ success: true, attempts, total });

  } catch (err) {
    next(err);
  }
};