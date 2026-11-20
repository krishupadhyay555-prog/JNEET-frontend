// ============================================================
//  JNEET+ AI — pages/Tests.jsx  (v5 — Full Test only)
//  CHANGED: chapter-wise revision section REMOVED entirely — moved
//  to its own page, Revision.jsx (route /revision), to eliminate
//  the exact confusion reported: two very different flows (submit-
//  at-end mock vs instant-feedback revision) sitting on one page
//  made it easy to tap the wrong one. This page is now Full-Test-
//  only, single clear purpose.
// ============================================================

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGoBack } from "../hooks/useGoBack.js";
import { ArrowLeft, GraduationCap, Trophy, ChevronRight } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { testApi } from "../api/testApi.js";
import toast from "react-hot-toast";

const FULL_TEST_LABEL = {
  NEET: "180 questions · 720 marks · +4/−1 marking · 60 real NEET PYQs inside",
  JEE:  "75 questions (20 MCQ + 5 numerical per subject) · 300 marks · +4/−1 · 45 real JEE Main PYQs inside",
};

export default function Tests() {
  const { examMode } = useAuth();
  const navigate = useNavigate();
  const goBack = useGoBack();

  const [startingFull, setStartingFull] = useState(false);

  const handleStartFull = async () => {
    setStartingFull(true);
    try {
      const res = await testApi.startFull();
      navigate(`/test/attempt/${res.data.attemptId}`);
    } catch (err) {
      toast.error(err.response?.data?.error || "Could not start full test");
    } finally {
      setStartingFull(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-base text-fg-primary">
      <nav className="border-b border-bg-border bg-bg-surface px-5 py-3.5 flex items-center gap-3 sticky top-0 z-10">
        <button
          onClick={goBack}
          className="flex items-center gap-1.5 text-gray-500 hover:text-fg-primary transition p-1.5 rounded-lg hover:bg-bg-hover"
          title="Back"
        >
          <ArrowLeft size={16} />
        </button>
        <span className="font-semibold text-sm">Mock Tests</span>
      </nav>

      <div className="max-w-2xl mx-auto px-5 py-8 space-y-4">
        <button onClick={() => navigate("/all-india")}
          className="w-full glass-panel rounded-2xl p-5 flex items-center gap-3 text-left hover:border-amber-500/40 transition">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center shrink-0">
            <Trophy size={18} className="text-amber-600" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-fg-primary">All-India Mock — every Sunday</p>
            <p className="text-[11px] text-gray-600 mt-0.5">Same paper for everyone, mostly real PYQs, your All-India rank and percentile.</p>
          </div>
          <ChevronRight size={16} className="text-gray-600 shrink-0" />
        </button>

        <div className="glass-panel rounded-2xl p-5">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-violet-600/15 border border-violet-600/25 flex items-center justify-center shrink-0">
              <GraduationCap size={18} className="text-violet-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-fg-primary">Full {examMode} Test</p>
              <p className="text-[11px] text-gray-600 mt-0.5">{FULL_TEST_LABEL[examMode]}</p>
            </div>
          </div>
          <p className="text-xs text-gray-600 mb-4 leading-relaxed">
            A complete, exam-pattern mock on an NTA-style screen (sections, palette, Mark for Review), timed like the real exam. Our questions and real previous-year questions are mixed — every PYQ shows NTA's original question with its exam, date and shift. Results and review appear after you submit.
          </p>
          <button
            onClick={handleStartFull}
            disabled={startingFull}
            className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50
              disabled:cursor-not-allowed text-white text-xs font-semibold py-2.5 rounded-xl
              transition-all duration-150 active:scale-[0.98]"
          >
            {startingFull ? "Starting..." : "Start Full Test"}
          </button>
        </div>
      </div>
    </div>
  );
}