// ============================================================
//  JNEET+ AI — config/targetExams.js  (v3 — NEET *and* JEE)
//  Mirror of backend/config/targetExams.js (kept here so the countdown works
//  offline). backend/tests/targetExams.test.js fails if the two drift apart —
//  keep one exam per line.
//  NTA only confirms the next sitting; later years are projections and are
//  marked `tentative` so the UI never shows fake precision.
// ============================================================

const RE_NEET_ACTIVE = import.meta.env.VITE_RE_NEET_ACTIVE === "true";

export const TARGET_EXAMS = [
  ...(RE_NEET_ACTIVE && import.meta.env.VITE_RE_NEET_DATE
    ? [{ key: "RE_NEET", label: "Re-NEET", date: import.meta.env.VITE_RE_NEET_DATE, tentative: false, examMode: "NEET" }]
    : []),
  { key: "NEET_2026", label: "NEET 2026", date: "2026-05-03T03:30:00.000Z", tentative: false, examMode: "NEET" },
  { key: "NEET_2027", label: "NEET 2027", date: "2027-05-02T03:30:00.000Z", tentative: true, examMode: "NEET" },
  { key: "NEET_2028", label: "NEET 2028", date: "2028-05-07T03:30:00.000Z", tentative: true, examMode: "NEET" },
  { key: "NEET_2029", label: "NEET 2029", date: "2029-05-06T03:30:00.000Z", tentative: true, examMode: "NEET" },
  { key: "NEET_2030", label: "NEET 2030", date: "2030-05-05T03:30:00.000Z", tentative: true, examMode: "NEET" },
  { key: "JEE_MAIN_2027", label: "JEE Main 2027", date: "2027-01-22T03:30:00.000Z", tentative: true, examMode: "JEE" },
  { key: "JEE_ADV_2027", label: "JEE Advanced 2027", date: "2027-05-16T03:30:00.000Z", tentative: true, examMode: "JEE" },
  { key: "JEE_MAIN_2028", label: "JEE Main 2028", date: "2028-01-22T03:30:00.000Z", tentative: true, examMode: "JEE" },
  { key: "JEE_ADV_2028", label: "JEE Advanced 2028", date: "2028-05-21T03:30:00.000Z", tentative: true, examMode: "JEE" },
  { key: "JEE_MAIN_2029", label: "JEE Main 2029", date: "2029-01-22T03:30:00.000Z", tentative: true, examMode: "JEE" },
  { key: "JEE_ADV_2029", label: "JEE Advanced 2029", date: "2029-05-20T03:30:00.000Z", tentative: true, examMode: "JEE" },
];

// Look up one target by key (any exam).
export function getTargetExam(key) {
  return TARGET_EXAMS.find((exam) => exam.key === key) ?? null;
}

// Targets for ONE exam whose date is still in the future — what the picker
// offers, so a finished exam never shows up as selectable.
export function getUpcomingTargetExams(examMode = "NEET") {
  const now = new Date();
  return TARGET_EXAMS
    .filter((exam) => exam.examMode === examMode && new Date(exam.date) > now)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
}

// Nearest upcoming exam of that mode, used when no target is saved yet.
export function getDefaultTargetExam(examMode = "NEET") {
  return getUpcomingTargetExams(examMode)[0] ?? null;
}
