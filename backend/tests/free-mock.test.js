// Free Quick Mock (no signup): pool, paper shape, server scoring,
// no answer leak, limits, and moving the sitting into a new account.
import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from "vitest";
import request from "supertest";
import app from "../app.js";
import User from "../models/User.js";
import Question from "../models/Question.js";
import TestAttempt from "../models/TestAttempt.js";
import GuestAttempt from "../models/GuestAttempt.js";
import MistakeEntry from "../models/MistakeEntry.js";
import { mailbox, clearMailbox } from "./mailbox.js";
import { connectTestDb, disconnectTestDb, client, registerBody } from "./helpers.js";
import { poolSize, scoreQuick, _resetPoolCache, pickSpread } from "../services/quickMock.js";

vi.mock("../services/emailService.js", async (orig) => (await import("./mailbox.js")).mailMock(orig));

const SUBJECTS = { JEE: ["Mathematics", "Physics", "Chemistry"], NEET: ["Physics", "Chemistry", "Biology"] };
async function seedBank() {
  const docs = [];
  for (const [exam, subs] of Object.entries(SUBJECTS)) {
    for (const subject of subs) {
      for (let c = 0; c < 8; c += 1) {
        for (let k = 0; k < 6; k += 1) {
          docs.push({ examMode: exam, subject, chapter: `${subject} Ch ${c}`, difficulty: "tough", questionText: `${exam} ${subject} ${c}-${k}?`,
            options: ["w", "x", "y", "z"], correctIndex: 2, explanation: `Because ${c}-${k}` });
        }
        docs.push({ examMode: exam, subject, chapter: `${subject} Ch ${c}`, difficulty: "easy", questionText: `easy ${exam} ${subject} ${c}?`,
          options: ["w", "x", "y", "z"], correctIndex: 0, explanation: "e" });
      }
    }
  }
  await Question.insertMany(docs);
}

beforeAll(async () => { await connectTestDb(); await seedBank(); _resetPoolCache(); });
afterAll(disconnectTestDb);
beforeEach(async () => { await Promise.all([User.deleteMany({}), TestAttempt.deleteMany({}), GuestAttempt.deleteMany({}), MistakeEntry.deleteMany({})]); clearMailbox(); });

const start = (c, exam) => c.post("/api/free-mock/start").send({ exam });
const keyOf = async (id) => (await GuestAttempt.findById(id).lean()).questions;
const LEAK = /correctIndex|"answers"|explanation|Because /;

describe("pool and paper", () => {
  it("pool is a list of ~500 PYQs + only hardest bank questions per exam", async () => {
    for (const exam of ["JEE", "NEET"]) {
      const s = await poolSize(exam);
      expect(s.pyq).toBeGreaterThan(400);
      expect(s.pyq).toBeLessThanOrEqual(501);
      expect(s.bank).toBe(3 * 8 * 6); // all tough ones here (< 500), never the easy ones
    }
  });

  it("JEE: 30 Qs, 10/10/10 with numericals, 60 min, no key anywhere, httpOnly guest cookie", async () => {
    const c = client();
    const r = await start(c, "JEE");
    expect(r.status).toBe(201);
    expect(r.body).toMatchObject({ exam: "JEE", durationMinutes: 60, maxMarks: 120 });
    expect(r.body.questions).toHaveLength(30);
    for (const s of SUBJECTS.JEE) {
      const qs = r.body.questions.filter((q) => q.subject === s);
      expect(qs).toHaveLength(10);
      expect(qs.filter((q) => q.type === "numeric")).toHaveLength(2);
      expect(new Set(qs.map((q) => q.chapter)).size).toBeGreaterThanOrEqual(5); // spread
    }
    expect(r.body.questions.some((q) => q.source === "pyq" && q.pyqLabel)).toBe(true);
    expect(JSON.stringify(r.body)).not.toMatch(LEAK);
    expect(String(r.headers["set-cookie"])).toMatch(/jneet_guest=.*HttpOnly/i);
  });

  it("NEET: 45 Qs, 11/11/23, 45 min", async () => {
    const r = await start(client(), "NEET");
    expect(r.body).toMatchObject({ durationMinutes: 45, maxMarks: 180 });
    expect(SUBJECTS.NEET.map((s) => r.body.questions.filter((q) => q.subject === s).length)).toEqual([11, 11, 23]);
  });

  it("the same device gets mostly different questions next time", async () => {
    const c = client();
    const a = (await start(c, "NEET")).body.questions.map((q) => q.questionText + q.imageUrl);
    const b = (await start(c, "NEET")).body.questions.map((q) => q.questionText + q.imageUrl);
    const overlap = b.filter((x) => a.includes(x)).length;
    expect(overlap).toBeLessThan(10);
  });

  it("pickSpread takes one per chapter before repeating", () => {
    const items = ["a", "a", "a", "b", "b", "c"].map((chapter, i) => ({ chapter, id: i }));
    const got = pickSpread(items, 3, new Set(), (x) => x.id);
    expect(new Set(got.map((x) => x.chapter)).size).toBe(3);
  });
});

describe("scoring (server only, +4 / −1)", () => {
  it("hand-computed: 3 right, 2 wrong, rest skipped → 10 marks, accuracy 60%", async () => {
    const c = client();
    const r = await start(c, "NEET");
    const key = await keyOf(r.body.attemptId);
    const answers = [0, 1, 2].map((i) => ({ i, selectedIndex: key[i].correctIndex, timeSec: 30 }))
      .concat([3, 4].map((i) => ({ i, selectedIndex: (key[i].correctIndex + 1) % 4, timeSec: 20 })));
    const s = await c.post(`/api/free-mock/${r.body.attemptId}/submit`).send({ answers });
    expect(s.status).toBe(200);
    expect(s.body.result).toMatchObject({ marks: 10, maxMarks: 180, correct: 3, wrong: 2, skipped: 40, accuracy: 60 });
    expect(s.body.result.subjects.reduce((n, x) => n + x.marks, 0)).toBe(10);
    expect(s.body.result.weakChapters.length).toBeLessThanOrEqual(3);
    expect(JSON.stringify(s.body)).not.toMatch(LEAK);
  });

  it("JEE numericals are matched as numbers; all right → 120/120", async () => {
    const c = client();
    const r = await start(c, "JEE");
    const key = await keyOf(r.body.attemptId);
    const answers = key.map((q, i) => (q.type === "numeric" ? { i, textAnswer: ` ${q.answers[0]} ` } : { i, selectedIndex: q.correctIndex }));
    const s = await c.post(`/api/free-mock/${r.body.attemptId}/submit`).send({ answers });
    expect(s.body.result).toMatchObject({ marks: 120, correct: 30, wrong: 0, accuracy: 100 });
  });

  it("weak chapters = most wrong first (pure function)", () => {
    const qs = [
      { subject: "Physics", chapter: "A", type: "mcq", options: [1, 2, 3, 4], correctIndex: 0 },
      { subject: "Physics", chapter: "B", type: "mcq", options: [1, 2, 3, 4], correctIndex: 0 },
      { subject: "Physics", chapter: "B", type: "mcq", options: [1, 2, 3, 4], correctIndex: 0 },
      { subject: "Physics", chapter: "C", type: "mcq", options: [1, 2, 3, 4], correctIndex: 0 },
    ];
    const { result } = scoreQuick(qs, [{ i: 0, selectedIndex: 0 }, { i: 1, selectedIndex: 1 }, { i: 2, selectedIndex: 2 }, { i: 3, selectedIndex: null }],
      { exam: "NEET", startedAt: new Date(0), submittedAt: new Date(60000), durationMinutes: 45 });
    expect(result.weakChapters.map((c) => c.chapter)).toEqual(["B", "C"]);
    expect(result.marks).toBe(2); // 4 − 1 − 1
  });

  it("double submit → same result once; reading it back never returns questions", async () => {
    const c = client();
    const r = await start(c, "NEET");
    const [a, b] = await Promise.all([
      c.post(`/api/free-mock/${r.body.attemptId}/submit`).send({ answers: [{ i: 0, selectedIndex: 0 }] }),
      c.post(`/api/free-mock/${r.body.attemptId}/submit`).send({ answers: [{ i: 0, selectedIndex: 1 }] }),
    ]);
    expect([a.status, b.status]).toContain(200);
    const res = await c.get(`/api/free-mock/${r.body.attemptId}/result`);
    expect(res.body.result.total).toBe(45);
    const again = await c.get(`/api/free-mock/${r.body.attemptId}`);
    expect(again.body.questions).toBeUndefined();
    expect(JSON.stringify(again.body) + JSON.stringify(res.body)).not.toMatch(LEAK);
  });

  it("another device (no / other cookie) can't read or submit someone's sitting", async () => {
    const r = await start(client(), "NEET");
    const other = client();
    await start(other, "NEET");
    expect((await other.get(`/api/free-mock/${r.body.attemptId}`)).status).toBe(404);
    expect((await request(app).post(`/api/free-mock/${r.body.attemptId}/submit`).send({ answers: [] })).status).toBe(404);
  });
});

describe("anti-bot limits (no daily limit for humans)", () => {
  it("61st start from one network in an hour → 429; another network still fine", async () => {
    const ip = "198.51.100.61";
    for (let i = 0; i < 60; i += 1) {
      const r = await request(app).post("/api/free-mock/start").set("X-Forwarded-For", ip).send({ exam: "NEET" });
      expect(r.status).toBe(201);
    }
    const blocked = await request(app).post("/api/free-mock/start").set("X-Forwarded-For", ip).send({ exam: "NEET" });
    expect(blocked.status).toBe(429);
    expect(blocked.body.code).toBe("FREE_MOCK_BUSY");
    expect((await start(client(), "NEET")).status).toBe(201);
  }, 60000);

  it("there is no endpoint that lists questions or answers", async () => {
    for (const p of ["/api/free-mock", "/api/free-mock/pool", "/api/free-mock/questions", "/api/free-mock/answers"]) {
      const r = await request(app).get(p);
      expect([404, 400]).toContain(r.status);
      expect(JSON.stringify(r.body)).not.toMatch(LEAK);
    }
  });
});

describe("moving the sitting into a new account", () => {
  async function guestThenSignup(exam, accountExam = exam) {
    const c = client();
    const r = await start(c, exam);
    const key = await keyOf(r.body.attemptId);
    const answers = key.slice(0, 4).map((q, i) => (q.type === "numeric" ? { i, textAnswer: "999999" } : { i, selectedIndex: (q.correctIndex + 1) % 4 }));
    await c.post(`/api/free-mock/${r.body.attemptId}/submit`).send({ answers });
    const body = registerBody({ examMode: accountExam, source: { src: "free-mock" } });
    expect((await c.post("/api/auth/register").send(body)).status).toBe(201);
    expect((await c.post("/api/auth/verify-email").send({ email: body.email, otp: mailbox.verify.get(body.email) })).status).toBe(200);
    return { c, body, attemptId: r.body.attemptId };
  }

  it("after signup the sitting becomes a normal test with answers, and wrong ones reach the Mistake Notebook — once", async () => {
    const { c, body } = await guestThenSignup("NEET");
    const cl = await c.post("/api/free-mock/claim");
    expect(cl.status).toBe(200);
    expect(cl.body.moved).toHaveLength(1);
    const u = await User.findOne({ email: body.email }).lean();
    const t = await TestAttempt.findById(cl.body.latest).lean();
    expect(String(t.userId)).toBe(String(u._id));
    expect(t).toMatchObject({ status: "submitted", mode: "test", totalQuestions: 45, wrongCount: 4, marksObtained: -4 });
    expect(await MistakeEntry.countDocuments({ userId: u._id })).toBeGreaterThan(0);
    // Now signed in, the review shows the key for THEIR attempt.
    const review = await c.get(`/api/test/${t._id}`);
    expect(review.status).toBe(200);
    expect((await c.post("/api/free-mock/claim")).body.moved).toHaveLength(0);
  });

  it("a sitting of the other exam is not moved into the account", async () => {
    const { c } = await guestThenSignup("JEE", "NEET");
    expect((await c.post("/api/free-mock/claim")).body.moved).toHaveLength(0);
  });

  it("claim needs a session", async () => {
    expect((await client().post("/api/free-mock/claim")).status).toBe(401);
  });
});
