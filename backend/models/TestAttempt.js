// ============================================================
//  JNEET+ AI — models/TestAttempt.js  (v2 — Test/Revision modes)
//  ADDED:
//    - mode: "test" | "revision" — distinguishes a full NEET/JEE-
//      pattern mock (timed, negative-marked, no explanations shown)
//      from chapter-wise practice (no timer, explanations shown).
//    - maxMarks / marksObtained — for "test" mode's +4/-1 scoring
//      (720 for NEET, 300 for JEE). Computed on submit regardless
//      of mode (harmless for revision — just an extra number),
//      but only meaningfully DISPLAYED for test mode.
//    - subject/chapter added to EACH question snapshot — needed
//      because a full test spans MULTIPLE subjects/chapters, unlike
//      chapter-wise revision where every question shares the same
//      one. This is also what the next step (auto-calculated WMS)
//      will aggregate on.
//  Everything else UNCHANGED.
// ============================================================

import mongoose from "mongoose";

const attemptQuestionSchema = new mongoose.Schema(
  {
    questionId:    { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
    subject:       { type: String, required: true },
    chapter:       { type: String, required: true },
    questionText:  { type: String, required: true },
    options:       { type: [String], required: true },
    correctIndex:  { type: Number, required: true },
    selectedIndex: { type: Number, default: null },
    imageUrl:      { type: String, default: null },
    explanation:   { type: String, default: "" },
  },
  { _id: false }
);

const testAttemptSchema = new mongoose.Schema(
  {
    userId:   { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    examMode: { type: String, enum: ["NEET", "JEE"], required: true },

    // For revision: the actual subject/chapter. For a full test:
    // a descriptive label ("All Subjects" / "NEET Full Test") —
    // the REAL per-subject breakdown lives on each question above.
    subject:  { type: String, required: true },
    chapter:  { type: String, required: true },

    mode: {
      type: String,
      enum: ["test", "revision"],
      default: "revision",
    },

    difficultyMix: {
      easy:     { type: Number, default: 0 },
      moderate: { type: Number, default: 0 },
      tough:    { type: Number, default: 0 },
    },

    questions: { type: [attemptQuestionSchema], default: [] },

    totalQuestions:   { type: Number, required: true },
    correctCount:     { type: Number, default: 0 },
    wrongCount:       { type: Number, default: 0 },
    unattemptedCount: { type: Number, default: 0 },
    score:            { type: Number, default: null }, // percentage, 0-100 (revision display)

    // Test-mode (+4/-1) scoring — null for revision attempts.
    maxMarks:      { type: Number, default: null }, // 720 (NEET) / 300 (JEE)
    marksObtained: { type: Number, default: null }, // correct*4 - wrong*1

    status: {
      type: String,
      enum: ["in-progress", "submitted"],
      default: "in-progress",
    },

    startedAt:   { type: Date, default: Date.now },
    submittedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

testAttemptSchema.index({ userId: 1, examMode: 1, subject: 1, chapter: 1, status: 1, submittedAt: -1 });

// Used by the (upcoming) auto-calculated WMS aggregation — groups
// a user's submitted attempts by each question's own subject.
testAttemptSchema.index({ userId: 1, status: 1, "questions.subject": 1 });

export default mongoose.model("TestAttempt", testAttemptSchema);