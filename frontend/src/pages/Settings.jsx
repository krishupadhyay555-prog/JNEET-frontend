// ============================================================
//  JNEET+ AI — pages/Settings.jsx  (v2 — accent picker enabled)
//  CHANGED:
//    - SectionCard now uses .glass-panel instead of a flat
//      bg-bg-card — this is the first real usage of the new
//      theme-aware glass utility (see index.css). Works correctly
//      in dark mode AND every light accent skin automatically,
//      since .glass-panel reads the same CSS variables that
//      already flip per-theme.
//    - The "Appearance" section's previously-disabled NEET
//      Green / JEE Blue / Mono swatch grid is now a REAL, working
//      Auto vs Normal picker, only shown when mode === "light"
//      (accent has no effect in dark mode). Auto's swatch
//      preview reflects the student's actual exam mode live.
//    - REMOVED: the Language (English/Hindi) section entirely —
//      product decision: a half-built "Hindi coming soon" toggle
//      was misleading (nothing actually translates yet) and picking
//      one language to promise first read as favoritism. The app
//      is English-only for now; this section, its state, and its
//      handler are all gone rather than left dead in the code.
//  Same logout/delete-account flows, same imports otherwise
//  (useAuth already provided examMode, just wasn't destructured
//  before).
// ============================================================

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Palette, LogOut, Check, Trash2, AlertTriangle } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import { Spinner } from "../components/ui/Spinner.jsx";
import toast from "react-hot-toast";

function SectionCard({ icon, title, subtitle, children }) {
  return (
    <div className="glass-panel rounded-2xl p-5 animate-fade-up">
      <div className="flex items-center gap-2.5 mb-1">
        <div className="w-8 h-8 rounded-lg bg-violet-600/15 border border-violet-600/20
          flex items-center justify-center shrink-0">
          {icon}
        </div>
        <h2 className="text-sm font-semibold text-fg-primary">{title}</h2>
      </div>
      {subtitle && <p className="text-[11px] text-gray-600 mb-4 ml-[42px]">{subtitle}</p>}
      <div className={subtitle ? "" : "mt-4"}>{children}</div>
    </div>
  );
}

export default function Settings() {
  const { examMode, logout, deleteAccount } = useAuth();
  const { mode, setMode, accentOverride, setAccentOverride } = useTheme();
  const navigate = useNavigate();

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deleting, setDeleting] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out");
    navigate("/login", { replace: true });
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      setDeleteError("Enter your password to confirm");
      return;
    }
    setDeleting(true);
    setDeleteError("");
    try {
      await deleteAccount(deletePassword);
      toast.success("Account deleted. Take care!");
      navigate("/login", { replace: true });
    } catch (err) {
      setDeleteError(err.response?.data?.error || "Could not delete account");
    } finally {
      setDeleting(false);
    }
  };

  // Auto-accent preview swatch reflects the student's real exam mode.
  const autoSwatch = examMode === "JEE"
    ? "bg-gradient-to-br from-[#EEF2FF] to-[#A5B4FC]"
    : "bg-gradient-to-br from-[#ECFDF5] to-[#5EEAD4]";
  const autoLabel = examMode === "JEE" ? "Auto — JEE Blue" : "Auto — NEET Green";

  return (
    <div className="min-h-screen bg-bg-base text-fg-primary">
      <nav className="border-b border-bg-border bg-bg-surface px-5 py-3.5 flex items-center gap-3 sticky top-0 z-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-gray-500 hover:text-fg-primary transition p-1.5 rounded-lg hover:bg-bg-hover"
          title="Back"
        >
          <ArrowLeft size={16} />
        </button>
        <span className="font-semibold text-sm">Settings</span>
      </nav>

      <div className="max-w-xl mx-auto px-5 py-8 space-y-5">

        {/* Theme */}
        <SectionCard
          icon={<Palette size={14} className="text-violet-400" />}
          title="Appearance"
          subtitle={
            mode === "light"
              ? "Light mode auto-tints itself to your exam mode. Prefer no color? Pick Normal below."
              : "Light/Dark mode is live. Switch to Light to choose an accent color."
          }
        >
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: "dark",  label: "Dark",  swatch: "bg-gradient-to-br from-[#2b2925] to-[#1a1917]" },
              { value: "light", label: "Light", swatch: "bg-gradient-to-br from-white to-[#EDE6F3]" },
            ].map((opt) => {
              const active = mode === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setMode(opt.value)}
                  className={`relative rounded-xl border p-3 text-center transition-all duration-200 active:scale-[0.97]
                    ${active ? "border-violet-600/50 bg-violet-600/10" : "border-bg-border bg-bg-panel hover:border-violet-600/30"}`}
                >
                  {active && (
                    <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-violet-600
                      flex items-center justify-center animate-scale-in">
                      <Check size={10} className="text-white" />
                    </div>
                  )}
                  <div className={`w-full h-8 rounded-lg mb-2 border border-bg-border ${opt.swatch}`} />
                  <p className="text-[11px] text-gray-400 font-medium">{opt.label}</p>
                </button>
              );
            })}
          </div>

          {/* Accent picker — only meaningful in light mode */}
          {mode === "light" && (
            <div className="grid grid-cols-2 gap-3 mt-3 animate-fade-up">
              {[
                { value: "auto",   label: autoLabel, swatch: autoSwatch },
                { value: "normal", label: "Normal (no color)", swatch: "bg-gradient-to-br from-gray-200 to-gray-500" },
              ].map((opt) => {
                const active = accentOverride === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setAccentOverride(opt.value)}
                    className={`relative rounded-xl border p-2.5 text-center transition-all duration-200 active:scale-[0.97]
                      ${active ? "border-violet-600/50 bg-violet-600/10" : "border-bg-border bg-bg-panel hover:border-violet-600/30"}`}
                  >
                    {active && (
                      <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-violet-600
                        flex items-center justify-center animate-scale-in">
                        <Check size={10} className="text-white" />
                      </div>
                    )}
                    <div className={`w-full h-6 rounded-md mb-1.5 ${opt.swatch}`} />
                    <p className="text-[10px] text-gray-600 font-medium">{opt.label}</p>
                  </button>
                );
              })}
            </div>
          )}
        </SectionCard>

        {/* Danger zone */}
        <SectionCard icon={<LogOut size={14} className="text-red-400" />} title="Account">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20
              border border-red-500/25 hover:border-red-500/40
              text-red-400 text-xs font-semibold px-4 py-2 rounded-xl
              transition-all duration-150 active:scale-95"
          >
            <LogOut size={13} />
            Log Out
          </button>
        </SectionCard>

        <SectionCard
          icon={<AlertTriangle size={14} className="text-red-400" />}
          title="Danger Zone"
          subtitle="This deactivates your account. Your data isn't permanently erased immediately — contact support within a reasonable window if this was a mistake."
        >
          {!deleteOpen ? (
            <button
              onClick={() => setDeleteOpen(true)}
              className="flex items-center gap-2 bg-bg-panel hover:bg-red-500/10
                border border-bg-border hover:border-red-500/40
                text-red-400 text-xs font-semibold px-4 py-2 rounded-xl
                transition-all duration-150 active:scale-95"
            >
              <Trash2 size={13} />
              Delete My Account
            </button>
          ) : (
            <div className="bg-red-500/5 border border-red-500/25 rounded-xl p-4 animate-scale-in">
              <p className="text-xs text-red-300 mb-3 leading-relaxed">
                Enter your password to permanently confirm this. This cannot be undone from within the app.
              </p>
              <input
                type="password"
                value={deletePassword}
                onChange={(e) => { setDeletePassword(e.target.value); setDeleteError(""); }}
                placeholder="Your password"
                className="w-full bg-bg-panel border border-bg-border rounded-xl px-4 py-2.5
                  text-sm text-fg-primary placeholder-gray-500 focus:outline-none
                  focus:border-red-500/60 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)] transition-all duration-200 mb-2"
              />
              {deleteError && <p className="text-red-400 text-xs mb-2">{deleteError}</p>}
              <div className="flex gap-2">
                <button
                  onClick={() => { setDeleteOpen(false); setDeletePassword(""); setDeleteError(""); }}
                  disabled={deleting}
                  className="flex-1 text-xs font-semibold px-4 py-2 rounded-xl border border-bg-border
                    text-gray-400 hover:text-fg-primary hover:bg-bg-hover transition-all duration-150"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                  className="flex-1 flex items-center justify-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl
                    bg-red-500/15 hover:bg-red-500/25 border border-red-500/40 text-red-300
                    transition-all duration-150 active:scale-95 disabled:opacity-50"
                >
                  {deleting ? <Spinner size={12} /> : <Trash2 size={12} />}
                  Confirm Delete
                </button>
              </div>
            </div>
          )}
        </SectionCard>

      </div>
    </div>
  );
}