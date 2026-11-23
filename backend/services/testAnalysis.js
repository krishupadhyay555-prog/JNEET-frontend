// ─────────────────────────────────────────────────────────────
//  JNEET+ AI — services/testAnalysis.js
//  Elite "deep analysis" of a submitted test: subject and chapter
//  accuracy, marks lost to negative marking, time per question, PYQ vs
//  bank accuracy, weakest chapters (with their OneShot) and a short,
//  rule-based action plan. Pure maths on the attempt — no AI cost.
// ─────────────────────────────────────────────────────────────
import TestAttempt from "../models/TestAttempt.js";
import { listOneShots } from "./oneshot.js";

const pct = (a, b) => (b ? Math.round((a / b) * 100) : null);

function tally(rows) {
  const t = { total: rows.length, correct: 0, wrong: 0, skipped: 0, timeSec: 0, timed: 0 };
  for (const q of rows) {
    if (q.selectedIndex === null || q.selectedIndex === undefined) t.skipped += 1;
    else if (q.selectedIndex === q.correctIndex) t.correct += 1;
    else t.wrong += 1;
    if (Number.isFinite(q.timeSpentSec)) { t.timeSec += q.timeSpentSec; t.timed += 1; }
  }
  t.marks = t.correct * 4 - t.wrong;
  t.accuracy = pct(t.correct, t.correct + t.wrong);
  t.avgSec = t.timed ? Math.round(t.timeSec / t.timed) : null;
  delete t.timed;
  return t;
}

function groupBy(list, keyFn) {
  const m = new Map();
  for (const x of list) { const k = keyFn(x); if (!m.has(k)) m.set(k, []); m.get(k).push(x); }
  return m;
}

export async function analyseAttempt(attempt) {
  const qs = attempt.questions;
  const overall = tally(qs);
  const slugs = new Map(listOneShots(attempt.examMode).map((o) => [`${o.subject}|${o.chapter}`.toLowerCase(), o.slug]));

  const subjects = [...groupBy(qs, (q) => q.subject)].map(([subject, rows]) => ({ subject, ...tally(rows) }));
  const chapters = [...groupBy(qs, (q) => `${q.subject}|${q.chapter}`)].map(([k, rows]) => {
    const [subject, chapter] = k.split("|");
    const t = tally(rows);
    return { subject, chapter, slug: slugs.get(k.toLowerCase()) ?? null, ...t, dropped: 4 * (t.wrong + t.skipped) + t.wrong };
  });
  const weakest = chapters.filter((c) => c.dropped > 0).sort((a, b) => b.dropped - a.dropped || (a.accuracy ?? 0) - (b.accuracy ?? 0)).slice(0, 5);
  const strongest = chapters.filter((c) => c.correct >= 2 && c.wrong === 0).sort((a, b) => b.correct - a.correct).slice(0, 3);

  const pyq = tally(qs.filter((q) => q.source === "pyq"));
  const bank = tally(qs.filter((q) => q.source !== "pyq"));

  // Time: questions that took much longer than the student's own median.
  const times = qs.map((q) => q.timeSpentSec).filter(Number.isFinite).sort((a, b) => a - b);
  const median = times.length ? times[Math.floor(times.length / 2)] : null;
  const slow = median ? qs.filter((q) => q.timeSpentSec > Math.max(2 * median, 120)) : [];
  const time = times.length ? {
    totalSec: times.reduce((s, x) => s + x, 0),
    medianSec: median,
    slowCount: slow.length,
    slowWrong: slow.filter((q) => q.selectedIndex !== null && q.selectedIndex !== undefined && q.selectedIndex !== q.correctIndex).length,
    onWrongSec: qs.filter((q) => q.selectedIndex !== null && q.selectedIndex !== undefined && q.selectedIndex !== q.correctIndex && Number.isFinite(q.timeSpentSec)).reduce((s, q) => s + q.timeSpentSec, 0),
  } : null;

  const history = await TestAttempt.find({ userId: attempt.userId, examMode: attempt.examMode, mode: "test", status: "submitted", submittedAt: { $lte: attempt.submittedAt } })
    .sort({ submittedAt: -1 }).limit(6).select("submittedAt marksObtained maxMarks allIndiaMockId").lean();
  const trend = history.reverse().map((h) => ({ at: h.submittedAt, marks: h.marksObtained, max: h.maxMarks, allIndia: Boolean(h.allIndiaMockId) }));

  const tips = [];
  if (overall.wrong > 0) {
    tips.push(`Negative marking cost you ${overall.wrong} mark${overall.wrong === 1 ? "" : "s"}. Answer only when you can rule out at least two options.`);
  }
  if (overall.accuracy !== null && overall.accuracy >= 80 && overall.skipped > overall.total * 0.25) {
    tips.push(`Your accuracy is ${overall.accuracy}% but you left ${overall.skipped} questions. You can afford to attempt more.`);
  }
  if (overall.accuracy !== null && overall.accuracy < 60 && overall.wrong >= 5) {
    tips.push(`Accuracy is ${overall.accuracy}%. Slow down on the first read and attempt fewer, surer questions.`);
  }
  if (time?.slowCount) {
    tips.push(`${time.slowCount} question${time.slowCount === 1 ? "" : "s"} took over ${Math.round(Math.max(2 * time.medianSec, 120) / 60)} min${time.slowWrong ? ` and ${time.slowWrong} of them were still wrong` : ""}. Skip and come back instead of getting stuck.`);
  }
  const slowSubj = subjects.filter((s) => s.avgSec).sort((a, b) => b.avgSec - a.avgSec)[0];
  if (slowSubj && subjects.length > 1) tips.push(`${slowSubj.subject} is your slowest subject (${slowSubj.avgSec}s per question). Practise timed sets there.`);
  if (weakest[0]) tips.push(`Revise ${weakest.slice(0, 3).map((c) => c.chapter).join(", ")} first: they lost you the most marks.`);
  if (pyq.total >= 5 && bank.total >= 5 && pyq.accuracy !== null && bank.accuracy !== null && pyq.accuracy + 15 < bank.accuracy) {
    tips.push(`You scored lower on real PYQs (${pyq.accuracy}%) than on practice questions (${bank.accuracy}%). Do more chapter-wise PYQs.`);
  }

  return { overall, subjects, weakest, strongest, pyq, bank, time, trend, tips, maxMarks: attempt.maxMarks, mode: attempt.mode };
}
