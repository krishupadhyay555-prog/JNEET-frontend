// ============================================================
//  JNEET+ AI — pages/ParentPay.jsx  (/pay/:token, public, B4)
//  A parent/guardian opens the link their child shared, picks a plan
//  and pays with Razorpay. No login: the signed 7-day token in the
//  URL says which student gets the plan. Only the student's first
//  name is shown.
// ============================================================

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle2, XCircle } from "lucide-react";
import { AuthShell, SubmitButton, Notice } from "../components/auth/AuthShell.jsx";
import { Spinner } from "../components/ui/Spinner.jsx";
import { paymentApi } from "../api/paymentApi.js";
import { isAppShell } from "../utils/appShell.js";
import { loadCheckout, openCheckout, rupees, istDate } from "../utils/razorpay.js";

const NAMES = { pro: "Pro", elite: "Elite" };

export default function ParentPay() {
  const { token } = useParams();
  const [info, setInfo] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [invalid, setInvalid] = useState("");
  const [planId, setPlanId] = useState("pro_4m");
  const [isParent, setIsParent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(null);

  useEffect(() => {
    let cancelled = false;
    paymentApi.parentInfo(token)
      .then((r) => { if (!cancelled) setInfo(r.data); })
      .catch((err) => {
        if (cancelled) return;
        const s = err.response?.status;
        if (s === 404 || s === 410) setInvalid(err.response.data?.error || "This payment link is not valid.");
        else setLoadError("We couldn't load this page. Please check your connection and try again.");
      });
    return () => { cancelled = true; };
  }, [token]);

  const pay = async (e) => {
    e.preventDefault();
    if (!isParent) { setError("Please confirm you are the parent or guardian."); return; }
    setBusy(true); setError("");
    try {
      if (!(await loadCheckout())) { setError("The payment page couldn't load. Please check your connection and try again."); return; }
      const { data: order } = await paymentApi.parentOrder(token, planId);
      const paid = await openCheckout(order);
      if (!paid) return;
      try {
        const { data } = await paymentApi.parentVerify(token, paid);
        setDone(data.applied ? data : { pending: true });
      } catch {
        setDone({ pending: true });
      }
    } catch (err) {
      if (err.isNetworkError || err.isTimeout) setError("Can't reach the server. Please try again.");
      else setError(err.response?.data?.error || "The payment couldn't start. Please try again in a minute.");
    } finally {
      setBusy(false);
    }
  };

  let body;
  if (isAppShell()) {
    body = <Notice tone="info">Please open this link in your phone's browser.</Notice>;
  } else if (invalid) {
    body = (
      <div className="text-center py-2">
        <XCircle size={40} className="mx-auto mb-3 text-red-400" />
        <p className="text-sm text-[#6B6572] leading-relaxed">{invalid}</p>
      </div>
    );
  } else if (loadError) {
    body = <Notice tone="error">{loadError}</Notice>;
  } else if (!info) {
    body = <div className="flex justify-center py-6"><Spinner size={22} /></div>;
  } else if (done) {
    body = (
      <div className="text-center py-2 animate-fade-up">
        <CheckCircle2 size={40} className="mx-auto mb-3 text-emerald-500" />
        <h2 className="text-base font-semibold text-[#2D2A32] mb-1.5">Thank you — payment received</h2>
        <p className="text-sm text-[#6B6572] leading-relaxed">
          {done.pending
            ? `We're confirming the payment. ${info.studentFirstName}'s plan will turn on within a few minutes, and a receipt will be emailed.`
            : `${info.studentFirstName}'s ${NAMES[done.plan]} plan is active till ${istDate(done.expiresAt)}. A receipt has been emailed to you.`}
        </p>
      </div>
    );
  } else if (!info.catalog.enabled) {
    body = <Notice tone="info">Paid plans are not open yet. Please try again in a few days.</Notice>;
  } else {
    const plans = info.catalog.plans;
    const chosen = plans.find((p) => p.id === planId);
    body = (
      <form onSubmit={pay} className="space-y-4">
        <p className="text-sm text-[#6B6572] leading-relaxed">
          {info.studentFirstName} ({info.examMode === "JEE" ? "JEE Main" : "NEET UG"}) has asked you to buy a JNEET+ AI plan.
          {info.plan !== "free" && info.expiresAt ? ` Their ${NAMES[info.plan]} plan is active till ${istDate(info.expiresAt)}; a new pass adds days on top.` : ""}
        </p>

        <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Plan">
          {plans.map((p) => {
            const lower = info.plan === "elite" && p.tier === "pro";
            return (
              <button type="button" key={p.id} role="radio" aria-checked={planId === p.id} disabled={lower}
                onClick={() => setPlanId(p.id)}
                className={`text-left rounded-xl border p-3 transition disabled:opacity-40 ${planId === p.id ? "border-[#93C5FD] bg-[#EBF5FF]" : "border-[#EDE6F3] hover:border-[#93C5FD]/60"}`}>
                <span className="block text-sm font-semibold text-[#2D2A32]">{NAMES[p.tier]} · {p.months} month{p.months > 1 ? "s" : ""}</span>
                <span className="block text-xs text-[#6B6572]">{rupees(p.amount)}{p.months > 1 ? ` (${rupees(p.perMonth)}/mo)` : ""}</span>
              </button>
            );
          })}
        </div>

        <ul className="text-xs text-[#6B6572] space-y-1">
          {(info.catalog.features[chosen?.tier] ?? []).map((f) => <li key={f}>• {f}</li>)}
        </ul>

        <label className="flex gap-2 text-xs text-[#2D2A32] items-start">
          <input type="checkbox" checked={isParent} onChange={(e) => setIsParent(e.target.checked)} className="mt-0.5" />
          <span>I am {info.studentFirstName}'s parent or legal guardian, aged 18 or above, and I agree to the{" "}
            <Link to="/terms" className="underline">Terms</Link> and <Link to="/refund" className="underline">Refund Policy</Link>{" "}
            (prepaid pass, no auto-renewal, non-refundable except for our errors).</span>
        </label>

        {error && <Notice tone="error">{error}</Notice>}
        <SubmitButton loading={busy} loadingText="Opening payment…">Pay {chosen ? rupees(chosen.amount) : ""}</SubmitButton>
        <p className="text-[11px] text-center text-[#8B8594]">Secure payment by Razorpay (UPI, cards, netbanking). We never see your card or UPI details.</p>
      </form>
    );
  }

  return (
    <AuthShell title="JNEET+ AI plan" subtitle={info ? `For ${info.studentFirstName}` : "Parent payment"} wide>
      {body}
    </AuthShell>
  );
}
