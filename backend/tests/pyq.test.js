// ============================================================
//  JNEET+ AI — tests/pyq.test.js
//  Previous-year question papers: content files + API.
// ============================================================

import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from "vitest";
import fs from "fs";
import path from "path";
import { clearMailbox } from "./mailbox.js";
import { connectTestDb, disconnectTestDb, signedInClient } from "./helpers.js";
import User from "../models/User.js";
import { loadPapers, validatePaper } from "../services/pyq.js";
import { loadOneShots } from "../services/oneshot.js";

vi.mock("../services/emailService.js", async (orig) => (await import("./mailbox.js")).mailMock(orig));

const dir = path.join(import.meta.dirname, "..", "content", "pyq");
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
const pub = path.join(import.meta.dirname, "..", "..", "frontend", "public", "pyq");

describe("PYQ content files", () => {
  // chapter names must be the app's own (same as the OneShot pages)
  const known = new Set(loadOneShots().flatMap((d) => Object.entries(d.chapters).map(([e, c]) => `${e}|${d.subject}|${c}`)));

  it("has at least one paper", () => expect(files.length).toBeGreaterThanOrEqual(1));

  it.each(files)("%s is complete and valid", (file) => {
    const doc = JSON.parse(fs.readFileSync(path.join(dir, file), "utf-8"));
    expect(validatePaper(doc, file)).toEqual([]);
  });

  it.each(files)("%s uses known chapters, numbers 1..N once, and its figures exist", (file) => {
    const doc = JSON.parse(fs.readFileSync(path.join(dir, file), "utf-8"));
    const ns = doc.questions.map((q) => q.n);
    expect(ns).toEqual([...Array(ns.length)].map((_, i) => i + 1));
    expect(new Set(doc.questions.map((q) => q.qid)).size).toBe(ns.length);
    for (const q of doc.questions) {
      expect(known.has(`${doc.exam}|${q.subject}|${q.chapter}`), `${q.n} ${q.chapter}`).toBe(true);
      for (const f of [q.fig, q.qimg, ...(q.optImg ?? [])].filter(Boolean)) {
        expect(fs.existsSync(path.join(pub, doc.id, f)), `${doc.id}/${f}`).toBe(true);
      }
    }
  });

  it("all files load", () => expect(loadPapers().length).toBe(files.length));

  it("the validator catches broken content", () => {
    expect(validatePaper({ id: "Bad Id", exam: "X", year: 1990, questions: [] })).toEqual(
      expect.arrayContaining(["id", "exam", "year", "questions"])
    );
    const q = { n: 1, subject: "Physics", chapter: "Waves", text: "t", explanation: "e", type: "mcq", options: ["a", "b"], correct: [5], status: "ok" };
    expect(validatePaper({ id: "x", exam: "JEE", year: 2026, title: "t", date: "d", paperPdf: "p", keyPdf: "k", questions: [q] }).join(" ")).toMatch(/options.*correct/);
  });
});

describe("PYQ API", () => {
  let jee, neet;
  beforeAll(connectTestDb);
  afterAll(disconnectTestDb);
  beforeEach(async () => {
    await User.deleteMany({});
    clearMailbox();
    ({ c: jee } = await signedInClient({ examMode: "JEE" }));
    ({ c: neet } = await signedInClient({ examMode: "NEET" }));
  });

  it("lists my exam's papers by year and serves one paper", async () => {
    const list = await jee.get("/api/pyq");
    expect(list.status).toBe(200);
    const y2026 = list.body.years.find((y) => y.year === 2026);
    expect(y2026.papers.map((p) => p.id)).toContain("jee-main-2026-04-02-s1");
    const one = await jee.get("/api/pyq/jee-main-2026-04-02-s1");
    expect(one.status).toBe(200);
    expect(one.body.paper.questions).toHaveLength(75);
    expect(one.body.paper.counts).toEqual({ Mathematics: 25, Physics: 25, Chemistry: 25 });
  });

  it("chapter view gathers questions with their paper", async () => {
    const ch = await jee.get("/api/pyq/chapters");
    const row = ch.body.chapters.find((c) => c.chapter === "Matrices and Determinants");
    expect(row.count).toBeGreaterThanOrEqual(2);
    const qs = await jee.get("/api/pyq/chapter").query({ subject: "Mathematics", chapter: "Matrices and Determinants" });
    expect(qs.body.questions.length).toBe(row.count);
    // newest paper first, and every question carries its paper (for the year label)
    const dates = qs.body.questions.map((q) => q.paper.date);
    expect(dates).toEqual([...dates].sort().reverse());
    expect(qs.body.questions.every((q) => q.paper.id && q.paper.title && q.paper.year)).toBe(true);
    expect(qs.body.questions.some((q) => q.paper.id === "jee-main-2026-04-02-s1")).toBe(true);
    expect((await jee.get("/api/pyq/chapter")).status).toBe(400);
  });

  it("another exam's paper is 404; login required", async () => {
    expect((await neet.get("/api/pyq/jee-main-2026-04-02-s1")).status).toBe(404);
    expect((await neet.get("/api/pyq")).body.years.find((y) => y.papers.some((p) => p.exam === "JEE"))).toBeUndefined();
    const { default: request } = await import("supertest");
    const { default: app } = await import("../app.js");
    expect((await request(app).get("/api/pyq")).status).toBe(401);
  });
});
