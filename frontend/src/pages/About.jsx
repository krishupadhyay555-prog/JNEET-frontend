// ============================================================
//  JNEET+ AI — pages/About.jsx   (public, "About us")
//  Who runs JNEET+ AI, what it does, how the AI works (OpenAI GPT
//  models via the API — stated plainly, per OpenAI's brand rules:
//  "powered by", no logo, no partnership claim), how questions are
//  checked, and how students are kept safe.
// ============================================================

import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { PublicShell, PageHero, PrimaryButton } from "../components/public/PublicShell.jsx";
import { usePublicStats, fmtCount } from "../hooks/usePublicStats.js";
import { BUSINESS } from "../legal/content.js";

function Block({ title, children }) {
  return (
    <section className="grid md:grid-cols-[260px_1fr] gap-4 md:gap-10 py-10 border-t border-[#E7E4DD]">
      <h2 className="text-[20px] font-bold tracking-tight">{title}</h2>
      <div className="space-y-4 text-[16px] leading-relaxed text-[#3A3741]">{children}</div>
    </section>
  );
}

export default function About() {
  const stats = usePublicStats();
  useEffect(() => { document.title = `About us — ${BUSINESS.product}`; window.scrollTo(0, 0); }, []);
  return (
    <PublicShell>
      <PageHero eyebrow="About us" title="Good guidance shouldn't depend on which city you live in.">
        {BUSINESS.product} gives every NEET and JEE aspirant a patient study mentor, real practice and honest feedback — at a price a student can afford, starting at ₹0.
      </PageHero>

      <div className="max-w-6xl mx-auto px-5 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            [stats ? fmtCount(stats.questions) : "13,000+", "practice questions"],
            [stats ? fmtCount(stats.chapters) : "—", "exam-chapter sets"],
            [stats ? String(stats.oneshots) : "20+", "OneShot notes"],
            ["13+", "minimum age"],
          ].map(([n, l]) => (
            <div key={l} className="bg-white rounded-2xl border border-[#E7E4DD] p-5">
              <p className="text-[26px] font-bold tracking-tight">{n}</p>
              <p className="text-[13.5px] text-[#5F5B67]">{l}</p>
            </div>
          ))}
        </div>

        <Block title="What we do">
          <p>{BUSINESS.product} is an online study platform for students preparing for NEET UG and JEE Main in India. It brings together an AI doubt-solving mentor, chapter-wise and full-length mock tests, revision with instant feedback, one-page chapter notes (OneShots) and progress tracking that shows your weak topics.</p>
          <p>Our approach is simple: help you think, don't just hand you answers. The mentor gives a hint first and the full solution when you need it, so you learn the method that works in the exam hall.</p>
        </Block>

        <Block title="How the AI works">
          <p>The AI mentor's answers are generated with <b>OpenAI's GPT models</b>, accessed through the OpenAI API. We thank OpenAI for building these models.</p>
          <p>We add our own layer on top: teaching rules (hint before answer, NCERT first, exam tricks, your study language), safety rules (no 18+ content or abuse, a caring reply when a student is stressed) and daily limits that keep the service affordable.</p>
          <p>Privacy: we identify you to OpenAI only with an anonymous, one-way hashed ID — never your name or email. Under OpenAI's API terms, API data is not used to train its models by default. Details are in our <Link to="/privacy" className="text-[#0F766E] font-semibold hover:underline">Privacy Policy</Link>.</p>
          <p className="text-[14.5px] text-[#5F5B67]">{BUSINESS.product} is an independent product. It is not made, endorsed or sponsored by OpenAI.</p>
        </Block>

        <Block title="How we check questions">
          <ul className="list-disc pl-5 space-y-2">
            <li>Numerical answers in the questions we write are calculated by code, and maths answers are re-checked by a computer algebra system.</li>
            <li>An automatic scan compares every explanation with its answer key; each mismatch is re-solved by hand and fixed.</li>
            <li>Duplicate and near-duplicate questions are removed, and new content follows the current NTA syllabus.</li>
            <li>Every question has a <b>Report</b> button. Reports reach us directly, and fixed questions update for everyone.</li>
          </ul>
        </Block>

        <Block title="Safety and privacy">
          <p>Students aged 13 and above can join. For students under 18, a parent or guardian approves the AI mentor by email and can withdraw approval at any time. We show no ads, never sell personal data, and let every student download or delete their data from Settings.</p>
          <p>We follow India's Digital Personal Data Protection Act, 2023. Questions or complaints go to our Grievance Officer through the <Link to="/contact?topic=grievance" className="text-[#0F766E] font-semibold hover:underline">Contact page</Link>.</p>
        </Block>

        <Block title="Who runs it">
          <p>{BUSINESS.product} is built and operated by <b>{BUSINESS.operator}</b>, in India.{BUSINESS.address ? ` Address: ${BUSINESS.address}.` : ""} You can write to us any time at <a href={`mailto:${BUSINESS.supportEmail}`} className="text-[#0F766E] font-semibold hover:underline">{BUSINESS.supportEmail}</a> — a real person reads every message.</p>
          <p className="text-[14.5px] text-[#5F5B67]">We are not affiliated with NTA, NMC, any IIT or any coaching institute. We do not promise ranks or admissions — we promise honest practice and feedback.</p>
        </Block>

        <div className="border-t border-[#E7E4DD] pt-10 flex flex-col sm:flex-row gap-3">
          <PrimaryButton to="/register">Create free account <ArrowRight size={17} /></PrimaryButton>
          <Link to="/contact" className="px-5 py-3 rounded-xl font-semibold text-[#17161C] hover:bg-black/[0.04] text-center">Contact us</Link>
        </div>
      </div>
    </PublicShell>
  );
}
