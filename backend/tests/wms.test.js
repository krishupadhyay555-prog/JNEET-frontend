import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import mongoose from "mongoose";
import User from "../models/User.js";
import TestAttempt from "../models/TestAttempt.js";
import { connectTestDb, disconnectTestDb, signedInClient } from "./helpers.js";
import { foldAttempts, buildWMSSummary, classifyAccuracy } from "../services/wmsScoringService.js";
import { vi } from "vitest";
vi.mock("../services/emailService.js", async (orig) => (await import("./mailbox.js")).mailMock(orig));

const q = (subject, chapter, selected, correct = 0) => ({
  questionId: new mongoose.Types.ObjectId(), subject, chapter, questionText: "q", options: ["a", "b", "c", "d"],
  correctIndex: correct, selectedIndex: selected,
});

describe("WMS scoring (unit)", () => {
  it("folds attempts into chapter rows (correct / wrong / skipped)", () => {
    const rows = foldAttempts([{ questions: [q("Physics", "Laws of Motion", 0), q("Physics", "Laws of Motion", 1), q("Physics", "Laws of Motion", null)] }]);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ total: 3, correct: 1, unattempted: 1 });
  });
  it("does not call a chapter weak/strong on too little data", () => {
    expect(classifyAccuracy(0, 2)).toBe("N");
    expect(classifyAccuracy(0, 5)).toBe("W");
    expect(classifyAccuracy(100, 5)).toBe("S");
    expect(classifyAccuracy(55, 9)).toBe("M");
  });
  it("lists enough-data weak chapters first and 'need more data' last", () => {
    const rows = [
      { _id: { subject: "Physics", chapter: "Tiny" }, total: 1, correct: 0, unattempted: 0 },
      { _id: { subject: "Physics", chapter: "Weak" }, total: 10, correct: 2, unattempted: 0 },
      { _id: { subject: "Physics", chapter: "Strong" }, total: 10, correct: 9, unattempted: 0 },
    ];
    const s = buildWMSSummary(rows);
    expect(s.byChapter.map((c) => c.chapter)).toEqual(["Weak", "Strong", "Tiny"]);
    expect(s.byChapter.at(-1).status).toBe("N");
  });
  it("empty input is a valid empty summary", () => {
    expect(buildWMSSummary(foldAttempts([])).overall.total).toBe(0);
  });
});

describe("GET /api/wms/summary", () => {
  beforeAll(connectTestDb);
  afterAll(disconnectTestDb);
  beforeEach(async () => { await Promise.all([User.deleteMany({}), TestAttempt.deleteMany({})]); });

  const attempt = (userId, examMode, questions, daysAgo = 0, status = "submitted") => TestAttempt.create({
    userId, examMode, subject: "S", chapter: "C", mode: "revision", questions, totalQuestions: questions.length,
    status, submittedAt: new Date(Date.now() - daysAgo * 86400000),
  });

  it("only counts submitted attempts of the CURRENT exam, newest 30", async () => {
    const { c, student } = await signedInClient();
    const wrong5 = Array.from({ length: 5 }, () => q("Physics", "Optics", 1));
    const right5 = Array.from({ length: 5 }, () => q("Physics", "Optics", 0));
    await attempt(student._id, "NEET", wrong5, 40);          // old and bad
    for (let i = 0; i < 30; i++) await attempt(student._id, "NEET", right5, i); // 30 recent good ones push the old one out
    await attempt(student._id, "JEE", wrong5, 0);            // other exam: ignored
    await attempt(student._id, "NEET", wrong5, 0, "in-progress"); // unfinished: ignored
    const res = await c.get("/api/wms/summary");
    expect(res.status).toBe(200);
    const { summary } = res.body;
    expect(summary.window).toEqual({ attempts: 30, max: 30 });
    expect(summary.overall).toMatchObject({ total: 150, correct: 150, accuracyPct: 100 });
    expect(summary.byChapter[0]).toMatchObject({ chapter: "Optics", status: "S" });
  });

  it("is empty (not an error) for a new student", async () => {
    const { c } = await signedInClient();
    const res = await c.get("/api/wms/summary");
    expect(res.status).toBe(200);
    expect(res.body.summary.overall.total).toBe(0);
  });
});
