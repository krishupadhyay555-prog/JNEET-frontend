// ============================================================
//  JNEET+ AI — components/auth/AuthShell.jsx
//  One layout for every public auth/consent screen (login, register,
//  forgot password, parent approval…) so they can't drift apart.
//  Also exports the shared gradient submit button and notice box.
// ============================================================

import { Spinner } from "../ui/Spinner.jsx";
import { ArrowRight } from "lucide-react";

export function AuthShell({ title, subtitle, children, footer, wide = false }) {
  return (
    <div className="min-h-screen bg-[#FDFBFC] flex items-center justify-center px-4 py-8 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute -top-24 -left-24 w-[420px] h-[420px] bg-[#93C5FD]/25 rounded-full blur-[110px] animate-pulse-soft" />
        <div
          className="absolute -bottom-24 -right-24 w-[420px] h-[420px] bg-[#F5A9C8]/25 rounded-full blur-[110px] animate-pulse-soft"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <main className={`w-full ${wide ? "max-w-lg" : "max-w-sm"} relative animate-fade-up`}>
        <div className="bg-white border border-[#EDE6F3] rounded-2xl p-6 sm:p-7 shadow-[0_1px_3px_rgba(45,42,50,0.06),0_12px_32px_rgba(45,42,50,0.08)]">
          <div className="flex flex-col items-center mb-6">
            <div className="w-11 h-11 rounded-xl overflow-hidden mb-3 shadow-[0_6px_18px_rgba(147,197,253,0.4)]">
              <img src="/icon-192.png" alt="" width="44" height="44" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-[#2D2A32]">{title}</h1>
            {subtitle ? <p className="text-[#6B6572] text-xs mt-0.5 text-center">{subtitle}</p> : null}
          </div>

          {children}
          {footer ? <div className="text-center text-[#6B6572] text-xs mt-5">{footer}</div> : null}
        </div>
      </main>
    </div>
  );
}

export function SubmitButton({ loading, loadingText, children, disabled, type = "submit", onClick }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      className="w-full bg-gradient-to-br from-[#93C5FD] to-[#F5A9C8]
        hover:shadow-[0_8px_24px_rgba(147,197,253,0.45)]
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none
        text-white font-semibold py-2.5 rounded-xl transition-all duration-200
        flex items-center justify-center gap-2 text-sm
        active:scale-[0.98] motion-safe:hover:-translate-y-0.5 group"
    >
      {loading ? (
        <>
          <Spinner size={15} />
          <span>{loadingText}</span>
        </>
      ) : (
        <>
          <span>{children}</span>
          <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5" />
        </>
      )}
    </button>
  );
}

const TONES = {
  info:    "bg-[#EBF5FF] border-[#93C5FD]/40 text-[#2D6CB0]",
  success: "bg-[#ECFDF3] border-[#86EFAC]/50 text-[#166534]",
  warn:    "bg-[#FFF8EB] border-[#FCD34D]/50 text-[#92400E]",
  error:   "bg-[#FEF2F2] border-[#FCA5A5]/50 text-[#B91C1C]",
};

export function Notice({ tone = "info", children }) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={`${TONES[tone]} border text-xs rounded-xl px-3.5 py-2.5 mb-4 animate-fade-in leading-relaxed`}
    >
      {children}
    </div>
  );
}
