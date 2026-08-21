// ============================================================
//  JNEET+ AI — pages/Revision.jsx  (NEW)
//  Chapter-wise revision selection — split out from Tests.jsx,
//  which previously combined this with Full Test on one page
//  (caused real confusion: easy to tap the wrong button and land
//  in the wrong flow). This is now its own fully separate page/
//  route, reusing the SAME TestCard component (unchanged props:
//  chapterInfo, onStart, starting) — only the page wrapper and
//  navigation target differ from what Tests.jsx used to do.
//  Starting a chapter creates a mode: "revision" TestAttempt
//  (via the existing testApi.start()) and routes to
//  /revision/attempt/:id — the instant-feedback RevisionSession
//  page, never the exam-simulation TestAttempt page.
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { testApi } from "../api/testApi.js";
import { TestCard } from "../components/tests/TestCard.jsx";
import { Spinner } from "../components/ui/Spinner.jsx";
import toast from "react-hot-toast";

const SUBJECTS_BY_EXAM = {
  NEET: ["Physics", "Chemistry", "Biology"],
  JEE:  ["Physics", "Chemistry", "Mathematics"],
};

export default function Revision() {
  const { examMode } = useAuth();
  const navigate = useNavigate();
  const subjects = SUBJECTS_BY_EXAM[examMode] ?? SUBJECTS_BY_EXAM.NEET;

  const [activeSubject, setActiveSubject] = useState(subjects[0]);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);

  const loadChapters = useCallback(async (subject) => {
    setLoading(true);
    try {
      const res = await testApi.getChapters(subject);
      setChapters(res.data.chapters ?? []);
    } catch {
      toast.error("Could not load available revision topics");
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
      toast.error(err.response?.data?.error || "Could not start revision");
    } finally {
      setStarting(false);
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
        <span className="font-semibold text-sm">Revision</span>
      </nav>

      <div className="max-w-2xl mx-auto px-5 py-8 space-y-6">
        <div>
          <h1 className="text-lg font-bold mb-1">Chapter-wise Revision</h1>
          <p className="text-xs text-gray-600">
            Pick a chapter, get instant feedback on every question — no waiting until the end.
          </p>
        </div>

        <div className="glass-panel rounded-2xl p-1.5 flex gap-1.5">
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
  );
}