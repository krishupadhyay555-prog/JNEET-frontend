// ============================================================
//  JNEET+ AI — controllers/testController.js  (v2 — Test/Revision modes)
//  ADDED: startFullTest() — generates a full NEET (180Q/720 marks)
//  or JEE (75Q/300 marks) mock, pulling proportionally across ALL
//  chapters within each subject (not filtered by chapter or
//  difficulty — mimics a real exam's natural spread).
//  CHANGED: startTest() (chapter-wise revision) now also stores
//  subject/chapter on each question snapshot (needed for the
//  upcoming WMS aggregation). submitTest() now always computes
//  marksObtained (+4/-1) alongside the existing percentage score —
//  harmless for revision, meaningful for test mode.
//  Content-safety: startFullTest() checks there are ENOUGH
//  questions per subject BEFORE creating anything — a half-built
//  "720 mark test" that's actually 6 questions would be worse than
//  a clear "not enough content yet" error.
// ============================================================

import Question    from "../models/Question.js";
import TestAttempt from "../models/TestAttempt.js";

const SUBJECTS_BY_EXAM = {
  NEET: ["Physics", "Chemistry", "Biology"],
  JEE:  ["Physics", "Chemistry", "Mathematics"],
};

// Full-test subject distribution — verified against the official
// 2026 NEET/JEE Main patterns (see conversation notes).
const FULL_TEST_CONFIG = {
  NEET: {
    maxMarks: 720,
    subjects: [
      { subject: "Physics",   count: 45 },
      { subject: "Chemistry", count: 45 },
      { subject: "Biology",   count: 90 },
    ],
  },
  JEE: {
    maxMarks: 300,
    // Simplified to all-MCQ for now (JEE's official 5 Numerical-
    // Value Questions per subject are deferred — see conversation
    // notes). 25 MCQ per subject instead of the official 20+5 split.
    subjects: [
      { subject: "Physics",     count: 25 },
      { subject: "Chemistry",  count: 25 },
      { subject: "Mathematics", count: 25 },
    ],
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

async function pickForDifficulty(baseFilter, difficulty, count, excludeIds) {
  if (count <= 0) return [];
  const filter = { ...baseFilter, difficulty };

  let picked = await Question.aggregate([
    { $match: { ...filter, _id: { $nin: excludeIds } } },
    { $sample: { size: count } },
  ]);

  if (picked.length < count) {
    const pickedIds = picked.map((q) => q._id);
    const more = await Question.aggregate([
      { $match: { ...filter, _id: { $nin: pickedIds } } },
      { $sample: { size: count - picked.length } },
    ]);
    picked = picked.concat(more);
  }

  return picked;
}

// Same pooling pattern as pickForDifficulty, but for full tests —
// pulls across ALL chapters and difficulties within one subject,
// since a real exam's spread isn't filtered by either.
async function pickRandomForSubject(examMode, subject, count, excludeIds) {
  if (count <= 0) return [];
  const filter = { examMode, subject };

  let picked = await Question.aggregate([
    { $match: { ...filter, _id: { $nin: excludeIds } } },
    { $sample: { size: count } },
  ]);

  if (picked.length < count) {
    const pickedIds = picked.map((q) => q._id);
    const more = await Question.aggregate([
      { $match: { ...filter, _id: { $nin: pickedIds } } },
      { $sample: { size: count - picked.length } },
    ]);
    picked = picked.concat(more);
  }

  return picked;
}

// ── POST /test/start — chapter-wise revision (unchanged behavior,
// now also snapshots subject/chapter per question) ─────────────
export const startTest = async (req, res, next) => {
  try {
    const { subject, chapter, easy = 0, moderate = 0, tough = 0 } = req.body;
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
      .select("questions.questionId")
      .lean();

    const excludeIds = lastAttempt
      ? lastAttempt.questions.map((q) => q.questionId)
      : [];

    const [easyQ, moderateQ, toughQ] = await Promise.all([
      pickForDifficulty(baseFilter, "easy",     easy,     excludeIds),
      pickForDifficulty(baseFilter, "moderate", moderate, excludeIds),
      pickForDifficulty(baseFilter, "tough",    tough,    excludeIds),
    ]);

    const combined = shuffleArray([...easyQ, ...moderateQ, ...toughQ]);

    if (combined.length === 0) {
      return res.status(404).json({
        success: false,
        error: `No questions available yet for ${chapter} (${subject}). Check back once more content is added.`,
      });
    }

    const shuffled = combined.map(shuffleOptions);

    const attempt = await TestAttempt.create({
      userId: req.user.id,
      examMode,
      subject,
      chapter,
      mode: "revision",
      difficultyMix: { easy, moderate, tough },
      questions: shuffled.map((q) => ({
        questionId:    q._id,
        subject:       q.subject,
        chapter:       q.chapter,
        questionText:  q.questionText,
        options:       q.options,
        correctIndex:  q.correctIndex,
        selectedIndex: null,
        imageUrl:      q.imageUrl || null,
        explanation:   q.explanation || "",
      })),
      totalQuestions: shuffled.length,
      status: "in-progress",
    });

    return res.json({
      success: true,
      attemptId: attempt._id,
      totalQuestions: attempt.totalQuestions,
      questions: attempt.questions.map((q) => ({
        questionId: q.questionId,
        questionText: q.questionText,
        options: q.options,
        imageUrl: q.imageUrl,
      })),
    });

  } catch (err) {
    next(err);
  }
};

// ── NEW: POST /test/start-full — full NEET/JEE-pattern mock ────
export const startFullTest = async (req, res, next) => {
  try {
    const examMode = req.user.examMode;
    const config = FULL_TEST_CONFIG[examMode] ?? FULL_TEST_CONFIG.NEET;

    // Check enough content exists BEFORE creating anything —
    // a "720 mark test" that's actually 6 questions would be
    // confusing and misleading, not a graceful partial test.
    const shortfalls = [];
    for (const s of config.subjects) {
      const available = await Question.countDocuments({ examMode, subject: s.subject });
      if (available < s.count) {
        shortfalls.push(`${s.subject} (need ${s.count}, have ${available})`);
      }
    }
    if (shortfalls.length > 0) {
      return res.status(404).json({
        success: false,
        error: `Not enough questions yet for a full ${examMode} test. Missing: ${shortfalls.join(", ")}.`,
      });
    }

    let allPicked = [];
    for (const s of config.subjects) {
      const picked = await pickRandomForSubject(examMode, s.subject, s.count, []);
      allPicked = allPicked.concat(picked);
    }

    const shuffled = shuffleArray(allPicked).map(shuffleOptions);

    const attempt = await TestAttempt.create({
      userId: req.user.id,
      examMode,
      subject: "All Subjects",
      chapter: `${examMode} Full Test`,
      mode: "test",
      maxMarks: config.maxMarks,
      questions: shuffled.map((q) => ({
        questionId:    q._id,
        subject:       q.subject,
        chapter:       q.chapter,
        questionText:  q.questionText,
        options:       q.options,
        correctIndex:  q.correctIndex,
        selectedIndex: null,
        imageUrl:      q.imageUrl || null,
        explanation:   q.explanation || "",
      })),
      totalQuestions: shuffled.length,
      status: "in-progress",
    });

    return res.json({
      success: true,
      attemptId: attempt._id,
      totalQuestions: attempt.totalQuestions,
      maxMarks: attempt.maxMarks,
      questions: attempt.questions.map((q) => ({
        questionId: q.questionId,
        questionText: q.questionText,
        options: q.options,
        imageUrl: q.imageUrl,
      })),
    });

  } catch (err) {
    next(err);
  }
};

// ── POST /test/:attemptId/submit ────────────────────────────
export const submitTest = async (req, res, next) => {
  try {
    const { attemptId } = req.params;
    const { answers } = req.body;

    const attempt = await TestAttempt.findOne({ _id: attemptId, userId: req.user.id });
    if (!attempt) {
      return res.status(404).json({ success: false, error: "Test attempt not found." });
    }
    if (attempt.status === "submitted") {
      return res.status(409).json({ success: false, error: "This test was already submitted." });
    }

    const answerMap = new Map(
      answers.map((a) => [a.questionId, a.selectedIndex])
    );

    let correctCount = 0, wrongCount = 0, unattemptedCount = 0;

    attempt.questions.forEach((q) => {
      const key = q.questionId.toString();
      const selected = answerMap.has(key) ? answerMap.get(key) : null;
      q.selectedIndex = selected;

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

    // +4/-1 marking — computed always (harmless for revision,
    // where the frontend simply won't show it), primary display
    // for "test" mode.
    attempt.marksObtained = correctCount * 4 - wrongCount * 1;

    attempt.status      = "submitted";
    attempt.submittedAt = new Date();

    await attempt.save();

    return res.json({ success: true, attempt });

  } catch (err) {
    next(err);
  }
};

// ── GET /test/:attemptId — for the review/result screen ─────
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
            questionId:    q.questionId,
            subject:       q.subject,
            chapter:       q.chapter,
            questionText:  q.questionText,
            options:       q.options,
            selectedIndex: q.selectedIndex,
            imageUrl:      q.imageUrl,
          })),
        },
      });
    }

    return res.json({ success: true, attempt });

  } catch (err) {
    next(err);
  }
};

// ── GET /test/chapters?subject=Physics ──────────────────────
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

    const match = { examMode };
    if (subject) match.subject = subject;

    const rows = await Question.aggregate([
      { $match: match },
      {
        $group: {
          _id: { subject: "$subject", chapter: "$chapter", difficulty: "$difficulty" },
          count: { $sum: 1 },
        },
      },
    ]);

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

    return res.json({ success: true, chapters: Object.values(chapterMap) });

  } catch (err) {
    next(err);
  }
};

// ── GET /test/history — past attempts list (no question data) ─
export const getHistory = async (req, res, next) => {
  try {
    const attempts = await TestAttempt.find({
      userId: req.user.id,
      status: "submitted",
    })
      .select("-questions")
      .sort({ submittedAt: -1 })
      .limit(50)
      .lean();

    return res.json({ success: true, attempts });

  } catch (err) {
    next(err);
  }
};