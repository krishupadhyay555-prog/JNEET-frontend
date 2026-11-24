// ============================================================
//  JNEET+ AI — utils/rankPredict.js
//  Pure functions (no React) behind the public Rank Predictor.
//
//  JEE Main: marks → percentile by piecewise-linear interpolation over
//  each shift's published marks-vs-percentile table, then percentile →
//  All India Rank the way NTA does it (best percentile of both
//  sessions, over all unique candidates).
//  NEET UG: rank = candidates with marks >= yours; log(rank) is
//  interpolated linearly between official / published anchors.
//
//  No predictor can be exact for a future paper — every result is a
//  RANGE and the UI says where the data comes from.
// ============================================================

import {
  JEE_SHIFTS, JEE_TABLE_PERCENTILES, JEE_LOWER_CURVE, JEE_FACTS,
  NEET_YEARS, NEET_FACTS,
} from "./rankData.js";

// ---------- input validation ----------

// Can `m` be scored with +4 right / −1 wrong on `n` questions?
// (e.g. NEET 717–719 and JEE 297–299 can't.)
const impossibleMsg = (m, max) =>
  reachableMarks(m, Math.round(max / 4)) ? null : `${m} isn't possible with +4 / −1 marking. Please check your marks.`;
export function reachableMarks(m, n) {
  if (m < 0) return -m <= n;
  const right = Math.ceil(m / 4);
  const wrong = right * 4 - m;
  return right + wrong <= n;
}

function parseMarks(value, min, max, exam) {
  const n = typeof value === "string" && value.trim() !== "" ? Number(value.trim()) : value;
  if (typeof n !== "number" || !Number.isFinite(n)) {
    throw new TypeError(`Enter your ${exam} marks as a number.`);
  }
  if (!Number.isInteger(n)) {
    throw new TypeError(`${exam} marks are always a whole number.`);
  }
  if (n < min || n > max) {
    throw new RangeError(`${exam} marks must be between ${min} and ${max}.`);
  }
  return n;
}

/** Returns null if the value is valid JEE Main marks, else a message. */
export function validateJeeMarks(value) {
  try { return impossibleMsg(parseMarks(value, JEE_FACTS.minMarks, JEE_FACTS.maxMarks, "JEE Main"), JEE_FACTS.maxMarks); }
  catch (e) { return e.message; }
}

/** Returns null if the value is valid NEET UG marks, else a message. */
export function validateNeetMarks(value) {
  try { return impossibleMsg(parseMarks(value, NEET_FACTS.minMarks, NEET_FACTS.maxMarks, "NEET UG"), NEET_FACTS.maxMarks); }
  catch (e) { return e.message; }
}

// ---------- helpers ----------

function interpolate(points, x) {
  if (x <= points[0][0]) return points[0][1];
  const last = points[points.length - 1];
  if (x >= last[0]) return last[1];
  for (let i = 1; i < points.length; i++) {
    const [x1, y1] = points[i];
    if (x <= x1) {
      const [x0, y0] = points[i - 1];
      return y0 + ((x - x0) / (x1 - x0)) * (y1 - y0);
    }
  }
  return last[1];
}

function median(values) {
  const s = [...values].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

const clampPct = (p) => Math.min(100, Math.max(0, p));

// ---------- JEE Main ----------

/** NTA: rank from the best percentile of both sessions over all unique candidates. */
export function expectedJeeRankFromPercentile(p) {
  return Math.max(1, Math.round(((100 - p) / 100) * JEE_FACTS.uniqueCandidates));
}

// (marks, percentile) anchors for one shift, cached.
const anchorCache = new Map();
export function jeeShiftAnchors(shift) {
  if (anchorCache.has(shift.id)) return anchorCache.get(shift.id);
  const m90 = shift.marks[90];
  const scale = m90 / 68;
  const lower = JEE_LOWER_CURVE
    .filter(([m]) => m > 0 && m < 68)
    .map(([m, p]) => [m * scale, p]);
  const table = [...JEE_TABLE_PERCENTILES]
    .sort((a, b) => a - b)
    .map((p) => [shift.marks[p], p]);
  const points = [[0, 0], ...lower, ...table, [shift.p999, 99.9], [JEE_FACTS.maxMarks, 100]];
  anchorCache.set(shift.id, points);
  return points;
}

function shiftPercentile(shift, marks) {
  if (marks <= 0) return 0;
  if (marks >= JEE_FACTS.maxMarks) return 100;
  return clampPct(interpolate(jeeShiftAnchors(shift), marks));
}

// Spread between published analyses at each percentile level.
// [from percentile, ± band]; checked top-down.
const JEE_BANDS = [[99.5, 0.05], [95, 0.3], [85, 1.0], [0, 2.5]];

function jeeBand(mid) {
  const low = clampPct(mid - JEE_BANDS.find(([t]) => mid >= t)[1]);
  // Keep the optimistic end from dropping when the band narrows at a
  // threshold, so more marks never give a worse best case.
  let high = mid + JEE_BANDS.find(([t]) => mid >= t)[1];
  for (let i = 0; i < JEE_BANDS.length - 1; i++) {
    const [t] = JEE_BANDS[i];
    if (mid >= t) high = Math.max(high, t + JEE_BANDS[i + 1][1]);
  }
  return { low, mid, high: clampPct(high) };
}

export const JEE_SHIFT_IDS = JEE_SHIFTS.map((s) => s.id);

function advancedStatus({ low, high }) {
  const c = JEE_FACTS.advancedCutoffGeneral;
  if (low >= c) return "yes";
  if (high < c) return "no";
  return "borderline";
}

/**
 * @param {{ marks: number|string, shift?: string }} input
 *   shift: a shift id ("2026-01-22-s1", …), "typical" (median of all
 *   shifts) or "range" (toughest → easiest shift).
 */
export function predictJee({ marks, shift = "typical" } = {}) {
  const m = parseMarks(marks, JEE_FACTS.minMarks, JEE_FACTS.maxMarks, "JEE Main");

  let percentile;
  let note;
  let extra = {};
  const all = JEE_SHIFTS.map((s) => ({ s, p: shiftPercentile(s, m) }));

  if (shift === "typical") {
    percentile = m <= 0 ? { low: 0, mid: 0, high: 0 } : m >= JEE_FACTS.maxMarks
      ? { low: 100, mid: 100, high: 100 } : jeeBand(median(all.map((x) => x.p)));
    note = `Typical shift: the middle value of all ${JEE_SHIFTS.length} JEE Main ${JEE_FACTS.year} shifts at your marks, ± the spread between published analyses.`;
  } else if (shift === "range") {
    const sorted = [...all].sort((a, b) => a.p - b.p);
    const easiest = sorted[0];                 // lowest percentile for the same marks
    const toughest = sorted[sorted.length - 1]; // highest percentile for the same marks
    percentile = { low: easiest.p, mid: median(all.map((x) => x.p)), high: toughest.p };
    extra = {
      toughestShift: { id: toughest.s.id, label: toughest.s.label },
      easiestShift: { id: easiest.s.id, label: easiest.s.label },
    };
    note = `All shifts: from the easiest shift (${easiest.s.label}) to the toughest (${toughest.s.label}) at your marks.`;
  } else {
    const s = JEE_SHIFTS.find((x) => x.id === shift);
    if (!s) throw new RangeError(`Unknown JEE Main shift: ${shift}`);
    const mid = shiftPercentile(s, m);
    percentile = m <= 0 ? { low: 0, mid: 0, high: 0 } : m >= JEE_FACTS.maxMarks
      ? { low: 100, mid: 100, high: 100 } : jeeBand(mid);
    extra = { shiftInfo: { id: s.id, label: s.label, session: s.session, estimated: s.estimated } };
    note = `Based on the ${s.label} paper (Session ${s.session}), ± the spread between published analyses.`
      + (s.estimated ? " Above 99 percentile this shift's curve is estimated — no 99.9 percentile data was published for Session 2." : "");
  }

  return {
    marks: m,
    percentile,
    rank: {
      best: expectedJeeRankFromPercentile(percentile.high),
      mid: expectedJeeRankFromPercentile(percentile.mid),
      worst: expectedJeeRankFromPercentile(percentile.low),
    },
    advancedEligible: advancedStatus(percentile),
    note,
    ...extra,
  };
}

// ---------- NEET UG ----------

const NEET_BAND_HIGH = 0.15; // 300 marks and above
const NEET_BAND_LOW = 0.25;  // below 300 marks
const NEET_BAND_SWITCH = 300;

function neetMidRank(year, marks) {
  const { anchors } = year;
  const top = anchors[anchors.length - 1];
  if (marks >= top[0]) return 1;
  if (marks <= anchors[0][0]) return anchors[0][1];
  const logPts = anchors.map(([x, r]) => [x, Math.log(r)]);
  return Math.max(1, Math.round(Math.exp(interpolate(logPts, marks))));
}

function neetRank(year, marks) {
  const mid = neetMidRank(year, marks);
  const f = marks < NEET_BAND_SWITCH ? NEET_BAND_LOW : NEET_BAND_HIGH;
  let low = Math.max(1, Math.round(mid * (1 - f)));
  // The band narrows at 300 marks; never let the best case get worse with more marks.
  if (marks >= NEET_BAND_SWITCH) {
    const below = neetMidRank(year, NEET_BAND_SWITCH - 1);
    low = Math.min(low, Math.max(1, Math.round(below * (1 - NEET_BAND_LOW))));
  }
  const high = Math.min(year.appeared, Math.round(mid * (1 + f)));
  return { low, mid, high: Math.max(high, mid) };
}

/**
 * @param {{ marks: number|string }} input
 * rank.low = best case (smaller number), rank.high = worst case.
 */
export function predictNeet({ marks } = {}) {
  const m = parseMarks(marks, NEET_FACTS.minMarks, NEET_FACTS.maxMarks, "NEET UG");
  const out = { marks: m };
  for (const key of Object.keys(NEET_YEARS)) {
    const y = NEET_YEARS[key];
    const rank = neetRank(y, m);
    out[key] = {
      rank,
      appeared: y.appeared,
      topPercent: (rank.mid / y.appeared) * 100,
    };
  }
  out.qualifies = {
    general2026: m >= NEET_YEARS.y2026.qualifyingGeneral,
    general2025: m >= NEET_YEARS.y2025.qualifyingGeneral,
  };
  return out;
}
