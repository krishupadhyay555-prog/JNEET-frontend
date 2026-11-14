// ============================================================
//  JNEET+ AI — pages/Plans.jsx  (/plans, B4 — web only)
//  Free / Pro / Elite, 1 month or 4 months, prepaid, no auto-renew,
//  non-refundable. Adults pay here with Razorpay; under-18s (and
//  anyone who wants a parent to pay) share a 7-day parent link.
//  Inside the Play Store app (TWA) this page only shows the current
//  plan — no prices, no buttons, no "buy on the website" hint.
// ============================================================

import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, Check, Crown, Gem, Leaf, Share2, Copy, ShieldCheck, Receipt, Info } from "lucide-react";
import { useGoBack } from "../hooks/useGoBack.js";
import { useAuth } from "../context/AuthContext.jsx";
import { paymentApi } from "../api/paymentApi.js";
import { Spinner } from "../components/ui/Spinner.jsx";
import { isAppShell } from "../utils/appShell.js";
import { loadCheckout, openCheckout, rupees, istDate } from "../utils/razorpay.js";

const TIER_META = {
  free:  { name: "Free",  icon: Leaf,  tone: "text-emerald-600 bg-emerald-500/10" },
  pro:   { name: "Pro",   icon: Gem,   tone: "text-violet-600 bg-violet-600/10" },
  elite: { name: "Elite", icon: Crown, tone: "text-amber-600 bg-amber-500/10" },
};
const RANK = { free: 0, pro: 1, elite: 2 };

function errorText(err, fallback) {
  if (err?.isNetworkError || err?.isTimeout) return "Your internet seems slow or offline. Check the connection and try again.";
  return err?.response?.data?.error || fallback;
}

export function CurrentPlanBanner({ me }) {
  const meta = TIER_META[me.plan] ?? TIER_META.free;
  const Icon = meta.icon;
  const [now] = useState(() => Date.now());
  const daysLeft = me.expiresAt ? Math.max(0, Math.ceil((new Date(me.expiresAt) - now) / 86400000)) : null;
  return (
    <div className="glass-panel rounded-2xl p-4 flex items-center gap-3">
      <span className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${meta.tone}`}><Icon size={18} /></span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold">Current plan: {meta.name}</p>
        <p className="text-[11px] text-gray-600 mt-0.5">
          {me.plan === "free"
            ? (me.lapsedAt ? `Your last pass ended on ${istDate(me.lapsedAt)}.` : "Free forever — no card needed.")
            : me.expiresAt
              ? `Active till ${istDate(me.expiresAt)} · ${daysLeft} day${daysLeft === 1 ? "" : "s"} left · no auto-renew`
              : "Active (no end date)"}
        </p>
      </div>
    </div>
  );
}

export default function Plans() {
  const goBack = useGoBack();
  const { refreshUser } = useAuth();
  const inApp = isAppShell();

  const [catalog, setCatalog] = useState(null);
  const [me, setMe] = useState(null);
  const [error, setError] = useState("");
  const [duration, setDuration] = useState("4m");
  const [busy, setBusy] = useState(null);          // planId being paid
  const [confirming, setConfirming] = useState(false);
  const [success, setSuccess] = useState(null);
  const [link, setLink] = useState(null);
  const [linkBusy, setLinkBusy] = useState(false);

  const loadMe = useCallback(async () => {
    const r = await paymentApi.mine();
    setMe(r.data);
    return r.data;
  }, []);

  useEffect(() => {
    let cancelled = false;
    Promise.all([paymentApi.plans(), paymentApi.mine()])
      .then(([p, m]) => { if (!cancelled) { setCatalog(p.data); setMe(m.data); } })
      .catch((err) => { if (!cancelled) setError(errorText(err, "Couldn't load the plans. Please try again.")); });
    return () => { cancelled = true; };
  }, []);

  // After a payment, if the server is still confirming, check a few times.
  const waitForPlan = async (planBefore, expiresBefore) => {
    for (let i = 0; i < 10; i += 1) {
      await new Promise((r) => setTimeout(r, 3000));
      try {
        const m = await loadMe();
        if (m.plan !== planBefore || m.expiresAt !== expiresBefore) return m;
      } catch { /* keep trying */ }
    }
    return null;
  };

  const buy = async (plan) => {
    setBusy(plan.id);
    try {
      const ok = await loadCheckout();
      if (!ok) { toast.error("The payment window didn't open. Check your internet and try again."); return; }
      const { data: order } = await paymentApi.order(plan.id);
      const paid = await openCheckout(order);
      if (!paid) return; // closed the window — nothing charged
      setConfirming(true);
      const before = { plan: me.plan, expiresAt: me.expiresAt };
      try {
        await paymentApi.verify(paid);
        const m = await loadMe();
        setSuccess(m);
      } catch (err) {
        const m = await waitForPlan(before.plan, before.expiresAt);
        if (m) setSuccess(m);
        else toast.error(errorText(err, "Payment received — we're confirming it. Your plan will turn on by itself within 5 minutes, and a receipt will be emailed."), { duration: 9000 });
      }
      await refreshUser().catch(() => {});
    } catch (err) {
      toast.error(errorText(err, "Couldn't start the payment. Please try again in a moment."), { duration: 6000 });
    } finally {
      setBusy(null);
      setConfirming(false);
    }
  };

  const makeLink = async () => {
    setLinkBusy(true);
    try {
      const { data } = await paymentApi.parentLink();
      setLink(data);
    } catch (err) {
      toast.error(errorText(err, "Couldn't create the link. Please try again."));
    } finally {
      setLinkBusy(false);
    }
  };

  const shareLink = async () => {
    const text = "JNEET+ AI plan payment link (valid for 7 days):";
    if (navigator.share) {
      try { await navigator.share({ title: "JNEET+ AI plan", text, url: link.url }); return; } catch { /* cancelled */ }
    }
    try { await navigator.clipboard.writeText(link.url); toast.success("Link copied"); } catch { toast.error("Couldn't copy — please select the link and copy it."); }
  };

  const plansFor = (tier) => catalog?.plans.find((p) => p.tier === tier && p.duration === duration);

  return (
    <div className="min-h-screen bg-bg-base text-fg-primary">
      <nav className="border-b border-bg-border bg-bg-surface px-5 py-3.5 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={goBack} aria-label="Back" className="text-gray-500 hover:text-fg-primary transition p-2 rounded-lg hover:bg-bg-hover">
          <ArrowLeft size={16} />
        </button>
        <span className="font-semibold text-sm">{inApp ? "Your plan" : "Plans"}</span>
      </nav>

      <div className="max-w-3xl mx-auto px-5 py-7 space-y-5">
        {error ? (
          <p className="text-xs text-red-500 text-center pt-8">{error}</p>
        ) : !catalog || !me ? (
          <div className="flex justify-center py-16"><Spinner size={20} /></div>
        ) : inApp ? (
          <CurrentPlanBanner me={me} />
        ) : success ? (
          <div className="glass-panel rounded-2xl p-6 text-center animate-fade-up">
            <div className="mx-auto mb-3 w-12 h-12 rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center"><Check size={24} /></div>
            <h1 className="text-lg font-bold mb-1">{TIER_META[success.plan]?.name} is active!</h1>
            <p className="text-xs text-gray-600 leading-relaxed">
              Valid till <strong>{istDate(success.expiresAt)}</strong>. Your receipt has been emailed.
              You now get more AI doubts every day — let's get studying.
            </p>
            <div className="flex gap-2 justify-center mt-5">
              <Link to="/ask" className="text-xs font-semibold px-4 py-2 rounded-xl bg-violet-600 text-white hover:bg-violet-700 transition">Ask AI</Link>
              <Link to="/dashboard" className="text-xs font-semibold px-4 py-2 rounded-xl border border-bg-border hover:bg-bg-hover transition">Dashboard</Link>
            </div>
          </div>
        ) : (
          <>
            <div>
              <h1 className="text-lg font-bold mb-1">Choose your plan</h1>
              <p className="text-xs text-gray-600 leading-relaxed">
                Prepaid pass — pay once, use it for the full period. No auto-renewal, and no card is saved.
              </p>
            </div>

            <CurrentPlanBanner me={me} />

            {catalog.enabled && catalog.mode === "test" && (
              <div className="rounded-2xl border border-sky-500/30 bg-sky-500/10 px-4 py-3 text-xs text-fg-primary flex gap-2">
                <Info size={14} className="shrink-0 mt-0.5" />
                <span><strong>Test mode</strong> — payments here are practice payments; no real money is charged.</span>
              </div>
            )}

            {!catalog.enabled && (
              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-xs text-tone-warn flex gap-2">
                <Info size={14} className="shrink-0 mt-0.5" />
                <span>Paid plans open soon. Until then, enjoy everything in the Free plan — prices are shown below.</span>
              </div>
            )}

            <div className="glass-panel rounded-2xl p-1.5 flex gap-1.5 max-w-xs mx-auto" role="tablist" aria-label="Duration">
              {[["1m", "1 month"], ["4m", "4 months"]].map(([v, label]) => (
                <button key={v} role="tab" aria-selected={duration === v} onClick={() => setDuration(v)}
                  className={`flex-1 text-xs font-medium px-3 py-2 rounded-xl transition ${duration === v ? "bg-violet-600 text-white" : "text-gray-600 hover:text-fg-primary"}`}>
                  {label}{v === "4m" ? " · save more" : ""}
                </button>
              ))}
            </div>

            <div className="grid sm:grid-cols-3 gap-3">
              {["free", "pro", "elite"].map((tier) => {
                const meta = TIER_META[tier];
                const Icon = meta.icon;
                const plan = tier === "free" ? null : plansFor(tier);
                const isCurrent = me.plan === tier;
                const lowerThanCurrent = RANK[tier] < RANK[me.plan];
                const monthly = tier === "free" ? null : catalog.plans.find((p) => p.tier === tier && p.duration === "1m");
                const saving = plan && duration === "4m" && monthly ? Math.round(100 - (plan.amount / (monthly.amount * 4)) * 100) : 0;
                return (
                  <div key={tier} className={`glass-panel rounded-2xl p-4 flex flex-col ${tier === "pro" ? "ring-1 ring-violet-600/40" : ""}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${meta.tone}`}><Icon size={15} /></span>
                      <span className="font-semibold text-sm">{meta.name}</span>
                      {isCurrent && <span className="ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600">Current</span>}
                    </div>
                    <p className="text-2xl font-bold">
                      {plan ? rupees(plan.amount) : "₹0"}
                      <span className="text-xs font-medium text-gray-600"> {plan ? `/ ${plan.months} month${plan.months > 1 ? "s" : ""}` : "forever"}</span>
                    </p>
                    <p className="text-[11px] text-gray-600 h-4">
                      {plan && duration === "4m" ? `${rupees(plan.perMonth)}/month${saving > 0 ? ` · ${saving}% kam` : ""}` : plan ? "incl. taxes" : ""}
                    </p>
                    <ul className="mt-3 space-y-1.5 text-xs text-gray-600 flex-1">
                      {(catalog.features[tier] ?? []).map((f) => (
                        <li key={f} className="flex gap-2"><Check size={13} className="text-emerald-500 mt-0.5 shrink-0" />{f}</li>
                      ))}
                    </ul>
                    {plan && (
                      me.canPayDirectly ? (
                        <button
                          onClick={() => buy(plan)}
                          disabled={!catalog.enabled || Boolean(busy) || lowerThanCurrent}
                          className="mt-4 w-full text-xs font-semibold py-2.5 rounded-xl bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                        >
                          {busy === plan.id ? <><Spinner size={13} /> {confirming ? "Confirming…" : "Opening…"}</>
                            : lowerThanCurrent ? `${TIER_META[me.plan].name} already active`
                            : isCurrent ? `Extend ${meta.name} · ${rupees(plan.amount)}`
                            : `Get ${meta.name} · ${rupees(plan.amount)}`}
                        </button>
                      ) : (
                        <p className="mt-4 text-[11px] text-center text-gray-600">Parent se pay karwao ↓</p>
                      )
                    )}
                  </div>
                );
              })}
            </div>

            {me.plan === "pro" && (
              <p className="text-[11px] text-gray-600 text-center">
                Moving from Pro to Elite? Your unused Pro days are converted into Elite days by value — nothing is wasted.
              </p>
            )}

            {/* Parent pays */}
            <div className="glass-panel rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck size={15} className="text-violet-500" />
                <p className="text-sm font-semibold">{me.canPayDirectly ? "Want a parent to pay?" : "Your parent or guardian pays"}</p>
              </div>
              <p className="text-[11px] text-gray-600 leading-relaxed mb-3">
                {me.canPayDirectly
                  ? "Create a link and send it on WhatsApp. It works for 7 days; the plan turns on in your account as soon as the payment is done."
                  : "Students under 18 can't pay by themselves. Send this link to your parent or guardian — they can pay by UPI or card on their phone, and the plan turns on in your account. The link is valid for 7 days."}
              </p>
              {link ? (
                <div className="space-y-2">
                  <div className="text-[11px] break-all rounded-xl bg-bg-panel border border-bg-border px-3 py-2 select-all">{link.url}</div>
                  <div className="flex gap-2">
                    <button onClick={shareLink} className="flex-1 text-xs font-semibold py-2 rounded-xl bg-violet-600 text-white hover:bg-violet-700 transition flex items-center justify-center gap-1.5"><Share2 size={13} /> Share</button>
                    <a href={`https://wa.me/?text=${encodeURIComponent(`JNEET+ AI plan payment link (valid for 7 days): ${link.url}`)}`} target="_blank" rel="noopener noreferrer"
                      className="flex-1 text-xs font-semibold py-2 rounded-xl border border-bg-border hover:bg-bg-hover transition flex items-center justify-center gap-1.5">WhatsApp</a>
                    <button onClick={async () => { try { await navigator.clipboard.writeText(link.url); toast.success("Link copied"); } catch { toast.error("Couldn't copy"); } }}
                      aria-label="Copy link" className="px-3 text-xs rounded-xl border border-bg-border hover:bg-bg-hover transition"><Copy size={13} /></button>
                  </div>
                  <p className="text-[10px] text-gray-600">Valid till {istDate(link.expiresAt)}.</p>
                </div>
              ) : (
                <button onClick={makeLink} disabled={linkBusy || !catalog.enabled}
                  className="text-xs font-semibold px-4 py-2 rounded-xl border border-violet-600/40 text-violet-600 hover:bg-violet-600/10 disabled:opacity-50 transition flex items-center gap-2">
                  {linkBusy ? <Spinner size={12} /> : <Share2 size={13} />} Create a payment link for a parent
                </button>
              )}
            </div>

            {me.history?.length > 0 && (
              <div className="glass-panel rounded-2xl p-4">
                <p className="text-sm font-semibold mb-2 flex items-center gap-2"><Receipt size={14} className="text-violet-500" /> Payments</p>
                <ul className="divide-y divide-bg-border">
                  {me.history.map((h) => (
                    <li key={h.paymentId} className="py-2 flex items-center justify-between text-xs">
                      <span>{TIER_META[h.tier]?.name} · {h.planId.endsWith("4m") ? "4 months" : "1 month"}<span className="block text-[10px] text-gray-600">{istDate(h.paidAt)} · {h.paymentId}{h.payer === "parent" ? " · paid by parent" : ""}</span></span>
                      <span className="font-semibold">{rupees(h.amount)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <p className="text-[10px] text-gray-600 text-center leading-relaxed">
              Prices in INR, taxes included. Payments are handled by Razorpay — we never see card or UPI details.
              Paid plans are non-refundable, except for our own errors (double charge, wrong amount, plan not activated).{" "}
              Pay karke aap <Link to="/terms" className="underline">Terms</Link> aur <Link to="/refund" className="underline">Refund Policy</Link> se agree karte ho.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
