// ============================================================
//  JNEET+ AI — pages/Tests.jsx  (v4 — revision routes to new page)
//  CHANGED: handleStart() now navigates to /revision/attempt/:id
//  (the new instant-feedback RevisionSession.jsx) instead of
//  /test/attempt/:id — chapter-wise revision always creates
//  mode: "revision" attempts, which is exactly what that new page
//  is for. handleStartFull() is UNCHANGED — Full Test still goes
//  to the existing exam-simulation TestAttempt.jsx, since that
//  flow (timed, submit-at-end, no mid-test explanations) is
//  correct for a full mock and must stay that way.
//  Everything else UNCHANGED from v3.
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, GraduationCap } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { testApi } from "../api/testApi.js";
import { TestCard } from "../components/tests/TestCard.jsx";
import { Spinner } from "../components/ui/Spinner.jsx";
import toast from "react-hot-toast";

const SUBJECTS_BY_EXAM = {
  NEET: ["Physics", "Chemistry", "Biology"],
  JEE:  ["Physics", "Chemistry", "Mathematics"],
};

const FULL_TEST_LABEL = {
  NEET: "180 questions · 720 marks · +4/−1 marking",
  JEE:  "75 questions · 300 marks · +4/−1 marking",
};

export default function Tests() {
  const { examMode } = useAuth();
  const navigate = useNavigate();
  const subjects = SUBJECTS_BY_EXAM[examMode] ?? SUBJECTS_BY_EXAM.NEET;

  const [activeSubject, setActiveSubject] = useState(subjects[0]);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [startingFull, setStartingFull] = useState(false);

  const loadChapters = useCallback(async (subject) => {
    setLoading(true);
    try {
      const res = await testApi.getChapters(subject);
      setChapters(res.data.chapters ?? []);
    } catch {
      toast.error("Could not load available tests");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadChapters(activeSubject);
  }, [activeSubject, loadChapters]);

  const handleStart = async (chapter, mix) => {
    setStarting(true);
    try {
      const res = await testApi.start({
        subject: activeSubject,
        chapter,
        easy: mix.easy,
        moderate: mix.moderate,
        tough: mix.tough,
      });
      navigate(`/revision/attempt/${res.data.attemptId}`);
    } catch (err) {
      toast.error(err.response?.data?.error || "Could not start test");
    } finally {
      setStarting(false);
    }
  };

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
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-gray-500 hover:text-fg-primary transition p-1.5 rounded-lg hover:bg-bg-hover"
          title="Back"
        >
          <ArrowLeft size={16} />
        </button>
        <span className="font-semibold text-sm">Tests</span>
      </nav>

      <div className="max-w-2xl mx-auto px-5 py-8 space-y-6">

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

        <div>
          <p className="text-[10px] text-gray-700 uppercase tracking-widest font-medium mb-3">
            Chapter-wise Revision
          </p>

          <div className="glass-panel rounded-2xl p-1.5 flex gap-1.5 mb-4">
            {subjects.map((subj) => (
              <button
                key={subj}
                onClick={() => setActiveSubject(subj)}
                className={`flex-1 text-xs font-medium px-3 py-2 rounded-xl transition-all duration-150
                  ${activeSubject === subj
                    ? "bg-violet-600 text-white shadow-glow-sm"
                    : "text-gray-600 hover:text-fg-primary"}`}
              >
                {subj}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <Spinner size={20} />
            </div>
          ) : chapters.length === 0 ? (
            <p className="text-[11px] text-gray-700 text-center pt-10">
              No questions available in {activeSubject} yet — check back soon.
            </p>
          ) : (
            <div className="space-y-2">
              {chapters.map((c) => (
                <TestCard
                  key={c.chapter}
                  chapterInfo={c}
                  onStart={handleStart}
                  starting={starting}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}