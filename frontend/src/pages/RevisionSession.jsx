// ============================================================
//  JNEET+ AI — pages/RevisionSession.jsx  (NEW)
//  The instant-feedback revision flow — deliberately separate
//  from TestAttempt.jsx (which stays exam-simulation, submit-at-
//  end, no explanations mid-test). Here, every answer OR skip
//  immediately reveals correct/wrong (red/green) + a short
//  explanation via the new /test/:attemptId/answer endpoint.
//  Deliberately NO jump-palette (unlike Mock Test) — just linear
//  Previous/Next + a progress bar. Fewer moving parts, fewer edge
//  cases, matches the "simple but not confusing, never breaks"
//  priority this project has repeatedly emphasized.
//  Skipping records selectedIndex: null on the backend — the
//  EXACT SAME "unattempted" signal the WMS aggregation already
//  understands (no new WMS logic needed; a skipped question
//  correctly counts toward that topic looking weaker, since not
//  knowing an answer is itself a weakness signal).
//  Reads attemptId from the URL (not nav state) and fetches fresh
//  on mount — same architecture fix already applied to
//  TestAttempt.jsx, for the same back/forward-safety reason.
//  Finishing calls the EXISTING testApi.submit() with the answers
//  accumulated locally as the student went — reuses the already-
//  tested scoring logic in submitTest(), no duplication.
// ============================================================

import { useState, useEffect, useRef } from "react";
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

  // { [questionId]: selectedIndex | null } — accumulated locally,
  // sent as the final batch to submitTest() at the end.
  const [localAnswers, setLocalAnswers] = useState({});

  // { [questionId]: { isCorrect, correctIndex, explanation, skipped } }
  const [feedback, setFeedback] = useState({});
  const [answering, setAnswering] = useState(false);
  const [finishing, setFinishing] = useState(false);

  const loadedRef = useRef(false);

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
          // Safety net — this page is revision-only.
          navigate(`/test/attempt/${attemptId}`, { replace: true });
          return;
        }

        setAttempt(a);
      } catch {
        toast.error("Could not load this revision.");
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
            onClick={() => {
              if (window.confirm("Exit this revision? Your progress so far is saved, but it will stay incomplete until you finish.")) {
                navigate("/tests", { replace: true });
              }
            }}
            className="flex items-center gap-1.5 text-gray-500 hover:text-fg-primary transition p-1.5 rounded-lg hover:bg-bg-hover shrink-0"
            title="Exit"
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

      {/* Progress bar */}
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