// ============================================================
//  JNEET+ AI — config/targetExams.js  (Fixed)
//  IMPORTANT: NTA (exam conducting body) only officially confirms
//  the exam date a few months before the exam itself. Any year
//  beyond the immediate next one is a "tentative" projection based
//  on past trends — NOT an official NTA date. We mark this so the
//  UI never shows fake precision to students.
// ============================================================

const RE_NEET_ACTIVE = import.meta.env.VITE_RE_NEET_ACTIVE === "true";

export const TARGET_EXAMS = [
  ...(RE_NEET_ACTIVE && import.meta.env.VITE_RE_NEET_DATE
    ? [{
        key: "RE_NEET",
        label: "Re-NEET",
        date: import.meta.env.VITE_RE_NEET_DATE,
        tentative: false,
      }]
    : []),
  { key: "NEET_2026", label: "NEET 2026", date: "2026-05-03T03:30:00.000Z", tentative: false },
  { key: "NEET_2027", label: "NEET 2027", date: "2027-05-02T03:30:00.000Z", tentative: true },
  { key: "NEET_2028", label: "NEET 2028", date: "2028-05-07T03:30:00.000Z", tentative: true },
  { key: "NEET_2029", label: "NEET 2029", date: "2029-05-06T03:30:00.000Z", tentative: true },
  { key: "NEET_2030", label: "NEET 2030", date: "2030-05-05T03:30:00.000Z", tentative: true },
];

// Unchanged — used wherever we already have a specific key
// (e.g. Dashboard.jsx showing the user's saved target).
export function getTargetExam(key) {
  return TARGET_EXAMS.find((exam) => exam.key === key) ?? null;
}

// NEW — only returns exams whose date is still in the future.
// This is what TargetExamModal should map over instead of the
// raw TARGET_EXAMS array, so an already-completed exam (like
// NEET 2026 after May 2026) never appears as a selectable target.
export function getUpcomingTargetExams() {
  const now = new Date();
  return TARGET_EXAMS.filter((exam) => new Date(exam.date) > now);
}

// NEW — sensible default target: the nearest exam that hasn't
// happened yet. Use this instead of defaulting to TARGET_EXAMS[0],
// which can silently point at a past exam once time moves on.
export function getDefaultTargetExam() {
  const upcoming = getUpcomingTargetExams();
  return upcoming.length > 0 ? upcoming[0] : null;
}