// ============================================================
//  JNEET+ AI — pages/Dashboard.jsx  (v3 — real logo + contrast fix)
//  CHANGED:
//    - Nav-bar Sparkles icon replaced with app's own JN logo image.
//    - "AI Mentor" feature-card icon: Sparkles → GraduationCap
//      (Sparkles looked like Gemini's icon everywhere it appeared).
//    - "Change Target Exam" link: was text-violet-300 hover:text-
//      violet-500, which reads NEAR-INVISIBLE in light mode under
//      the NEET/JEE accent skins (light-teal / light-indigo text on
//      a near-white background — well under readable contrast).
//      Swapped to the new .link-accent CSS class (defined in
//      index.css) which resolves to a properly-dark accent color
//      in light mode and a properly-light one in dark mode, in
//      every accent (Normal/NEET/JEE).
//  Everything else — layout, stats, features grid, target-exam
//  modal logic — UNCHANGED from v2.
// ============================================================

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { ExamCountdown } from "../components/dashboard/ExamCountdown.jsx";
import { TargetExamModal } from "../components/dashboard/TargetExamModal.jsx";
import { QuoteOfDay } from "../components/dashboard/QuoteOfDay.jsx";
import { ProfileMenu } from "../components/ProfileMenu.jsx";
import { getTargetExam } from "../config/targetExams.js";
import toast from "react-hot-toast";
import {
  BarChart3, ClipboardList, TrendingUp,
  ChevronRight, GraduationCap,
  Target, MessageSquare, BookMarked,
} from "lucide-react";

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-bg-card border border-bg-border rounded-xl p-4">
      <div className="mb-2">{icon}</div>
      <p className="text-xl font-bold text-fg-primary tabular-nums">{value}</p>
      <p className="text-[11px] text-gray-600 mt-0.5">{label}</p>
    </div>
  );
}

function FeatureCard({ icon, title, desc, badge, badgeClass, available, onClick }) {
  return (
    <div
      onClick={available ? onClick : undefined}
      className={`bg-bg-card border rounded-2xl p-5 flex items-center gap-4 transition group
        ${available
          ? "border-bg-border hover:border-violet-600/40 cursor-pointer"
          : "border-bg-border/50 opacity-40 cursor-not-allowed select-none"
        }`}
    >
      <div className="w-11 h-11 rounded-xl bg-bg-panel flex items-center justify-center shrink-0 group-hover:scale-105 transition duration-150">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-semibold text-sm text-fg-primary">{title}</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${badgeClass}`}>
            {badge}
          </span>
        </div>
        <p className="text-xs text-gray-600">{desc}</p>
      </div>
      {available && (
        <ChevronRight
          size={16}
          className="text-gray-700 group-hover:text-violet-400 transition shrink-0"
        />
      )}
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

  const features = [
    {
      icon: <GraduationCap size={20} className="text-violet-400" />,
      title: "AI Mentor",
      desc: `Instant ${examMode} doubt solving with streaming AI`,
      badge: "Active",
      badgeClass: "bg-emerald-900/30 text-emerald-400 border-emerald-700/30",
      available: true,
      onClick: () => navigate("/ask"),
    },
    {
      icon: <BarChart3 size={20} className="text-orange-400" />,
      title: "WMS Tracker",
      desc: "Weak / Medium / Strong topic analysis",
      badge: "Active",
      badgeClass: "bg-emerald-900/30 text-emerald-400 border-emerald-700/30",
      available: true,
      onClick: () => navigate("/wms"),
    },
    {
      icon: <ClipboardList size={20} className="text-blue-400" />,
      title: "Mock Tests",
      desc: "Chapter-wise MCQs with instant scoring",
      badge: "Active",
      badgeClass: "bg-emerald-900/30 text-emerald-400 border-emerald-700/30",
      available: true,
      onClick: () => navigate("/tests"),
    },
    {
      icon: <TrendingUp size={20} className="text-emerald-400" />,
      title: "Analytics",
      desc: "Performance trends & weak area insights",
      badge: "Soon",
      badgeClass: "bg-bg-panel text-gray-600 border-bg-border",
      available: false,
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

      <div className="max-w-3xl mx-auto px-5 py-8 animate-fade-up">
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
              className="text-[11px] link-accent transition"
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

        <div className="mb-5">
          <ExamCountdown targetExam={user?.targetExam} />
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <StatCard
            icon={<Target size={15} className="text-violet-400" />}
            label="Exam Target"
            value={selectedTarget?.label ?? examMode}
          />
          <StatCard
            icon={<BookMarked size={15} className="text-amber-400" />}
            label="Saved Concepts"
            value="-"
          />
          <StatCard
            icon={<MessageSquare size={15} className="text-blue-400" />}
            label="Mock Tests"
            value="0"
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
    </div>
  );
}