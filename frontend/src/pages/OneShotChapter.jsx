// ============================================================
//  JNEET+ AI — pages/OneShotChapter.jsx
//  One chapter's OneShot: Summary · Formulas · Examples · Key topics
//  · Ratta. Pre-written and verified on the server (services/oneshot.js).
// ============================================================

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Pin, AlertTriangle, MessageCircle, ListChecks } from "lucide-react";
import { useGoBack } from "../hooks/useGoBack.js";
import { useAuth } from "../context/AuthContext.jsx";
import { oneshotApi } from "../api/learnApi.js";
import { Spinner } from "../components/ui/Spinner.jsx";
import { MathText } from "../components/learn/MathText.jsx";

const TABS = [
  { id: "summary",  label: "Summary" },
  { id: "formulas", label: "Formulas" },
  { id: "examples", label: "Examples" },
  { id: "topics",   label: "Key topics" },
  { id: "ratta",    label: "Ratta (Must memorise)" },
];

function FormulaCard({ f }) {
  return (
    <article className="bg-bg-card border border-bg-border rounded-2xl p-4">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-bold">{f.name}</h3>
        {f.tag ? (
          <span className="shrink-0 text-[10px] font-semibold text-tone-warn bg-amber-500/15 rounded-md px-2 py-0.5">{f.tag}</span>
        ) : f.unit ? (
          <span className="shrink-0 text-[11px] text-gray-600">{f.unit}</span>
        ) : null}
      </div>
      <p className="text-[14.5px] font-medium leading-relaxed my-2.5 bg-bg-panel rounded-xl px-3 py-2.5 break-words"><MathText>{f.formula}</MathText></p>
      <p className="text-[12.5px] leading-relaxed text-fg-secondary"><strong className="text-fg-primary">When to use:</strong> <MathText>{f.when}</MathText></p>
      {f.mistake && (
        <p className="text-[12.5px] leading-relaxed text-fg-secondary mt-1">
          <strong className="text-tone-warn">Common mistake:</strong> <MathText>{f.mistake}</MathText>
        </p>
      )}
      {f.note && (
        <p className="text-[12.5px] leading-relaxed text-fg-secondary mt-1">
          <strong className="text-violet-500">Remember:</strong> <MathText>{f.note}</MathText>
        </p>
      )}
      {f.tag && f.unit && <p className="text-[11px] text-gray-600 mt-1">Unit: {f.unit}</p>}
    </article>
  );
}

export default function OneShotChapter() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const goBack = useGoBack("/oneshot");
  const { examMode } = useAuth();
  const [lang, setLang] = useState(null);            // null = saved study language
  const key = `${examMode}:${slug}:${lang ?? "saved"}`;
  const [loaded, setLoaded] = useState({ key: null, doc: null, error: "" });
  const state = loaded.key === key
    ? { loading: false, doc: loaded.doc, error: loaded.error }
    : { loading: true, doc: null, error: "" };
  const [tab, setTab] = useState("summary");

  useEffect(() => {
    let cancelled = false;
    oneshotApi.get(slug, lang ?? undefined)
      .then((r) => { if (!cancelled) setLoaded({ key, doc: r.data.oneshot, error: "" }); })
      .catch((err) => {
        if (cancelled) return;
        setLoaded({ key, doc: null, error: err.response?.status === 404 ? "This OneShot isn't available for your exam yet." : "Couldn't load this page. Please try again." });
      });
    return () => { cancelled = true; };
  }, [slug, key, lang]);

  const { loading, doc, error } = state;

  return (
    <div className="min-h-screen bg-bg-base text-fg-primary flex flex-col">
      <header className="bg-bg-surface border-b border-bg-border sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 pt-3 flex items-center gap-3">
          <button onClick={goBack} aria-label="Back" className="text-gray-500 hover:text-fg-primary transition p-2 rounded-lg hover:bg-bg-hover">
            <ArrowLeft size={16} />
          </button>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-tone-warn">
              OneShot{doc ? ` · ${doc.subject} · ~${doc.readMinutes} min` : ""}
            </p>
            <h1 className="text-[15px] font-bold leading-tight truncate">{doc?.title ?? "OneShot"}</h1>
          </div>
        </div>
        {doc && (
          <div role="tablist" aria-label="OneShot sections" className="max-w-2xl mx-auto px-3 mt-2 flex gap-1 overflow-x-auto no-scrollbar">
            {TABS.filter((t) => t.id !== "ratta" || doc.ratta?.length).map((t) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
                className={`shrink-0 px-3 py-2.5 text-[13px] border-b-2 -mb-px transition
                  ${tab === t.id ? "border-fg-primary font-bold text-fg-primary" : "border-transparent text-gray-600 hover:text-fg-primary"}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}
      </header>

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-5 space-y-3">
        {doc && !loading && (doc.languages?.length > 1 || doc.fallback) && (
          <div className="flex flex-wrap items-center gap-2 text-[12px]">
            {doc.languages?.length > 1 && (
              <div role="radiogroup" aria-label="Page language" className="inline-flex rounded-xl border border-bg-border bg-bg-card p-0.5">
                {doc.languages.map((l) => (
                  <button
                    key={l}
                    type="button"
                    role="radio"
                    aria-checked={doc.lang === l}
                    onClick={() => setLang(l)}
                    className={`px-3 py-1 rounded-lg transition ${doc.lang === l ? "bg-violet-600 text-white font-semibold" : "text-gray-600 hover:text-fg-primary"}`}
                  >
                    {l === "english" ? "English" : "Hinglish"}
                  </button>
                ))}
              </div>
            )}
            {doc.fallback && (
              <p className="text-gray-600">
                {doc.lang === "hinglish"
                  ? "The English version of this chapter is on its way — showing Hinglish for now."
                  : "The Hinglish version of this chapter is on its way — showing English for now."}
              </p>
            )}
          </div>
        )}
        {loading ? (
          <div className="flex justify-center py-16"><Spinner size={20} /></div>
        ) : error ? (
          <p className="text-sm text-gray-600 text-center pt-10">{error}</p>
        ) : tab === "summary" ? (
          <div className="space-y-3 animate-fade-up">
            {doc.summary.map((p, i) => (
              <p key={i} className="text-[14px] leading-relaxed text-fg-primary"><MathText>{p}</MathText></p>
            ))}
          </div>
        ) : tab === "formulas" ? (
          <div className="space-y-2.5 animate-fade-up">
            {doc.formulas.map((f) => <FormulaCard key={f.name} f={f} />)}
          </div>
        ) : tab === "examples" ? (
          <div className="space-y-2.5 animate-fade-up">
            {doc.examples.map((x, i) => (
              <article key={x.title} className="bg-bg-card border border-bg-border rounded-2xl p-4">
                <p className="text-[11px] font-semibold text-violet-500 mb-1">Example {i + 1}</p>
                <h3 className="text-sm font-bold mb-1.5">{x.title}</h3>
                <p className="text-[13.5px] leading-relaxed"><MathText>{x.problem}</MathText></p>
                <div className="mt-2.5 rounded-xl bg-emerald-500/10 px-3 py-2.5 text-[13px] leading-relaxed">
                  <strong className="text-tone-ok">Solution: </strong><MathText>{x.solution}</MathText>
                </div>
              </article>
            ))}
          </div>
        ) : tab === "topics" ? (
          <div className="space-y-2.5 animate-fade-up">
            {doc.topics.map((t) => (
              <article key={t.title} className="bg-bg-card border border-bg-border rounded-2xl p-4">
                <h3 className="text-sm font-bold mb-1">{t.title}</h3>
                <p className="text-[13.5px] leading-relaxed text-fg-secondary"><MathText>{t.explain}</MathText></p>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-amber-500/10 border border-amber-500/30 p-4 animate-fade-up">
            <p className="flex items-center gap-2 text-sm font-bold text-tone-warn mb-2">
              <Pin size={15} /> Ratta zone — must memorise
            </p>
            <ul className="space-y-2 text-[13.5px] leading-relaxed list-disc pl-5">
              {doc.ratta.map((r) => <li key={r}><MathText>{r}</MathText></li>)}
            </ul>
          </div>
        )}

        {doc && !loading && (
          <p className="flex items-center gap-1.5 text-[11px] text-gray-600 pt-2">
            <AlertTriangle size={11} /> Spotted a mistake? Tell the AI Mentor — we fix it fast. Checked on: {doc.verifiedOn}
          </p>
        )}
      </main>

      {doc && (
        <footer className="sticky bottom-0 bg-bg-surface/95 backdrop-blur border-t border-bg-border">
          <div className="max-w-2xl mx-auto px-4 py-3 flex gap-2.5">
            <button
              type="button"
              onClick={() => navigate("/ask")}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-bg-border bg-bg-card text-sm font-semibold min-h-[48px] hover:bg-bg-hover transition"
            >
              <MessageCircle size={15} className="shrink-0" />
              <span className="whitespace-nowrap sm:hidden">Ask a doubt</span>
              <span className="whitespace-nowrap hidden sm:inline">Ask the AI Mentor</span>
            </button>
            <button
              type="button"
              onClick={() => navigate("/revision", { state: { subject: doc.subject, chapter: doc.chapter } })}
              className="flex-[1.4] flex items-center justify-center gap-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold min-h-[48px] transition"
            >
              <ListChecks size={15} className="shrink-0" />
              <span className="whitespace-nowrap sm:hidden">Revise</span>
              <span className="whitespace-nowrap hidden sm:inline">Revise this chapter</span>
            </button>
          </div>
        </footer>
      )}
    </div>
  );
}
