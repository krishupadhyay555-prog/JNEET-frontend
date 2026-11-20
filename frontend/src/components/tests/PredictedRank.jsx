// ============================================================
//  JNEET+ AI — components/tests/PredictedRank.jsx
//  After a FULL mock (75-question JEE / 180-question NEET, NTA marking):
//  "if this were the real exam" — percentile and AIR from the Rank
//  Predictor (utils/rankPredict.js, official NTA result data). Only for
//  full papers: a chapter test's marks mean nothing on the NTA scale.
// ============================================================

import { Link } from "react-router-dom";
import { TrendingUp } from "lucide-react";
import { predictJee, predictNeet } from "../../utils/rankPredict.js";

const inr = (n) => Math.round(n).toLocaleString("en-IN");

export function PredictedRank({ attempt }) {
  const full = attempt.mode === "test" && (attempt.maxMarks === 300 || attempt.maxMarks === 720) && attempt.totalQuestions >= 75;
  if (!full || typeof attempt.marksObtained !== "number") return null;

  let jee = null, neet = null;
  try {
    if (attempt.examMode === "JEE") jee = predictJee({ marks: Math.max(0, attempt.marksObtained), shift: "typical" });
    else neet = predictNeet({ marks: Math.max(0, attempt.marksObtained) });
  } catch {
    return null;
  }

  const body = jee ? (
    <>
      <p className="text-2xl font-bold tabular-nums">{jee.percentile.mid.toFixed(2)} <span className="text-xs font-medium text-gray-600">percentile</span></p>
      <p className="text-xs text-gray-600">≈ AIR {inr(jee.rank.best)} – {inr(jee.rank.worst)} on a typical JEE Main 2026 shift ·
        JEE Advanced cut-off (General 93.41): <span className="font-semibold text-fg-primary">{jee.advancedEligible === "yes" ? "above" : jee.advancedEligible === "no" ? "below" : "borderline"}</span></p>
    </>
  ) : (
    <>
      <p className="text-2xl font-bold tabular-nums">AIR {inr(neet.y2025.rank.low)} – {inr(neet.y2026.rank.high)}</p>
      <p className="text-xs text-gray-600">≈ AIR {inr(neet.y2025.rank.mid)} if the paper is tough like NEET 2025, ≈ {inr(neet.y2026.rank.mid)} if easier like NEET 2026 ·
        qualifying (General): <span className="font-semibold text-fg-primary">{neet.qualifies.general2026 ? "yes" : neet.qualifies.general2025 ? "only in a tough year" : "not yet"}</span></p>
    </>
  );

  return (
    <div className="glass-panel rounded-2xl p-4 space-y-1">
      <p className="text-[11px] font-semibold text-violet-600 flex items-center gap-1.5"><TrendingUp size={13} /> If this were the real exam</p>
      {body}
      <p className="text-[10px] text-gray-600">An estimate from official NTA result data — our mocks are not normalised like NTA&apos;s. <Link to="/rank-predictor" className="text-violet-600 font-medium">How it works</Link></p>
    </div>
  );
}
