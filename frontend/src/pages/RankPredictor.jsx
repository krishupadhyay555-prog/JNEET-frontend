// ============================================================
//  JNEET+ AI — pages/RankPredictor.jsx   (public, /rank-predictor)
//  JEE Main percentile + AIR and NEET UG AIR estimates from official
//  NTA result data and published shift-wise analyses. Always shows a
//  RANGE and where the data comes from — no predictor can be exact
//  for a future paper. Logic: utils/rankPredict.js, data: utils/rankData.js.
// ============================================================

import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowRight, CheckCircle2, AlertTriangle, XCircle, ExternalLink, Info } from "lucide-react";
import { PublicShell, PageHero, PrimaryButton } from "../components/public/PublicShell.jsx";
import { BUSINESS } from "../legal/content.js";
import { predictJee, predictNeet, validateJeeMarks, validateNeetMarks } from "../utils/rankPredict.js";
import { JEE_SHIFTS, JEE_FACTS, NEET_YEARS, sources, asOf } from "../utils/rankData.js";

const HONEST_LINE = "An estimate from official NTA result data and published shift-wise analyses — your real rank depends on your paper.";

// ---------- formatting ----------

const fmtInt = (n) => Math.round(n).toLocaleString("en-IN");
function fmtPct(p) {
  if (p >= 100) return "100";
  if (p <= 0) return "0";
  return p >= 99.5 ? p.toFixed(3) : p.toFixed(2);
}
function fmtTop(pct) {
  if (pct < 0.01) return "the top 0.01%";
  if (pct < 1) return `the top ${pct.toFixed(2)}%`;
  return `the top ${pct.toFixed(1)}%`;
}
function fmtDate(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

// ---------- small building blocks ----------

const card = "bg-white rounded-2xl border border-[#E7E4DD]";
const inputCls = "w-full h-12 px-4 rounded-xl border border-[#E2DED6] bg-white text-[17px] font-semibold text-[#17161C] placeholder:font-normal placeholder:text-[#9A96A1] focus:outline-none focus:border-[#0D9488] focus:ring-4 focus:ring-[#0D9488]/15 transition";

function MarksField({ id, label, hint, value, onChange, error, min, max }) {
  return (
    <div>
      <label htmlFor={id} className="block text-[14px] font-semibold text-[#17161C] mb-1.5">{label}</label>
      <input
        id={id}
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        step={1}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`e.g. ${Math.round(max / 2)}`}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={`${id}-hint${error ? ` ${id}-err` : ""}`}
        className={`${inputCls} ${error ? "border-[#E11D48] focus:border-[#E11D48] focus:ring-[#E11D48]/15" : ""}`}
      />
      <p id={`${id}-hint`} className="mt-1.5 text-[12.5px] text-[#6E6A76]">{hint}</p>
      {error && <p id={`${id}-err`} role="alert" className="mt-1 text-[13px] font-medium text-[#BE123C]">{error}</p>}
    </div>
  );
}

function Stat({ label, value, sub }) {
  return (
    <div className={`${card} p-4 sm:p-5`}>
      <p className="text-[12px] font-semibold uppercase tracking-wider text-[#6E6A76]">{label}</p>
      <p className="mt-1.5 text-[22px] sm:text-[24px] font-bold tracking-tight leading-tight tabular-nums">{value}</p>
      {sub && <p className="mt-1 text-[13.5px] text-[#5F5B67] tabular-nums">{sub}</p>}
    </div>
  );
}

const STATUS = {
  yes: { Icon: CheckCircle2, box: "bg-[#ECFDF5] border-[#A7F3D0] text-[#065F46]", icon: "text-[#059669]" },
  borderline: { Icon: AlertTriangle, box: "bg-[#FFFBEB] border-[#FDE68A] text-[#78350F]", icon: "text-[#D97706]" },
  no: { Icon: XCircle, box: "bg-[#FFF1F2] border-[#FECDD3] text-[#881337]", icon: "text-[#E11D48]" },
};

function StatusBox({ status, title, children }) {
  const { Icon, box, icon } = STATUS[status];
  return (
    <div className={`rounded-2xl border p-4 sm:p-5 flex gap-3 ${box}`}>
      <Icon size={22} className={`shrink-0 mt-0.5 ${icon}`} aria-hidden="true" />
      <div>
        <p className="font-semibold text-[15px]">{title}</p>
        {children && <div className="mt-1 text-[13.5px] leading-relaxed opacity-90">{children}</div>}
      </div>
    </div>
  );
}

// "Where you stand": a 0–100 track with the estimated range, the most
// likely point, and optional reference ticks.
function StandBar({ low, mid, high, ticks = [], caption, label }) {
  const pos = (v) => `${Math.min(100, Math.max(0, v))}%`;
  return (
    <figure className={`${card} p-4 sm:p-5`}>
      <figcaption className="text-[12px] font-semibold uppercase tracking-wider text-[#6E6A76]">{label}</figcaption>
      <div
        className="relative mt-8 mb-2 h-3 rounded-full bg-[#EFEDE7]"
        role="img"
        aria-label={caption}
      >
        <div className="absolute inset-y-0 rounded-full bg-[#0D9488]/30" style={{ left: pos(low), width: `max(6px, ${Math.max(0, high - low)}%)` }} />
        {ticks.map((t) => (
          <div key={t.label} className="absolute -top-1.5 -bottom-1.5 w-px bg-[#17161C]/45" style={{ left: pos(t.value) }}>
            <span className={`absolute -top-6 text-[11px] font-medium text-[#5F5B67] whitespace-nowrap ${t.value > 80 ? "right-1" : "left-1"}`}>{t.label}</span>
          </div>
        ))}
        <div
          className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0D9488] border-[3px] border-white shadow-[0_2px_8px_rgba(13,148,136,0.5)]"
          style={{ left: pos(mid) }}
        />
      </div>
      <div className="flex justify-between text-[11.5px] text-[#9A96A1] tabular-nums" aria-hidden="true">
        <span>0</span><span>25</span><span>50</span><span>75</span><span>100</span>
      </div>
      <p className="mt-3 text-[14px] text-[#3A3741] leading-relaxed">{caption}</p>
    </figure>
  );
}

// ---------- JEE Main ----------

const SESSIONS = [1, 2].map((n) => ({
  n,
  label: n === 1 ? "Session 1 — January 2026" : "Session 2 — April 2026",
  shifts: JEE_SHIFTS.filter((s) => s.session === n),
}));

function JeePanel() {
  const [marks, setMarks] = useState("");
  const [shift, setShift] = useState("typical");
  const error = marks === "" ? null : validateJeeMarks(marks);
  const result = useMemo(
    () => (marks === "" || error ? null : predictJee({ marks, shift })),
    [marks, shift, error],
  );
  const cutoff = JEE_FACTS.advancedCutoffGeneral;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <MarksField
          id="jee-marks"
          label="Your JEE Main marks (out of 300)"
          hint="Use your expected or mock score. Negative totals (down to −75) are allowed."
          value={marks}
          onChange={setMarks}
          error={error}
          min={JEE_FACTS.minMarks}
          max={JEE_FACTS.maxMarks}
        />
        <div>
          <label htmlFor="jee-shift" className="block text-[14px] font-semibold text-[#17161C] mb-1.5">Compare with which paper?</label>
          <select
            id="jee-shift"
            value={shift}
            onChange={(e) => setShift(e.target.value)}
            aria-describedby="jee-shift-hint"
            className={`${inputCls} text-[15.5px] pr-10`}
          >
            <option value="typical">Typical shift (middle of all 19)</option>
            <option value="range">All shifts (easiest → toughest)</option>
            {SESSIONS.map((s) => (
              <optgroup key={s.n} label={s.label}>
                {s.shifts.map((x) => <option key={x.id} value={x.id}>{x.label}</option>)}
              </optgroup>
            ))}
          </select>
          <p id="jee-shift-hint" className="mt-1.5 text-[12.5px] text-[#6E6A76]">Same marks give a higher percentile in a tougher shift.</p>
        </div>
      </div>

      <div aria-live="polite">
        {!result ? (
          <EmptyHint text="Enter your marks to see your percentile range, All India Rank range and JEE Advanced check." />
        ) : (
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <Stat
                label="Percentile (NTA score)"
                value={result.percentile.low === result.percentile.high
                  ? fmtPct(result.percentile.mid)
                  : `${fmtPct(result.percentile.low)} – ${fmtPct(result.percentile.high)}`}
                sub={`Most likely about ${fmtPct(result.percentile.mid)}`}
              />
              <Stat
                label="All India Rank (CRL)"
                value={result.rank.best === result.rank.worst
                  ? fmtInt(result.rank.mid)
                  : `${fmtInt(result.rank.best)} – ${fmtInt(result.rank.worst)}`}
                sub={`Most likely about ${fmtInt(result.rank.mid)} of ${fmtInt(JEE_FACTS.uniqueCandidates)}`}
              />
            </div>

            <StatusBox
              status={result.advancedEligible}
              title={{
                yes: "Likely to qualify for JEE Advanced 2026 (General)",
                borderline: "Borderline for JEE Advanced 2026 (General)",
                no: "Below the JEE Advanced 2026 General cutoff",
              }[result.advancedEligible]}
            >
              The 2026 General (CRL) cutoff was <b className="tabular-nums">{cutoff}</b> percentile.
              {result.advancedEligible === "borderline" && " Your estimated range crosses it — a few marks can decide this."}
              {" "}Cutoffs for OBC-NCL, EWS, SC, ST and PwD candidates are lower.
            </StatusBox>

            <StandBar
              label="Where you stand"
              low={result.percentile.low}
              mid={result.percentile.mid}
              high={result.percentile.high}
              ticks={[{ value: cutoff, label: "Adv. cutoff" }]}
              caption={result.percentile.mid >= 100
                ? "A perfect score: 100 percentile."
                : `You would be ahead of about ${fmtPct(result.percentile.mid)}% of candidates in your shift — ${fmtTop(100 - result.percentile.mid)}.`}
            />

            <DataNote>
              {result.note}
              {result.shiftInfo?.estimated && (
                <span className="inline-block ml-1 px-1.5 py-0.5 rounded-md bg-[#FFFBEB] border border-[#FDE68A] text-[11.5px] font-semibold text-[#78350F] align-middle">99.9+ estimated</span>
              )}
              {" "}Rank = (100 − percentile) × {fmtInt(JEE_FACTS.uniqueCandidates)} unique candidates (JEE Main {JEE_FACTS.year}, both sessions; NTA uses your better session).
            </DataNote>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------- NEET UG ----------

function NeetYearCard({ y, r, qualifies }) {
  return (
    <div className={`${card} p-4 sm:p-5 flex flex-col`}>
      <p className="text-[12px] font-semibold uppercase tracking-wider text-[#0F766E]">If your paper is like {y.title}</p>
      <p className="mt-0.5 text-[13px] text-[#6E6A76]">{y.paper}</p>
      <p className="mt-3 text-[12px] font-semibold uppercase tracking-wider text-[#6E6A76]">All India Rank</p>
      <p className="mt-1 text-[24px] font-bold tracking-tight leading-tight tabular-nums">
        {r.rank.low === r.rank.high ? fmtInt(r.rank.mid) : `${fmtInt(r.rank.low)} – ${fmtInt(r.rank.high)}`}
      </p>
      <p className="mt-1 text-[13.5px] text-[#5F5B67] tabular-nums">
        Most likely about {fmtInt(r.rank.mid)} of {fmtInt(y.appeared)} — {fmtTop(r.topPercent)}
      </p>
      <div className="mt-4 pt-3 border-t border-[#EFEDE7] flex items-start gap-2 text-[13.5px]">
        {qualifies
          ? <CheckCircle2 size={18} className="shrink-0 mt-px text-[#059669]" aria-hidden="true" />
          : <XCircle size={18} className="shrink-0 mt-px text-[#E11D48]" aria-hidden="true" />}
        <span className="text-[#3A3741]">
          {qualifies ? "Qualifies" : "Does not qualify"} (General: {y.qualifyingGeneral}+ marks, 50th percentile)
        </span>
      </div>
    </div>
  );
}

function NeetPanel() {
  const [marks, setMarks] = useState("");
  const error = marks === "" ? null : validateNeetMarks(marks);
  const result = useMemo(() => (marks === "" || error ? null : predictNeet({ marks })), [marks, error]);
  const y26 = NEET_YEARS.y2026;
  const y25 = NEET_YEARS.y2025;

  return (
    <div className="space-y-6">
      <div className="sm:max-w-[calc(50%-0.5rem)]">
        <MarksField
          id="neet-marks"
          label="Your NEET UG marks (out of 720)"
          hint="Use your expected or mock score (+4 / −1 marking, so −180 to 720)."
          value={marks}
          onChange={setMarks}
          error={error}
          min={-180}
          max={720}
        />
      </div>

      <div aria-live="polite">
        {!result ? (
          <EmptyHint text="Enter your marks to see your All India Rank range against two very different real papers." />
        ) : (
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <NeetYearCard y={y26} r={result.y2026} qualifies={result.qualifies.general2026} />
              <NeetYearCard y={y25} r={result.y2025} qualifies={result.qualifies.general2025} />
            </div>

            <StandBar
              label="Where you stand (like NEET 2026)"
              low={100 - (result.y2026.rank.high / y26.appeared) * 100}
              mid={100 - result.y2026.topPercent}
              high={100 - (result.y2026.rank.low / y26.appeared) * 100}
              ticks={[{ value: 50, label: "Qualifying (50th pct.)" }]}
              caption={`Ahead of about ${(100 - result.y2026.topPercent).toFixed(1)}% of candidates if your paper is like NEET 2026. Like the tougher NEET 2025 paper, the same marks would place you in ${fmtTop(result.y2025.topPercent)}.`}
            />

            <DataNote>
              Rank here = how many candidates scored your marks or more in that year (ties are broken by NTA&apos;s tie-break rules, so your actual rank can be a little better).
              The same marks mean very different ranks in an easy and a tough year — that is why we show both. Reserved-category qualifying marks are lower.
            </DataNote>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------- shared bits ----------

function EmptyHint({ text }) {
  return (
    <div className="rounded-2xl border border-dashed border-[#D9D5CC] bg-white/50 px-5 py-8 text-center text-[14.5px] text-[#6E6A76]">{text}</div>
  );
}

function DataNote({ children }) {
  return (
    <p className="flex gap-2 text-[13px] leading-relaxed text-[#5F5B67]">
      <Info size={16} className="shrink-0 mt-0.5 text-[#0D9488]" aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
}

function Block({ title, children }) {
  return (
    <section className="grid md:grid-cols-[260px_1fr] gap-4 md:gap-10 py-10 border-t border-[#E7E4DD]">
      <h2 className="text-[20px] font-bold tracking-tight">{title}</h2>
      <div className="space-y-4 text-[16px] leading-relaxed text-[#3A3741]">{children}</div>
    </section>
  );
}

const TABS = [
  { key: "jee", label: "JEE Main" },
  { key: "neet", label: "NEET UG" },
];

// ---------- page ----------

export default function RankPredictor({ fixedExam = null }) {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const exam = fixedExam || (params.get("exam") === "neet" ? "neet" : "jee");
  const tabRefs = useRef({});

  useEffect(() => { window.scrollTo(0, 0); }, []);
  useEffect(() => {
    document.title = fixedExam === "neet" ? `NEET UG Rank Predictor 2027 (Free) — ${BUSINESS.product}`
      : fixedExam === "jee" ? `JEE Main Rank Predictor 2027 (Free) — ${BUSINESS.product}`
      : `JEE Main & NEET Rank Predictor 2027 (Free) — ${BUSINESS.product}`;
  }, [fixedExam]);

  const select = (key, focus = false) => {
    if (fixedExam) navigate(key === "neet" ? "/neet-rank-predictor" : "/jee-main-rank-predictor", { replace: true });
    else setParams(key === "jee" ? {} : { exam: key }, { replace: true });
    if (focus) tabRefs.current[key]?.focus();
  };
  const onTabKey = (e) => {
    const i = TABS.findIndex((t) => t.key === exam);
    let next = null;
    if (e.key === "ArrowRight") next = TABS[(i + 1) % TABS.length];
    else if (e.key === "ArrowLeft") next = TABS[(i - 1 + TABS.length) % TABS.length];
    else if (e.key === "Home") next = TABS[0];
    else if (e.key === "End") next = TABS[TABS.length - 1];
    if (next) { e.preventDefault(); select(next.key, true); }
  };

  const jeeSources = sources.filter((s) => s.exam === "jee");
  const neetSources = sources.filter((s) => s.exam === "neet");

  return (
    <PublicShell>
      <PageHero eyebrow="Rank Predictor" title="Estimate your JEE Main percentile and NEET UG All India Rank.">
        Built on the latest official NTA results and published shift-wise analyses. Free, no sign-up — and honest: you always get a range, with the data source.
      </PageHero>

      <div className="max-w-6xl mx-auto px-5 pb-10">
        <div className="mb-6 flex gap-2.5 rounded-2xl border border-[#0D9488]/25 bg-[#F0FDFA] px-4 py-3.5 text-[14px] leading-relaxed text-[#134E4A]">
          <Info size={18} className="shrink-0 mt-0.5 text-[#0D9488]" aria-hidden="true" />
          <p>{HONEST_LINE}</p>
        </div>

        <div className={`${card} p-4 sm:p-6 md:p-8`}>
          <div role="tablist" aria-label="Exam" className="inline-flex p-1 rounded-xl bg-[#F1EFEA] mb-6" onKeyDown={onTabKey}>
            {TABS.map((t) => {
              const active = exam === t.key;
              return (
                <button
                  key={t.key}
                  ref={(el) => { tabRefs.current[t.key] = el; }}
                  type="button"
                  role="tab"
                  id={`tab-${t.key}`}
                  aria-selected={active}
                  aria-controls={`panel-${t.key}`}
                  tabIndex={active ? 0 : -1}
                  onClick={() => select(t.key)}
                  className={`px-4 sm:px-5 py-2 rounded-lg text-[14.5px] font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] ${active ? "bg-white text-[#17161C] shadow-sm" : "text-[#5F5B67] hover:text-[#17161C]"}`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>

          <div role="tabpanel" id={`panel-${exam}`} aria-labelledby={`tab-${exam}`}>
            {exam === "jee" ? <JeePanel key="jee" /> : <NeetPanel key="neet" />}
          </div>
        </div>

        <Block title="How this works">
          <p><b>JEE Main.</b> NTA turns your marks into a percentile inside your own shift, so the same marks score higher in a tough shift. For each of the {JEE_SHIFTS.length} JEE Main {JEE_FACTS.year} shifts we use the published marks needed for 90 to 99.9 percentile, and the usual NTA curve below 90 (scaled to that shift). Your percentile is read off that curve; &ldquo;Typical shift&rdquo; takes the middle value of all shifts, &ldquo;All shifts&rdquo; shows the easiest-to-toughest spread.</p>
          <p>Your All India Rank comes from your percentile the way NTA does it: (100 − percentile) ÷ 100 × {fmtInt(JEE_FACTS.uniqueCandidates)}, the number of unique candidates who appeared in {JEE_FACTS.year}. NTA counts your better percentile of the two sessions.</p>
          <p><b>NEET UG.</b> NEET has one paper for everyone, so rank is simply how many candidates scored your marks or more. We use official NTA result figures (topper, rank at key marks, the qualifying mark and the number who appeared) for two real years: {yearBlurb(NEET_YEARS.y2026)} and {yearBlurb(NEET_YEARS.y2025)}. Between those points the rank changes smoothly, and we fill the gaps on that curve.</p>
          <p><b>Why a range?</b> Marks-vs-percentile tables are built from students&apos; scorecards, and different analyses differ slightly — by about ±0.05 percentile near the top and up to ±2.5 below 85. For NEET we show ±15% (±25% below 300 marks). Above all, next year&apos;s rank depends on how hard that paper is, which nobody can know in advance.</p>
          <p className="text-[14.5px] text-[#5F5B67]">This is a free guide, not an official result. {BUSINESS.product} is not affiliated with NTA. Data as of {fmtDate(asOf)}.</p>
        </Block>

        <Block title="Sources">
          <SourceList title="JEE Main 2026" items={jeeSources} />
          <SourceList title="NEET UG 2026 and 2025" items={neetSources} />
          <p className="text-[14.5px] text-[#5F5B67]">
            JEE Main shift tables are crowd-sourced from students&apos; scorecards by the publishers above; NTA does not publish them.
            Session 2 (April) points above 99 percentile are our estimate because no 99.9 percentile data was published.
          </p>
        </Block>

        <div className="border-t border-[#E7E4DD] pt-10 flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between">
          <p className="text-[16px] text-[#3A3741] max-w-xl">Want a better rank? Practise with full-length mocks and see your weak topics.</p>
          <PrimaryButton to="/register">Create free account <ArrowRight size={17} /></PrimaryButton>
        </div>
      </div>
    </PublicShell>
  );
}

function yearBlurb(year) {
  return `${year.title} (${year.paper.split(" — ")[1]})`;
}

function SourceList({ title, items }) {
  return (
    <div>
      <h3 className="text-[15px] font-semibold text-[#17161C] mb-2">{title}</h3>
      <ul className="space-y-2">
        {items.map((s) => (
          <li key={s.url}>
            <a href={s.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-start gap-1.5 text-[14.5px] text-[#0F766E] hover:underline">
              <span>{s.title}</span>
              <ExternalLink size={14} className="shrink-0 mt-1" aria-hidden="true" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
