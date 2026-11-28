// ============================================================
//  JNEET+ AI — pages/About.jsx   (public, "About us")
//  Calm, factual, checkable. Every statement here is true of the product
//  today (sources: docs/PYQ_COVERAGE.md, tools/pyq/build.py, legal/content.js).
//  Numbers are live from /api/public/stats only — never hard-coded, and
//  hidden (not guessed) if the stats can't load. AI is OpenAI GPT via the
//  API, stated plainly ("powered by", no logo, no partnership claim).
// ============================================================

import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, FileCheck2, ShieldCheck, Lock, MessageSquareText } from "lucide-react";
import { PublicShell, PageHero, PrimaryButton } from "../components/public/PublicShell.jsx";
import { usePublicStats, fmtCount } from "../hooks/usePublicStats.js";
import { BUSINESS } from "../legal/content.js";

const link = "text-[#0F766E] font-semibold hover:underline";

function Block({ icon: Icon, eyebrow, title, children }) {
  return (
    <section className="grid md:grid-cols-[280px_1fr] gap-4 md:gap-12 py-12 border-t border-[#E7E4DD]">
      <div>
        <p className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#0D9488]">
          {Icon ? <Icon size={15} strokeWidth={2} aria-hidden="true" /> : null}{eyebrow}
        </p>
        <h2 className="mt-2 text-[21px] font-bold tracking-tight text-[#17161C] leading-snug">{title}</h2>
      </div>
      <div className="space-y-4 text-[16px] leading-[1.7] text-[#3A3741] max-w-[62ch]">{children}</div>
    </section>
  );
}

function Step({ n, title, children }) {
  return (
    <li className="relative pl-12">
      <span className="absolute left-0 top-0.5 w-8 h-8 rounded-full border border-[#0D9488]/40 text-[#0F766E] text-[14px] font-semibold flex items-center justify-center bg-white">{n}</span>
      <p className="font-semibold text-[#17161C]">{title}</p>
      <p className="text-[15px] text-[#4A4652] mt-0.5">{children}</p>
    </li>
  );
}

function Facts({ stats }) {
  const items = stats
    ? [
        [stats.pyqs, "previous-year questions from official NTA papers"],
        [stats.questions, "practice questions"],
        [stats.chapters, "chapter sets across NEET UG and JEE Main"],
        [stats.oneshots, "OneShot chapter notes"],
      ].filter(([n]) => Number.isFinite(n) && n > 0)
    : null;
  if (stats && !items.length) return null;
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-[#E7E4DD] rounded-2xl overflow-hidden border border-[#E7E4DD]" aria-live="polite">
      {(items ?? [0, 1, 2, 3].map((k) => [null, String(k)])).map(([n, label]) => (
        <div key={label} className="bg-white p-5 min-h-[104px]">
          {n === null ? (
            <>
              <div className="skeleton h-7 w-20 rounded-md" />
              <div className="skeleton h-3.5 w-32 rounded mt-3" />
            </>
          ) : (
            <>
              <p className="text-[28px] font-bold tracking-tight text-[#17161C] tabular-nums">{fmtCount(n)}</p>
              <p className="text-[13.5px] text-[#5F5B67] leading-snug mt-0.5">{label}</p>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default function About() {
  const stats = usePublicStats();
  useEffect(() => { document.title = `About us — ${BUSINESS.product}`; window.scrollTo(0, 0); }, []);
  const g = BUSINESS.grievanceOfficer;

  return (
    <PublicShell>
      <PageHero eyebrow="About us" title="Honest practice for NEET UG and JEE Main.">
        {BUSINESS.product} is a study platform for Indian students. Real NTA papers with their official answers, practice questions we check before you see them, and a mentor that explains the method — at a price a student can afford, starting at ₹0.
      </PageHero>

      <div className="max-w-6xl mx-auto px-5 pb-16">
        <Facts stats={stats} />

        <Block icon={FileCheck2} eyebrow="Previous-year questions" title="Straight from NTA's papers, matched to NTA's key.">
          <ol className="space-y-5">
            <Step n="1" title="Official papers only">Every PYQ comes from a question paper published by NTA. Coaching material is used only as a cross-check, never as the source.</Step>
            <Step n="2" title="Matched to the final answer key">Each question and its options are matched by NTA&apos;s own question and option IDs to NTA&apos;s final answer key.</Step>
            <Step n="3" title="Nothing unverified goes live">If anything doesn&apos;t match, that paper is not published until it is fixed.</Step>
            <Step n="4" title="Bonus and dropped questions follow NTA">Where NTA dropped a question, gave bonus marks or accepted more than one answer, we follow NTA&apos;s decision. NEET UG 2024 uses the key revised after the Supreme Court&apos;s order.</Step>
          </ol>
          <p className="text-[15px] text-[#5F5B67]">Each PYQ shows its exam, year and shift, so you can always check it yourself.</p>
        </Block>

        <Block icon={ShieldCheck} eyebrow="Answer checks" title="How we check answers.">
          <ul className="list-disc pl-5 space-y-2">
            <li>Numerical answers in the questions we write are calculated by code, and maths answers are re-checked by a computer algebra system.</li>
            <li>An automatic scan compares every explanation with its answer key. Each mismatch is solved again by hand and fixed.</li>
            <li>An AI-written solution to a PYQ is only shown if its final answer matches NTA&apos;s key.</li>
            <li>Duplicate questions are removed, and new content follows the current NTA syllabus.</li>
            <li>Every question has a <b>Report</b> button. Reports reach us directly, and a fixed question updates for everyone.</li>
          </ul>
        </Block>

        <Block icon={MessageSquareText} eyebrow="The AI mentor" title="How the AI works.">
          <p>The mentor&apos;s answers are generated with <b>OpenAI&apos;s GPT models</b> through the OpenAI API. On top of that we add our own teaching rules (a hint before the full answer, NCERT first), safety rules (no adult content or abuse, a caring reply when a student is stressed) and fair daily limits.</p>
          <p>We identify you to OpenAI only with an anonymous, one-way hashed ID — never your name or email. Under OpenAI&apos;s API terms, API data is not used to train its models by default.</p>
          <p className="text-[14.5px] text-[#5F5B67]">{BUSINESS.product} is an independent product. It is not made, endorsed or sponsored by OpenAI.</p>
        </Block>

        <Block icon={Lock} eyebrow="Privacy and safety" title="Your data stays yours.">
          <ul className="list-disc pl-5 space-y-2">
            <li>Passwords are stored only as a one-way hash. We can&apos;t read them.</li>
            <li>No ads, and we never sell personal data. The few services we use (hosting, email, payments, captcha, AI) are listed in our <Link to="/privacy" className={link}>Privacy Policy</Link>.</li>
            <li>You can download your data or delete your account at any time from Settings.</li>
            <li>Students aged 13 and above can join. For students under 18, a parent or guardian approves the AI mentor by email and can withdraw that approval at any time.</li>
          </ul>
        </Block>

        <Block eyebrow="Who runs it" title="A small team you can reach.">
          <p>{BUSINESS.product} is built and run by <b>{BUSINESS.operator}</b>, in India.{BUSINESS.address ? ` Address: ${BUSINESS.address}.` : ""} Write to <a href={`mailto:${BUSINESS.supportEmail}`} className={link}>{BUSINESS.supportEmail}</a>{BUSINESS.phone ? <> or call {BUSINESS.phone} ({BUSINESS.phoneHours})</> : null} — a real person reads every message.</p>
          <div className="rounded-2xl border border-[#E7E4DD] bg-white p-5">
            <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[#5F5B67]">Grievance Officer</p>
            <p className="mt-1.5 font-semibold text-[#17161C]">{g.name}</p>
            <p className="text-[15px]"><a href={`mailto:${g.email}`} className={link}>{g.email}</a></p>
            <p className="text-[14.5px] text-[#5F5B67] mt-2">We acknowledge a complaint within 48 hours and resolve it within one month. You can also use the <Link to="/contact?topic=grievance" className={link}>Contact page</Link>.</p>
          </div>
          <p className="text-[14.5px] text-[#5F5B67]">We are not affiliated with or endorsed by NTA, NMC, any IIT, or any coaching institute or government body. We don&apos;t promise ranks or admissions — we promise honest practice and honest feedback.</p>
        </Block>

        <div className="border-t border-[#E7E4DD] pt-10 flex flex-col sm:flex-row gap-3">
          <PrimaryButton to="/free-mock">Try a free mock — no signup <ArrowRight size={17} /></PrimaryButton>
          <Link to="/register" className="min-h-[48px] inline-flex items-center justify-center px-5 rounded-xl font-semibold text-[#17161C] border border-[#E7E4DD] hover:bg-black/[0.03]">Create free account</Link>
        </div>
      </div>
    </PublicShell>
  );
}
