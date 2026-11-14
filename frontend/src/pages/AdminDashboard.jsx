// ============================================================
//  JNEET+ AI — pages/AdminDashboard.jsx  (/admin, founder only)
//  Live numbers straight from the database: students, NEET vs JEE,
//  signups, paid plans, revenue, learning activity, AI cost, safety.
//  Only accounts listed in ADMIN_EMAILS (Render) can load it — the
//  server answers 404 to everyone else, and this page sends them away.
//  Refreshes every 60 seconds while open.
// ============================================================

import { useCallback, useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { ArrowLeft, RefreshCw, Users, IndianRupee, Activity, GraduationCap, ShieldAlert, Table2, BarChart3 } from "lucide-react";
import api from "../api/axiosInstance.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useGoBack } from "../hooks/useGoBack.js";
import { Spinner } from "../components/ui/Spinner.jsx";

const nf = new Intl.NumberFormat("en-IN");
const inr = (v) => `₹${nf.format(Math.round(v ?? 0))}`;
const pct = (a, b) => (b ? `${Math.round((a / b) * 100)}%` : "—");
const dt = (d) => (d ? new Date(d).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" }) : "—");
const dayLabel = (key) => new Date(`${key}T00:00:00+05:30`).toLocaleDateString("en-IN", { day: "numeric", month: "short", timeZone: "Asia/Kolkata" });

function Tile({ icon, label, value, sub }) {
  return (
    <div className="bg-bg-card border border-bg-border rounded-2xl p-4">
      <p className="flex items-center gap-1.5 text-[11px] font-medium text-gray-600 uppercase tracking-wide">{icon}{label}</p>
      <p className="text-2xl font-bold text-fg-primary mt-1.5 tabular-nums">{value}</p>
      {sub && <p className="text-[11.5px] text-gray-600 mt-0.5">{sub}</p>}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="bg-bg-card border border-bg-border rounded-2xl p-4">
      <h2 className="text-sm font-bold text-fg-primary mb-3">{title}</h2>
      {children}
    </section>
  );
}

function Rows({ rows }) {
  return (
    <dl className="divide-y divide-bg-border/70">
      {rows.map(([k, v]) => (
        <div key={k} className="flex items-center justify-between py-1.5 text-[13px]">
          <dt className="text-gray-600">{k}</dt>
          <dd className="font-semibold text-fg-primary tabular-nums">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

// Bar chart (SVG): one or two stacked series, hover tooltip, table view.
function BarChart({ title, data, series, format = (v) => nf.format(v), height = 160 }) {
  const [hover, setHover] = useState(null);
  const [table, setTable] = useState(false);
  const totals = data.map((d) => series.reduce((s, x) => s + (d[x.key] ?? 0), 0));
  const max = Math.max(1, ...totals);
  const W = 600; const H = height; const pad = { t: 6, b: 2, l: 0, r: 0 };
  const bw = (W - pad.l - pad.r) / data.length;
  const y = (v) => (v / max) * (H - pad.t - pad.b);
  const sum = totals.reduce((a, b) => a + b, 0);

  return (
    <div>
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-3 text-[11.5px] text-gray-600">
          <span className="font-semibold text-fg-primary text-[13px]">{title}</span>
          {series.length > 1 && series.map((s) => (
            <span key={s.key} className="inline-flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm" style={{ background: `var(${s.color})` }} />{s.label}</span>
          ))}
        </div>
        <button type="button" onClick={() => setTable((t) => !t)} className="text-[11px] text-gray-600 hover:text-fg-primary inline-flex items-center gap-1">
          {table ? <><BarChart3 size={12} /> Chart</> : <><Table2 size={12} /> Table</>}
        </button>
      </div>
      {table ? (
        <div className="max-h-56 overflow-auto rounded-xl border border-bg-border">
          <table className="w-full text-[12px]">
            <thead className="sticky top-0 bg-bg-panel"><tr><th className="text-left p-2 font-semibold">Day</th>{series.map((s) => <th key={s.key} className="text-right p-2 font-semibold">{s.label}</th>)}</tr></thead>
            <tbody>{[...data].reverse().map((d) => (
              <tr key={d.day} className="border-t border-bg-border/60"><td className="p-2">{dayLabel(d.day)}</td>{series.map((s) => <td key={s.key} className="p-2 text-right tabular-nums">{format(d[s.key] ?? 0)}</td>)}</tr>
            ))}</tbody>
          </table>
        </div>
      ) : (
        <div className="relative">
          <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="w-full" style={{ height }} role="img" aria-label={`${title}: total ${format(sum)} in 30 days`}>
            <line x1={pad.l} x2={W - pad.r} y1={H - pad.b} y2={H - pad.b} stroke="rgb(var(--bg-border))" strokeWidth="1" />
            {data.map((d, i) => {
              let acc = 0;
              const x = pad.l + i * bw;
              return (
                <g key={d.day} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
                  <rect x={x} y={pad.t} width={bw} height={H - pad.t - pad.b} fill="transparent" />
                  {series.map((s) => {
                    const v = d[s.key] ?? 0;
                    if (!v) return null;
                    const h = Math.max(2, y(v));
                    const yy = H - pad.b - acc - h;
                    acc += h + 2; // 2px surface gap between stacked segments
                    return <rect key={s.key} x={x + bw * 0.18} y={yy} width={bw * 0.64} height={h} rx="2" fill={`var(${s.color})`} opacity={hover === null || hover === i ? 1 : 0.45} />;
                  })}
                </g>
              );
            })}
          </svg>
          <div className="relative h-4 mt-1 text-[10.5px] text-gray-600" aria-hidden="true">
            {data.map((d, i) => (i % 5 === 0 || i === data.length - 1) && (
              <span key={d.day} className="absolute -translate-x-1/2 whitespace-nowrap" style={{ left: `${((i + 0.5) / data.length) * 100}%` }}>{dayLabel(d.day)}</span>
            ))}
          </div>
          {hover !== null && (
            <div className="absolute top-0 pointer-events-none bg-bg-surface border border-bg-border rounded-lg shadow-lg px-2.5 py-1.5 text-[11.5px]"
              style={{ left: `${Math.min(78, Math.max(0, (hover / data.length) * 100 - 8))}%` }}>
              <p className="font-semibold">{dayLabel(data[hover].day)}</p>
              {series.map((s) => <p key={s.key} className="tabular-nums text-gray-600">{s.label}: <span className="text-fg-primary font-semibold">{format(data[hover][s.key] ?? 0)}</span></p>)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const goBack = useGoBack("/dashboard");
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setBusy(true);
    try {
      const res = await api.get("/admin/stats");
      setStats(res.data.stats);
      setError("");
    } catch (err) {
      setError(err.response?.status === 404 ? "not-admin" : "Couldn't load the numbers. Try Refresh.");
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    if (!user?.isAdmin) return undefined;
    load();
    const t = setInterval(() => { if (document.visibilityState === "visible") load(); }, 60_000);
    return () => clearInterval(t);
  }, [user?.isAdmin, load]);

  const s = stats;
  const daily = useMemo(() => s?.daily ?? [], [s]);

  if (!user?.isAdmin || error === "not-admin") return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen bg-bg-base text-fg-primary">
      <header className="bg-bg-surface border-b border-bg-border sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={goBack} aria-label="Back" className="p-2 rounded-lg text-gray-500 hover:text-fg-primary hover:bg-bg-hover"><ArrowLeft size={16} /></button>
          <div className="min-w-0 flex-1">
            <h1 className="text-[15px] font-bold leading-tight">Admin · live numbers</h1>
            <p className="text-[11px] text-gray-600">Straight from the database · {s ? `updated ${dt(s.generatedAt)} IST` : "loading…"} · only you can see this page</p>
          </div>
          <button onClick={load} disabled={busy} className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border border-bg-border hover:bg-bg-hover disabled:opacity-60">
            <RefreshCw size={13} className={busy ? "animate-spin" : ""} /> Refresh
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-5 space-y-4">
        {error && <p className="text-xs text-red-500">{error}</p>}
        {!s ? (
          <div className="flex justify-center py-20"><Spinner size={22} /></div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <Tile icon={<Users size={12} />} label="Students" value={nf.format(s.students.total)} sub={`NEET ${nf.format(s.students.neet)} · JEE ${nf.format(s.students.jee)}`} />
              <Tile icon={<Activity size={12} />} label="New signups" value={nf.format(s.students.newToday)} sub={`last 24 h · 7 d: ${nf.format(s.students.new7)} · 30 d: ${nf.format(s.students.new30)}`} />
              <Tile icon={<GraduationCap size={12} />} label="Paid students" value={nf.format(s.plans.paidStudents)} sub={`${s.plans.conversionPct}% of students · ${nf.format(s.plans.free)} on Free`} />
              <Tile icon={<IndianRupee size={12} />} label="Revenue (30 days)" value={inr(s.revenue.last30.rupees)} sub={`today ${inr(s.revenue.today.rupees)} · all-time ${inr(s.revenue.allTime.rupees)}`} />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Tile label="Active today" value={nf.format(s.students.activeToday)} sub={`${pct(s.students.activeToday, s.students.total)} of students`} />
              <Tile label="Active 7 days" value={nf.format(s.students.active7)} sub={pct(s.students.active7, s.students.total)} />
              <Tile label="Active 30 days" value={nf.format(s.students.active30)} sub={pct(s.students.active30, s.students.total)} />
            </div>

            <Section title="Last 30 days">
              <div className="space-y-6">
                <BarChart title="Signups per day" data={daily}
                  series={[{ key: "neetSignups", label: "NEET", color: "--chart-neet" }, { key: "jeeSignups", label: "JEE", color: "--chart-jee" }]} />
                <BarChart title="Revenue per day" data={daily} format={inr}
                  series={[{ key: "rupees", label: "Revenue", color: "--chart-rev" }]} height={130} />
              </div>
            </Section>

            <div className="grid md:grid-cols-2 gap-4">
              <Section title="Students">
                <Rows rows={[
                  ["NEET / JEE", `${nf.format(s.students.neet)} / ${nf.format(s.students.jee)}`],
                  ["Adults (18+) / under 18", `${nf.format(s.students.adults)} / ${nf.format(s.students.minors)}`],
                  ["Under-18 parent approval: granted / pending", `${nf.format(s.students.minorsParent.granted ?? 0)} / ${nf.format(s.students.minorsParent.pending ?? 0)}`],
                  ["Signed up but email not verified", nf.format(s.students.unverifiedSignups)],
                  ["Deleted accounts", nf.format(s.students.deletedAccounts)],
                ]} />
                <p className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide mt-4 mb-1">Target exams</p>
                <Rows rows={s.students.targetExams.map((t) => [t.target.replace(/_/g, " "), nf.format(t.n)])} />
              </Section>

              <Section title="Plans & revenue">
                <div className="overflow-x-auto">
                  <table className="w-full text-[13px] mb-3">
                    <thead><tr className="text-gray-600 text-[11.5px]"><th className="text-left font-medium py-1">Active plan</th><th className="text-right font-medium">NEET</th><th className="text-right font-medium">JEE</th></tr></thead>
                    <tbody>
                      {["pro", "elite"].map((t) => (
                        <tr key={t} className="border-t border-bg-border/70"><td className="py-1.5 capitalize">{t}</td><td className="text-right tabular-nums font-semibold">{s.plans.paid[t].NEET}</td><td className="text-right tabular-nums font-semibold">{s.plans.paid[t].JEE}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Rows rows={[
                  ["Passes ending in the next 7 days", nf.format(s.plans.expiringIn7Days)],
                  ["Payments (all-time)", `${nf.format(s.revenue.allTime.payments)} by ${nf.format(s.revenue.allTime.buyers)} students`],
                  ...s.revenue.byPlan.map((p) => [`  ${p.planId.replace("_", " · ").replace("1m", "1 month").replace("4m", "4 months")}`, `${p.payments} · ${inr(p.rupees)}`]),
                  ["Orders not paid / failed / refunded", `${nf.format(s.revenue.statusCounts.created ?? 0)} / ${nf.format(s.revenue.statusCounts.failed ?? 0)} / ${nf.format(s.revenue.statusCounts.refunded ?? 0)}`],
                ]} />
                {s.revenue.flagged.length > 0 && (
                  <div className="mt-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3">
                    <p className="flex items-center gap-1.5 text-[12px] font-semibold text-tone-warn mb-1.5"><ShieldAlert size={13} /> Payments that need a look</p>
                    {s.revenue.flagged.map((f) => (
                      <p key={f.orderId} className="text-[11.5px] text-fg-primary">{f.flag.replace(/_/g, " ")} · {f.planId} · {inr(f.rupees)} · {f.orderId} · {dt(f.createdAt)}</p>
                    ))}
                  </div>
                )}
              </Section>

              <Section title="Learning activity">
                <Rows rows={[
                  ["Tests + revisions submitted (all-time)", nf.format(s.learning.attemptsTotal)],
                  ["… in the last 7 days", nf.format(s.learning.attempts7)],
                  ["NEET: mock tests / revisions", `${nf.format(s.learning.attemptsByExam.NEET.test)} / ${nf.format(s.learning.attemptsByExam.NEET.revision)}`],
                  ["JEE: mock tests / revisions", `${nf.format(s.learning.attemptsByExam.JEE.test)} / ${nf.format(s.learning.attemptsByExam.JEE.revision)}`],
                  ["AI chats (students who chatted)", `${nf.format(s.learning.chats)} (${nf.format(s.learning.studentsWhoChatted)})`],
                  ["AI answers today (students)", `${nf.format(s.learning.aiToday.answers)} (${nf.format(s.learning.aiToday.students)})`],
                  ["AI cost today / last 30 days", `${inr(s.learning.aiToday.costInr)} / ${inr(s.learning.ai30.costInr)}`],
                ]} />
              </Section>

              <Section title="Content & safety">
                <Rows rows={[
                  ["NEET questions (MCQ / fill-in-the-blank)", `${nf.format(s.learning.questionBank.NEET.mcq)} / ${nf.format(s.learning.questionBank.NEET.fill_blank)}`],
                  ["JEE questions (MCQ / fill-in-the-blank)", `${nf.format(s.learning.questionBank.JEE.mcq)} / ${nf.format(s.learning.questionBank.JEE.fill_blank)}`],
                  ["JEE Advanced (stored, not served)", nf.format(s.learning.questionBank.JEE.advanced ?? 0)],
                  ["OneShot chapters NEET / JEE", `${s.learning.oneshots.NEET} / ${s.learning.oneshots.JEE}`],
                  ["AI chat locked / paused right now", `${nf.format(s.safety.lockedNow)} / ${nf.format(s.safety.pausedNow)}`],
                ]} />
              </Section>
            </div>

            <Section title="Recent signups">
              <div className="overflow-x-auto">
                <table className="w-full text-[12.5px]">
                  <thead><tr className="text-gray-600 text-[11.5px] text-left">
                    <th className="font-medium py-1.5 pr-3">Name</th><th className="font-medium pr-3">Email</th><th className="font-medium pr-3">Exam</th>
                    <th className="font-medium pr-3">Age</th><th className="font-medium pr-3">Plan</th><th className="font-medium pr-3">Joined</th><th className="font-medium">Last login</th>
                  </tr></thead>
                  <tbody>
                    {s.recentSignups.map((u, i) => (
                      <tr key={`${u.email}-${i}`} className="border-t border-bg-border/70">
                        <td className="py-1.5 pr-3 font-medium">{u.firstName}</td><td className="pr-3 text-gray-600">{u.email}</td><td className="pr-3">{u.exam}</td>
                        <td className="pr-3">{u.age === "minor" ? "<18" : u.age === "adult" ? "18+" : "—"}</td><td className="pr-3 capitalize">{u.plan}</td>
                        <td className="pr-3 whitespace-nowrap">{dt(u.joinedAt)}</td><td className="whitespace-nowrap">{dt(u.lastLogin)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-[11px] text-gray-600 mt-2">Emails are partly hidden on purpose. Counts include only verified, active accounts.</p>
            </Section>
          </>
        )}
      </main>
    </div>
  );
}
