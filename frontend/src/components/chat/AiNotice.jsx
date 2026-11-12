// ============================================================
//  JNEET+ AI — components/chat/AiNotice.jsx
//  Explains WHY the AI mentor can't answer right now, instead of a
//  generic error toast: daily limit reached, waiting for parent
//  approval, paused / locked after chat-rule breaks, or temporarily busy.
//  Always offers something useful to do.
// ============================================================

import { useState } from "react";
import { Link }     from "react-router-dom";
import toast        from "react-hot-toast";
import { consentApi } from "../../api/authApi.js";
import { aiApi }      from "../../api/aiApi.js";
import { Clock, ShieldCheck, CloudOff, PauseCircle, Lock, X } from "lucide-react";

const fmtWhen = (iso) => {
  const t = iso ? new Date(iso) : null;
  if (!t || Number.isNaN(t.getTime())) return null;
  return t.toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });
};

export function AiNotice({ notice, onDismiss, onUnlocked, onLockUpdate }) {
  const [sending, setSending] = useState(false);
  const [agreed, setAgreed] = useState(false);
  if (!notice) return null;

  const requestUnlock = async () => {
    setSending(true);
    try {
      const r = await aiApi.requestUnlock();
      if (r.data?.unlocked) {
        toast.success("AI chat unlocked. Padhai pe focus — all the best!");
        onUnlocked?.();
      } else if (r.data?.sentToParent) {
        toast.success("We emailed your parent/guardian the approval link.");
        if (r.data.lock) onLockUpdate?.(r.data.lock);
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Couldn't do that right now. Try again later.");
      if (err.response?.data?.lock) onLockUpdate?.(err.response.data.lock);
    } finally {
      setSending(false);
    }
  };

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
  } else if (notice.code === "CHAT_PAUSED") {
    icon = <PauseCircle size={16} />;
    title = "AI chat is paused for a short break";
    const t = notice.resumesAt ? new Date(notice.resumesAt) : null;
    const when = t && !Number.isNaN(t.getTime())
      ? t.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })
      : null;
    body = `This happened because 18+ content or abusive language isn't allowed on JNEET+ and it was repeated after warnings.${when ? ` The chat opens again at ${when}.` : ""} Tests, Revision and Notes keep working.`;
    actions = (
      <>
        <Link to="/revision" className="underline underline-offset-2 hover:opacity-80">Revise a chapter</Link>
        <Link to="/tests" className="underline underline-offset-2 hover:opacity-80">Take a mock test</Link>
      </>
    );
  } else if (notice.code === "CHAT_LOCKED") {
    const lock = notice.lock ?? {};
    icon = <Lock size={16} />;
    title = "AI chat is locked";
    const keep = "Tests, Revision and Notes keep working.";
    if (lock.unlockVia === "parent") {
      const mailed = fmtWhen(lock.parentEmailedAt);
      const resendAt = lock.canResendAt ? new Date(lock.canResendAt) : null;
      const canResend = !resendAt || resendAt.getTime() <= Date.now();
      body = `The chat rules were broken again after two warnings and two pauses, so the AI chat is locked. ${mailed ? `Your parent/guardian was emailed an approval link on ${mailed}.` : "Your parent/guardian needs to approve unlocking it."} It opens again when they approve. ${keep}`;
      actions = (
        <>
          <button type="button" onClick={requestUnlock} disabled={sending || !canResend} className="underline underline-offset-2 hover:opacity-80 disabled:opacity-50">
            {sending ? "Sending…" : canResend ? "Email my parent again" : `Email again after ${fmtWhen(lock.canResendAt)}`}
          </button>
          <Link to="/revision" className="underline underline-offset-2 hover:opacity-80">Revise a chapter</Link>
        </>
      );
    } else {
      const at = lock.unlockAvailableAt ? new Date(lock.unlockAvailableAt) : null;
      const ready = !at || at.getTime() <= Date.now();
      body = ready
        ? `The chat rules were broken again after two warnings and two pauses, so the AI chat was locked. You can unlock it now if you agree to the rules. ${keep}`
        : `The chat rules were broken again after two warnings and two pauses, so the AI chat is locked. You can ask to unlock it after ${fmtWhen(lock.unlockAvailableAt)}. ${keep}`;
      actions = ready ? (
        <div className="w-full space-y-2">
          <label className="flex items-start gap-2 text-[12px] font-normal text-fg-primary">
            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 accent-amber-500" />
            <span>I understand: no 18+ content and no abusive language. If it happens again, the chat locks again straight away.</span>
          </label>
          <button type="button" onClick={requestUnlock} disabled={!agreed || sending} className="rounded-lg bg-amber-500/90 px-3 py-1.5 text-[12px] font-semibold text-black hover:bg-amber-500 disabled:opacity-50">
            {sending ? "Unlocking…" : "Unlock AI chat"}
          </button>
        </div>
      ) : (
        <>
          <Link to="/revision" className="underline underline-offset-2 hover:opacity-80">Revise a chapter</Link>
          <Link to="/tests" className="underline underline-offset-2 hover:opacity-80">Take a mock test</Link>
        </>
      );
    }
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
