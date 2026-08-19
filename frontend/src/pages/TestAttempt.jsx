// ============================================================
//  JNEET+ AI — pages/TestAttempt.jsx  (v2 — rebuilt)
//  ARCHITECTURE FIX: the previous version read attemptId+questions
//  from React Router navigation `state` — which is tied to a
//  specific history entry and can behave unpredictably with
//  browser back/forward (exactly the "test section repeats" bug).
//  Now the page reads `attemptId` from the URL itself
//  (/test/attempt/:attemptId) and FETCHES its data fresh from the
//  server on every mount — so back/forward/refresh always show the
//  correct, current state, no matter how you arrived here.
//  UX FIX: one question at a time (was all-questions-on-one-page)
//  + a QuestionPalette to jump between them — matches standard
//  exam-app UX (Testbook/Embibe/NTA-style), not a generic quiz feel.
//  VISUAL: uses .glass-panel for the palette bar, matching the
//  premium look already established in Settings.jsx.
// ============================================================

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight, Send } from "lucide-react";
import { testApi } from "../api/testApi.js";
import { MCQCard } from "../components/tests/MCQCard.jsx";
import { QuestionPalette } from "../components/tests/QuestionPalette.jsx";
import { TestTimer } from "../components/tests/TestTimer.jsx";
import { Spinner } from "../components/ui/Spinner.jsx";
import toast from "react-hot-toast";

export default function TestAttempt() {
  const { attemptId } = useParams();
  const navigate = useNavigate();

  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await testApi.getAttempt(attemptId);
        if (cancelled) return;

        const a = res.data.attempt;

        // Already submitted (e.g. reached via back-button after
        // finishing) — send straight to the result page instead of
        // re-showing a "live" test.
        if (a.status === "submitted") {
          navigate(`/test/result/${attemptId}`, { replace: true });
          return;
        }

        setAttempt(a);

        const initialAnswers = {};
        a.questions.forEach((q) => {
          if (q.selectedIndex !== null && q.selectedIndex !== undefined) {
            initialAnswers[q.questionId] = q.selectedIndex;
          }
        });
        setAnswers(initialAnswers);

      } catch {
        toast.error("Could not load this test.");
        navigate("/tests", { replace: true });
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [attemptId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center">
        <Spinner size={20} />
      </div>
    );
  }

  if (!attempt) return null;

  const questions = attempt.questions;
  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const isLast = currentIndex === questions.length - 1;
  const allAnswered = answeredCount === questions.length;

  const handleSelect = (questionId, index) => {
    setAnswers((prev) => ({ ...prev, [questionId]: index }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const payload = {
        answers: questions.map((q) => ({
          questionId: q.questionId,
          selectedIndex: answers[q.questionId] ?? null,
        })),
      };
      await testApi.submit(attemptId, payload);
      navigate(`/test/result/${attemptId}`, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.error || "Could not submit test");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-base text-fg-primary">
      <nav className="border-b border-bg-border bg-bg-surface/90 backdrop-blur-xl px-5 py-3.5 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => {
              if (window.confirm("Exit this test? Your answers so far are saved, but the test will stay incomplete until you submit.")) {
                navigate("/tests", { replace: true });
              }
            }}
            className="flex items-center gap-1.5 text-gray-500 hover:text-fg-primary transition p-1.5 rounded-lg hover:bg-bg-hover shrink-0"
            title="Exit test"
          >
            <ArrowLeft size={16} />
          </button>
          <div className="min-w-0">
            <p className="font-semibold text-sm truncate">{attempt.chapter}</p>
            <p className="text-[10px] text-gray-600">{attempt.subject}</p>
          </div>
        </div>
        <TestTimer startedAt={attempt.startedAt} />
      </nav>

      <div className="max-w-2xl mx-auto px-5 py-6 space-y-5">
        <div className="glass-panel rounded-2xl p-3">
          <p className="text-[11px] text-gray-600 mb-2.5 px-1">
            {answeredCount} of {questions.length} answered
          </p>
          <QuestionPalette
            questions={questions}
            currentIndex={currentIndex}
            answers={answers}
            onJump={setCurrentIndex}
          />
        </div>

        <div key={currentQuestion.questionId} className="animate-fade-up">
          <MCQCard
            question={currentQuestion}
            index={currentIndex}
            total={questions.length}
            selectedIndex={answers[currentQuestion.questionId] ?? null}
            onSelect={handleSelect}
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            disabled={currentIndex === 0}
            className="flex items-center gap-1.5 bg-bg-panel border border-bg-border disabled:opacity-40
              disabled:cursor-not-allowed text-fg-primary text-xs font-semibold px-4 py-2.5 rounded-xl
              hover:border-violet-600/40 transition-all duration-150"
          >
            <ChevronLeft size={14} /> Previous
          </button>

          {isLast ? (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500
                disabled:opacity-50 text-white text-xs font-semibold px-4 py-2.5 rounded-xl
                transition-all duration-150 active:scale-[0.98]"
            >
              <Send size={13} />
              {submitting ? "Submitting..." : "Submit Test"}
            </button>
          ) : (
            <button
              onClick={() => setCurrentIndex((i) => Math.min(questions.length - 1, i + 1))}
              className="flex-1 flex items-center justify-center gap-1.5 bg-violet-600 hover:bg-violet-500
                text-white text-xs font-semibold px-4 py-2.5 rounded-xl
                transition-all duration-150 active:scale-[0.98]"
            >
              Next <ChevronRight size={14} />
            </button>
          )}
        </div>

        {!isLast && allAnswered && (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500
              disabled:opacity-50 text-white text-xs font-semibold px-4 py-2.5 rounded-xl
              transition-all duration-150 active:scale-[0.98]"
          >
            <Send size={13} />
            All answered — Submit now
          </button>
        )}
      </div>
    </div>
  );
}