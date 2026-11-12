// ============================================================
//  JNEET+ AI — tests/blanks.test.js
//  Fill-in-the-blank: the answer checker, and Revision end to end
//  (start with blanks, answers never leak, server-side checking,
//  scoring, mock tests never include blanks).
// ============================================================

import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from "vitest";
import { clearMailbox } from "./mailbox.js";
import { connectTestDb, disconnectTestDb, signedInClient } from "./helpers.js";
import User from "../models/User.js";
import Question from "../models/Question.js";
import TestAttempt from "../models/TestAttempt.js";
import { isBlankCorrect, normalizeBlank } from "../services/blankAnswer.js";

vi.mock("../services/emailService.js", async (orig) => (await import("./mailbox.js")).mailMock(orig));

describe("blank answer checker", () => {
  it.each([
    ["see saw", ["see-saw"]], ["Seesaw", ["see-saw"]], ["SF4", ["SF₄"]], ["O2-", ["O₂⁻"]], ["Fe3+", ["Fe³⁺"]],
    ["0.50", ["1/2"]], [".5", ["0.5"]], ["0.502", ["0.5"]], ["90", ["90°"]], ["104.5°", ["104.5"]], ["−1", ["-1"]],
    ["kg m2", ["kg·m²"]], ["MLT-2", ["MLT⁻²"]], ["the mitochondria", ["mitochondria"]], ["pi/2", ["π/2"]],
    ["Angular Momentum", ["angular momentum"]], ["two", ["2", "two"]],
  ])("accepts %j for %j", (typed, ans) => expect(isBlankCorrect(typed, ans)).toBe(true));

  it.each([
    ["O2", ["O₂⁻"]], ["ethanol", ["methanol"]], ["propanal", ["propanol"]], ["0.51", ["0.5"]], ["3", ["-3"]],
    ["2-3i", ["2+3i"]], ["", ["x"]], ["   ", ["x"]], ["mitosis", ["meiosis"]],
  ])("rejects %j for %j (one letter or sign changes the meaning)", (typed, ans) => expect(isBlankCorrect(typed, ans)).toBe(false));

  it("normalises sensibly", () => {
    expect(normalizeBlank("See-Saw")).toBe("seesaw");
    expect(normalizeBlank("O₂⁻")).toBe("o2-");
  });
});

const mcq = (n, over = {}) => ({
  examMode: "NEET", subject: "Physics", chapter: "Laws of Motion", difficulty: "easy",
  questionText: `Question ${n}?`, options: ["A", "B", "C", "D"], correctIndex: 1, explanation: `Because ${n}`, ...over,
});
const blank = (n, over = {}) => ({
  examMode: "NEET", subject: "Physics", chapter: "Laws of Motion", difficulty: "easy", type: "fill_blank",
  questionText: `Blank ${n}: inertia is measured by ____.`, answers: ["mass"], explanation: `Mass ${n}`, ...over,
});

let a;
const realAggregate = Question.aggregate.bind(Question);
beforeAll(async () => {
  await connectTestDb();
  vi.spyOn(Question, "aggregate").mockImplementation(async (pipeline) => {
    const [match, sample] = pipeline;
    if (!match?.$match || !sample?.$sample) return realAggregate(pipeline);
    const docs = await Question.find(match.$match).lean();
    return docs.sort(() => Math.random() - 0.5).slice(0, sample.$sample.size);
  });
});
afterAll(disconnectTestDb);
beforeEach(async () => {
  await User.deleteMany({}); await Question.deleteMany({}); await TestAttempt.deleteMany({});
  clearMailbox();
  a = (await signedInClient()).c;
  await Question.insertMany([1, 2, 3, 4].map((n) => mcq(n)));
  await Question.insertMany([1, 2, 3].map((n) => blank(n)));
});

describe("Revision with fill-in-the-blanks", () => {
  it("the model rejects a blank without answers and an MCQ without 4 options", async () => {
    await expect(Question.create(blank(9, { answers: [] }))).rejects.toThrow(/accepted answer/);
    await expect(Question.create(mcq(9, { options: ["A", "B"] }))).rejects.toThrow(/4 options/);
  });

  it("chapters report how many blanks exist", async () => {
    const res = await a.get("/api/test/chapters?subject=Physics");
    const ch = res.body.chapters.find((c) => c.chapter === "Laws of Motion");
    expect(ch.total).toBe(4);   // MCQs only
    expect(ch.blanks).toBe(3);
  });

  it("start mixes MCQs and blanks; blanks never leak their answers", async () => {
    const res = await a.post("/api/test/start").send({ subject: "Physics", chapter: "Laws of Motion", easy: 2, blanks: 2 });
    expect(res.status).toBe(200);
    expect(res.body.totalQuestions).toBe(4);
    const types = res.body.questions.map((q) => q.type).sort();
    expect(types).toEqual(["fill_blank", "fill_blank", "mcq", "mcq"]);
    expect(JSON.stringify(res.body)).not.toMatch(/"answers"|"mass"|correctIndex/);
    const got = await a.get(`/api/test/${res.body.attemptId}`);
    expect(JSON.stringify(got.body)).not.toMatch(/"answers"|"mass"|correctIndex/);
  });

  it("blanks are checked on the server: correct, wrong and skipped; submit scores them and ignores client values", async () => {
    const start = await a.post("/api/test/start").send({ subject: "Physics", chapter: "Laws of Motion", easy: 1, blanks: 3 });
    const id = start.body.attemptId;
    const [b1, b2, b3] = start.body.questions.filter((q) => q.type === "fill_blank");
    const m = start.body.questions.find((q) => q.type === "mcq");

    const r1 = await a.post(`/api/test/${id}/answer`).send({ questionId: String(b1.questionId), textAnswer: "  Mass " });
    expect(r1.body).toMatchObject({ isCorrect: true, type: "fill_blank", correctAnswer: "mass", selectedIndex: 0 });
    const r2 = await a.post(`/api/test/${id}/answer`).send({ questionId: String(b2.questionId), textAnswer: "weight" });
    expect(r2.body).toMatchObject({ isCorrect: false, selectedIndex: 1 });
    expect(r2.body.explanation).toMatch(/Mass/);
    const r3 = await a.post(`/api/test/${id}/answer`).send({ questionId: String(b3.questionId), textAnswer: "" });
    expect(r3.body).toMatchObject({ isCorrect: false, selectedIndex: null });
    expect((await a.post(`/api/test/${id}/answer`).send({ questionId: String(b1.questionId), textAnswer: "x".repeat(201) })).status).toBe(400);

    // The client lies about the blanks — the server keeps what it checked.
    const submit = await a.post(`/api/test/${id}/submit`).send({ answers: [
      { questionId: String(m.questionId), selectedIndex: null },
      { questionId: String(b1.questionId), selectedIndex: 1 },
      { questionId: String(b2.questionId), selectedIndex: 0 },
      { questionId: String(b3.questionId), selectedIndex: 0 },
    ] });
    expect(submit.status).toBe(200);
    expect(submit.body.attempt).toMatchObject({ correctCount: 1, wrongCount: 1, unattemptedCount: 2, score: 25 });
    const saved = submit.body.attempt.questions.find((q) => String(q.questionId) === String(b1.questionId));
    expect(saved).toMatchObject({ type: "fill_blank", textAnswer: "Mass", answers: ["mass"] });
  });

  it("an MCQ still works the old way next to blanks", async () => {
    const start = await a.post("/api/test/start").send({ subject: "Physics", chapter: "Laws of Motion", easy: 1, blanks: 1 });
    const m = start.body.questions.find((q) => q.type === "mcq");
    const r = await a.post(`/api/test/${start.body.attemptId}/answer`).send({ questionId: String(m.questionId), selectedIndex: 2 });
    expect(r.body).toMatchObject({ type: "mcq", isCorrect: expect.any(Boolean), correctIndex: expect.any(Number) });
  });

  it("only blanks is allowed; nothing at all is rejected", async () => {
    expect((await a.post("/api/test/start").send({ subject: "Physics", chapter: "Laws of Motion", blanks: 2 })).body.totalQuestions).toBe(2);
    expect((await a.post("/api/test/start").send({ subject: "Physics", chapter: "Laws of Motion" })).status).toBe(400);
  });

  it("mock tests never include fill-in-the-blanks", async () => {
    const extra = (s, n) => Array.from({ length: n }, (_, i) => mcq(`${s}${i}`, { subject: s, chapter: "X" }));
    await Question.insertMany([...extra("Physics", 46), ...extra("Chemistry", 46), ...extra("Biology", 91)]);
    await Question.insertMany(Array.from({ length: 30 }, (_, i) => blank(`f${i}`, { chapter: "X" })));
    const res = await a.post("/api/test/start-full");
    expect(res.status).toBe(200);
    expect(res.body.questions.every((q) => q.type !== "fill_blank" && q.options.length === 4)).toBe(true);
  });
});
