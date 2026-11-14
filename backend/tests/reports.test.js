// "Report this question": students flag questions; only the founder sees the list.
import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from "vitest";

vi.hoisted(() => { process.env.ADMIN_EMAILS = "boss@example.com"; });

import mongoose from "mongoose";
import User from "../models/User.js";
import TestAttempt from "../models/TestAttempt.js";
import QuestionReport from "../models/QuestionReport.js";
import { connectTestDb, disconnectTestDb, signedInClient } from "./helpers.js";
import { mailbox, clearMailbox } from "./mailbox.js";

vi.mock("../services/emailService.js", async (orig) => (await import("./mailbox.js")).mailMock(orig));

beforeAll(connectTestDb);
afterAll(disconnectTestDb);
beforeEach(async () => { await Promise.all([User.deleteMany({}), TestAttempt.deleteMany({}), QuestionReport.deleteMany({})]); clearMailbox(); });

const qid = new mongoose.Types.ObjectId();
async function attemptFor(studentId) {
  return TestAttempt.create({
    userId: studentId, examMode: "NEET", subject: "Physics", chapter: "Kinematics", mode: "revision", totalQuestions: 1,
    questions: [{ questionId: qid, subject: "Physics", chapter: "Kinematics", questionText: "What is 2 + 2?", options: ["3", "4", "5", "6"], correctIndex: 2, explanation: "4." }],
  });
}
async function student(email) {
  const s = await signedInClient(email ? { email } : {});
  const u = await User.findOne({ email: s.body.email });
  return { ...s, id: u._id };
}

describe("report a question", () => {
  it("a student can report a question from their own attempt, once (re-report updates)", async () => {
    const { c, id } = await student();
    const a = await attemptFor(id);
    const r1 = await c.post("/api/test/report").send({ attemptId: String(a._id), questionId: String(qid), reason: "wrong_answer", note: "Answer is 4, key says 5" });
    expect(r1.status).toBe(201);
    const r2 = await c.post("/api/test/report").send({ attemptId: String(a._id), questionId: String(qid), reason: "typo" });
    expect(r2.status).toBe(200);
    const all = await QuestionReport.find({});
    expect(all).toHaveLength(1);
    expect(all[0].reason).toBe("typo");
    expect(all[0].snapshot.questionText).toBe("What is 2 + 2?");
    expect(all[0].snapshot.correctIndex).toBe(2);
  });

  it("rejects bad input and questions from someone else's attempt", async () => {
    const owner = await student();
    const a = await attemptFor(owner.id);
    const other = await student();
    expect((await other.c.post("/api/test/report").send({ attemptId: String(a._id), questionId: String(qid), reason: "typo" })).status).toBe(404);
    expect((await owner.c.post("/api/test/report").send({ attemptId: String(a._id), questionId: String(qid), reason: "spam" })).status).toBe(400);
    expect((await owner.c.post("/api/test/report").send({ attemptId: "x", questionId: String(qid), reason: "typo" })).status).toBe(400);
    expect((await owner.c.post("/api/test/report").send({ attemptId: String(a._id), questionId: String(qid), reason: "other", note: "x".repeat(501) })).status).toBe(400);
  });

  it("alerts the founder once when a question reaches 3 reports, and only the admin sees the list", async () => {
    for (let i = 0; i < 3; i++) {
      const s = await student();
      const a = await attemptFor(s.id);
      expect((await s.c.post("/api/test/report").send({ attemptId: String(a._id), questionId: String(qid), reason: "wrong_answer" })).status).toBe(201);
      if (i === 2) expect((await s.c.get("/api/admin/reports")).status).toBe(404);
    }
    const alerts = mailbox.alerts.filter((x) => x.area === "questions");
    expect(alerts).toHaveLength(1);

    const boss = await student("boss@example.com");
    const list = await boss.c.get("/api/admin/reports");
    expect(list.status).toBe(200);
    expect(list.body.counts.open).toBe(3);
    expect(list.body.items[0]).toMatchObject({ count: 3, snapshot: { questionText: "What is 2 + 2?" } });
    expect(list.body.items[0].reasons[0]).toMatchObject({ reason: "wrong_answer", n: 3 });

    const fix = await boss.c.patch(`/api/admin/reports/${qid}`).send({ status: "fixed" });
    expect(fix.body).toMatchObject({ success: true, updated: 3 });
    expect((await boss.c.get("/api/admin/reports")).body.counts).toMatchObject({ open: 0, fixed: 3 });
  });
});
