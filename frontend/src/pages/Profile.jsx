// ============================================================
//  JNEET+ AI — pages/Profile.jsx  (v2 — password rule synced)
//  FIXED: handlePasswordChange() was still checking the OLD
//  6-character-only rule ("New password must be at least 6
//  characters") — inconsistent with the strengthened rule already
//  applied to registration (authSchemas.js: 8+ chars, needs a
//  letter AND a number). A student could have "fixed" their
//  password here in a way that still failed if the backend's
//  userController.js enforces the same newer rule (that file
//  wasn't provided — flagging this, not guessing its contents).
//  Placeholder text updated to match. Also removed hardcoded
//  text-gray-500 → already fixed globally via the gray-scale CSS
//  variable change, no per-file action needed there.
//  Everything else — name update, account-info display — is
//  UNCHANGED.
// ============================================================

import { useState } from "react";
import { useGoBack } from "../hooks/useGoBack.js";
import { ArrowLeft, User, Lock, Calendar, Target, Save } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { Spinner } from "../components/ui/Spinner.jsx";
import { ChangePasswordSettings } from "../components/settings/ChangePasswordSettings.jsx";
import toast from "react-hot-toast";

function SectionCard({ icon, title, children }) {
  return (
    <div className="bg-bg-card border border-bg-border rounded-2xl p-5 animate-fade-up">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-lg bg-violet-600/15 border border-violet-600/20
          flex items-center justify-center shrink-0">
          {icon}
        </div>
        <h2 className="text-sm font-semibold text-fg-primary">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function TextField({ label, ...props }) {
  return (
    <div>
      <label className="text-xs text-gray-500 block mb-1.5 font-medium">{label}</label>
      <input
        {...props}
        className="w-full bg-bg-panel border border-bg-border rounded-xl px-4 py-2.5
          text-sm text-fg-primary placeholder-gray-500 focus:outline-none
          focus:border-violet-500/70 focus:shadow-glow-sm transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed"
      />
    </div>
  );
}

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const goBack = useGoBack();

  const [name, setName] = useState(user?.name ?? "");
  const [nameSaving, setNameSaving] = useState(false);

  const nameChanged = name.trim() !== "" && name.trim() !== user?.name;

  const handleNameSave = async () => {
    if (!nameChanged) return;
    if (name.trim().length < 2) {
      toast.error("Name must be at least 2 characters");
      return;
    }
    setNameSaving(true);
    try {
      await updateProfile({ name: name.trim() });
      toast.success("Name updated");
    } catch (err) {
      toast.error(err.response?.data?.error || "Could not update name");
    } finally {
      setNameSaving(false);
    }
  };

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })
    : "—";

  return (
    <div className="min-h-screen bg-bg-base text-fg-primary">
      <nav className="border-b border-bg-border bg-bg-surface px-5 py-3.5 flex items-center gap-3 sticky top-0 z-10">
        <button
          onClick={goBack}
          className="flex items-center gap-1.5 text-gray-500 hover:text-fg-primary transition p-1.5 rounded-lg hover:bg-bg-hover"
          title="Back"
        >
          <ArrowLeft size={16} />
        </button>
        <span className="font-semibold text-sm">Profile</span>
      </nav>

      <div className="max-w-xl mx-auto px-5 py-8 space-y-5">

        {/* Account info */}
        <SectionCard icon={<Calendar size={14} className="text-violet-400" />} title="Account Info">
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-gray-600 mb-1">Member since</p>
              <p className="text-fg-primary font-medium">{memberSince}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1 flex items-center gap-1">
                <Target size={11} /> Exam Mode
              </p>
              <p className="text-fg-primary font-medium">{user?.examMode}</p>
            </div>
          </div>
        </SectionCard>

        {/* Name */}
        <SectionCard icon={<User size={14} className="text-violet-400" />} title="Your Name">
          <div className="space-y-3">
            <TextField
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
            <TextField label="Email" value={user?.email ?? ""} disabled />
            <p className="text-[11px] text-gray-700">Email cannot be changed here — contact support if needed.</p>
            <button
              onClick={handleNameSave}
              disabled={!nameChanged || nameSaving}
              className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500
                disabled:opacity-40 disabled:cursor-not-allowed
                text-white text-xs font-semibold px-4 py-2 rounded-xl
                transition-all duration-150 active:scale-95"
            >
              {nameSaving ? <Spinner size={13} /> : <Save size={13} />}
              Save Name
            </button>
          </div>
        </SectionCard>

        {/* Password — same component (strength meter, show/hide) as Settings */}
        <SectionCard icon={<Lock size={14} className="text-violet-400" />} title="Change Password">
          <ChangePasswordSettings />
        </SectionCard>

      </div>
    </div>
  );
}