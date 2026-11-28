// ============================================================
//  JNEET+ AI — services/quickMock.js
//  "Free Quick Mock" (no signup) for JEE Main + NEET UG.
//
//  POOL (a list of ids, never a copy of the questions):
//    ~500 servable official PYQs (services/pyqPool.js)
//  + ~500 hardest bank questions (difficulty "tough", main level, MCQ),
//  per exam, picked by a stable hash so the pool is the same on every
//  server and restart, and grows only when the content grows.
//
//  PAPER: JEE 30 Qs (10 Maths / 10 Physics / 10 Chemistry, 2 numericals
//  each) in 60 min; NEET 45 Qs (11 P / 11 C / 23 Bio) in 45 min. Spread
//  over chapters, options shuffled (except PYQs whose options are
//  printed in the image), questions this device saw in its last 5
//  sittings are avoided while enough are left. +4 / −1.
// ============================================================
import crypto from "crypto";
import Question from "../models/Question.js";
import { pyqPools, pyqSnapshot, sameNumber } from "./pyqPool.js";

export const QUICK_CONFIG = {
  JEE: {
    durationMinutes: 60,
    subjects: [
      { subject: "Mathematics", count: 10, numeric: 2 },
      { subject: "Physics",     count: 10, numeric: 2 },
      { subject: "Chemistry",   count: 10, numeric: 2 },
    ],
  },
  NEET: {
    durationMinutes: 45,
    subjects: [
      { subject: "Physics",   count: 11, numeric: 0 },
      { subject: "Chemistry", count: 11, numeric: 0 },
      { subject: "Biology",   count: 23, numeric: 0 },
    ],
  },
};
export const POOL_PYQ = 500;
export const POOL_BANK = 500;
const BANK_FILTER = { difficulty: "tough", level: { $ne: "advanced" }, type: { $ne: "fill_blank" } };
const CACHE_MS = 60 * 60 * 1000;

const h = (s) => crypto.createHash("sha1").update(String(s)).digest("hex");
const byHash = (key) => (a, b) => (h(key(a)) < h(key(b)) ? -1 : 1);
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
export const maxMarksFor = (exam) => QUICK_CONFIG[exam].subjects.reduce((n, s) => n + s.count, 0) * 4;

// ── Pool (cached list of refs / ids) ────────────────────────────
let cache = { at: 0, pools: null };
export function _resetPoolCache() { cache = { at: 0, pools: null }; }

export async function quickPool(exam) {
  if (cache.pools && Date.now() - cache.at < CACHE_MS) return cache.pools[exam];
  const pools = {};
  for (const [ex, cfg] of Object.entries(QUICK_CONFIG)) {
    const total = cfg.subjects.reduce((n, s) => n + s.count, 0);
    pools[ex] = {};
    for (const s of cfg.subjects) {
      const share = s.count / total;
      const py = pyqPools()[ex]?.[s.subject] ?? { mcq: [], numeric: [] };
      const pyqN = Math.round(POOL_PYQ * share);
      const numN = s.numeric ? Math.min(py.numeric.length, Math.round(pyqN * 0.25)) : 0;
      const numeric = [...py.numeric].sort(byHash((p) => p.ref)).slice(0, numN);
      const mcq = [...py.mcq].sort(byHash((p) => p.ref)).slice(0, pyqN - numN);
      const bankIds = (await Question.find({ examMode: ex, subject: s.subject, ...BANK_FILTER }).select("_id chapter").lean())
        .sort(byHash((q) => q._id)).slice(0, Math.round(POOL_BANK * share));
      pools[ex][s.subject] = {
        pyqMcq: mcq.map((p) => ({ ref: p.ref, chapter: p.chapter })),
        pyqNumeric: numeric.map((p) => ({ ref: p.ref, chapter: p.chapter })),
        bank: bankIds.map((q) => ({ id: String(q._id), chapter: q.chapter })),
      };
    }
  }
  cache = { at: Date.now(), pools };
  return pools[exam];
}

export async function poolSize(exam) {
  const p = await quickPool(exam);
  let pyq = 0; let bank = 0;
  for (const s of Object.values(p)) { pyq += s.pyqMcq.length + s.pyqNumeric.length; bank += s.bank.length; }
  return { pyq, bank, total: pyq + bank };
}

// Picks `n` items, one per chapter first (spread), avoiding `seen` keys
// while enough fresh ones are left.
export function pickSpread(items, n, seen, key) {
  if (n <= 0) return [];
  const fresh = items.filter((x) => !seen.has(key(x)));
  const source = fresh.length >= n ? fresh : items;
  const byChapter = new Map();
  for (const x of shuffle(source)) {
    if (!byChapter.has(x.chapter)) byChapter.set(x.chapter, []);
    byChapter.get(x.chapter).push(x);
  }
  const out = [];
  const lists = shuffle([...byChapter.values()]);
  while (out.length < n && lists.some((l) => l.length)) {
    for (const l of lists) {
      if (out.length >= n) break;
      if (l.length) out.push(l.shift());
    }
  }
  return out;
}

// PYQ options keep NTA's order: the saved solutions (Explain with AI) say
// "option (3)" against the original paper, so shuffling would contradict them.
function shuffledPyq(p) {
  const snap = pyqSnapshot(p);
  if (snap) return snap;
  const canShuffle = snap.type === "mcq" && !snap.optionsInImage && !(snap.optionImages ?? []).some(Boolean)
    && Array.isArray(snap.options) && snap.options.length === 4 && snap.options.every((o) => String(o ?? "").trim());
  if (!canShuffle) return snap;
  const order = shuffle([0, 1, 2, 3]);
  return { ...snap, options: order.map((i) => snap.options[i]), correctIndex: order.indexOf(snap.correctIndex) };
}

function bankSnap(q) {
  const order = shuffle(q.options.map((_, i) => i));
  return {
    questionId: q._id, source: "bank", subject: q.subject, chapter: q.chapter, type: "mcq",
    questionText: q.questionText, options: order.map((i) => q.options[i]), correctIndex: order.indexOf(q.correctIndex),
    imageUrl: q.imageUrl || null, explanation: q.explanation || "", selectedIndex: null,
  };
}

export const questionKey = (q) => (q.pyqRef ? `p:${q.pyqRef}` : `b:${q.questionId}`);

// A fresh paper: NTA order, per subject MCQs (PYQ + bank mixed) then numericals.
export async function buildQuickPaper(exam, seen = new Set()) {
  const cfg = QUICK_CONFIG[exam];
  const pool = await quickPool(exam);
  const byRef = new Map();
  for (const t of ["mcq", "numeric"]) for (const s of cfg.subjects) for (const p of pyqPools()[exam]?.[s.subject]?.[t] ?? []) byRef.set(p.ref, p);

  const out = [];
  for (const s of cfg.subjects) {
    const sp = pool[s.subject];
    const numeric = pickSpread(sp.pyqNumeric, Math.min(s.numeric, sp.pyqNumeric.length), seen, (x) => `p:${x.ref}`);
    const mcqNeeded = s.count - numeric.length;
    const pyqMcqN = Math.min(Math.ceil(mcqNeeded / 2), sp.pyqMcq.length);
    let bankN = mcqNeeded - pyqMcqN;
    const bankPick = pickSpread(sp.bank, Math.min(bankN, sp.bank.length), seen, (x) => `b:${x.id}`);
    bankN = bankPick.length;
    // If the bank is short, fill with more PYQs.
    const pyqPick = pickSpread(sp.pyqMcq, Math.min(mcqNeeded - bankN, sp.pyqMcq.length), seen, (x) => `p:${x.ref}`);
    const bankDocs = await Question.find({ _id: { $in: bankPick.map((b) => b.id) } }).lean();
    const mcqs = shuffle([...bankDocs.map(bankSnap), ...pyqPick.map((x) => shuffledPyq(byRef.get(x.ref)))]);
    out.push(...mcqs, ...numeric.map((x) => pyqSnapshot(byRef.get(x.ref))));
  }
  return out;
}

// What a guest sees of a question: never the key or the solution.
export function guestQuestion(q, i) {
  const out = {
    i, type: q.type ?? "mcq", subject: q.subject, chapter: q.chapter,
    questionText: q.questionText ?? "", options: q.options ?? [], imageUrl: q.imageUrl ?? null,
  };
  if (q.source === "pyq") {
    Object.assign(out, {
      source: "pyq", pyqLabel: q.pyqLabel, imageW: q.imageW ?? null, figUrl: q.figUrl ?? null,
      optionImages: q.optionImages ?? [], optionImageW: q.optionImageW ?? [], optionsInImage: q.optionsInImage === true,
    });
  }
  return out;
}

// ── Scoring (server only) ─────────────────────────────────────────
// answers: [{ i, selectedIndex?, textAnswer?, timeSec? }]
export function scoreQuick(questions, answers, { exam, startedAt, submittedAt, durationMinutes }) {
  const byI = new Map();
  for (const a of Array.isArray(answers) ? answers : []) if (Number.isInteger(a?.i)) byI.set(a.i, a);
  const subjects = new Map();
  const chapters = new Map();
  let correct = 0; let wrong = 0; let skipped = 0;

  const scored = questions.map((q, i) => {
    const a = byI.get(i) ?? {};
    let state; let selectedIndex = null; let textAnswer = null;
    if (q.type === "numeric") {
      textAnswer = typeof a.textAnswer === "string" ? a.textAnswer.trim().slice(0, 20) : "";
      state = !textAnswer ? "skipped" : (q.answers ?? []).some((v) => sameNumber(textAnswer, v)) ? "correct" : "wrong";
      textAnswer = textAnswer || null;
      selectedIndex = state === "skipped" ? null : state === "correct" ? 0 : 1;
    } else {
      selectedIndex = Number.isInteger(a.selectedIndex) && a.selectedIndex >= 0 && a.selectedIndex < (q.options?.length || 4) ? a.selectedIndex : null;
      state = selectedIndex === null ? "skipped" : selectedIndex === q.correctIndex ? "correct" : "wrong";
    }
    const timeSec = Number.isFinite(a.timeSec) ? Math.max(0, Math.min(Math.round(a.timeSec), 3600)) : 0;
    if (state === "correct") correct += 1; else if (state === "wrong") wrong += 1; else skipped += 1;

    const s = subjects.get(q.subject) ?? { subject: q.subject, total: 0, correct: 0, wrong: 0, skipped: 0, marks: 0, timeSec: 0 };
    s.total += 1; s[state] += 1; s.marks += state === "correct" ? 4 : state === "wrong" ? -1 : 0; s.timeSec += timeSec;
    subjects.set(q.subject, s);
    const ck = `${q.subject}|${q.chapter}`;
    const c = chapters.get(ck) ?? { subject: q.subject, chapter: q.chapter, correct: 0, wrong: 0, skipped: 0 };
    c[state] += 1; chapters.set(ck, c);
    return { selectedIndex, textAnswer, timeSec, state };
  });

  const weakChapters = [...chapters.values()]
    .filter((c) => c.wrong + c.skipped > 0)
    .sort((x, y) => (y.wrong * 2 + y.skipped) - (x.wrong * 2 + x.skipped) || x.correct - y.correct || x.chapter.localeCompare(y.chapter))
    .slice(0, 3);
  const limitSec = durationMinutes * 60;
  const tookSec = Math.max(0, Math.round((new Date(submittedAt) - new Date(startedAt)) / 1000));
  return {
    scored,
    result: {
      exam, marks: correct * 4 - wrong, maxMarks: questions.length * 4,
      total: questions.length, correct, wrong, skipped,
      accuracy: correct + wrong ? Math.round((correct / (correct + wrong)) * 1000) / 10 : 0,
      timeTakenSec: Math.min(tookSec, limitSec + 120), timeLimitSec: limitSec,
      subjects: [...subjects.values()],
      weakChapters,
    },
  };
}
