// ============================================================
//  JNEET+ AI — models/Test.js
//  INTENTIONALLY EMPTY OF A MODEL DEFINITION.
//
//  There's no predefined/stored "test paper" entity. Tests are
//  generated dynamically per-request — a student picks a chapter
//  + a difficulty mix (e.g. 5 easy / 8 moderate / 5 tough), and
//  testController.js's startTest() randomly samples matching
//  questions from the Question bank right then.
//
//  What actually gets persisted is TestAttempt.js — the record of
//  which questions a specific student got in a specific attempt,
//  what they answered, and their score. If "named test templates"
//  (e.g. a fixed "NEET 2026 Full Mock") are ever wanted later,
//  that would be a deliberate new model — not added here quietly.
// ============================================================

export {};