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
    questionText: {
      type: String,
      required: true,
      trim: true,
    },
    options: {
      type: [String],
      required: true,
      validate: {
        validator: (v) => v.length === 4,
        message: "A question must have exactly 4 options.",
      },
    },
    correctIndex: {
      type: Number,
      required: true,
      min: 0,
      max: 3,
    },
    explanation: {
      type: String,
      default: "",
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