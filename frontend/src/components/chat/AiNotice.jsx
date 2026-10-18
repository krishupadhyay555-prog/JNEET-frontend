// ============================================================
//  JNEET+ AI — components/chat/AiNotice.jsx
//  Explains WHY the AI mentor can't answer right now, instead of a
//  generic error toast: daily limit reached, waiting for parent
//  approval, or temporarily busy. Always offers something useful to do.
// ============================================================

import { useState } from "react";
import { Link }     from "react-router-dom";
import toast        from "react-hot-toast";
import { consentApi } from "../../api/authApi.js";
import { Clock, ShieldCheck, CloudOff, X } from "lucide-react";

export function AiNotice({ notice, onDismiss }) {
  const [sending, setSending] = useState(false);
  if (!notice) return null;

  const resendParent = async () => {
    setSending(true);
    try {
      await consentApi.resend();
      toast.success("We emailed your parent a new approval link.");
    } catch (err) {
      toast.error(err.response?.data?.error || "Couldn't send the email right now. Try again later.");
    } finally {
      setSending(false);
    }
  };

  let icon = <CloudOff size={16} />;
  let title = "The AI mentor is unavailable";
  let body = notice.message;
  let actions = null;

  if (notice.code === "DAILY_LIMIT") {
    icon = <Clock size={16} />;
    title = "You've used today's free doubts";
    body = notice.limit
      ? `All ${notice.limit} free AI doubts for today are done. They reset at midnight (IST).`
      : "Today's free AI doubts are done. They reset at midnight (IST).";
    actions = (
      <>
        <Link to="/tests" className="underline underline-offset-2 hover:opacity-80">Take a mock test</Link>
        <Link to="/revision" className="underline underline-offset-2 hover:opacity-80">Revise your weak topics</Link>
      </>
    );
  } else if (notice.code === "PARENT_CONSENT_REQUIRED") {
    icon = <ShieldCheck size={16} />;
    title = "Waiting for parent approval";
    body = "Because you're under 18, a parent or guardian needs to approve the AI mentor. Tests, revision and notes are open in the meantime.";
    actions = (
      <>
        <button type="button" onClick={resendParent} disabled={sending} className="underline underline-offset-2 hover:opacity-80 disabled:opacity-50">
          {sending ? "Sending…" : "Email my parent again"}
        </button>
        <Link to="/settings" className="underline underline-offset-2 hover:opacity-80">Change parent's email</Link>
      </>
    );
  } else if (notice.code === "AI_BUSY") {
    title = "The AI mentor is very busy today";
  }

  return (
    <div role="status" className="mx-auto w-full max-w-3xl mb-2 rounded-xl border border-amber-500/30 bg-amber-500/10 text-fg-primary px-3.5 py-3 text-[13px] leading-relaxed animate-fade-up flex gap-2.5">
      <span className="mt-0.5 text-amber-500 shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="font-semibold">{title}</p>
        <p className="text-gray-400">{body}</p>
        {actions ? <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-[12px] font-medium">{actions}</div> : null}
      </div>
      {onDismiss ? (
        <button type="button" onClick={onDismiss} aria-label="Dismiss" className="text-gray-500 hover:text-fg-primary self-start p-0.5">
          <X size={14} />
        </button>
      ) : null}
    </div>
  );
}
