// 28 Nov audit: answer leaks during an open All-India Mock, revision
// re-answering, free-mock PYQ option order, claim rollback, TTS consent.
import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from "vitest";
import mongoose from "mongoose";
import { clearMailbox } from "./mailbox.js";
import { connectTestDb, disconnectTestDb, signedInClient } from "./helpers.js";
import User from "../models/User.js";
import Question from "../models/Question.js";
import TestAttempt from "../models/TestAttempt.js";
import AllIndiaMock from "../models/AllIndiaMock.js";
import GuestAttempt from "../models/GuestAttempt.js";
import { claimGuestAttempts } from "../controllers/freeMockController.js";
import { buildQuickPaper, _resetPoolCache } from "../services/quickMock.js";
import { pyqPools } from "../services/pyqPool.js";

vi.mock("../services/emailService.js", async (orig) => (await import("./mailbox.js")).mailMock(orig));

beforeAll(connectTestDb);
afterAll(disconnectTestDb);
beforeEach(async () => {
  await Promise.all([User.deleteMany({}), Question.deleteMany({}), TestAttempt.deleteMany({}), AllIndiaMock.deleteMany({}), GuestAttempt.deleteMany({})]);
  clearMailbox();
});

async function sitAllIndia(userId, { closesInMs }) {
  const now = Date.now();
  const mock = await AllIndiaMock.create({
    examMode: "JEE", weekKey: "2026-11-29", title: "JEE Main All-India Mock", opensAt: new Date(now - 3600e3),
    lastStartAt: new Date(now + closesInMs - 1), closesAt: new Date(now + closesInMs), durationMinutes: 180, maxMarks: 300,
  });
  await TestAttempt.create({
    userId, examMode: "JEE", subject: "All Subjects", chapter: "All-India", mode: "test", allIndiaMockId: mock._id,
    totalQuestions: 1, status: "in-progress", startedAt: new Date(now - 60e3), questions: [],
  });
  return mock;
}

describe("All-India Mock open → PYQ papers + Explain with AI paused", () => {
  it("paper and chapter PYQs (they carry NTA answers) give 423 while the mock is open, work after close", async () => {
    const { c, body } = await signedInClient({ examMode: "JEE" });
    const paperId = (await c.get("/api/pyq")).body.years[0].papers[0].id;
    expect((await c.get(`/api/pyq/${paperId}`)).status).toBe(200);
    const u = await User.findOne({ email: body.email }).lean();
    const mock = await sitAllIndia(u._id, { closesInMs: 3600e3 });
    const r = await c.get(`/api/pyq/${paperId}`);
    expect(r.status).toBe(423);
    expect(JSON.stringify(r.body)).not.toMatch(/"correct"|"answer"/);
    expect((await c.get("/api/pyq/chapter").query({ subject: "Physics", chapter: "Kinematics" })).status).toBe(423);
    expect((await c.get("/api/pyq")).status).toBe(200);           // the list (no answers) stays open
    await AllIndiaMock.updateOne({ _id: mock._id }, { $set: { closesAt: new Date(Date.now() - 1000) } });
    expect((await c.get(`/api/pyq/${paperId}`)).status).toBe(200);
  });
});

describe("Revision: one answer per question", () => {
  it("re-answering after the key was shown → 409; submit keeps the first answer", async () => {
    const { c } = await signedInClient({ examMode: "JEE" });
    await Question.insertMany(Array.from({ length: 3 }, (_, i) => ({ examMode: "JEE", subject: "Physics", chapter: "Kinematics", difficulty: "easy",
      questionText: `Q${i}?`, options: ["A", "B", "C", "D"], correctIndex: 1, explanation: "x" })));
    const s = await c.post("/api/test/start").send({ subject: "Physics", chapter: "Kinematics", easy: 3 });
    const saved = await TestAttempt.findById(s.body.attemptId).lean();
    const q0 = saved.questions[0];
    const wrong = (q0.correctIndex + 1) % 4;
    const first = await c.post(`/api/test/${s.body.attemptId}/answer`).send({ questionId: String(q0.questionId), selectedIndex: wrong });
    expect(first.body.isCorrect).toBe(false);
    const again = await c.post(`/api/test/${s.body.attemptId}/answer`).send({ questionId: String(q0.questionId), selectedIndex: q0.correctIndex });
    expect(again.status).toBe(409);
    // A client that sends the right answer at submit can't overwrite it either.
    const done = await c.post(`/api/test/${s.body.attemptId}/submit`).send({ answers: [{ questionId: String(q0.questionId), selectedIndex: q0.correctIndex }] });
    expect(done.body.attempt.correctCount).toBe(0);
    expect(done.body.attempt.wrongCount).toBe(1);
  });
});

describe("Free mock", () => {
  it("PYQ options keep NTA's order (saved solutions say 'option (3)' against the paper)", async () => {
    _resetPoolCache();
    const paper = await buildQuickPaper("NEET");
    const all = new Map();
    for (const s of Object.values(pyqPools().NEET)) for (const p of s.mcq) all.set(p.ref, p);
    const pyqs = paper.filter((q) => q.source === "pyq" && q.type === "mcq");
    expect(pyqs.length).toBeGreaterThan(5);
    for (const q of pyqs) {
      const orig = all.get(q.pyqRef);
      expect(q.correctIndex).toBe(orig.correct ?? orig.correctIndex ?? q.correctIndex);
      if (Array.isArray(orig.options) && orig.options.length) expect(q.options).toEqual(orig.options);
    }
  });

  it("a claim that fails half-way is given back and works next time", async () => {
    const { body } = await signedInClient({ examMode: "NEET" });
    const u = await User.findOne({ email: body.email }).lean();
    await GuestAttempt.create({ guestId: "a".repeat(32), examMode: "NEET", durationMinutes: 45, maxMarks: 4, endsAt: new Date(),
      status: "submitted", submittedAt: new Date(), result: { correct: 0, wrong: 1, skipped: 0, marks: -1 },
      questions: [{ questionId: new mongoose.Types.ObjectId(), source: "bank", subject: "Physics", chapter: "X", type: "mcq",
        questionText: "q", options: ["a", "b", "c", "d"], correctIndex: 0, selectedIndex: 1 }] });
    const spy = vi.spyOn(TestAttempt, "create").mockRejectedValueOnce(new Error("db blip"));
    await expect(claimGuestAttempts(u._id, "NEET", "a".repeat(32))).rejects.toThrow("db blip");
    spy.mockRestore();
    expect((await GuestAttempt.findOne({}).lean()).claimedBy).toBeNull();
    expect(await claimGuestAttempts(u._id, "NEET", "a".repeat(32))).toHaveLength(1);
  });
});

describe("Voice (TTS) respects the parent-consent lock", () => {
  it("an AI-locked student gets 403 before any provider call", async () => {
    const { c, body } = await signedInClient();
    await User.updateOne({ email: body.email }, { $set: { plan: "elite", planExpiresAt: new Date(Date.now() + 864e5), "consent.ageGroup": "minor", "consent.parentStatus": "pending" } });
    const r = await c.post("/api/ai/tts").send({ text: "Hello there" });
    expect(r.status).toBe(403);
    expect(r.body.code).toBe("AI_LOCKED");
  });
});
