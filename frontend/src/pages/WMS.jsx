// ============================================================
//  JNEET+ AI — pages/WMS.jsx  (v3 — polished, A+ pass)
//  CHANGED:
//    - Loading state: plain <Spinner> → skeleton blocks (matches
//      the premium loading pattern already used in Notes.jsx),
//      feels less "raw" than a bare spinner on a page this central.
//    - "Focus areas" list now caps at 6 by default with a "Show
//      all (N)" toggle — an unbounded list of every chapter ever
//      attempted would grow messy over time; this keeps the page
//      scannable while still surfacing everything on request.
//    - Rank numbers (1, 2, 3...) passed into WeaknessCard so the
//      "weakest first" ordering is visually explicit.
//    - Nav subtitle line added ("Auto-updated...") for context,
//      since this page has no manual controls to explain itself.
//  Data flow, empty state, subjects-by-exam-mode filtering —
//  UNCHANGED from v2.
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ClipboardList, ChevronDown, ChevronUp } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { wmsApi } from "../api/wmsApi.js";
import { ProgressGraph } from "../components/wms/ProgressGraph.jsx";
import { SubjectIndicator } from "../components/wms/SubjectIndicator.jsx";
import { WeaknessCard } from "../components/wms/WeaknessCard.jsx";
import toast from "react-hot-toast";

const SUBJECTS_BY_EXAM = {
  NEET: ["Physics", "Chemistry", "Biology"],
  JEE:  ["Physics", "Chemistry", "Mathematics"],
};

const COLLAPSED_LIMIT = 6;

export default function WMS() {
  const { examMode } = useAuth();
  const navigate = useNavigate();
  const subjects = SUBJECTS_BY_EXAM[examMode] ?? SUBJECTS_BY_EXAM.NEET;

  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAllChapters, setShowAllChapters] = useState(false);

  const loadSummary = useCallback(async () => {
    try {
      const res = await wmsApi.getSummary();
      setSummary(res.data.summary);
    } catch {
      toast.error("Could not load your weakness data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  const hasData = summary && summary.overall.total > 0;

  const relevantChapters = hasData
    ? summary.byChapter.filter((c) => subjects.includes(c.subject))
    : [];

  const visibleChapters = showAllChapters
    ? relevantChapters
    : relevantChapters.slice(0, COLLAPSED_LIMIT);

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
        <div>
          <p className="font-semibold text-sm leading-tight">Weakness Tracker</p>
          <p className="text-[10px] text-gray-600 leading-tight">Auto-updated from your tests & revisions</p>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-5 py-8 space-y-5">
        {loading ? (
          <div className="space-y-3">
            <div className="h-[180px] rounded-2xl skeleton" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="h-24 rounded-xl skeleton" />
              <div className="h-24 rounded-xl skeleton" />
              <div className="h-24 rounded-xl skeleton" />
            </div>
            <div className="h-16 rounded-xl skeleton" />
            <div className="h-16 rounded-xl skeleton" />
          </div>
        ) : !hasData ? (
          <div className="bg-bg-card border border-bg-border rounded-2xl p-8 text-center space-y-3">
            <ClipboardList size={28} className="text-gray-700 mx-auto" />
            <p className="text-sm font-medium text-fg-primary">No data yet</p>
            <p className="text-xs text-gray-600 leading-relaxed">
              This page is calculated automatically from your Tests and Revisions —
              take one to see which topics you're weak, medium, or strong in.
            </p>
            <button
              onClick={() => navigate("/tests")}
              className="inline-flex items-center gap-1.5 bg-violet-600 hover:bg-violet-500
                text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all duration-150"
            >
              Go to Tests
            </button>
          </div>
        ) : (
          <>
            <ProgressGraph overall={summary.overall} />

            <div>
              <p className="text-[10px] text-gray-700 uppercase tracking-widest font-medium mb-3">
                By subject
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {subjects.map((subj) => (
                  <SubjectIndicator
                    key={subj}
                    subject={subj}
                    stats={summary.bySubject[subj]}
                  />
                ))}
              </div>
            </div>

            {relevantChapters.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[10px] text-gray-700 uppercase tracking-widest font-medium">
                    Focus areas (weakest first)
                  </p>
                  <span className="text-[10px] text-gray-600">{relevantChapters.length} total</span>
                </div>
                <div className="space-y-1.5">
                  {visibleChapters.map((c, i) => (
                    <WeaknessCard key={`${c.subject}-${c.chapter}`} entry={c} rank={i + 1} />
                  ))}
                </div>

                {relevantChapters.length > COLLAPSED_LIMIT && (
                  <button
                    onClick={() => setShowAllChapters((v) => !v)}
                    className="w-full flex items-center justify-center gap-1.5 text-xs text-gray-600
                      hover:text-fg-primary transition py-2.5 mt-2 rounded-xl hover:bg-bg-hover"
                  >
                    {showAllChapters ? (
                      <>Show less <ChevronUp size={13} /></>
                    ) : (
                      <>Show all {relevantChapters.length} <ChevronDown size={13} /></>
                    )}
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}