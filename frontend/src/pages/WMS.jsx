// ============================================================
//  JNEET+ AI — pages/WMS.jsx  (v2 — auto-calculated, read-only)
//  REPLACED entirely — no more "Add Topic" form, no manual
//  W/M/S buttons, no delete. Everything here is derived live from
//  the student's real Test + Revision history (see
//  wmsController.js / wmsScoringService.js). If they have no
//  attempts yet, the page explains that and points them to Tests.
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ClipboardList } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { wmsApi } from "../api/wmsApi.js";
import { ProgressGraph } from "../components/wms/ProgressGraph.jsx";
import { SubjectIndicator } from "../components/wms/SubjectIndicator.jsx";
import { WeaknessCard } from "../components/wms/WeaknessCard.jsx";
import { Spinner } from "../components/ui/Spinner.jsx";
import toast from "react-hot-toast";

const SUBJECTS_BY_EXAM = {
  NEET: ["Physics", "Chemistry", "Biology"],
  JEE:  ["Physics", "Chemistry", "Mathematics"],
};

export default function WMS() {
  const { examMode } = useAuth();
  const navigate = useNavigate();
  const subjects = SUBJECTS_BY_EXAM[examMode] ?? SUBJECTS_BY_EXAM.NEET;

  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

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

  // Only chapters relevant to the student's own exam-mode subjects.
  const relevantChapters = hasData
    ? summary.byChapter.filter((c) => subjects.includes(c.subject))
    : [];

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
        <span className="font-semibold text-sm">Weakness Tracker</span>
      </nav>

      <div className="max-w-2xl mx-auto px-5 py-8 space-y-5">
        {loading ? (
          <div className="flex justify-center py-16">
            <Spinner size={20} />
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

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {subjects.map((subj) => (
                <SubjectIndicator
                  key={subj}
                  subject={subj}
                  stats={summary.bySubject[subj]}
                />
              ))}
            </div>

            {relevantChapters.length > 0 && (
              <div>
                <p className="text-[10px] text-gray-700 uppercase tracking-widest font-medium mb-3">
                  Focus areas (weakest first)
                </p>
                <div className="space-y-1.5">
                  {relevantChapters.map((c) => (
                    <WeaknessCard key={`${c.subject}-${c.chapter}`} entry={c} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}