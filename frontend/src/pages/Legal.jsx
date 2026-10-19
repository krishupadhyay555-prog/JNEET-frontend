// ============================================================
//  JNEET+ AI — pages/Legal.jsx
//  Renders /privacy, /terms and /refund from legal/content.js (the same
//  source that generates the static HTML copies in public/).
// ============================================================

import { useEffect } from "react";
import { Link }      from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { LEGAL, LEGAL_UPDATED, BUSINESS } from "../legal/content.js";

export default function Legal({ doc }) {
  const d = LEGAL[doc];

  useEffect(() => {
    const prev = document.title;
    document.title = `${d.title} — ${BUSINESS.product}`;
    window.scrollTo(0, 0);
    return () => { document.title = prev; };
  }, [d.title]);

  return (
    <div className="min-h-screen bg-[#FDFBFC] text-[#2D2A32] px-5 py-8 sm:py-12">
      <article className="max-w-2xl mx-auto">
        <Link to="/login" className="inline-flex items-center gap-1.5 text-xs text-[#6B6572] hover:text-[#2D2A32] mb-6">
          <ArrowLeft size={13} /> {BUSINESS.product}
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{d.title}</h1>
        <p className="text-xs text-[#6B6572] mt-1 mb-5">Last updated: {LEGAL_UPDATED}</p>
        <p className="text-[15px] leading-relaxed text-[#403C47] mb-2">{d.intro}</p>

        {d.sections.map((s) => (
          <section key={s.h}>
            <h2 className="text-lg font-semibold mt-8 mb-2.5">{s.h}</h2>
            {s.p?.map((t, i) => <p key={`p${i}`} className="text-[15px] leading-relaxed text-[#403C47] mb-3">{t}</p>)}
            {s.ul ? (
              <ul className="list-disc pl-5 mb-3 space-y-1.5">
                {s.ul.map((t, i) => <li key={i} className="text-[15px] leading-relaxed text-[#403C47]">{t}</li>)}
              </ul>
            ) : null}
            {s.p2?.map((t, i) => <p key={`q${i}`} className="text-[15px] leading-relaxed text-[#403C47] mb-3">{t}</p>)}
          </section>
        ))}

        <footer className="mt-12 pt-5 border-t border-[#EDE6F3] text-xs text-[#6B6572] flex flex-wrap gap-x-4 gap-y-1">
          {Object.entries(LEGAL).map(([key, v]) => (
            <Link key={key} to={v.path} className="hover:text-[#2D2A32] hover:underline">{v.title}</Link>
          ))}
        </footer>
      </article>
    </div>
  );
}
