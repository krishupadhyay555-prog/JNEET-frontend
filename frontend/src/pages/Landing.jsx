// ============================================================
//  JNEET+ AI — pages/Landing.jsx
//  Public home page for logged-out visitors (signed-in students go to
//  the app). Built to earn trust: real numbers from the server, how we
//  check questions, how the AI works, safety for under-18s, clear
//  pricing and answers to common doubts.
// ============================================================

import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BrainCircuit, ClipboardCheck, RefreshCcw, BookOpenCheck, LineChart, Flag,
  ShieldCheck, Lock, HeartHandshake, Calculator, ScanSearch, ListChecks, ArrowRight, Check, FileText,
} from "lucide-react";
import { PublicShell, PrimaryButton, SecondaryButton } from "../components/public/PublicShell.jsx";
import { PricingCards } from "../components/public/PricingCards.jsx";
import { usePlanCatalog } from "../hooks/usePlanCatalog.js";
import { usePublicStats, fmtCount } from "../hooks/usePublicStats.js";

const FEATURES = [
  { icon: BrainCircuit, title: "A mentor that makes you think", text: "Ask any doubt. You get a hint first, then the full step-by-step solution — anchored to NCERT, in English, Hinglish or your own language." },
  { icon: ClipboardCheck, title: "Mock tests that feel real", text: "Full NEET / JEE mocks on an NTA-style screen — sections, palette, Mark for Review — with real previous-year questions mixed in, then a question-by-question review." },
  { icon: FileText, title: "Every PYQ, NTA-checked", text: "JEE Main and NEET previous-year papers, year and shift wise, shown exactly as NTA printed them — every answer from NTA's final key." },
  { icon: RefreshCcw, title: "Revision with instant feedback", text: "MCQs and fill-in-the-blanks that tell you right away why an answer is right or wrong." },
  { icon: BookOpenCheck, title: "OneShot chapter notes", text: "Every formula, key idea, common mistake and must-memorise fact of a chapter on one page." },
  { icon: LineChart, title: "Know your weak topics", text: "Chapter-wise strength from your own answers, so every study hour goes where it counts." },
];

const CHECKS = [
  { icon: Calculator, title: "Numbers computed, not typed", text: "In the questions we write, every numerical answer is calculated by code and maths answers are re-checked by a computer algebra system." },
  { icon: ScanSearch, title: "Answer key vs explanation", text: "An automatic scan compares each explanation with its answer key. Every mismatch is re-solved by hand." },
  { icon: ListChecks, title: "Current NTA syllabus", text: "New questions and notes follow the 2026–27 NTA syllabus for NEET UG and JEE Main — nothing from removed topics." },
  { icon: Flag, title: "Students keep us honest", text: "Reports from students go straight to our review queue. Fixed questions update for everyone." },
];

const FAQ = [
  ["Is JNEET+ AI really free?", "Yes. The free plan has 5 AI doubts a day plus mock tests, revision, OneShot notes and progress tracking, with no card needed. Paid plans add more AI doubts and deeper solving."],
  ["Which AI does the mentor use?", "The mentor's answers are generated with OpenAI's GPT models through the OpenAI API. We add our own teaching rules on top: hints before answers, NCERT first, exam tricks, and strict safety rules. We identify you to OpenAI only with an anonymous ID."],
  ["Can the AI be wrong?", "Yes — any AI can make mistakes. That's why the mentor shows its steps, our question bank is checked by code, and every question has a report button. For anything important, check with your NCERT book or teacher."],
  ["I'm under 18. Can I use it?", "Yes, if you are 13 or older. Mock tests, revision and notes work right away; the AI mentor switches on once a parent or guardian approves it by email. Paid plans for under-18 students are paid by a parent through a link you share."],
  ["Is my data safe?", "We store your data securely, never sell it, show no ads, and you can download or delete your data any time in Settings. Read our Privacy Policy for details."],
  ["Does a paid plan renew automatically?", "No. Plans are prepaid: 1 month, or an exam pass till your exam. When a pass ends you simply return to Free — no surprise charges."],
];

function HeroCard() {
  return (
    <div className="relative" aria-hidden="true">
      <div className="absolute -inset-6 bg-gradient-to-br from-[#0D9488]/15 via-transparent to-[#4F46E5]/10 blur-2xl rounded-[40px]" />
      <div className="relative bg-white rounded-3xl border border-[#E7E4DD] shadow-[0_30px_60px_-30px_rgba(23,22,28,0.35)] p-5 sm:p-6">
        <div className="flex items-center justify-between text-[12px]">
          <span className="font-semibold text-[#0D9488] uppercase tracking-wider">Physics · Rotational Motion</span>
          <span className="inline-flex items-center gap-1 text-[#0F766E] bg-[#E6F4F1] px-2 py-0.5 rounded-full font-medium"><Check size={12} /> Checked by code</span>
        </div>
        <p className="mt-3 text-[15px] leading-relaxed font-medium">A disc rotating freely at ω has an identical disc gently placed on it. What fraction of the kinetic energy is lost?</p>
        <div className="mt-3 grid grid-cols-2 gap-2 text-[14px]">
          {["1/4", "1/2", "3/4", "0"].map((o, i) => (
            <div key={o} className={`px-3 py-2 rounded-xl border ${i === 1 ? "border-[#0D9488] bg-[#E6F4F1] font-semibold" : "border-[#E7E4DD]"}`}>{String.fromCharCode(65 + i)}. {o}</div>
          ))}
        </div>
        <div className="mt-4 rounded-2xl bg-[#F6F5F2] p-3.5 text-[13.5px] leading-relaxed">
          <p className="text-[11.5px] font-semibold text-[#5F5B67] mb-1">AI mentor · hint first</p>
          Angular momentum stays the same: Iω = 2I·ω′. Now compare ½Iω² with ½(2I)ω′² — what do you get?
        </div>
      </div>
    </div>
  );
}

export default function Landing() {
  const stats = usePublicStats();
  const catalog = usePlanCatalog();
  useEffect(() => { document.title = "JNEET+ AI — NEET & JEE study mentor, mock tests and revision"; }, []);

  const STAT = [
    [stats ? fmtCount(stats.questions) : "13,000+", "practice questions"],
    [stats ? String(stats.oneshots) : "20+", "OneShot chapter notes"],
    [stats?.pyqs ? fmtCount(stats.pyqs) : "11,000+", "official PYQs with NTA's answer key"],
    ["₹0", "to start — no card"],
  ];

  return (
    <PublicShell>
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-5 pt-12 pb-16 sm:pt-20 sm:pb-24 grid lg:grid-cols-[1.1fr_1fr] gap-12 items-center">
        <div>
          <p className="inline-flex items-center gap-2 text-[12.5px] font-semibold text-[#0F766E] bg-[#E6F4F1] px-3 py-1 rounded-full">For NEET UG &amp; JEE Main 2027</p>
          <h1 className="mt-5 text-[40px] sm:text-[58px] font-bold tracking-tight leading-[1.03]">
            Study smarter.<br />Not alone.
          </h1>
          <p className="mt-5 text-[17px] sm:text-[19px] leading-relaxed text-[#5F5B67] max-w-xl">
            An AI mentor that teaches you to solve, mock tests that feel real, and revision that fixes your weak topics — all in one place.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <PrimaryButton to="/register">Create free account <ArrowRight size={17} /></PrimaryButton>
            <SecondaryButton to="/login">I have an account</SecondaryButton>
          </div>
          <p className="mt-4 text-[13px] text-[#6E6A76]">For students aged 13+. Under 18? A parent approves the AI mentor by email.</p>
          <p className="mt-1.5 text-[13px] text-[#6E6A76]">JEE Advanced: coming soon (after JEE Main results).</p>
        </div>
        <HeroCard />
      </section>

      {/* Numbers */}
      <section className="border-y border-[#E7E4DD] bg-white/60">
        <div className="max-w-6xl mx-auto px-5 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {STAT.map(([n, l]) => (
            <div key={l}>
              <p className="text-[28px] sm:text-[32px] font-bold tracking-tight">{n}</p>
              <p className="text-[13.5px] text-[#5F5B67]">{l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-5 py-20">
        <h2 className="text-[30px] sm:text-[38px] font-bold tracking-tight max-w-2xl">Everything you need between your books and the exam hall</h2>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <div key={f.title} className="bg-white rounded-2xl border border-[#E7E4DD] p-6 hover:shadow-[0_12px_30px_-18px_rgba(23,22,28,0.35)] transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-[#E6F4F1] text-[#0F766E] flex items-center justify-center"><f.icon size={20} /></div>
              <h3 className="mt-4 font-semibold text-[16.5px]">{f.title}</h3>
              <p className="mt-1.5 text-[14.5px] leading-relaxed text-[#5F5B67]">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How we check */}
      <section className="bg-[#17161C] text-white">
        <div className="max-w-6xl mx-auto px-5 py-20">
          <p className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-[#5EEAD4]">Accuracy</p>
          <h2 className="mt-3 text-[30px] sm:text-[38px] font-bold tracking-tight max-w-2xl">A wrong answer key costs marks. So we check.</h2>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {CHECKS.map((c) => (
              <div key={c.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                <c.icon size={22} className="text-[#5EEAD4]" />
                <h3 className="mt-4 font-semibold text-[16px]">{c.title}</h3>
                <p className="mt-1.5 text-[14px] leading-relaxed text-white/70">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI + safety */}
      <section className="max-w-6xl mx-auto px-5 py-20 grid lg:grid-cols-2 gap-10">
        <div>
          <p className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-[#0D9488]">How the AI works</p>
          <h2 className="mt-3 text-[28px] sm:text-[34px] font-bold tracking-tight">Powered by OpenAI's GPT models, taught to teach</h2>
          <p className="mt-4 text-[16px] leading-relaxed text-[#5F5B67]">
            The mentor's answers are generated with OpenAI's GPT models through the OpenAI API. On top, we add our own rules: give a hint before the answer, stay close to NCERT, show the exam trick, and never encourage cheating. Your name and email are never sent to OpenAI — only an anonymous ID.
          </p>
          <Link to="/about" className="mt-5 inline-flex items-center gap-1.5 font-semibold text-[#0F766E] hover:underline">More about us <ArrowRight size={16} /></Link>
        </div>
        <div className="grid gap-4">
          {[
            [ShieldCheck, "Built for students, including under-18s", "Age check at sign-up. For students under 18, a parent approves the AI mentor by email and can withdraw approval any time."],
            [Lock, "Your data is yours", "No ads, no selling data. Download or delete your data whenever you want from Settings."],
            [HeartHandshake, "A caring reply when it's hard", "If a message shows stress or distress, the mentor responds with care and points to free help lines like Tele-MANAS (14416)."],
          ].map(([icon, h, p]) => ({ icon, h, p })).map((it) => (
            <div key={it.h} className="bg-white rounded-2xl border border-[#E7E4DD] p-5 flex gap-4">
              <div className="w-10 h-10 shrink-0 rounded-xl bg-[#EEF0FF] text-[#4F46E5] flex items-center justify-center"><it.icon size={20} /></div>
              <div><p className="font-semibold text-[15.5px]">{it.h}</p><p className="mt-1 text-[14px] leading-relaxed text-[#5F5B67]">{it.p}</p></div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-6xl mx-auto px-5 pb-20" id="pricing">
        <div className="flex items-end justify-between gap-4 flex-wrap mb-8">
          <h2 className="text-[30px] sm:text-[38px] font-bold tracking-tight">Simple, honest pricing</h2>
          <Link to="/pricing" className="font-semibold text-[#0F766E] hover:underline inline-flex items-center gap-1.5">Payment details <ArrowRight size={16} /></Link>
        </div>
        <PricingCards catalog={catalog} />
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-5 pb-20">
        <h2 className="text-[30px] sm:text-[38px] font-bold tracking-tight text-center mb-8">Questions students ask</h2>
        <div className="divide-y divide-[#E7E4DD] border-y border-[#E7E4DD]">
          {FAQ.map(([q, a]) => (
            <details key={q} className="group py-4">
              <summary className="flex items-center justify-between gap-4 cursor-pointer list-none font-semibold text-[16px]">
                {q}<span className="text-[#0D9488] text-xl leading-none transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-2.5 text-[15px] leading-relaxed text-[#5F5B67]">{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-5 pb-16">
        <div className="rounded-3xl bg-gradient-to-br from-[#0D9488] to-[#0F766E] text-white p-8 sm:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h2 className="text-[26px] sm:text-[32px] font-bold tracking-tight">Your next study session starts here.</h2>
            <p className="mt-2 text-white/80 text-[15.5px]">Free forever plan. Takes 1 minute to sign up.</p>
          </div>
          <Link to="/register" className="px-6 py-3 rounded-xl bg-white text-[#0F766E] font-semibold hover:bg-[#F6F5F2] inline-flex items-center gap-2">Create free account <ArrowRight size={17} /></Link>
        </div>
      </section>
    </PublicShell>
  );
}
