// ============================================================
//  JNEET+ AI — models/AllIndiaMock.js
//  The weekly All-India Mock (founder, 19 Nov 2026): ONE paper per exam
//  per week, the same questions in the same order for every student,
//  open for one Sunday, then an All-India rank list. The paper is kept
//  here (with answers) so every sitting is identical; each student's
//  sitting is a normal TestAttempt with allIndiaMockId set.
// ============================================================

import mongoose from "mongoose";
import { attemptQuestionSchema } from "./TestAttempt.js";

const allIndiaMockSchema = new mongoose.Schema(
  {
    examMode:        { type: String, enum: ["NEET", "JEE"], required: true },
    weekKey:         { type: String, required: true },   // the Sunday it runs, "2026-11-29" (IST)
    title:           { type: String, required: true },   // "JEE Main All-India Mock · 29 Nov 2026"
    opensAt:         { type: Date, required: true },
    lastStartAt:     { type: Date, required: true },     // a sitting must be able to finish by closesAt
    closesAt:        { type: Date, required: true },
    durationMinutes: { type: Number, required: true },
    maxMarks:        { type: Number, required: true },
    questions:       { type: [attemptQuestionSchema], default: [] },
    pyqRefs:         { type: [String], default: [] },     // PYQs used, so later mocks use fresh ones
  },
  { timestamps: true }
);

allIndiaMockSchema.index({ examMode: 1, weekKey: 1 }, { unique: true });

export default mongoose.model("AllIndiaMock", allIndiaMockSchema);
