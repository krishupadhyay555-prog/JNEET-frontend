// Public landing pages for search (JEE/NEET mock tests and PYQs).
// Content lives in src/seo/seoContent.js (shared with the static HTML).
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { PublicShell, PageHero, PrimaryButton } from "../components/public/PublicShell.jsx";
import SeoFaq from "../components/public/SeoFaq.jsx";
import { seoPage } from "../seo/seoContent.js";

export default function SeoLanding({ path }) {
  const p = seoPage(path);
  useEffect(() => { if (p) document.title = p.title; window.scrollTo(0, 0); }, [p]);
  if (!p) return null;
  const neet = path.startsWith("neet");
  return (
    <PublicShell>
      <PageHero eyebrow={p.eyebrow} title={p.h1}>{p.intro}</PageHero>
      <div className="max-w-6xl mx-auto px-5 pb-16 space-y-12">
        <ul className="grid gap-3 sm:grid-cols-2">
          {p.points.map((t) => (
            <li key={t} className="flex gap-2.5 rounded-xl border border-[#E7E4DD] bg-white p-4 text-[15px] text-[#3A3741]">
              <CheckCircle2 size={19} className="shrink-0 mt-0.5 text-[#0D9488]" aria-hidden="true" />{t}
            </li>
          ))}
        </ul>
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <PrimaryButton to={p.cta.to}>{p.cta.label} <ArrowRight size={17} /></PrimaryButton>
          <Link to={neet ? "/neet-rank-predictor" : "/jee-main-rank-predictor"} className="font-semibold text-[#0F766E] hover:underline">
            Try the free {neet ? "NEET" : "JEE Main"} rank predictor →
          </Link>
        </div>
        <SeoFaq faq={p.faq} />
      </div>
    </PublicShell>
  );
}
