import { describe, it, expect } from "vitest";
import {
  predictJee, predictNeet, expectedJeeRankFromPercentile,
  validateJeeMarks, validateNeetMarks, JEE_SHIFT_IDS,
} from "./rankPredict.js";
import { JEE_SHIFTS, JEE_FACTS, NEET_YEARS } from "./rankData.js";

const near = (actual, expected, pct = 0.01) =>
  expect(Math.abs(actual - expected)).toBeLessThanOrEqual(Math.max(1, expected * pct));

describe("data", () => {
  it("has all 19 shifts with increasing anchors", () => {
    expect(JEE_SHIFTS).toHaveLength(19);
    expect(new Set(JEE_SHIFT_IDS).size).toBe(19);
    for (const s of JEE_SHIFTS) {
      expect(s.p999).toBeGreaterThan(s.marks[99]);
      expect(s.p999).toBeLessThanOrEqual(290);
      expect(s.estimated).toBe(s.session === 2);
    }
  });
});

describe("JEE Main", () => {
  const modes = ["typical", "range", ...JEE_SHIFT_IDS];

  it.each(modes)("is monotonic for %s (more marks → better or equal)", (shift) => {
    let prev = predictJee({ marks: -75, shift });
    for (let m = -74; m <= 300; m++) {
      const r = predictJee({ marks: m, shift });
      expect(r.percentile.mid).toBeGreaterThanOrEqual(prev.percentile.mid);
      expect(r.percentile.low).toBeGreaterThanOrEqual(prev.percentile.low);
      expect(r.percentile.high).toBeGreaterThanOrEqual(prev.percentile.high);
      expect(r.rank.mid).toBeLessThanOrEqual(prev.rank.mid);
      expect(r.rank.best).toBeLessThanOrEqual(prev.rank.best);
      expect(r.rank.worst).toBeLessThanOrEqual(prev.rank.worst);
      expect(r.percentile.low).toBeLessThanOrEqual(r.percentile.mid);
      expect(r.percentile.high).toBeGreaterThanOrEqual(r.percentile.mid);
      prev = r;
    }
  });

  it("reproduces the shift tables", () => {
    expect(predictJee({ marks: 186, shift: "2026-01-22-s1" }).percentile.mid).toBeCloseTo(99.0, 6);
    expect(predictJee({ marks: 97, shift: "2026-01-22-s1" }).percentile.mid).toBeCloseTo(90.0, 6);
    expect(predictJee({ marks: 243, shift: "2026-01-22-s1" }).percentile.mid).toBeCloseTo(99.9, 6);
    expect(predictJee({ marks: 108, shift: "2026-01-24-s2" }).percentile.mid).toBeCloseTo(90.0, 6);
    expect(predictJee({ marks: 162, shift: "2026-04-06-s1" }).percentile.mid).toBeCloseTo(99.0, 6);
    for (const s of JEE_SHIFTS) {
      for (const p of [99, 95, 90]) {
        expect(predictJee({ marks: s.marks[p], shift: s.id }).percentile.mid).toBeCloseTo(p, 6);
      }
    }
  });

  it("flags Session 2 shifts as estimated above 99 percentile", () => {
    expect(predictJee({ marks: 200, shift: "2026-04-02-s1" }).shiftInfo.estimated).toBe(true);
    expect(predictJee({ marks: 200, shift: "2026-01-21-s1" }).shiftInfo.estimated).toBe(false);
  });

  it("gives 300 → 100 percentile, rank 1", () => {
    for (const shift of modes) {
      const r = predictJee({ marks: 300, shift });
      expect(r.percentile).toEqual({ low: 100, mid: 100, high: 100 });
      expect(r.rank).toEqual({ best: 1, mid: 1, worst: 1 });
      expect(r.advancedEligible).toBe("yes");
    }
  });

  it("treats negative marks as 0 percentile", () => {
    const r = predictJee({ marks: -20 });
    expect(r.percentile.mid).toBe(0);
    expect(r.rank.mid).toBe(JEE_FACTS.uniqueCandidates);
    expect(r.advancedEligible).toBe("no");
  });

  it("range mode spans toughest → easiest shift", () => {
    const r = predictJee({ marks: 150, shift: "range" });
    const each = JEE_SHIFT_IDS.map((id) => predictJee({ marks: 150, shift: id }).percentile.mid);
    expect(r.percentile.low).toBeCloseTo(Math.min(...each), 9);
    expect(r.percentile.high).toBeCloseTo(Math.max(...each), 9);
    expect(r.toughestShift.id).toBe("2026-01-22-s2");
    expect(r.easiestShift.id).toBe("2026-01-24-s2");
  });

  it("checks the JEE Advanced General cutoff", () => {
    expect(predictJee({ marks: 40 }).advancedEligible).toBe("no");
    expect(predictJee({ marks: 160 }).advancedEligible).toBe("yes");
    const statuses = new Set();
    for (let m = 80; m <= 140; m++) statuses.add(predictJee({ marks: m }).advancedEligible);
    expect(statuses).toEqual(new Set(["no", "borderline", "yes"]));
  });

  it("computes rank from percentile like NTA", () => {
    expect(expectedJeeRankFromPercentile(100)).toBe(1);
    expect(expectedJeeRankFromPercentile(99)).toBe(15385);
    expect(expectedJeeRankFromPercentile(0)).toBe(1538468);
    expect(expectedJeeRankFromPercentile(93.4123549)).toBe(101349);
  });

  it("rejects bad input", () => {
    expect(() => predictJee({ marks: 301 })).toThrow(RangeError);
    expect(() => predictJee({ marks: -76 })).toThrow(RangeError);
    expect(() => predictJee({ marks: 120.5 })).toThrow(TypeError);
    expect(() => predictJee({ marks: "abc" })).toThrow(TypeError);
    expect(() => predictJee({ marks: "" })).toThrow(TypeError);
    expect(() => predictJee({})).toThrow(TypeError);
    expect(() => predictJee({ marks: 120, shift: "2026-13-01-s9" })).toThrow(RangeError);
    expect(predictJee({ marks: "120" }).marks).toBe(120);
    expect(validateJeeMarks(120)).toBeNull();
    expect(validateJeeMarks(400)).toMatch(/between -75 and 300/);
  });
});

describe("NEET UG", () => {
  it("is monotonic for both reference years", () => {
    let prev = predictNeet({ marks: -180 });
    for (let m = -179; m <= 720; m++) {
      const r = predictNeet({ marks: m });
      for (const y of ["y2026", "y2025"]) {
        expect(r[y].rank.mid).toBeLessThanOrEqual(prev[y].rank.mid);
        expect(r[y].rank.low).toBeLessThanOrEqual(prev[y].rank.low);
        expect(r[y].rank.high).toBeLessThanOrEqual(prev[y].rank.high);
        expect(r[y].rank.low).toBeLessThanOrEqual(r[y].rank.mid);
        expect(r[y].rank.high).toBeGreaterThanOrEqual(r[y].rank.mid);
      }
      prev = r;
    }
  });

  it("reproduces NEET 2026 anchors", () => {
    near(predictNeet({ marks: 600 }).y2026.rank.mid, 10160);
    near(predictNeet({ marks: 650 }).y2026.rank.mid, 1492);
    near(predictNeet({ marks: 500 }).y2026.rank.mid, 90780);
    near(predictNeet({ marks: 213 }).y2026.rank.mid, 996935);
    expect(predictNeet({ marks: 715 }).y2026.rank.mid).toBe(1);
    expect(predictNeet({ marks: 720 }).y2026.rank.mid).toBe(1);
  });

  it("reproduces NEET 2025 anchors", () => {
    near(predictNeet({ marks: 600 }).y2025.rank.mid, 1386);
    near(predictNeet({ marks: 650 }).y2025.rank.mid, 77);
    near(predictNeet({ marks: 144 }).y2025.rank.mid, 1101151);
    expect(predictNeet({ marks: 686 }).y2025.rank.mid).toBe(1);
  });

  it("uses ±15% at 300+ and ±25% below 300", () => {
    const a = predictNeet({ marks: 600 }).y2026.rank;
    expect(a.low).toBe(Math.round(a.mid * 0.85));
    expect(a.high).toBe(Math.round(a.mid * 1.15));
    const b = predictNeet({ marks: 250 }).y2026.rank;
    expect(b.low).toBe(Math.round(b.mid * 0.75));
    expect(b.high).toBe(Math.round(b.mid * 1.25));
  });

  it("checks General qualifying marks", () => {
    expect(predictNeet({ marks: 213 }).qualifies).toEqual({ general2026: true, general2025: true });
    expect(predictNeet({ marks: 212 }).qualifies).toEqual({ general2026: false, general2025: true });
    expect(predictNeet({ marks: 143 }).qualifies).toEqual({ general2026: false, general2025: false });
  });

  it("caps rank at candidates appeared", () => {
    const r = predictNeet({ marks: -180 });
    expect(r.y2026.rank.high).toBeLessThanOrEqual(NEET_YEARS.y2026.appeared);
    expect(r.y2025.rank.mid).toBe(NEET_YEARS.y2025.appeared);
  });

  it("rejects bad input", () => {
    expect(() => predictNeet({ marks: 721 })).toThrow(RangeError);
    expect(() => predictNeet({ marks: -181 })).toThrow(RangeError);
    expect(() => predictNeet({ marks: 600.5 })).toThrow(TypeError);
    expect(() => predictNeet({ marks: null })).toThrow(TypeError);
    expect(validateNeetMarks(600)).toBeNull();
    expect(validateNeetMarks(800)).toMatch(/between -180 and 720/);
  });
});

// 24 Nov audit: impossible scores are refused (hand-checked with 4c − w, c + w ≤ N)
import { reachableMarks, validateNeetMarks as vNeet, validateJeeMarks as vJee } from "./rankPredict.js";
describe("impossible marks", () => {
  it("NEET: 720 / 716 / 715 ok; 717, 718, 719 impossible", () => {
    expect([720, 716, 715, 0, -180].map((m) => reachableMarks(m, 180))).toEqual([true, true, true, true, true]);
    expect([717, 718, 719, -181].map((m) => reachableMarks(m, 180))).toEqual([false, false, false, false]);
    expect(vNeet(719)).toMatch(/isn't possible/);
    expect(vNeet(716)).toBeNull();
  });
  it("JEE: 300 / 296 ok; 297–299 impossible", () => {
    expect(vJee(299)).toMatch(/isn't possible/);
    expect(vJee(297)).toMatch(/isn't possible/);
    expect(vJee(296)).toBeNull();
    expect(vJee(-75)).toBeNull();
  });
});
