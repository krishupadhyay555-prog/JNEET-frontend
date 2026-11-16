// ============================================================
//  JNEET+ AI — services/pyq.js
//  Previous-year questions (PYQs), one file per official paper:
//  content/pyq/<id>.json, written by tools/pyq/build.py. The builder
//  only writes a paper after EVERY answer has been matched against
//  NTA's official final answer key (question ID → correct option ID),
//  so this service never decides answers itself — it just serves them.
//  Dropped / bonus / several-correct questions keep NTA's ruling
//  (status: "dropped" | "bonus" | "multi").
//  Two kinds of question: typed (text + $…$ maths) or NTA's original
//  images (qimg + optImg, cut from the official PDF — nothing re-typed).
// ============================================================

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "content", "pyq");
const SUBJECTS = { NEET: ["Physics", "Chemistry", "Biology"], JEE: ["Mathematics", "Physics", "Chemistry"] };
const STATUSES = ["ok", "dropped", "bonus", "multi"];

const str = (v) => typeof v === "string" && v.trim().length > 0;

// Returns a list of problems (empty = valid). Used at load time and by tests.
export function validatePaper(d, file = "") {
  const p = [];
  if (!str(d.id) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(d.id)) p.push("id");
  if (file && `${d.id}.json` !== file) p.push("id must match the file name");
  if (!SUBJECTS[d.exam]) p.push("exam");
  if (!Number.isInteger(d.year) || d.year < 2013 || d.year > 2100) p.push("year");
  if (!str(d.title) || !str(d.date)) p.push("title/date");
  if (!str(d.paperPdf) || !str(d.keyPdf)) p.push("source links");
  if (!Array.isArray(d.questions) || d.questions.length === 0) p.push("questions");
  else {
    d.questions.forEach((q, i) => {
      const bad = (what) => p.push(`Q${q?.n ?? i + 1}: ${what}`);
      if (!Number.isInteger(q.n)) bad("n");
      if (!SUBJECTS[d.exam]?.includes(q.subject)) bad("subject");
      // text OR NTA's original question image; the explanation may still be "coming soon" ("")
      if (!str(q.chapter) || !(str(q.text) || str(q.qimg)) || typeof (q.explanation ?? "") !== "string") bad("chapter/text/explanation");
      if (!STATUSES.includes(q.status)) bad("status");
      if (q.type === "mcq") {
        const imgs = Array.isArray(q.optImg) && q.optImg.length === 4 && q.optImg.every(str);
        if (!Array.isArray(q.options) || q.options.length !== 4 || !(imgs || q.options.every(str))) bad("options");
        if (!Array.isArray(q.correct) || !q.correct.every((c) => Number.isInteger(c) && c >= 0 && c <= 3)) bad("correct");
        if (q.status === "ok" && q.correct?.length !== 1) bad("one correct option expected");
        if (q.status === "dropped" && q.correct?.length !== 0) bad("dropped has no correct option");
      } else if (q.type === "numeric") {
        if (q.status === "ok" && !str(q.answer)) bad("answer");
      } else bad("type");
    });
  }
  return p;
}

let cache = null;
export function loadPapers(dir = DIR) {
  if (cache && dir === DIR) return cache;
  const out = [];
  if (fs.existsSync(dir)) {
    for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".json")).sort()) {
      const doc = JSON.parse(fs.readFileSync(path.join(dir, file), "utf-8"));
      const problems = validatePaper(doc, file);
      if (problems.length) {
        console.error(`[PYQ] ${file} skipped — invalid: ${problems.slice(0, 5).join(", ")}`);
        continue;
      }
      out.push(doc);
    }
  }
  // newest first: year, then date, then shift
  out.sort((a, b) => b.year - a.year || b.date.localeCompare(a.date) || (a.shift ?? 0) - (b.shift ?? 0));
  if (dir === DIR) cache = out;
  return out;
}

const summary = (d) => ({
  id: d.id, exam: d.exam, year: d.year, session: d.session ?? null, date: d.date, shift: d.shift ?? null,
  title: d.title, total: d.questions.length, counts: d.counts ?? {},
});

// Papers for one exam, grouped by year (newest first).
export function listPapers(exam) {
  const years = new Map();
  for (const d of loadPapers().filter((p) => p.exam === exam)) {
    if (!years.has(d.year)) years.set(d.year, []);
    years.get(d.year).push(summary(d));
  }
  return [...years.entries()].map(([year, papers]) => ({ year, papers }));
}

export function getPaper(exam, id) {
  const d = loadPapers().find((p) => p.id === id && p.exam === exam);
  return d ?? null;
}

// Chapter list with question counts, per subject, for one exam.
export function listChapters(exam) {
  const map = new Map();
  for (const d of loadPapers().filter((p) => p.exam === exam)) {
    for (const q of d.questions) {
      const key = `${q.subject}|${q.chapter}`;
      map.set(key, (map.get(key) ?? 0) + 1);
    }
  }
  return [...map.entries()]
    .map(([k, count]) => { const [subject, chapter] = k.split("|"); return { subject, chapter, count }; })
    .sort((a, b) => a.subject.localeCompare(b.subject) || a.chapter.localeCompare(b.chapter));
}

// Every PYQ of one chapter (newest paper first), each tagged with its paper.
export function chapterQuestions(exam, subject, chapter) {
  const out = [];
  for (const d of loadPapers().filter((p) => p.exam === exam)) {
    for (const q of d.questions) {
      if (q.subject === subject && q.chapter === chapter) {
        out.push({ ...q, paper: { id: d.id, title: d.title, year: d.year, date: d.date, shift: d.shift ?? null } });
      }
    }
  }
  return out;
}
