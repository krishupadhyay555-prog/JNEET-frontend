// ============================================================
//  JNEET+ AI — pages/Legal.jsx
//  Renders /privacy, /terms, /refund and /delivery from
//  legal/content.js (the same source that generates the static HTML
//  copies in public/). Sticky table of contents on desktop.
// ============================================================

import { useEffect } from "react";
import { Link } from "react-router-dom";
import { PublicShell } from "../components/public/PublicShell.jsx";
import { LEGAL, LEGAL_UPDATED, BUSINESS } from "../legal/content.js";

const slug = (h) => h.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export default function Legal({ doc }) {
  const d = LEGAL[doc];

  useEffect(() => {
    const prev = document.title;
    document.title = `${d.title} — ${BUSINESS.product}`;
    window.scrollTo(0, 0);
    return () => { document.title = prev; };
  }, [d.title]);

  return (
    <PublicShell>
      <div className="max-w-6xl mx-auto px-5 pt-12 pb-16 sm:pt-16 grid lg:grid-cols-[230px_1fr] gap-10">
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-6">
            <nav aria-label="Legal pages" className="space-y-1">
              <p className="text-[11.5px] font-semibold uppercase tracking-wider text-[#6E6A76] mb-2">Policies</p>
              {Object.entries(LEGAL).map(([key, v]) => (
                <Link key={key} to={v.path} className={`block px-3 py-1.5 rounded-lg text-[14px] ${key === doc ? "bg-white border border-[#E7E4DD] font-semibold text-[#17161C]" : "text-[#5F5B67] hover:text-[#17161C]"}`}>{v.title}</Link>
              ))}
            </nav>
            <nav aria-label="On this page" className="space-y-1 border-t border-[#E7E4DD] pt-5">
              <p className="text-[11.5px] font-semibold uppercase tracking-wider text-[#6E6A76] mb-2">On this page</p>
              {d.sections.map((s) => (
                <a key={s.h} href={`#${slug(s.h)}`} className="block text-[13px] leading-snug py-1 text-[#5F5B67] hover:text-[#0F766E]">{s.h}</a>
              ))}
            </nav>
          </div>
        </aside>

        <article className="max-w-[720px]">
          <p className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-[#0D9488] mb-3">Legal</p>
          <h1 className="text-[32px] sm:text-[42px] font-bold tracking-tight leading-tight">{d.title}</h1>
          <p className="text-[13.5px] text-[#6E6A76] mt-2 mb-6">Last updated: {LEGAL_UPDATED}</p>
          <p className="text-[16.5px] leading-relaxed text-[#3A3741] mb-2">{d.intro}</p>

          {d.sections.map((s) => (
            <section key={s.h} id={slug(s.h)} className="scroll-mt-24">
              <h2 className="text-[19px] font-bold tracking-tight mt-10 mb-3">{s.h}</h2>
              {s.p?.map((t, i) => <p key={`p${i}`} className="text-[15.5px] leading-[1.75] text-[#3A3741] mb-3">{t}</p>)}
              {s.ul ? (
                <ul className="list-disc pl-5 mb-3 space-y-2 marker:text-[#0D9488]">
                  {s.ul.map((t, i) => <li key={i} className="text-[15.5px] leading-[1.7] text-[#3A3741]">{t}</li>)}
                </ul>
              ) : null}
              {s.p2?.map((t, i) => <p key={`q${i}`} className="text-[15.5px] leading-[1.75] text-[#3A3741] mb-3">{t}</p>)}
            </section>
          ))}

          <div className="mt-12 rounded-2xl bg-white border border-[#E7E4DD] p-5 text-[14.5px] leading-relaxed text-[#5F5B67]">
            Questions about this policy? <Link to="/contact" className="text-[#0F766E] font-semibold hover:underline">Contact us</Link> or write to{" "}
            <a href={`mailto:${BUSINESS.supportEmail}`} className="text-[#0F766E] font-semibold hover:underline">{BUSINESS.supportEmail}</a>.
          </div>
          <div className="lg:hidden mt-8 flex flex-wrap gap-x-4 gap-y-2 text-[13.5px]">
            {Object.values(LEGAL).map((v) => <Link key={v.path} to={v.path} className="text-[#5F5B67] underline">{v.title}</Link>)}
          </div>
        </article>
      </div>
    </PublicShell>
  );
}
