// ============================================================
//  JNEET+ AI — services/wmsScoringService.js  (v2 — auto-calculated)
//  REPLACED the old manual self-report scoring logic entirely.
//  WMS status is now derived from REAL accuracy across a
//  student's full Test + Revision history — no self-click input.
//  Unattempted questions count against accuracy (same principle
//  as a real exam: not knowing an answer and guessing wrong are
//  both signals of weakness, skipping isn't neutral).
// ============================================================

const WEAK_THRESHOLD   = 40; // < 40% accuracy
const STRONG_THRESHOLD = 70; // > 70% accuracy — between is Medium

// A label built on 1-2 questions is noise, not insight: a chapter needs at
// least MIN_CHAPTER_SAMPLE questions (and a subject MIN_SUBJECT_SAMPLE) before
// it can be called Weak / Medium / Strong. Below that it is "N" (need more data).
export const MIN_CHAPTER_SAMPLE = 5;
export const MIN_SUBJECT_SAMPLE = 10;

export function classifyAccuracy(accuracyPct, total = Infinity, minSample = MIN_CHAPTER_SAMPLE) {
  if (total < minSample) return "N";
  if (accuracyPct < WEAK_THRESHOLD) return "W";
  if (accuracyPct > STRONG_THRESHOLD) return "S";
  return "M";
}

// Folds attempts (each with a `questions` array) into per-(subject, chapter)
// rows. Done in Node instead of a Mongo $group/$cond so it is portable, unit
// testable and cheap (the caller limits it to the most recent attempts).
export function foldAttempts(attempts) {
  const map = new Map();
  for (const a of attempts ?? []) {
    for (const q of a.questions ?? []) {
      if (!q?.subject || !q?.chapter) continue;
      const key = `${q.subject}\u0000${q.chapter}`;
      let row = map.get(key);
      if (!row) {
        row = { _id: { subject: q.subject, chapter: q.chapter }, total: 0, correct: 0, unattempted: 0 };
        map.set(key, row);
      }
      row.total += 1;
      if (q.selectedIndex === null || q.selectedIndex === undefined) row.unattempted += 1;
      else if (q.selectedIndex === q.correctIndex) row.correct += 1;
    }
  }
  return [...map.values()];
}

// `rows` = aggregation output, one row per (subject, chapter),
// each with { total, correct, unattempted }. Shapes it into the
// full summary the frontend needs: overall totals, subject-level
// rollups (with status), and chapter-level detail (for a "focus
// areas" list, worst-accuracy first).
export function buildWMSSummary(rows) {
  const bySubject = {};
  const byChapter = [];

  let overallTotal = 0, overallCorrect = 0, overallUnattempted = 0;

  for (const row of rows) {
    const { subject, chapter } = row._id;
    const total = row.total;
    const correct = row.correct;
    const unattempted = row.unattempted;
    const wrong = total - correct - unattempted;
    const accuracyPct = total > 0 ? Math.round((correct / total) * 100) : 0;

    overallTotal += total;
    overallCorrect += correct;
    overallUnattempted += unattempted;

    if (!bySubject[subject]) {
      bySubject[subject] = { total: 0, correct: 0, unattempted: 0 };
    }
    bySubject[subject].total += total;
    bySubject[subject].correct += correct;
    bySubject[subject].unattempted += unattempted;

    byChapter.push({
      subject, chapter, total, correct, wrong, unattempted,
      accuracyPct,
      status: classifyAccuracy(accuracyPct, total, MIN_CHAPTER_SAMPLE),
    });
  }

  const subjectSummary = {};
  for (const [subject, s] of Object.entries(bySubject)) {
    const wrong = s.total - s.correct - s.unattempted;
    const accuracyPct = s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
    subjectSummary[subject] = {
      total: s.total,
      correct: s.correct,
      wrong,
      unattempted: s.unattempted,
      accuracyPct,
      status: classifyAccuracy(accuracyPct, s.total, MIN_SUBJECT_SAMPLE),
    };
  }

  // Worst accuracy first — these are the chapters most worth revising.
  // Chapters with too few questions to judge go to the end of the list.
  byChapter.sort((a, b) =>
    (a.status === "N") - (b.status === "N") ||
    a.accuracyPct - b.accuracyPct ||
    b.total - a.total ||
    a.chapter.localeCompare(b.chapter)
  );

  const overallWrong = overallTotal - overallCorrect - overallUnattempted;
  const overallAccuracyPct = overallTotal > 0
    ? Math.round((overallCorrect / overallTotal) * 100)
    : 0;

  return {
    overall: {
      total: overallTotal,
      correct: overallCorrect,
      wrong: overallWrong,
      unattempted: overallUnattempted,
      accuracyPct: overallAccuracyPct,
    },
    bySubject: subjectSummary,
    byChapter,
  };
}