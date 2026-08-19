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

export function classifyAccuracy(accuracyPct) {
  if (accuracyPct < WEAK_THRESHOLD) return "W";
  if (accuracyPct > STRONG_THRESHOLD) return "S";
  return "M";
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
      status: classifyAccuracy(accuracyPct),
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
      status: classifyAccuracy(accuracyPct),
    };
  }

  // Worst accuracy first — these are the chapters most worth revising.
  byChapter.sort((a, b) => a.accuracyPct - b.accuracyPct);

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