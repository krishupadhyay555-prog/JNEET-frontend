// ============================================================
//  JNEET+ AI — tests/oneshot-recap.test.js
//  OneShot content + API, and "Pichli baar ka recap" end to end.
// ============================================================

import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from "vitest";
import fs from "fs";
import path from "path";
import { clearMailbox } from "./mailbox.js";
import { connectTestDb, disconnectTestDb, signedInClient } from "./helpers.js";
import User from "../models/User.js";
import Question from "../models/Question.js";
import TestAttempt from "../models/TestAttempt.js";
import Chat from "../models/Chat.js";
import { loadOneShots, validateOneShot } from "../services/oneshot.js";
import { loadSeedQuestions } from "../seed/seedQuestions.js";
import { keywordChapters, validatePicks, findRecap, _clearChapterCache, RECENT_MS } from "../services/recap.js";

vi.mock("../services/emailService.js", async (orig) => (await import("./mailbox.js")).mailMock(orig));

// ── OneShot content ──────────────────────────────────────────────
describe("OneShot content files", () => {
  const dir = path.join(import.meta.dirname, "..", "content", "oneshot");
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
  const bankChapters = new Set(loadSeedQuestions().filter((q) => q.type === "mcq" && q.level === "main").map((q) => `${q.examMode}|${q.subject}|${q.chapter}`));

  it("has the first batch", () => expect(files.length).toBeGreaterThanOrEqual(6));

  it.each(files)("%s is complete and valid", (file) => {
    const doc = JSON.parse(fs.readFileSync(path.join(dir, file), "utf-8"));
    expect(validateOneShot(doc, file)).toEqual([]);
  });

  it.each(files)("%s points at chapters that exist in the question bank", (file) => {
    const doc = JSON.parse(fs.readFileSync(path.join(dir, file), "utf-8"));
    for (const [exam, chapter] of Object.entries(doc.chapters)) {
      expect(bankChapters.has(`${exam}|${doc.subject}|${chapter}`), `${exam} ${chapter}`).toBe(true);
    }
  });

  it("all files load", () => expect(loadOneShots().length).toBe(files.length));

  it("the validator catches broken content", () => {
    expect(validateOneShot({ slug: "Bad Slug", chapters: { NEET: "X" }, subject: "Mathematics" })).toEqual(
      expect.arrayContaining(["slug", "chapters", "summary", "formulas", "examples", "topics"])
    );
  });
});

// ── API ──────────────────────────────────────────────────────────
const mcq = (n, over = {}) => ({
  examMode: "NEET", subject: "Biology", chapter: "Breathing and Exchange of Gases", difficulty: "easy",
  questionText: `Breathing Q${n}?`, options: ["A", "B", "C", "D"], correctIndex: 2, explanation: `E${n}`, ...over,
});

let a, student;
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
  await Promise.all([User.deleteMany({}), Question.deleteMany({}), TestAttempt.deleteMany({}), Chat.deleteMany({})]);
  clearMailbox(); _clearChapterCache();
  ({ c: a, student } = await signedInClient());
  await Question.insertMany([
    ...[1, 2, 3, 4, 5, 6].map((n) => mcq(n)),
    ...[1, 2, 3].map((n) => mcq(`c${n}`, { subject: "Biology", chapter: "Cell Cycle and Cell Division" })),
    mcq("adv", { level: "advanced", questionText: "Advanced breathing?" }),
    { ...mcq("fb"), type: "fill_blank", options: undefined, correctIndex: undefined, answers: ["tidal"], questionText: "TV is ____ volume." },
  ]);
});

describe("OneShot API", () => {
  it("lists only my exam's chapters and serves one", async () => {
    const list = await a.get("/api/oneshot");
    expect(list.status).toBe(200);
    const slugs = list.body.chapters.map((c) => c.slug);
    expect(slugs).toContain("breathing-and-exchange-of-gases");
    expect(slugs).not.toContain("complex-numbers-and-quadratic-equations"); // JEE only
    const one = await a.get("/api/oneshot/rotational-motion");
    expect(one.body.oneshot.chapter).toBe("System of Particles and Rotational Motion");
    expect(one.body.oneshot.formulas.length).toBeGreaterThan(4);
  });
  it("404 for another exam's chapter or an unknown slug; login required", async () => {
    expect((await a.get("/api/oneshot/complex-numbers-and-quadratic-equations")).status).toBe(404);
    expect((await a.get("/api/oneshot/nope")).status).toBe(404);
    const { default: request } = await import("supertest");
    const { default: app } = await import("../app.js");
    expect((await request(app).get("/api/oneshot")).status).toBe(401);
  });
});

describe("OneShot languages (English default, Hinglish option)", () => {
  const dir = path.join(import.meta.dirname, "..", "content", "oneshot");
  const files = fs.readdirSync(dir);
  const both = files.filter((f) => f.endsWith(".hinglish.json")).map((f) => f.replace(".hinglish.json", ""))
    .filter((slug) => files.includes(`${slug}.json`) && JSON.parse(fs.readFileSync(path.join(dir, `${slug}.json`), "utf-8")).chapters.NEET);
  const hinglishOnly = files.filter((f) => f.endsWith(".hinglish.json")).map((f) => f.replace(".hinglish.json", ""))
    .filter((slug) => !files.includes(`${slug}.json`) && JSON.parse(fs.readFileSync(path.join(dir, `${slug}.hinglish.json`), "utf-8")).chapters.NEET);

  it("English and Hinglish versions of a chapter describe the same chapter", () => {
    for (const f of files.filter((x) => x.endsWith(".hinglish.json"))) {
      const slug = f.replace(".hinglish.json", "");
      if (!files.includes(`${slug}.json`)) continue;
      const hi = JSON.parse(fs.readFileSync(path.join(dir, f), "utf-8"));
      const en = JSON.parse(fs.readFileSync(path.join(dir, `${slug}.json`), "utf-8"));
      expect(en.chapters).toEqual(hi.chapters);
      expect(en.subject).toBe(hi.subject);
      expect(en.formulas.length).toBe(hi.formulas.length);
      expect(en.examples.length).toBe(hi.examples.length);
    }
  });

  it("serves English by default, Hinglish when chosen, and says when it falls back", async () => {
    if (both.length) {
      const slug = both[0];
      const en = await a.get(`/api/oneshot/${slug}`);
      expect(en.body.oneshot.lang).toBe("english");
      expect(en.body.oneshot.fallback).toBe(false);
      expect(en.body.oneshot.languages).toEqual(["english", "hinglish"]);
      const hi = await a.get(`/api/oneshot/${slug}?lang=hinglish`);
      expect(hi.body.oneshot.lang).toBe("hinglish");

      const pref = await a.patch("/api/user/preferences").send({ studyLanguage: "hinglish" });
      expect(pref.status).toBe(200);
      expect(pref.body.student.studyLanguage).toBe("hinglish");
      expect((await a.get(`/api/oneshot/${slug}`)).body.oneshot.lang).toBe("hinglish");
      expect((await a.get(`/api/oneshot/${slug}?lang=english`)).body.oneshot.lang).toBe("english");
      await a.patch("/api/user/preferences").send({ studyLanguage: "auto" });
    }
    if (hinglishOnly.length) {
      const r = await a.get(`/api/oneshot/${hinglishOnly[0]}`);
      expect(r.body.oneshot.lang).toBe("hinglish");
      expect(r.body.oneshot.fallback).toBe(true);
    }
    expect(both.length + hinglishOnly.length).toBeGreaterThan(0);
  });

  it("rejects a bad study language and keeps persona updates working", async () => {
    expect((await a.patch("/api/user/preferences").send({ studyLanguage: "klingon" })).status).toBe(400);
    expect((await a.patch("/api/user/preferences").send({})).status).toBe(400);
    const r = await a.patch("/api/user/preferences").send({ persona: "fun" });
    expect(r.status).toBe(200);
    expect(r.body.student.persona).toBe("fun");
    expect(r.body.student.studyLanguage).toBe("auto");
  });
});

describe("AI language rules", () => {
  it("defaults to English when unclear, follows the student's language, and honours Hinglish", async () => {
    const { buildSystemPrompt } = await import("../services/ai/persona.js");
    const auto = buildSystemPrompt({ examMode: "NEET" });
    expect(auto).toMatch(/Bengali, Gujarati, Marathi/);
    expect(auto).toMatch(/unclear[^\n]*reply in English\./);
    expect(auto).not.toMatch(/__DEFAULT_LANG__/);
    const hi = buildSystemPrompt({ examMode: "JEE", studyLanguage: "hinglish" });
    expect(hi).toMatch(/student chose Hinglish/);
    expect(hi).toMatch(/reply in Hinglish \(Hindi in Roman script/);
    const en = buildSystemPrompt({ examMode: "JEE", studyLanguage: "english" });
    expect(en).toMatch(/student chose English/);
  });
});

// ── Recap ────────────────────────────────────────────────────────
const old = (ms = RECENT_MS + 60_000) => new Date(Date.now() - ms);
async function makeChat(sessions) {
  return Chat.collection.insertOne({
    userId: new (Chat.base.Types.ObjectId)(String(student._id ?? student.id)), examMode: "NEET", activeSessionId: null, createdAt: new Date(), updatedAt: new Date(),
    sessions: sessions.map((s) => ({
      _id: new (Chat.base.Types.ObjectId)(), title: s.title ?? "Chat", pinned: false, pinnedAt: null,
      createdAt: s.at ?? old(), updatedAt: s.at ?? old(),
      messages: (s.msgs ?? []).map((t, i) => ({ _id: new (Chat.base.Types.ObjectId)(), role: i % 2 ? "ai" : "user", content: t, saved: false, feedback: null })),
    })),
  });
}
const me = () => ({ id: student._id ?? student.id, examMode: "NEET" });

describe("recap chapter mapping (strict)", () => {
  const cands = [
    { subject: "Biology", chapter: "Breathing and Exchange of Gases" },
    { subject: "Biology", chapter: "Biomolecules" },
    { subject: "Chemistry", chapter: "Biomolecules" },
    { subject: "Physics", chapter: "Laws of Motion" },
  ];
  it("AI picks that are not exactly on the list are dropped", () => {
    expect(validatePicks(["Biology | Breathing and Exchange of Gases", "Biology | Respiration", "Physics | Laws of motion", "x"], cands))
      .toEqual([cands[0], cands[3]]);
  });
  it("keeps Biology and Chemistry 'Biomolecules' apart", () => {
    expect(validatePicks(["Chemistry | Biomolecules"], cands)).toEqual([cands[2]]);
  });
  it("keyword fallback is conservative", () => {
    expect(keywordChapters("tidal volume and exchange of gases in breathing", cands)).toEqual([cands[0]]);
    expect(keywordChapters("hi, motivation do, padhai nahi ho rahi", cands)).toEqual([]);
  });
  it("keyword fallback: two distinctive words of a long chapter name are enough, one is not", () => {
    const phys = [
      { subject: "Physics", chapter: "System of Particles and Rotational Motion" },
      { subject: "Physics", chapter: "Laws of Motion" },
    ];
    expect(keywordChapters("Title: Rotational motion doubt\n- ring ka moment of inertia", phys)).toEqual([phys[0]]);
    expect(keywordChapters("motion ka doubt", phys)).toEqual([]);
  });
});

describe("recap API", () => {
  it("no chat → no recap", async () => {
    expect((await a.get("/api/recap")).body.recap).toBeNull();
  });

  it("skips a chat used in the last 20 minutes", async () => {
    await makeChat([{ at: new Date(), msgs: ["breathing exchange of gases kya hai", "…"] }]);
    expect((await a.get("/api/recap")).body.recap).toBeNull();
  });

  it("maps the last chat, caches it, and starts 5 verified MCQs from that chapter only", async () => {
    await makeChat([
      { at: old(3 * 86400000), title: "Old", msgs: ["cell cycle division mitosis"] },
      { at: old(), title: "Gases", msgs: ["breathing aur exchange of gases samjhao", "…", "tidal volume?"] },
    ]);
    const r = await a.get("/api/recap");
    expect(r.body.recap.chapters).toEqual([{ subject: "Biology", chapter: "Breathing and Exchange of Gases" }]);
    expect(r.body.recap.questions).toBe(5);

    const cached = await Chat.findOne({}).lean();
    expect(cached.sessions[1].recap.chapters).toHaveLength(1);
    expect(cached.sessions[1].updatedAt.getTime()).toBeLessThan(Date.now() - RECENT_MS); // caching must not "touch" the chat

    const s = await a.post("/api/recap/start").send({ sessionId: r.body.recap.sessionId });
    expect(s.status).toBe(200);
    expect(s.body.questions).toHaveLength(5);
    expect(s.body.questions.every((q) => q.type === "mcq" && q.chapter === "Breathing and Exchange of Gases")).toBe(true);
    expect(JSON.stringify(s.body)).not.toMatch(/correctIndex|Advanced breathing|TV is/);
    const att = await TestAttempt.findById(s.body.attemptId).lean();
    expect(att).toMatchObject({ mode: "revision", subject: "Biology", status: "in-progress" });
    expect(att.chapter).toMatch(/^Recap: Breathing/);
  });

  it("an off-topic last chat gives no recap (never invented questions)", async () => {
    await makeChat([{ title: "Motivation", msgs: ["bahut stress hai, motivate karo"] }]);
    expect((await a.get("/api/recap")).body.recap).toBeNull();
  });

  it("an AI mapper result is used when available, and only for listed chapters", async () => {
    await makeChat([{ title: "Divide", msgs: ["prophase I ke stages"] }]);
    const recap = await findRecap(me(), { mapper: async (_t, c) => validatePicks(["Biology | Cell Cycle and Cell Division", "Biology | Made Up"], c) });
    expect(recap.chapters).toEqual([{ subject: "Biology", chapter: "Cell Cycle and Cell Division" }]);
    expect(recap.questions).toBe(3);
  });

  it("a miss while the AI is down is not cached; the next open asks again", async () => {
    await makeChat([{ title: "Divide", msgs: ["prophase I ke stages"] }]);
    expect(await findRecap(me(), { mapper: async () => null })).toBeNull();
    const chat = await Chat.findOne({ examMode: "NEET" }).lean();
    expect(chat.sessions[0].recap ?? null).toBeNull();
    const recap = await findRecap(me(), { mapper: async (_t, c) => validatePicks(["Biology | Cell Cycle and Cell Division"], c) });
    expect(recap.chapters).toEqual([{ subject: "Biology", chapter: "Cell Cycle and Cell Division" }]);
  });

  it("someone else's chat id cannot be started", async () => {
    await makeChat([{ msgs: ["breathing exchange of gases"] }]);
    const bad = await a.post("/api/recap/start").send({ sessionId: "0123456789abcdef01234567" });
    expect(bad.status).toBe(404);
    expect((await a.post("/api/recap/start").send({ sessionId: "nope" })).status).toBe(400);
  });
});
