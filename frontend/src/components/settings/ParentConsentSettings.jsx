// ============================================================
//  JNEET+ AI — components/settings/ParentConsentSettings.jsx
//  Only shown for under-18 students: approval status, resend the e-mail,
//  or fix a wrong parent address.
// ============================================================

import { useState } from "react";
import toast        from "react-hot-toast";
import { useAuth }  from "../../context/AuthContext.jsx";
import { consentApi } from "../../api/authApi.js";
import { Spinner }  from "../ui/Spinner.jsx";

const STATUS = {
  granted:  { label: "Approved",          cls: "text-emerald-500" },
  pending:  { label: "Waiting for parent", cls: "text-amber-500" },
  revoked:  { label: "Approval withdrawn", cls: "text-red-400" },
};

export function ParentConsentSettings() {
  const { user, setStudent } = useAuth();
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const c = user?.consent;
  if (!c || c.ageGroup !== "minor") return null;

  const st = STATUS[c.parentStatus] ?? STATUS.pending;

  const resend = async () => {
    setBusy(true);
    try {
      await consentApi.resend();
      toast.success("We emailed your parent a new approval link.");
    } catch (err) {
      toast.error(err.response?.data?.error || "Couldn't send the email right now.");
    } finally { setBusy(false); }
  };

  const saveEmail = async (e) => {
    e.preventDefault();
    const v = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { setError("Enter a valid email address"); return; }
    setBusy(true); setError("");
    try {
      const res = await consentApi.changeParent({ parentEmail: v });
      if (res.data.student) setStudent(res.data.student);
      toast.success("Parent email updated and approval link sent.");
      setEditing(false); setEmail("");
    } catch (err) {
      setError(err.response?.data?.fieldErrors?.[0]?.message || err.response?.data?.error || "Couldn't update. Try again.");
    } finally { setBusy(false); }
  };

  return (
    <div className="space-y-3 text-xs">
      <p className="text-gray-500 leading-relaxed">
        Because you're under 18, a parent or guardian approves the AI mentor. Tests, revision and notes work regardless.
      </p>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <span>Status: <strong className={st.cls}>{st.label}</strong></span>
        {c.parentEmailMasked ? <span className="text-gray-500">Parent: {c.parentEmailMasked}</span> : null}
      </div>

      {c.parentStatus !== "granted" && !editing ? (
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={resend} disabled={busy}
            className="border border-bg-border hover:bg-bg-hover text-fg-primary font-semibold px-3.5 py-2 rounded-xl transition disabled:opacity-50 flex items-center gap-2">
            {busy ? <Spinner size={12} /> : null} Email my parent again
          </button>
          <button type="button" onClick={() => setEditing(true)}
            className="border border-bg-border hover:bg-bg-hover text-gray-400 px-3.5 py-2 rounded-xl transition">
            Wrong email? Change it
          </button>
        </div>
      ) : null}

      {editing ? (
        <form onSubmit={saveEmail} className="space-y-2 animate-fade-up">
          <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }}
            placeholder="parent@example.com" autoCapitalize="none" spellCheck={false}
            aria-label="Parent or guardian email"
            className="w-full bg-bg-panel border border-bg-border rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-fg-primary placeholder-gray-500 focus:outline-none focus:border-violet-500/60" />
          {error ? <p role="alert" className="text-red-400">{error}</p> : null}
          <div className="flex gap-2">
            <button type="button" onClick={() => { setEditing(false); setError(""); }} disabled={busy}
              className="flex-1 border border-bg-border text-gray-400 hover:bg-bg-hover rounded-xl py-2 transition">Cancel</button>
            <button type="submit" disabled={busy}
              className="flex-1 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl py-2 transition disabled:opacity-50">
              {busy ? "Saving…" : "Save & send"}
            </button>
          </div>
        </form>
      ) : null}
    </div>
  );
}
