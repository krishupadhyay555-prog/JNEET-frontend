// ============================================================
//  JNEET+ AI — pages/Landing.jsx
//  Public home page for logged-out visitors (logged-in students are
//  redirected to the app). Free plan is live; Pro/Elite are "coming soon"
//  and carry no price or payment button.
// ============================================================

import { Link } from "react-router-dom";
import { BrainCircuit, ClipboardCheck, RefreshCcw, TrendingUp, ShieldCheck, Check } from "lucide-react";
import { LEGAL } from "../legal/content.js";

const FEATURES = [
  { icon: BrainCircuit,   title: "A mentor that makes you think", text: "Stuck on a numerical? Get a hint first, then the full solution when you need it. Anchored to NCERT, in English, Hindi or Hinglish." },
  { icon: ClipboardCheck, title: "Mock tests",                    text: "Chapter-wise and full-length practice for NEET and JEE with instant scoring and review." },
  { icon: RefreshCcw,     title: "Smart revision",                text: "Revision queues built from the questions you got wrong, so you fix weak spots first." },
  { icon: TrendingUp,     title: "Know where you stand",          text: "Subject and chapter strength at a glance, so every study hour counts." },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#FDFBFC] text-[#2D2A32]">
      <header className="max-w-5xl mx-auto px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <img src="/icon-192.png" alt="" width="32" height="32" className="rounded-lg" />
          <span className="font-bold tracking-tight">JNEET+ AI</span>
        </div>
        <nav className="flex items-center gap-2 text-sm">
          <Link to="/login" className="px-3.5 py-2 rounded-xl hover:bg-[#F3EEF8] font-medium">Log in</Link>
          <Link to="/register" className="px-4 py-2 rounded-xl bg-gradient-to-br from-[#93C5FD] to-[#F5A9C8] text-white font-semibold">Sign up free</Link>
        </nav>
      </header>

      <main>
        <section className="max-w-3xl mx-auto px-5 pt-12 pb-14 text-center">
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight">
            Your NEET &amp; JEE study mentor, <span className="bg-gradient-to-r from-[#5B9FE8] to-[#E879A9] bg-clip-text text-transparent">always on</span>
          </h1>
          <p className="mt-4 text-[#6B6572] text-base sm:text-lg leading-relaxed">
            Doubt-solving that teaches you to think, mock tests, smart revision and progress tracking. Free to start.
          </p>
          <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/register" className="px-6 py-3 rounded-xl bg-gradient-to-br from-[#93C5FD] to-[#F5A9C8] text-white font-semibold shadow-[0_8px_24px_rgba(147,197,253,0.4)]">Create free account</Link>
            <Link to="/login" className="px-6 py-3 rounded-xl border border-[#EDE6F3] bg-white font-semibold hover:border-[#93C5FD]/60">I already have an account</Link>
          </div>
          <p className="mt-3 text-xs text-[#8B8594]">For students aged 13+. Under 18? A parent approves the AI mentor.</p>
        </section>

        <section className="max-w-5xl mx-auto px-5 pb-14 grid sm:grid-cols-2 gap-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="bg-white border border-[#EDE6F3] rounded-2xl p-5">
              <div className="w-9 h-9 rounded-xl bg-[#EBF5FF] text-[#3D7DC9] flex items-center justify-center mb-3"><f.icon size={18} /></div>
              <h2 className="font-semibold mb-1">{f.title}</h2>
              <p className="text-sm text-[#6B6572] leading-relaxed">{f.text}</p>
            </div>
          ))}
        </section>

        <section className="max-w-5xl mx-auto px-5 pb-14">
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-6">Plans</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-white border-2 border-[#93C5FD] rounded-2xl p-5">
              <p className="font-semibold">Free</p>
              <p className="text-2xl font-bold mt-1">₹0</p>
              <ul className="mt-3 space-y-1.5 text-sm text-[#6B6572]">
                {["5 AI doubts every day", "Mock tests & revision", "Notes & progress tracking"].map((t) => (
                  <li key={t} className="flex gap-2"><Check size={15} className="text-emerald-500 mt-0.5 shrink-0" />{t}</li>
                ))}
              </ul>
            </div>
            {["Pro", "Elite"].map((n) => (
              <div key={n} className="bg-white/60 border border-[#EDE6F3] rounded-2xl p-5">
                <p className="font-semibold">{n}</p>
                <p className="text-sm font-medium text-[#8B8594] mt-2">Coming soon</p>
                <p className="mt-3 text-sm text-[#8B8594] leading-relaxed">More daily doubts and deeper solving. We'll announce it here first.</p>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-5 pb-16 text-center">
          <p className="inline-flex items-center gap-2 text-sm text-[#6B6572]"><ShieldCheck size={16} className="text-[#5B9FE8]" /> Built with student safety in mind: age checks, parent approval for under-18s, and a caring response if you're ever overwhelmed.</p>
        </section>
      </main>

      <footer className="border-t border-[#EDE6F3] py-6 text-xs text-[#6B6572] text-center space-x-4">
        {Object.values(LEGAL).map((d) => <Link key={d.path} to={d.path} className="hover:underline">{d.title}</Link>)}
      </footer>
    </div>
  );
}
