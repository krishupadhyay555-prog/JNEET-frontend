// ─────────────────────────────────────────────────────────────
//  JNEET+ AI — models/MistakeEntry.js
//  One row per (student, question) that the student got wrong or left
//  blank in a test or revision. It comes back for revision 1 day later,
//  then 3 days later; two right answers in a row clear it. A wrong
//  answer sends it back to "tomorrow". Snapshot `q` keeps the question
//  as it was served (bank or official PYQ), answer included — it is
//  never sent to the client before the student answers.
// ─────────────────────────────────────────────────────────────
import mongoose from "mongoose";

const mistakeSchema = new mongoose.Schema(
  {
    userId:   { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    examMode: { type: String, enum: ["NEET", "JEE"], required: true },
    key:      { type: String, required: true },          // "bank:<id>" | "pyq:<ref>"
    subject:  { type: String, required: true },
    chapter:  { type: String, required: true },
    q:        { type: mongoose.Schema.Types.Mixed, required: true },
    reason:   { type: String, enum: ["wrong", "skipped"], default: "wrong" },
    wrongCount: { type: Number, default: 0 },
    skipCount:  { type: Number, default: 0 },
    stage:      { type: Number, default: 0 },             // reviews passed
    streak:     { type: Number, default: 0 },             // right answers in a row
    nextReviewAt:   { type: Date, required: true },
    lastReviewedAt: { type: Date, default: null },
    resolvedAt:     { type: Date, default: null },
    lastAttemptId:  { type: mongoose.Schema.Types.ObjectId, ref: "TestAttempt", default: null },
  },
  { timestamps: true }
);

mistakeSchema.index({ userId: 1, key: 1 }, { unique: true });
mistakeSchema.index({ userId: 1, resolvedAt: 1, nextReviewAt: 1 });

export default mongoose.model("MistakeEntry", mistakeSchema);
