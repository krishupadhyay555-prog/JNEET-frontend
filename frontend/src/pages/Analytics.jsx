// ============================================================
//  JNEET+ AI — pages/Analytics.jsx  (v1.1 — duplicate style-prop
//  bug fixed)
//  FIXED: the "Full tests" bar had TWO `style` attributes on the
//  same JSX element (a genuine typo, not a design choice) — this
//  is a duplicate-JSX-attribute error that would have broken the
//  production build entirely (white-screen crash on this page).
//  Merged into a single style object. Everything else — trend
//  chart, stat cards, subject bars, recent activity feed —
//  UNCHANGED from v1.
// ============================================================

import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, TrendingUp, Flame, ClipboardList, Target } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { testApi } from "../api/testApi.js";
import toast from "react-hot-toast";

const SUBJECTS_BY_EXAM = {
  NEET: ["Physics", "Chemistry", "Biology"],
  JEE:  ["Physics", "Chemistry", "Mathematics"],
};

function dayKey(dateStr) {
  return new Date(dateStr).toISOString().slice(0, 10);
}

function computeStreak(attempts) {
  if (attempts.length === 0) return 0;

  const uniqueDays = [...new Set(attempts.map((a) => dayKey(a.submittedAt)))].sort().reverse();

  const todayKey = dayKey(new Date().toISOString());
  const yesterdayKey = dayKey(new Date(Date.now() - 86400000).toISOString());

  if (uniqueDays[0] !== todayKey && uniqueDays[0] !== yesterdayKey) return 0;

  let streak = 1;
  for (let i = 1; i < uniqueDays.length; i++) {
    const prev = new Date(uniqueDays[i - 1]);
    const curr = new Date(uniqueDays[i]);
    const diffDays = Math.round((prev - curr) / 86400000);
    if (diffDays === 1) {
      streak += 1;
    } else {
      break;
    }
  }
  return streak;
}

function formatShortDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function TrendChart({ attempts }) {
  const recent = attempts.slice(-10);
  if (recent.length < 2) {
    return (
      <p className="text-xs text-gray-600 text-center py-10">
        Take at least 2 tests or revisions to see your trend here.
      </p>
    );
  }

  const W = 600, H = 160, padX = 16, padY = 20;
  const stepX = (W - padX * 2) / (recent.length - 1);

  const points = recent.map((a, i) => {
    const x = padX + i * stepX;
    const y = padY + (1 - a.score / 100) * (H - padY * 2);
    return { x, y, a };
  });

  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");

  return (
    <div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} className="overflow-visible">
        <line x1={padX} y1={H - padY} x2={W - padX} y2={H - padY} stroke="rgb(var(--bg-border))" strokeWidth="1" />
        <path d={pathD} fill="none" stroke="rgb(var(--violet-500))" strokeWidth="2" />
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="4"
            fill={p.a.mode === "test" ? "rgb(var(--violet-500))" : "#34b76a"}
            stroke="rgb(var(--bg-card))"
            strokeWidth="2"
          />
        ))}
      </svg>
      <div className="flex items-center justify-between mt-2 text-[10px] text-gray-600">
        <span>{formatShortDate(recent[0].submittedAt)}</span>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full" style={{ background: "rgb(var(--violet-500))" }} />
            Mock test
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#34b76a]" />
            Revision
          </span>
        </div>
        <span>{formatShortDate(recent[recent.length - 1].submittedAt)}</span>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-bg-card border border-bg-border rounded-xl p-3.5">
      <div className="mb-1.5">{icon}</div>
      <p className="text-lg font-bold text-fg-primary tabular-nums">{value}</p>
      <p className="text-[10px] text-gray-600">{label}</p>
    </div>
  );
}

export default function Analytics() {
  const { examMode } = useAuth();
  const navigate = useNavigate();
  const subjects = SUBJECTS_BY_EXAM[examMode] ?? SUBJECTS_BY_EXAM.NEET;

  const [attempts, setAttempts] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    testApi.getHistory()
      .then((res) => setAttempts((res.data.attempts ?? []).slice().reverse())) // oldest-first for the trend chart
      .catch(() => {
        toast.error("Could not load your analytics");
        setAttempts([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    if (!attempts || attempts.length === 0) return null;

    const totalQuestions = attempts.reduce((sum, a) => sum + (a.totalQuestions || 0), 0);
    const avgAccuracy = Math.round(
      attempts.reduce((sum, a) => sum + (a.score || 0), 0) / attempts.length
    );
    const streak = computeStreak(attempts);

    const bySubjectCount = {};
    subjects.forEach((s) => { bySubjectCount[s] = 0; });
    let fullTestCount = 0;

    attempts.forEach((a) => {
      if (a.mode === "test") {
        fullTestCount += 1;
      } else if (subjects.includes(a.subject)) {
        bySubjectCount[a.subject] += 1;
      }
    });

    const maxCount = Math.max(1, fullTestCount, ...Object.values(bySubjectCount));

    return {
      totalAttempts: attempts.length,
      totalQuestions,
      avgAccuracy,
      streak,
      bySubjectCount,
      fullTestCount,
      maxCount,
    };
  }, [attempts, subjects]);

  const recentAttempts = attempts ? attempts.slice(-8).reverse() : [];

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
          <p className="font-semibold text-sm leading-tight">Analytics</p>
          <p className="text-[10px] text-gray-600 leading-tight">Your progress over time</p>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-5 py-8 space-y-5">
        {loading ? (
          <div className="space-y-3">
            <div className="h-[200px] rounded-2xl skeleton" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[0, 1, 2, 3].map((i) => <div key={i} className="h-20 rounded-xl skeleton" />)}
            </div>
            <div className="h-32 rounded-2xl skeleton" />
          </div>
        ) : !stats ? (
          <div className="bg-bg-card border border-bg-border rounded-2xl p-8 text-center space-y-3">
            <TrendingUp size={28} className="text-gray-700 mx-auto" />
            <p className="text-sm font-medium text-fg-primary">No activity yet</p>
            <p className="text-xs text-gray-600 leading-relaxed">
              Take a test or revision to start building your progress history.
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
            <div className="bg-bg-card border border-bg-border rounded-2xl p-5">
              <p className="text-xs font-semibold text-fg-primary mb-4">Score trend</p>
              <TrendChart attempts={attempts} />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <StatCard
                icon={<ClipboardList size={15} className="text-blue-500" />}
                label="Total attempts"
                value={stats.totalAttempts}
              />
              <StatCard
                icon={<Target size={15} className="text-purple-500" />}
                label="Questions answered"
                value={stats.totalQuestions}
              />
              <StatCard
                icon={<TrendingUp size={15} className="text-emerald-600" />}
                label="Average accuracy"
                value={`${stats.avgAccuracy}%`}
              />
              <StatCard
                icon={<Flame size={15} className="text-amber-600" />}
                label="Day streak"
                value={stats.streak}
              />
            </div>

            <div className="bg-bg-card border border-bg-border rounded-2xl p-5">
              <p className="text-xs font-semibold text-fg-primary mb-4">Activity by category</p>
              <div className="space-y-2.5">
                {subjects.map((subj) => (
                  <div key={subj}>
                    <div className="flex justify-between text-[11px] text-gray-600 mb-1">
                      <span>{subj}</span>
                      <span>{stats.bySubjectCount[subj]} revision{stats.bySubjectCount[subj] === 1 ? "" : "s"}</span>
                    </div>
                    <div className="h-2 rounded-full bg-bg-panel overflow-hidden">
                      <div
                        style={{ width: `${(stats.bySubjectCount[subj] / stats.maxCount) * 100}%`, transition: "width 0.5s ease-out" }}
                        className="h-full rounded-full bg-teal-600"
                      />
                    </div>
                  </div>
                ))}
                <div>
                  <div className="flex justify-between text-[11px] text-gray-600 mb-1">
                    <span>Full tests</span>
                    <span>{stats.fullTestCount} attempt{stats.fullTestCount === 1 ? "" : "s"}</span>
                  </div>
                  <div className="h-2 rounded-full bg-bg-panel overflow-hidden">
                    <div
                      style={{
                        width: `${(stats.fullTestCount / stats.maxCount) * 100}%`,
                        background: "rgb(var(--violet-500))",
                        transition: "width 0.5s ease-out",
                      }}
                      className="h-full rounded-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <p className="text-[10px] text-gray-700 uppercase tracking-widest font-medium mb-3">
                Recent activity
              </p>
              <div className="space-y-1.5">
                {recentAttempts.map((a) => (
                  <div
                    key={a._id}
                    className="bg-bg-card border border-bg-border rounded-xl p-3 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-fg-primary truncate">
                        {a.mode === "test" ? `${examMode} Full Test` : `${a.subject} · ${a.chapter}`}
                      </p>
                      <p className="text-[10px] text-gray-600">{formatShortDate(a.submittedAt)}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-semibold text-fg-primary tabular-nums">{a.score}%</span>
                      <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full uppercase tracking-wide
                        ${a.mode === "test" ? "bg-violet-600/10 text-violet-600" : "bg-teal-600/10 text-teal-600"}`}>
                        {a.mode === "test" ? "Test" : "Revision"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}