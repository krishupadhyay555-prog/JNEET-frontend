// ============================================================
//  JNEET+ AI — pages/TestResult.jsx  (v4 — mode-aware back navigation)
//  FIXED (root cause of the multi-hop back-button chain reported):
//  both the nav-bar back button AND the no-result fallback were
//  hardcoded to navigate("/tests") regardless of attempt.mode.
//  Since Tests.jsx and Revision.jsx are now two fully separate
//  pages (Tests = Full Test only, Revision = chapter-wise
//  instant-feedback), a result page for a REVISION attempt was
//  incorrectly sending "back" to the Full Test page instead of
//  back to Revision's chapter list — that's what produced the
//  Result → Tests → Revision → Dashboard hop chain. Now checks
//  attempt.mode ("test" vs "revision") and routes back to the
//  correct originating page in both places.
//  Everything else — result loading, ResultSummary, ReviewAnswer
//  list — UNCHANGED from v3.
// ============================================================

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { testApi } from "../api/testApi.js";
import { ResultSummary } from "../components/tests/ResultSummary.jsx";
import { ReviewAnswer } from "../components/tests/ReviewAnswer.jsx";
import { Spinner } from "../components/ui/Spinner.jsx";
import toast from "react-hot-toast";

export default function TestResult() {
  const { attemptId } = useParams();
  const navigate = useNavigate();

  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await testApi.getAttempt(attemptId);
        if (!cancelled) setAttempt(res.data.attempt);
      } catch {
        if (!cancelled) toast.error("Could not load this result.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [attemptId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center">
        <Spinner size={20} />
      </div>
    );
  }

  if (!attempt) {
    return (
      <div className="min-h-screen bg-bg-base text-fg-primary flex items-center justify-center px-5">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-3">No result to show.</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="text-xs text-violet-400 hover:text-violet-500 font-medium"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // FIX: route back to whichever page this attempt actually came
  // from — Revision (chapter-wise, instant-feedback) or Tests
  // (Full-Test-only page) — never hardcoded to one or the other.
  const backPath = attempt.mode === "revision" ? "/revision" : "/tests";

  return (
    <div className="min-h-screen bg-bg-base text-fg-primary">
      <nav className="border-b border-bg-border bg-bg-surface/90 backdrop-blur-xl px-5 py-3.5 flex items-center gap-3 sticky top-0 z-10">
        <button
          onClick={() => navigate(backPath, { replace: true })}
          className="flex items-center gap-1.5 text-gray-500 hover:text-fg-primary transition p-1.5 rounded-lg hover:bg-bg-hover"
          title={attempt.mode === "revision" ? "Back to Revision" : "Back to Tests"}
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <p className="font-semibold text-sm">{attempt.chapter}</p>
          <p className="text-[10px] text-gray-600">{attempt.subject}</p>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-5 py-8 space-y-4">
        <ResultSummary attempt={attempt} />

        <p className="text-[10px] text-gray-700 uppercase tracking-widest font-medium pt-2">
          Review
        </p>

        {attempt.questions.map((q, i) => (
          <ReviewAnswer key={q.questionId} question={q} index={i} mode={attempt.mode} />
        ))}
      </div>
    </div>
  );
}