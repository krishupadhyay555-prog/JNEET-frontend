// ============================================================
//  JNEET+ AI — pages/RevisionSession.jsx  (v3 — exit auto-submits
//  partial progress)
//  FIXED (same root cause as TestAttempt.jsx v3): exiting a
//  revision session previously just navigated to /revision after
//  a plain confirm() — the attempt stayed "in-progress" forever
//  and never counted in WMS/Analytics, even though individual
//  answers were ALREADY being saved question-by-question via
//  /test/:attemptId/answer. Exit now calls the EXISTING
//  handleFinish() (same function "Finish Revision" already uses)
//  instead of a bare navigate — submits localAnswers as-is, so the
//  student sees a result immediately and it correctly counts.
//  Confirm-dialog wording updated to reflect the new behavior.
//  Everything else — instant-feedback flow, skip handling, mode-
//  aware exit destination (v2 fix) — UNCHANGED.
// ============================================================

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Check, X as XIcon, SkipForward, ChevronRight } from "lucide-react";
import { testApi } from "../api/testApi.js";
import { Spinner } from "../components/ui/Spinner.jsx";
import toast from "react-hot-toast";

const OPTION_LETTERS = ["A", "B", "C", "D"];

export default function RevisionSession() {
  const { attemptId } = useParams();
  const navigate = useNavigate();

  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [localAnswers, setLocalAnswers] = useState({});
  const [feedback, setFeedback] = useState({});
  const [answering, setAnswering] = useState(false);
  const [finishing, setFinishing] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await testApi.getAttempt(attemptId);
        if (cancelled) return;

        const a = res.data.attempt;

        if (a.status === "submitted") {
          navigate(`/test/result/${attemptId}`, { replace: true });
          return;
        }
        if (a.mode !== "revision") {
          navigate(`/test/attempt/${attemptId}`, { replace: true });
          return;
        }

        setAttempt(a);
      } catch {
        toast.error("Could not load this revision.");
        navigate("/revision", { replace: true });
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
  const currentFeedback = feedback[currentQuestion.questionId];
  const isLast = currentIndex === questions.length - 1;
  const progressPct = Math.round(((currentIndex + 1) / questions.length) * 100);

  const recordAnswer = async (selectedIndex) => {
    if (answering || currentFeedback) return;
    setAnswering(true);
    try {
      const res = await testApi.answerQuestion(attemptId, {
        questionId: currentQuestion.questionId,
        selectedIndex,
      });

      setLocalAnswers((prev) => ({ ...prev, [currentQuestion.questionId]: selectedIndex }));
      setFeedback((prev) => ({
        ...prev,
        [currentQuestion.questionId]: {
          isCorrect: res.data.isCorrect,
          correctIndex: res.data.correctIndex,
          explanation: res.data.explanation,
          skipped: selectedIndex === null,
        },
      }));
    } catch (err) {
      toast.error(err.response?.data?.error || "Could not check this answer.");
    } finally {
      setAnswering(false);
    }
  };

  const handleFinish = async () => {
    setFinishing(true);
    try {
      const payload = {
        answers: questions.map((q) => ({
          questionId: q.questionId,
          selectedIndex: localAnswers[q.questionId] ?? null,
        })),
      };
      await testApi.submit(attemptId, payload);
      navigate(`/test/result/${attemptId}`, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.error || "Could not finish this revision.");
    } finally {
      setFinishing(false);
    }
  };

  const handleExit = async () => {
    if (
      window.confirm(
        "Exit this revision? Whatever you've answered so far will be submitted and scored — unanswered questions count as unattempted."
      )
    ) {
      await handleFinish();
    }
  };

  const goNext = () => {
    if (isLast) {
      handleFinish();
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  const goPrevious = () => setCurrentIndex((i) => Math.max(0, i - 1));

  return (
    <div className="min-h-screen bg-bg-base text-fg-primary">
      <nav className="border-b border-bg-border bg-bg-surface/90 backdrop-blur-xl px-5 py-3.5 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={handleExit}
            disabled={finishing}
            className="flex items-center gap-1.5 text-gray-500 hover:text-fg-primary transition p-1.5 rounded-lg hover:bg-bg-hover shrink-0 disabled:opacity-50"
            title="Exit and submit"
          >
            <ArrowLeft size={16} />
          </button>
          <div className="min-w-0">
            <p className="font-semibold text-sm truncate">{attempt.chapter}</p>
            <p className="text-[10px] text-gray-600">{attempt.subject} · Revision</p>
          </div>
        </div>
        <span className="text-[11px] text-gray-600 shrink-0">
          {currentIndex + 1} of {questions.length}
        </span>
      </nav>

      <div className="h-1 bg-bg-panel">
        <div
          className="h-full bg-violet-600 transition-all duration-300 ease-out"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <div className="max-w-2xl mx-auto px-5 py-6 space-y-5">
        <div key={currentQuestion.questionId} className="animate-fade-up space-y-4">
          <p className="text-sm leading-relaxed text-fg-primary font-medium">
            {currentQuestion.questionText}
          </p>

          {currentQuestion.imageUrl && (
            <img
              src={currentQuestion.imageUrl}
              alt="Question diagram"
              className="rounded-xl border border-bg-border max-h-64 object-contain"
            />
          )}

          <div className="space-y-2">
            {currentQuestion.options.map((opt, idx) => {
              const selected = localAnswers[currentQuestion.questionId] === idx;
              const isCorrectOption = currentFeedback && idx === currentFeedback.correctIndex;
              const isWrongSelected = currentFeedback && selected && !currentFeedback.isCorrect;

              let stateClasses = "border-bg-border hover:border-violet-600/40 hover:bg-bg-hover";
              if (currentFeedback) {
                if (isCorrectOption) {
                  stateClasses = "border-emerald-600/60 bg-emerald-600/10";
                } else if (isWrongSelected) {
                  stateClasses = "border-red-500/60 bg-red-500/10";
                } else {
                  stateClasses = "border-bg-border opacity-60";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => recordAnswer(idx)}
                  disabled={!!currentFeedback || answering}
                  className={`w-full flex items-center gap-3 text-left px-4 py-3 rounded-xl border
                    transition-all duration-150 text-sm ${stateClasses}
                    ${!currentFeedback && !answering ? "cursor-pointer" : "cursor-default"}`}
                >
                  <span className="w-6 h-6 rounded-full bg-bg-panel border border-bg-border
                    flex items-center justify-center text-[11px] font-bold shrink-0">
                    {OPTION_LETTERS[idx]}
                  </span>
                  <span className="flex-1 text-fg-primary">{opt}</span>
                  {currentFeedback && isCorrectOption && (
                    <Check size={16} className="text-emerald-600 shrink-0" />
                  )}
                  {currentFeedback && isWrongSelected && (
                    <XIcon size={16} className="text-red-500 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {!currentFeedback && (
            <button
              onClick={() => recordAnswer(null)}
              disabled={answering}
              className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-fg-primary
                transition disabled:opacity-50 px-3 py-2 rounded-lg hover:bg-bg-hover"
            >
              <SkipForward size={13} />
              {answering ? "Checking..." : "Skip this question"}
            </button>
          )}

          {currentFeedback && (
            <div className="animate-fade-up space-y-2">
              <p className={`text-xs font-semibold ${
                currentFeedback.skipped
                  ? "text-gray-600"
                  : currentFeedback.isCorrect
                    ? "text-emerald-600"
                    : "text-red-500"
              }`}>
                {currentFeedback.skipped
                  ? "You skipped this question."
                  : currentFeedback.isCorrect
                    ? "Correct!"
                    : "Not quite."}
              </p>
              {currentFeedback.explanation && (
                <div className="bg-bg-panel border border-bg-border rounded-xl p-3.5">
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {currentFeedback.explanation}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={goPrevious}
            disabled={currentIndex === 0}
            className="flex items-center gap-1.5 bg-bg-panel border border-bg-border disabled:opacity-40
              disabled:cursor-not-allowed text-fg-primary text-xs font-semibold px-4 py-2.5 rounded-xl
              hover:border-violet-600/40 transition-all duration-150"
          >
            Previous
          </button>

          <button
            onClick={goNext}
            disabled={!currentFeedback || finishing}
            className="flex-1 flex items-center justify-center gap-1.5 bg-violet-600 hover:bg-violet-500
              disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold px-4 py-2.5 rounded-xl
              transition-all duration-150 active:scale-[0.98]"
          >
            {isLast
              ? (finishing ? "Finishing..." : "Finish Revision")
              : (<>Next <ChevronRight size={14} /></>)
            }
          </button>
        </div>
      </div>
    </div>
  );
}