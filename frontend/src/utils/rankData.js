// ============================================================
//  JNEET+ AI — utils/rankData.js
//  Data behind the public Rank Predictor (/rank-predictor).
//  Every number here comes from official NTA result data or from
//  published shift-wise analyses — see `sources` below. Update this
//  file (and `asOf`) when a new NTA result is declared.
//
//  JEE: marks needed for each percentile, per shift (2026 papers).
//  NEET: rank = number of candidates with marks >= the mark.
// ============================================================

export const asOf = "2026-11-19";

// Percentile levels in the shift tables below (high → low).
export const JEE_TABLE_PERCENTILES = [99, 98.5, 98, 97, 96, 95, 94, 93, 92, 91, 90];

// Marks out of 300 needed for each percentile in JEE_TABLE_PERCENTILES order.
// p999 = marks for 99.9 percentile. Session 2 has no published 99.9 point,
// so it is estimated as (99-percentile mark + 55), capped at 290.
const S1 = [
  // id,             date,         shift, 99 … 90 marks,                                      99.9
  ["2026-01-21-s1", "2026-01-21", 1, [168, 156, 147, 134, 123, 115, 106, 99, 93, 87, 82], 224],
  ["2026-01-21-s2", "2026-01-21", 2, [175, 163, 154, 141, 130, 121, 112, 105, 99, 93, 87], 230],
  ["2026-01-22-s1", "2026-01-22", 1, [186, 174, 165, 151, 139, 129, 120, 114, 108, 102, 97], 243],
  ["2026-01-22-s2", "2026-01-22", 2, [153, 140, 131, 118, 108, 99, 92, 85, 79, 74, 70], 219],
  ["2026-01-23-s1", "2026-01-23", 1, [166, 154, 146, 132, 122, 113, 105, 98, 92, 86, 80], 227],
  ["2026-01-23-s2", "2026-01-23", 2, [156, 144, 135, 122, 112, 104, 96, 89, 83, 78, 73], 224],
  ["2026-01-24-s1", "2026-01-24", 1, [175, 163, 154, 141, 130, 121, 112, 105, 99, 93, 87], 236],
  ["2026-01-24-s2", "2026-01-24", 2, [200, 188, 178, 164, 152, 142, 133, 125, 119, 113, 108], 230],
  ["2026-01-28-s1", "2026-01-28", 1, [168, 156, 147, 134, 123, 115, 106, 99, 93, 87, 82], 228],
  ["2026-01-28-s2", "2026-01-28", 2, [172, 160, 151, 138, 127, 118, 110, 103, 97, 91, 86], 237],
];

const S2 = [
  ["2026-04-02-s1", "2026-04-02", 1, [185, 172, 163, 149, 137, 127, 118, 110, 103, 97, 91]],
  ["2026-04-02-s2", "2026-04-02", 2, [192, 180, 170, 156, 144, 134, 124, 116, 110, 103, 97]],
  ["2026-04-04-s1", "2026-04-04", 1, [180, 168, 159, 146, 134, 125, 116, 108, 102, 96, 90]],
  ["2026-04-04-s2", "2026-04-04", 2, [182, 170, 161, 148, 136, 127, 118, 110, 104, 98, 92]],
  ["2026-04-05-s1", "2026-04-05", 1, [193, 180, 170, 156, 144, 134, 124, 116, 110, 103, 97]],
  ["2026-04-05-s2", "2026-04-05", 2, [178, 166, 157, 143, 132, 123, 114, 107, 101, 94, 88]],
  ["2026-04-06-s1", "2026-04-06", 1, [162, 150, 141, 129, 118, 110, 102, 95, 89, 83, 78]],
  ["2026-04-06-s2", "2026-04-06", 2, [196, 183, 173, 159, 146, 136, 126, 118, 112, 105, 99]],
  ["2026-04-08-s2", "2026-04-08", 2, [165, 153, 144, 131, 121, 112, 104, 97, 91, 85, 80]],
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function toShift([id, date, shift, marks, p999], session) {
  const [y, m, d] = date.split("-").map(Number);
  const estimated = p999 == null;
  return {
    id,
    date,
    session,
    shift,
    label: `${d} ${MONTHS[m - 1]} ${y} · Shift ${shift} (${shift === 1 ? "morning" : "afternoon"})`,
    // { [percentile]: marks }
    marks: Object.fromEntries(JEE_TABLE_PERCENTILES.map((p, i) => [p, marks[i]])),
    p999: estimated ? Math.min(290, marks[0] + 55) : p999,
    estimated,
  };
}

export const JEE_SHIFTS = [
  ...S1.map((r) => toShift(r, 1)),
  ...S2.map((r) => toShift(r, 2)),
];

// Typical NTA marks → percentile curve below the 90th percentile
// (widely circulated ranges). Scaled per shift by (shift90 / 68).
export const JEE_LOWER_CURVE = [
  [0, 0],
  [10, 9.70],
  [20, 33.23],
  [30, 56.57],
  [40, 71.30],
  [50, 80.98],
  [60, 86.91],
  [68, 90.0],
];

export const JEE_FACTS = {
  year: 2026,
  uniqueCandidates: 1538468,      // both sessions, NTA 20 Apr 2026
  session1Appeared: 1304653,
  advancedCutoffGeneral: 93.4123549, // JEE Advanced 2026, General (CRL)
  candidatesAt100: 26,
  maxMarks: 300,
  minMarks: -75,
};

// NEET (UG): [marks, rank] anchors. rank = candidates at or above the mark.
export const NEET_YEARS = {
  y2026: {
    key: "y2026",
    year: 2026,
    title: "NEET (UG) 2026",
    paper: "Re-exam, 21 Jun 2026 — easier paper, topper 715",
    appeared: 1994000, // ≈ 20 lakh (≈ 2 × candidates at the 50th percentile)
    qualifyingGeneral: 213, // General, 50th percentile
    topper: 715,
    anchors: [
      [0, 1994000],
      [213, 996935],
      [500, 90780],
      [600, 10160],
      [650, 1492],
      [690, 138],
      [700, 19],
      [715, 1],
    ],
  },
  y2025: {
    key: "y2025",
    year: 2025,
    title: "NEET (UG) 2025",
    paper: "4 May 2025 — tough paper, topper 686",
    appeared: 2209318,
    qualifyingGeneral: 144,
    topper: 686,
    anchors: [
      [0, 2209318],
      [144, 1101151],
      [500, 36843],  // published analysis
      [550, 11000],  // published analyses (approx.)
      [600, 1386],
      [650, 77],
      [686, 1],
    ],
  },
};

export const NEET_FACTS = { maxMarks: 720, minMarks: -180 };

export const sources = [
  {
    title: "Competishun — JEE Main 2026 final result: shift-wise percentile analysis (crowd-sourced from scorecards)",
    url: "https://competishun.com/jee-main-2026-final-result-official-cutoff-shift-wise-percentile-analysis-complete-data-breakdown/",
    exam: "jee",
  },
  {
    title: "Resonance — JEE Main 2026 Session 1 score vs percentile analysis",
    url: "https://resonancecolleges.com/blog/jee-main-2026-session-1-score-vs-percentile-analysis",
    exam: "jee",
  },
  {
    title: "Vedantu — January 2026 shift-wise marks vs percentile vs rank (Session 1)",
    url: "https://www.vedantu.com/jee-main/january-2026-shift-wise-marks-vs-percentile-vs-rank-session-1",
    exam: "jee",
  },
  {
    title: "Collegedunia — How many students appeared for JEE Main 2026 (NTA figures)",
    url: "https://collegedunia.com/news/how-many-students-appeared-for-jee-main-2026-alertid-150907",
    exam: "jee",
  },
  {
    title: "Careers360 — JEE Main 2026 cut-offs for all categories to qualify for JEE Advanced",
    url: "https://news.careers360.com/jee-main-2026-cut-offs-for-all-categories-qualify-for-jee-advanced-year",
    exam: "jee",
  },
  {
    title: "Sunstone — JEE Main marks vs rank vs percentile (typical NTA curve)",
    url: "https://sunstone.in/blog/jee-main-marks-vs-ranks-vs-percentile",
    exam: "jee",
  },
  {
    title: "Republic World — NTA declares NEET UG 2026 result: toppers, cut-off, qualified candidates",
    url: "https://www.republicworld.com/amp/education/nta-declares-neet-ug-2026-result-1121-lakh-candidates-qualify-check-toppers-cut-off-state-wise-performance-and-counselling-details-2026-07-16-132544",
    exam: "neet",
  },
  {
    title: "Sartha — NEET 2026 qualifying cut-off (General, OBC, SC, ST, EWS)",
    url: "https://www.sartha.in/blogs/neet-2026-qualifying-cutoff-general-obc-sc-st-ews",
    exam: "neet",
  },
  {
    title: "Careers360 — NEET UG 2026 cut-offs rise: category-wise cut-offs",
    url: "https://news.careers360.com/neet-ug-2026-cut-offs-rise-category-wise-cut-offs-general-obc-sc-st-mcc-counselling/amp",
    exam: "neet",
  },
  {
    title: "JEE Predictor — NEET marks vs rank",
    url: "https://jeepredictor.in/articles/neet-marks-vs-rank",
    exam: "neet",
  },
  {
    title: "eSaral — NEET marks vs rank",
    url: "https://www.esaral.com/neet/neet-marks-vs-rank/",
    exam: "neet",
  },
  {
    title: "exam.fit — NEET marks vs rank",
    url: "https://exam.fit/blog/neet-marks-vs-rank-2026",
    exam: "neet",
  },
  {
    title: "Free Press Journal — NEET UG 2025 cut-off marks decline across categories",
    url: "https://www.freepressjournal.in/amp/education/neet-ug-2025-cut-off-marks-decline-across-categories",
    exam: "neet",
  },
  {
    title: "Medical Dialogues — NEET 2025 result declared (NTA figures)",
    url: "https://medicaldialogues.in/amp/news/education/medical-admissions/neet-2025-result-declared-final-answer-key-out-download-scorecards-now-150019",
    exam: "neet",
  },
];
