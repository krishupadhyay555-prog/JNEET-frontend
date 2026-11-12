// ============================================================
//  JNEET+ AI — models/Question.js
//  The question bank. Compound index matches exactly how
//  testController.js's startTest() filters + $sample-selects, so
//  random selection stays fast even as the bank grows.
// ============================================================

import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    examMode: {
      type: String,
      enum: ["NEET", "JEE"],
      required: true,
    },
    subject: {
      type: String,
      enum: ["Physics", "Chemistry", "Biology", "Mathematics"],
      required: true,
    },
    chapter: {
      type: String,
      required: true,
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ["easy", "moderate", "tough"],
      required: true,
    },
    // "mcq" = 4 options, one correct (tests + revision).
    // "fill_blank" = typed answer, checked against `answers`
    // (Revision only — never served in mock tests; see SERVABLE).
    type: {
      type: String,
      enum: ["mcq", "fill_blank"],
      default: "mcq",
    },
    questionText: {
      type: String,
      required: true,
      trim: true,
    },
    options: {
      type: [String],
      default: undefined,
      validate: {
        validator: function (v) {
          return this.type === "fill_blank" ? !v || v.length === 0 : Array.isArray(v) && v.length === 4;
        },
        message: "An MCQ must have exactly 4 options (a fill-in-the-blank has none).",
      },
    },
    correctIndex: {
      type: Number,
      required: function () { return this.type !== "fill_blank"; },
      min: 0,
      max: 3,
    },
    // Accepted answers for a fill-in-the-blank (first one is shown as
    // "the" answer). Checked by services/blankAnswer.js.
    answers: {
      type: [String],
      default: undefined,
      validate: {
        validator: function (v) {
          return this.type === "fill_blank" ? Array.isArray(v) && v.length > 0 && v.every((a) => String(a).trim()) : !v || v.length === 0;
        },
        message: "A fill-in-the-blank needs at least one accepted answer.",
      },
    },
    explanation: {
      type: String,
      default: "",
    },
    // "main" = NEET UG / JEE Main level (served in tests).
    // "advanced" = JEE Advanced level — stored in the bank but NOT
    // served until the Advanced pack launches (see testController
    // SERVABLE filter). Missing field counts as "main".
    level: {
      type: String,
      enum: ["main", "advanced"],
      default: "main",
    },
    // Optional — set when the question has a diagram/figure,
    // uploaded via POST /api/upload/image (Cloudinary).
    imageUrl: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

// Matches the exact filter shape used in startTest()'s $sample
// queries (examMode + subject + chapter + difficulty together).
questionSchema.index({ examMode: 1, subject: 1, chapter: 1, difficulty: 1 });

export default mongoose.model("Question", questionSchema);