// ============================================================
//  JNEET+ AI — pages/ParentConsent.jsx
//  Public page opened from the e-mail sent to a parent/guardian.
//    /parent-consent/:token          → review + approve
//    /parent-consent/revoke/:token   → withdraw approval
//  The token in the URL is the credential; nothing here needs a login.
// ============================================================

import { useEffect, useState } from "react";
import { useParams, Link }     from "react-router-dom";
import { consentApi }          from "../api/authApi.js";
import { AuthShell, SubmitButton, Notice } from "../components/auth/AuthShell.jsx";
import { Spinner }             from "../components/ui/Spinner.jsx";
import { CheckCircle2, ShieldCheck, XCircle } from "lucide-react";

function useLink(token, revoke) {
  const [state, setState] = useState({ loading: true, info: null, error: "" });
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await (revoke ? consentApi.describeRevoke(token) : consentApi.describeApprove(token));
        if (!cancelled) setState({ loading: false, info: res.data, error: "" });
      } catch (err) {
        if (cancelled) return;
        if (err.response?.status === 404) setState({ loading: false, info: { state: "invalid" }, error: "" });
        else setState({ loading: false, info: null, error: "We couldn't load this page. Please check your connection and try again." });
      }
    })();
    return () => { cancelled = true; };
  }, [token, revoke]);
  return state;
}

function Done({ icon, tone, title, children }) {
  return (
    <div className="text-center py-2 animate-fade-up">
      <div className={`mx-auto mb-3 flex justify-center ${tone}`} aria-hidden="true">{icon}</div>
      <h2 className="text-base font-semibold text-[#2D2A32] mb-1.5">{title}</h2>
      <p className="text-sm text-[#6B6572] leading-relaxed">{children}</p>
    </div>
  );
}

export default function ParentConsent({ revoke = false }) {
  const { token } = useParams();
  const { loading: loadingInfo, info, error: loadError } = useLink(token, revoke);

  const [isAdult, setIsAdult] = useState(false);
  const [agree,   setAgree]   = useState(false);
  const [busy,    setBusy]    = useState(false);
  const [error,   setError]   = useState("");
  const [done,    setDone]    = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!revoke && (!isAdult || !agree)) { setError("Please tick both boxes to continue."); return; }
    setBusy(true); setError("");
    try {
      if (revoke) await consentApi.revoke(token, { confirm: true });
      else await consentApi.approve(token, { isAdult: true, agree: true });
      setDone(true);
    } catch (err) {
      if (err.isNetworkError || err.isTimeout) setError("Can't reach the server. Please try again.");
      else setError(err.response?.data?.error || "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  let body;
  if (loadingInfo) {
    body = <div className="flex justify-center py-6"><Spinner size={22} /></div>;
  } else if (loadError) {
    body = <Notice tone="error">{loadError}</Notice>;
  } else if (info?.state === "invalid") {
    body = (
      <Done icon={<XCircle size={40} />} tone="text-red-400" title="This link isn't valid">
        It may have been used already or mistyped. If you want to approve or withdraw approval, ask your child to send a fresh link from their JNEET+ AI settings.
      </Done>
    );
  } else if (info?.state === "expired") {
    body = (
      <Done icon={<XCircle size={40} />} tone="text-amber-400" title="This link has expired">
        Approval links work for 7 days. Ask {info.studentName} to send a new one from the app.
      </Done>
    );
  } else if (info?.state === "already_granted") {
    body = (
      <Done icon={<CheckCircle2 size={40} />} tone="text-emerald-500" title="Already approved">
        You've already approved {info.studentName}'s use of the AI mentor. You can withdraw approval any time using the link in your confirmation email.
      </Done>
    );
  } else if (done && revoke) {
    body = (
      <Done icon={<CheckCircle2 size={40} />} tone="text-emerald-500" title="Approval withdrawn">
        The AI mentor is now turned off for {info.studentName}'s account. Mock tests, revision and notes still work.
      </Done>
    );
  } else if (done) {
    body = (
      <Done icon={<CheckCircle2 size={40} />} tone="text-emerald-500" title="Thank you — approved">
        {info.studentName} can now use the AI mentor. We've emailed you a link to withdraw approval whenever you wish.
      </Done>
    );
  } else if (revoke) {
    body = (
      <form onSubmit={submit} className="space-y-4">
        <p className="text-sm text-[#6B6572] leading-relaxed">
          You're about to withdraw your approval for <strong className="text-[#2D2A32]">{info.studentName}</strong> to use the JNEET+ AI mentor.
          The mentor will stop working for their account straight away. Their tests, revision and notes are not affected.
        </p>
        {error ? <Notice tone="error">{error}</Notice> : null}
        <SubmitButton loading={busy} loadingText="Withdrawing…">Withdraw approval</SubmitButton>
      </form>
    );
  } else {
    body = (
      <form onSubmit={submit} className="space-y-4">
        <p className="text-sm text-[#6B6572] leading-relaxed">
          <strong className="text-[#2D2A32]">{info.studentName}</strong> signed up for JNEET+ AI to prepare for {info.examMode}.
          Because they are under 18, we need a parent or legal guardian to approve the <strong>AI study mentor</strong>.
        </p>

        <div className="rounded-xl border border-[#EDE6F3] bg-[#FBF9FD] p-3.5 text-xs text-[#6B6572] leading-relaxed space-y-1.5">
          <p className="flex items-center gap-1.5 font-semibold text-[#2D2A32]"><ShieldCheck size={14} className="text-[#5B9FE8]" /> What you're approving</p>
          <ul className="list-disc pl-4 space-y-1">
            <li>{info.studentName} can ask the AI mentor study questions. It is an AI, can make mistakes, and is built to guide the student to think, not just hand over answers.</li>
            <li>Questions are sent to our AI provider to generate replies. We do not use them for advertising and do not sell them.</li>
            <li>Serious-distress messages get a caring reply with helpline information.</li>
            <li>You can withdraw approval at any time using the link in the confirmation email.</li>
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
          <span>I have read the above and approve {info.studentName}'s use of the AI mentor.</span>
        </label>

        {error ? <Notice tone="error">{error}</Notice> : null}
        <SubmitButton loading={busy} loadingText="Saving…">Approve</SubmitButton>
      </form>
    );
  }

  return (
    <AuthShell wide title={revoke ? "Withdraw approval" : "Parent / guardian approval"} subtitle="JNEET+ AI">
      {body}
    </AuthShell>
  );
}
