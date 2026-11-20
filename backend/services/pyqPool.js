// ============================================================
//  JNEET+ AI — services/pyqPool.js
//  Real previous-year questions for the full mocks (founder, 19 Nov
//  2026: "naye questions + PYQs ek saath; PYQ image par saal likha ho").
//  Takes every PYQ from content/pyq (answers there are NTA's final key,
//  checked by the builder) and keeps only the ones a mock can score
//  without doubt:
//    - status "ok"  (dropped / bonus / several-correct ones are left out),
//    - in the current syllabus (no oldSyllabus label),
//    - MCQ with exactly one correct option, or numeric with NTA's value.
//  A PYQ gets a FIXED id (from its paper + number), so reports and the
//  Mistake Notebook see the same question every time it is served.
// ============================================================

import crypto from "crypto";
import mongoose from "mongoose";
import { loadPapers } from "./pyq.js";

let pools = null;

export function pyqObjectId(ref) {
  return new mongoose.Types.ObjectId(crypto.createHash("md5").update(`pyq:${ref}`).digest("hex").slice(0, 24));
}

function entry(d, q) {
  const ref = `${d.id}#${q.n}`;
  const url = (f) => (f ? `/pyq/${d.id}/${f}` : null);
  return {
    ref,
    id: pyqObjectId(ref),
    paperId: d.id,
    n: q.n,
    label: d.title,                       // e.g. "JEE Main 2025 · 2 April · Shift 1"
    year: d.year,
    subject: q.subject,
    chapter: q.chapter,
    type: q.type,                         // "mcq" | "numeric"
    text: q.text || "",
    imageUrl: url(q.qimg),
    imageW: q.qimgW ?? null,
    figUrl: url(q.fig),
    options: q.options ?? [],
    optionImages: Array.isArray(q.optImg) ? q.optImg.map(url) : [],
    optionImageW: Array.isArray(q.optImgW) ? q.optImgW : [],
    optionsInImage: q.optionsInImage === true,
    correctIndex: q.type === "mcq" ? q.correct[0] : 0,
    answers: q.type === "numeric" ? (q.answers ?? [q.answer]) : [],
    explanation: q.explanation || "",
  };
}

function servable(q) {
  if (q.status !== "ok" || q.oldSyllabus) return false;
  if (q.type === "mcq") return Array.isArray(q.correct) && q.correct.length === 1;
  if (q.type === "numeric") return typeof q.answer === "string" && q.answer.trim() !== "";
  return false;
}

// { NEET: { Physics: { mcq: [...], numeric: [...] }, ... }, JEE: {...} }
export function pyqPools() {
  if (pools) return pools;
  const out = { NEET: {}, JEE: {} };
  for (const d of loadPapers()) {
    for (const q of d.questions) {
      if (!servable(q)) continue;
      const bySubject = (out[d.exam][q.subject] ??= { mcq: [], numeric: [] });
      bySubject[q.type].push(entry(d, q));
    }
  }
  pools = out;
  return pools;
}

// `count` random PYQs of one exam/subject/type, avoiding `avoidRefs`
// (questions the student met in recent mocks) while enough are left.
export function samplePyq(examMode, subject, type, count, avoidRefs = new Set()) {
  if (count <= 0) return [];
  const pool = pyqPools()[examMode]?.[subject]?.[type] ?? [];
  const fresh = pool.filter((p) => !avoidRefs.has(p.ref));
  const source = fresh.length >= count ? fresh : pool;
  const a = [...source];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, count);
}

// How a PYQ is stored inside a TestAttempt (a snapshot, like bank questions).
export function pyqSnapshot(p) {
  return {
    questionId: p.id,
    source: "pyq",
    pyqRef: p.ref,
    pyqLabel: p.label,
    subject: p.subject,
    chapter: p.chapter,
    type: p.type === "numeric" ? "numeric" : "mcq",
    questionText: p.text,
    options: p.options,
    optionImages: p.optionImages,
    optionImageW: p.optionImageW,
    optionsInImage: p.optionsInImage,
    imageUrl: p.imageUrl,
    imageW: p.imageW,
    figUrl: p.figUrl,
    correctIndex: p.correctIndex,
    answers: p.type === "numeric" ? p.answers : undefined,
    selectedIndex: null,
    explanation: p.explanation,
  };
}

// NTA numeric answers: "22", "0.5", "-3" … compare as numbers.
export function sameNumber(a, b) {
  const x = Number(String(a ?? "").trim());
  const y = Number(String(b ?? "").trim());
  return String(a ?? "").trim() !== "" && Number.isFinite(x) && Number.isFinite(y) && Math.abs(x - y) < 1e-9;
}

// Per chapter: how many servable PYQs (for the Revision chapter list).
let chapterCounts = null;
export function pyqChapterCounts(examMode) {
  if (!chapterCounts) {
    chapterCounts = { NEET: {}, JEE: {} };
    for (const [exam, bySubject] of Object.entries(pyqPools())) {
      for (const [subject, { mcq, numeric }] of Object.entries(bySubject)) {
        for (const p of [...mcq, ...numeric]) {
          const k = `${subject}::${p.chapter}`;
          chapterCounts[exam][k] = (chapterCounts[exam][k] ?? 0) + 1;
        }
      }
    }
  }
  return chapterCounts[examMode] ?? {};
}

// `count` random PYQs of one chapter (MCQs and numericals together),
// avoiding `avoidRefs` while enough are left.
export function samplePyqChapter(examMode, subject, chapter, count, avoidRefs = new Set()) {
  if (count <= 0) return [];
  const p = pyqPools()[examMode]?.[subject];
  if (!p) return [];
  const pool = [...p.mcq, ...p.numeric].filter((q) => q.chapter === chapter);
  const fresh = pool.filter((q) => !avoidRefs.has(q.ref));
  const source = fresh.length >= count ? fresh : pool;
  const a = [...source];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, count);
}

// Servable PYQs in total (they count as practice questions next to the bank).
export function pyqServableTotal() {
  let n = 0;
  for (const bySubject of Object.values(pyqPools())) {
    for (const { mcq, numeric } of Object.values(bySubject)) n += mcq.length + numeric.length;
  }
  return n;
}
