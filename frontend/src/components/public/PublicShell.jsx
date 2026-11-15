// ============================================================
//  JNEET+ AI — components/public/PublicShell.jsx
//  Header + footer shared by every public page (home, About, Pricing,
//  Contact, legal pages). Calm, editorial look: warm paper background,
//  ink text, one teal accent. The footer carries every page Razorpay
//  and the DPDP rules expect (About, Contact, Pricing, Terms, Privacy,
//  Refund, Delivery) and the plain-language AI disclosure.
// ============================================================

import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { BUSINESS, LEGAL } from "../../legal/content.js";

export const INK = "text-[#17161C]";
export const MUTED = "text-[#5F5B67]";

const NAV = [
  ["/about", "About"],
  ["/pricing", "Pricing"],
  ["/contact", "Contact"],
];

export function Logo({ to = "/" }) {
  return (
    <Link to={to} className="flex items-center gap-2.5 shrink-0" aria-label={`${BUSINESS.product} home`}>
      <img src="/icon-192.png" alt="" width="32" height="32" className="rounded-[9px] shadow-sm" />
      <span className="font-bold tracking-tight text-[17px] text-[#17161C]">JNEET<span className="text-[#0D9488]">+</span> AI</span>
    </Link>
  );
}

export function PrimaryButton({ to, children, className = "" }) {
  return (
    <Link to={to} className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#0D9488] hover:bg-[#0F766E] text-white font-semibold shadow-[0_6px_20px_-6px_rgba(13,148,136,0.55)] transition-colors ${className}`}>
      {children}
    </Link>
  );
}

export function SecondaryButton({ to, children, className = "" }) {
  return (
    <Link to={to} className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-[#E2DED6] bg-white hover:border-[#0D9488]/50 text-[#17161C] font-semibold transition-colors ${className}`}>
      {children}
    </Link>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const link = ({ isActive }) => `px-3 py-2 rounded-lg text-[14px] font-medium transition-colors ${isActive ? "text-[#0D9488]" : "text-[#3A3741] hover:text-[#17161C] hover:bg-black/[0.03]"}`;
  return (
    <header className="sticky top-0 z-30 bg-[#F6F5F2]/85 backdrop-blur-md border-b border-[#E7E4DD]/70">
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between gap-4">
        <Logo />
        <nav className="hidden md:flex items-center gap-1" aria-label="Main">
          {NAV.map(([to, label]) => <NavLink key={to} to={to} className={link}>{label}</NavLink>)}
        </nav>
        <div className="hidden md:flex items-center gap-2">
          <Link to="/login" className="px-3.5 py-2 rounded-lg text-[14px] font-semibold text-[#17161C] hover:bg-black/[0.04]">Log in</Link>
          <Link to="/register" className="px-4 py-2 rounded-lg text-[14px] font-semibold bg-[#17161C] text-white hover:bg-black">Start free</Link>
        </div>
        <button className="md:hidden p-2 -mr-2 rounded-lg text-[#17161C]" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label="Menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-[#E7E4DD] bg-[#F6F5F2] px-5 py-3 space-y-1">
          {NAV.map(([to, label]) => (
            <NavLink key={to} to={to} onClick={() => setOpen(false)} className="block px-2 py-2.5 rounded-lg text-[15px] font-medium text-[#17161C]">{label}</NavLink>
          ))}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <SecondaryButton to="/login" className="py-2.5">Log in</SecondaryButton>
            <PrimaryButton to="/register" className="py-2.5">Start free</PrimaryButton>
          </div>
        </div>
      )}
    </header>
  );
}

function Footer() {
  const col = "space-y-2.5";
  const a = "block text-[13.5px] text-[#5F5B67] hover:text-[#17161C] transition-colors";
  return (
    <footer className="border-t border-[#E7E4DD] bg-[#EFEDE7]/60 mt-8">
      <div className="max-w-6xl mx-auto px-5 py-12 grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="space-y-3">
          <Logo />
          <p className="text-[13.5px] leading-relaxed text-[#5F5B67] max-w-xs">
            An AI study mentor, practice tests and revision for NEET UG and JEE Main students in India.
          </p>
        </div>
        <div className={col}>
          <p className="text-[12px] font-semibold uppercase tracking-wider text-[#17161C]">Product</p>
          <Link to="/about" className={a}>About us</Link>
          <Link to="/pricing" className={a}>Pricing</Link>
          <Link to="/register" className={a}>Create free account</Link>
          <Link to="/login" className={a}>Log in</Link>
        </div>
        <div className={col}>
          <p className="text-[12px] font-semibold uppercase tracking-wider text-[#17161C]">Help</p>
          <Link to="/contact" className={a}>Contact us</Link>
          <Link to="/contact?topic=grievance" className={a}>Grievance Officer</Link>
          <Link to="/contact?topic=privacy" className={a}>Privacy request</Link>
        </div>
        <div className={col}>
          <p className="text-[12px] font-semibold uppercase tracking-wider text-[#17161C]">Legal</p>
          {Object.values(LEGAL).map((d) => <Link key={d.path} to={d.path} className={a}>{d.short || d.title}</Link>)}
        </div>
      </div>
      <div className="border-t border-[#E2DED6]">
        <div className="max-w-6xl mx-auto px-5 py-5 text-[12px] leading-relaxed text-[#6E6A76] space-y-1.5">
          <p>AI answers are generated with OpenAI's GPT models through the OpenAI API, following our own teaching rules. AI can make mistakes — check important facts against NCERT and official sources.</p>
          <p>{BUSINESS.product} is an independent product and is not affiliated with or endorsed by NTA, NMC, any IIT, OpenAI, or any coaching institute.</p>
          <p>© {new Date().getFullYear()} {BUSINESS.operator}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export function PublicShell({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#F6F5F2] text-[#17161C] antialiased" style={{ fontFamily: "var(--font-sans)" }}>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-white px-3 py-2 rounded-lg z-50">Skip to content</a>
      <Header />
      <main id="main" className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

// Page title band used by About / Pricing / Contact / legal pages.
export function PageHero({ eyebrow, title, children }) {
  return (
    <section className="max-w-6xl mx-auto px-5 pt-14 pb-10 sm:pt-20 sm:pb-12">
      {eyebrow && <p className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-[#0D9488] mb-3">{eyebrow}</p>}
      <h1 className="text-[34px] sm:text-[48px] font-bold tracking-tight leading-[1.08] max-w-3xl">{title}</h1>
      {children && <div className="mt-4 text-[16.5px] sm:text-[18px] leading-relaxed text-[#5F5B67] max-w-2xl">{children}</div>}
    </section>
  );
}
