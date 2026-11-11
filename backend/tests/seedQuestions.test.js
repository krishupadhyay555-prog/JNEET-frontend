// Guards the question bank in seed/questions/*.json so a broken,
// duplicate or self-contradicting question can't slip back in.
import { describe, it, expect } from "vitest";
import { loadSeedQuestions } from "../seed/seedQuestions.js";

const questions = loadSeedQuestions();

const SUBJECTS = {
  NEET: ["Physics", "Chemistry", "Biology"],
  JEE: ["Physics", "Chemistry", "Mathematics"],
};
const norm = (s) => String(s).toLowerCase().replace(/\s+/g, "").replace(/−/g, "-");

// Phrases that only appear when an explanation argues with its own key.
const META = /discard|this (?:question|item|candidate) (?:is|must|should)|option index|correct index|listed (?:index|key)|not the selected|keyed|none of the (?:listed |given )?options|options? (?:do|does) not (?:contain|match)|absent from the options|not among the (?:listed |given )?options|\?\s*actually/i;

describe("seed question bank", () => {
  it("loads a large bank", () => {
    expect(questions.length).toBeGreaterThan(10000);
  });

  it("every question has a valid shape", () => {
    const bad = questions.filter((q) =>
      !SUBJECTS[q.examMode]?.includes(q.subject) ||
      !["easy", "moderate", "tough"].includes(q.difficulty) ||
      !["main", "advanced"].includes(q.level) ||
      !q.chapter?.trim() ||
      !q.questionText?.trim() ||
      !Array.isArray(q.options) || q.options.length !== 4 ||
      q.options.some((o) => typeof o !== "string" || !o.trim()) ||
      !Number.isInteger(q.correctIndex) || q.correctIndex < 0 || q.correctIndex > 3 ||
      !q.explanation?.trim()
    );
    expect(bad.map((q) => q.questionText.slice(0, 60))).toEqual([]);
  });

  it("no question has two identical options", () => {
    const bad = questions.filter((q) => new Set(q.options.map(norm)).size !== 4);
    expect(bad.map((q) => q.questionText.slice(0, 60))).toEqual([]);
  });

  it("no duplicate question text within the same exam", () => {
    const seen = new Set();
    const dups = [];
    for (const q of questions) {
      const k = `${q.examMode}|${norm(q.questionText)}`;
      if (seen.has(k)) dups.push(q.questionText.slice(0, 60));
      seen.add(k);
    }
    expect(dups).toEqual([]);
  });

  it("no explanation contradicts its own answer key", () => {
    const bad = questions.filter((q) => META.test(q.explanation));
    expect(bad.map((q) => q.questionText.slice(0, 60))).toEqual([]);
  });

  it("JEE Advanced questions are JEE-only", () => {
    const bad = questions.filter((q) => q.level === "advanced" && q.examMode !== "JEE");
    expect(bad.length).toBe(0);
  });
});
