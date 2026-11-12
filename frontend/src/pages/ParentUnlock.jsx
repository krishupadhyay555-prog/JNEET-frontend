// ============================================================
//  JNEET+ AI — pages/ParentUnlock.jsx
//  Public page opened from the "AI study chat locked" email that a
//  parent/guardian of an under-18 student receives after repeated
//  chat-rule breaks.  /parent-unlock/:token
//  The token in the URL is the credential; nothing here needs a login.
//  It never shows the student's messages — we don't keep them.
// ============================================================

import { useEffect, useState } from "react";
import { useParams, Link }     from "react-router-dom";
import { consentApi }          from "../api/authApi.js";
import { AuthShell, SubmitButton, Notice } from "../components/auth/AuthShell.jsx";
import { Spinner }             from "../components/ui/Spinner.jsx";
import { CheckCircle2, ShieldCheck, XCircle } from "lucide-react";

function Done({ icon, tone, title, children }) {
  return (
    <div className="text-center py-2 animate-fade-up">
      <div className={`mx-auto mb-3 flex justify-center ${tone}`} aria-hidden="true">{icon}</div>
      <h2 className="text-base font-semibold text-[#2D2A32] mb-1.5">{title}</h2>
      <p className="text-sm text-[#6B6572] leading-relaxed">{children}</p>
    </div>
  );
}

export default function ParentUnlock() {
  const { token } = useParams();
  const [load, setLoad] = useState({ loading: true, info: null, error: "" });
  const [isAdult, setIsAdult] = useState(false);
  const [agree,   setAgree]   = useState(false);
  const [busy,    setBusy]    = useState(false);
  const [error,   setError]   = useState("");
  const [done,    setDone]    = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await consentApi.describeUnlock(token);
        if (!cancelled) setLoad({ loading: false, info: res.data, error: "" });
      } catch (err) {
        if (cancelled) return;
        if (err.response?.status === 404) setLoad({ loading: false, info: { state: "invalid" }, error: "" });
        else setLoad({ loading: false, info: null, error: "We couldn't load this page. Please check your connection and try again." });
      }
    })();
    return () => { cancelled = true; };
  }, [token]);

  const submit = async (e) => {
    e.preventDefault();
    if (!isAdult || !agree) { setError("Please tick both boxes to continue."); return; }
    setBusy(true); setError("");
    try {
      await consentApi.unlock(token, { isAdult: true, agree: true });
      setDone(true);
    } catch (err) {
      if (err.isNetworkError || err.isTimeout) setError("Can't reach the server. Please try again.");
      else setError(err.response?.data?.error || "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const { loading, info, error: loadError } = load;
  let body;
  if (loading) {
    body = <div className="flex justify-center py-6"><Spinner size={22} /></div>;
  } else if (loadError) {
    body = <Notice tone="error">{loadError}</Notice>;
  } else if (info?.state === "invalid") {
    body = (
      <Done icon={<XCircle size={40} />} tone="text-red-400" title="This link isn't valid">
        It may have been used already, replaced by a newer link, or mistyped. Your child can ask for a fresh link from the AI chat screen.
      </Done>
    );
  } else if (info?.state === "expired") {
    body = (
      <Done icon={<XCircle size={40} />} tone="text-amber-400" title="This link has expired">
        Unlock links work for 7 days. {info.studentName} can ask for a new one from the AI chat screen.
      </Done>
    );
  } else if (info?.state === "already_unlocked" || done) {
    body = (
      <Done icon={<CheckCircle2 size={40} />} tone="text-emerald-500" title={done ? "Thank you — AI chat unlocked" : "Already unlocked"}>
        {info.studentName} can use the AI study mentor again. If the chat rules are broken again, it will lock again straight away and you will get another email.
      </Done>
    );
  } else {
    body = (
      <form onSubmit={submit} className="space-y-4">
        <p className="text-sm text-[#6B6572] leading-relaxed">
          The AI study chat on <strong className="text-[#2D2A32]">{info.studentName}</strong>'s JNEET+ AI account was locked after
          repeated breaks of our chat rules, even after two warnings and two pauses.
        </p>

        <div className="rounded-xl border border-[#EDE6F3] bg-[#FBF9FD] p-3.5 text-xs text-[#6B6572] leading-relaxed space-y-1.5">
          <p className="flex items-center gap-1.5 font-semibold text-[#2D2A32]"><ShieldCheck size={14} className="text-[#5B9FE8]" /> Good to know</p>
          <ul className="list-disc pl-4 space-y-1">
            <li>The chat rules: no 18+ content and no abusive language. Questions about the syllabus (including reproduction and health topics) are always allowed.</li>
            <li>We do not keep the messages — only the kind of rule and the time.</li>
            <li>Mock tests, revision and notes keep working whether you unlock or not.</li>
            <li>If you unlock and the rules are broken again, the chat locks again straight away.</li>
          </ul>
          <p>
            Read the full <Link to="/privacy" target="_blank" rel="noopener" className="text-[#5B9FE8] hover:underline font-medium">Privacy Policy</Link>{" "}
            and <Link to="/terms" target="_blank" rel="noopener" className="text-[#5B9FE8] hover:underline font-medium">Terms</Link>.
          </p>
        </div>

        <label className="flex items-start gap-2.5 text-xs text-[#6B6572] leading-relaxed cursor-pointer">
          <input type="checkbox" checked={isAdult} onChange={(e) => { setIsAdult(e.target.checked); setError(""); }}
            className="mt-0.5 h-4 w-4 accent-[#5B9FE8] shrink-0" />
          <span>I am {info.studentName}'s parent or legal guardian and I am 18 or older.</span>
        </label>
        <label className="flex items-start gap-2.5 text-xs text-[#6B6572] leading-relaxed cursor-pointer">
          <input type="checkbox" checked={agree} onChange={(e) => { setAgree(e.target.checked); setError(""); }}
            className="mt-0.5 h-4 w-4 accent-[#5B9FE8] shrink-0" />
          <span>I have spoken to {info.studentName} about the chat rules and I want to unlock the AI chat.</span>
        </label>

        {error ? <Notice tone="error">{error}</Notice> : null}
        <SubmitButton loading={busy} loadingText="Unlocking…">Unlock AI chat</SubmitButton>
      </form>
    );
  }

  return (
    <AuthShell wide title="AI study chat locked" subtitle="JNEET+ AI">
      {body}
    </AuthShell>
  );
}
