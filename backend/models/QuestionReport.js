// ============================================================
//  JNEET+ AI — models/QuestionReport.js
//  A student flags a question from a result review or a Revision
//  session ("answer is wrong", "typo", …). One report per student per
//  question (re-reporting updates it). A snapshot of exactly what the
//  student saw is kept, because a re-seed can change or remove the
//  live question.
// ============================================================

import mongoose from "mongoose";

export const REPORT_REASONS = ["wrong_answer", "wrong_question", "typo", "out_of_syllabus", "other"];

const questionReportSchema = new mongoose.Schema(
  {
    userId:     { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    questionId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    attemptId:  { type: mongoose.Schema.Types.ObjectId, required: true },
    reason:     { type: String, enum: REPORT_REASONS, required: true },
    note:       { type: String, default: "", maxlength: 500 },
    status:     { type: String, enum: ["open", "fixed", "dismissed"], default: "open", index: true },
    snapshot: {
      examMode: String, subject: String, chapter: String, type: { type: String },
      questionText: String, options: [String], correctIndex: Number, answers: [String], explanation: String,
    },
    resolvedAt: Date,
  },
  { timestamps: true }
);

questionReportSchema.index({ userId: 1, questionId: 1 }, { unique: true });
questionReportSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model("QuestionReport", questionReportSchema);
