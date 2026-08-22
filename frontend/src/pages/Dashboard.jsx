// ============================================================
//  JNEET+ AI — pages/Dashboard.jsx  (v6 — full 5-card redesign)
//  CHANGED (this is the "Dashboard integration" phase, following
//  the mockup approved earlier):
//    - The old 4-card "Features" grid (which included AI Mentor
//      as one of the cards) is replaced with a 5-card grid:
//      Revision, Mock Tests, WMS, Analytics, Notes — all equal
//      weight, each with its own colored icon badge (teal/blue/
//      purple/indigo/pink — deliberately no amber/orange, per
//      earlier feedback that amber reads too close to Claude's
//      own color).
//    - AI Mentor moved OUT of the card grid entirely into a
//      separate floating "Ask AI Mentor" pill button (bottom-
//      right, fixed position) — the "distinct way to reach chat"
//      that was discussed. Uses a plain MessageCircle icon, not
//      Sparkles (that icon is fully retired app-wide now) and not
//      a robot icon (retired earlier too).
//      NOTE (scope): this floating button is only on Dashboard for
//      now, not yet on every page — making it truly global would
//      need a shared layout wrapper that doesn't exist yet (each
//      page currently renders its own nav independently). Flagging
//      this rather than silently under-delivering; can extend to
//      other pages as a follow-up if wanted.
//    - Revision and Mock Tests cards now show a real "Last done" /
//      "Last given" relative date instead of a static "Active"
//      badge with no information — computed client-side from the
//      EXISTING testApi.getHistory() endpoint (no new backend
//      needed): the history list is already sorted most-recent-
//      first, so the first entry per mode gives its last-activity
//      date.
//    - Notes card shows a real saved-count from the EXISTING
//      notesApi.list() endpoint.
//    - The old 3-card stat row (Exam Target / Saved Concepts /
//      Mock Tests count) is REMOVED — Exam Target duplicated the
//      Exam Settings panel right above it, Saved Concepts was a
//      permanent "-" placeholder duplicating the Sidebar's own
//      Saved tab (per the earlier decision to keep Saved Concepts
//      in ONE place only), and Mock Tests' static "0" is now
//      superseded by the real last-given date on its own card.
//      Removing this row also declutters the page, which was part
//      of the original goal.
//  UNCHANGED: nav bar, greeting, QuoteOfDay, Exam Settings panel,
//  ExamCountdown, TargetExamModal logic.
// ============================================================

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { ExamCountdown } from "../components/dashboard/ExamCountdown.jsx";
import { TargetExamModal } from "../components/dashboard/TargetExamModal.jsx";
import { QuoteOfDay } from "../components/dashboard/QuoteOfDay.jsx";
import { ProfileMenu } from "../components/ProfileMenu.jsx";
import { getTargetExam } from "../config/targetExams.js";
import { testApi } from "../api/testApi.js";
import { notesApi } from "../api/notesApi.js";
import toast from "react-hot-toast";
import {
  RefreshCw, ClipboardList, BarChart3, TrendingUp, StickyNote,
  ChevronRight, MessageCircle,
} from "lucide-react";

function formatRelative(dateStr) {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
  }
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function FeatureCard({ icon, iconBg, title, desc, available, onClick }) {
  return (
    <div
      onClick={available ? onClick : undefined}
      className={`relative bg-bg-card border rounded-2xl p-5 flex items-center gap-4 transition group
        ${available
          ? "border-bg-border hover:border-violet-600/40 cursor-pointer"
          : "border-bg-border/50 opacity-40 cursor-not-allowed select-none"
        }`}
    >
      {available && (
        <ChevronRight
          size={15}
          className="absolute top-4 right-4 text-gray-600 group-hover:text-violet-500 transition"
        />
      )}
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition duration-150 ${iconBg}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0 pr-4">
        <p className="font-semibold text-sm text-fg-primary mb-0.5">{title}</p>
        <p className="text-xs text-gray-600">{desc}</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user, examMode, updateTargetExam } = useAuth();
  const navigate = useNavigate();
  const [targetModalOpen, setTargetModalOpen] = useState(
    !!user && !user.targetExam && !user.targetExamPromptDismissed
  );

  const isNewAccount = !user?.lastLogin;
  const selectedTarget = getTargetExam(user?.targetExam);

  const [lastTestAt, setLastTestAt]         = useState(undefined); // undefined = loading, null = never
  const [lastRevisionAt, setLastRevisionAt] = useState(undefined);
  const [notesCount, setNotesCount]         = useState(undefined);

  useEffect(() => {
    let cancelled = false;

    testApi.getHistory()
      .then((res) => {
        if (cancelled) return;
        const attempts = res.data.attempts ?? [];
        const lastTest     = attempts.find((a) => a.mode === "test");
        const lastRevision = attempts.find((a) => a.mode === "revision");
        setLastTestAt(lastTest?.submittedAt ?? null);
        setLastRevisionAt(lastRevision?.submittedAt ?? null);
      })
      .catch(() => {
        if (!cancelled) {
          setLastTestAt(null);
          setLastRevisionAt(null);
        }
      });

    notesApi.list()
      .then((res) => {
        if (!cancelled) setNotesCount((res.data.notes ?? []).length);
      })
      .catch(() => {
        if (!cancelled) setNotesCount(null);
      });

    return () => { cancelled = true; };
  }, []);

  const handleModeSwitch = async (mode) => {
    if (mode === examMode) return;
    toast(`To switch to ${mode} mode, log out and register again.`, {
      icon: "i",
      duration: 5000,
    });
  };

  const handleTargetSave = async (targetExam, dismissed = true) => {
    await updateTargetExam(targetExam, dismissed);
    if (targetExam) toast.success("Target exam updated");
  };

  const revisionDesc = lastRevisionAt === undefined
    ? "Chapter-wise practice with instant feedback"
    : lastRevisionAt
      ? `Last done: ${formatRelative(lastRevisionAt)}`
      : "Not started yet";

  const testDesc = lastTestAt === undefined
    ? "Full exam-pattern test, instant scoring"
    : lastTestAt
      ? `Last given: ${formatRelative(lastTestAt)}`
      : "Not attempted yet";

  const notesDesc = notesCount === undefined
    ? "Your saved formulas and concepts"
    : notesCount > 0
      ? `${notesCount} note${notesCount === 1 ? "" : "s"} saved`
      : "No notes yet";

  const features = [
    {
      icon: <RefreshCw size={20} className="text-teal-500" />,
      iconBg: "bg-teal-500/10",
      title: "Revision",
      desc: revisionDesc,
      available: true,
      onClick: () => navigate("/revision"),
    },
    {
      icon: <ClipboardList size={20} className="text-blue-500" />,
      iconBg: "bg-blue-500/10",
      title: "Mock Tests",
      desc: testDesc,
      available: true,
      onClick: () => navigate("/tests"),
    },
    {
      icon: <BarChart3 size={20} className="text-purple-500" />,
      iconBg: "bg-purple-500/10",
      title: "WMS Tracker",
      desc: "Weak / Medium / Strong topic analysis",
      available: true,
      onClick: () => navigate("/wms"),
    },
    {
      icon: <TrendingUp size={20} className="text-indigo-500" />,
      iconBg: "bg-indigo-500/10",
      title: "Analytics",
      desc: "Performance trends & weak area insights (coming soon)",
      available: false,
      onClick: null,
    },
    {
      icon: <StickyNote size={20} className="text-pink-500" />,
      iconBg: "bg-pink-500/10",
      title: "Notes",
      desc: notesDesc,
      available: true,
      onClick: () => navigate("/notes"),
    },
  ];

  return (
    <div className="min-h-screen bg-bg-base text-fg-primary">
      <TargetExamModal
        user={user}
        open={targetModalOpen}
        allowLater={!isNewAccount}
        onClose={() => setTargetModalOpen(false)}
        onSave={handleTargetSave}
      />

      <nav className="border-b border-bg-border bg-bg-surface px-5 py-3.5 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg overflow-hidden shadow-glow-sm">
            <img
              src="/icon-192.png"
              alt="JNEET+ AI"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="font-bold text-sm tracking-wide gradient-text">JNEET+ AI</span>
        </div>

        <ProfileMenu />
      </nav>

      <div className="max-w-3xl mx-auto px-5 py-8 pb-28 animate-fade-up">
        <div className="mb-7">
          <h1 className="text-2xl font-bold mb-0.5 tracking-tight">
            Hi, {user?.name?.split(" ")[0] ?? "Student"}!
          </h1>
          <p className="text-gray-600 text-sm">
            What do you want to study today? Let's start your {examMode} preparation.
          </p>
        </div>

        <div className="mb-5">
          <QuoteOfDay />
        </div>

        <div className="bg-bg-card border border-bg-border rounded-2xl p-5 mb-5">
          <div className="flex items-center justify-between gap-3 mb-3">
            <p className="text-[10px] text-gray-700 font-medium uppercase tracking-widest">
              Exam Settings
            </p>
            <button
              type="button"
              onClick={() => setTargetModalOpen(true)}
              className="text-[11px] link-accent font-medium transition"
            >
              Change Target Exam
            </button>
          </div>

          <div className="flex flex-wrap gap-3">
            {["NEET", "JEE"].map((mode) => (
              <button
                key={mode}
                onClick={() => handleModeSwitch(mode)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition active:scale-[0.97]
                  ${examMode === mode
                    ? "bg-violet-600 text-white shadow-glow-sm"
                    : "bg-bg-panel border border-bg-border text-gray-500 hover:border-violet-600/40 hover:text-fg-primary"
                  }`}
              >
                {mode} Mode
                {examMode === mode && (
                  <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full">
                    Active
                  </span>
                )}
              </button>
            ))}

            <div className="px-4 py-2.5 rounded-xl bg-bg-panel border border-bg-border text-sm">
              <span className="text-gray-600 mr-2">Target:</span>
              <span className="text-fg-primary font-semibold">
                {selectedTarget?.label ?? "Not selected"}
              </span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <ExamCountdown
            targetExam={user?.targetExam}
            onChangeTarget={() => setTargetModalOpen(true)}
          />
        </div>

        <p className="text-[10px] text-gray-700 uppercase tracking-widest mb-3 font-medium">
          Features
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {features.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </div>

      {/* Floating chat entry — deliberately separate from the
          feature grid above, per the approved dashboard mockup. */}
      <button
        onClick={() => navigate("/ask")}
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 flex items-center gap-2
          bg-bg-card border border-bg-border hover:border-violet-600/50 text-fg-primary
          px-5 py-3.5 rounded-full shadow-card transition-all duration-150
          active:scale-95 hover:-translate-y-0.5 z-20"
      >
        <MessageCircle size={17} className="text-violet-500" />
        <span className="text-sm font-medium">Ask AI Mentor</span>
      </button>
    </div>
  );
}