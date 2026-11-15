// ============================================================
//  JNEET+ AI — components/public/PricingCards.jsx
//  Free / Pro / Elite cards for the home and Pricing pages. Prices come
//  from the server catalog (single source of truth). Until payments are
//  switched on, Pro/Elite show "Coming soon" instead of a price.
// ============================================================

import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { rupees } from "../../utils/razorpay.js";

const FREE = ["5 AI doubts every day", "Chapter-wise mock tests and full papers", "Revision with instant feedback", "OneShot chapter notes", "Progress and weak-topic tracking"];

function Feature({ children }) {
  return <li className="flex gap-2.5 text-[14px] leading-snug text-[#3A3741]"><Check size={16} className="text-[#0D9488] mt-0.5 shrink-0" />{children}</li>;
}

export function PricingCards({ catalog }) {
  return (
    <div className="grid md:grid-cols-3 gap-5">
      <div className="bg-white rounded-2xl border border-[#E7E4DD] p-6 flex flex-col">
        <p className="font-semibold text-[15px]">Free</p>
        <p className="mt-2 text-[34px] font-bold tracking-tight">₹0</p>
        <p className="text-[13px] text-[#6E6A76]">Forever. No card needed.</p>
        <ul className="mt-5 space-y-2.5 flex-1">{FREE.map((t) => <Feature key={t}>{t}</Feature>)}</ul>
        <Link to="/register" className="mt-6 text-center px-4 py-2.5 rounded-xl border border-[#E2DED6] font-semibold hover:border-[#0D9488]/60">Start free</Link>
      </div>
      {["pro", "elite"].map((tier) => {
        const name = tier === "pro" ? "Pro" : "Elite";
        const m1 = catalog?.plans?.find((p) => p.tier === tier && p.duration === "1m");
        const m4 = catalog?.plans?.find((p) => p.tier === tier && p.duration === "4m");
        const live = catalog?.enabled && m1;
        const featured = tier === "pro";
        return (
          <div key={tier} className={`rounded-2xl p-6 flex flex-col relative ${featured ? "bg-[#17161C] text-white border border-[#17161C]" : "bg-white border border-[#E7E4DD]"}`}>
            {featured && <span className="absolute -top-3 left-6 text-[11px] font-semibold uppercase tracking-wider bg-[#0D9488] text-white px-2.5 py-1 rounded-full">Most popular</span>}
            <p className="font-semibold text-[15px]">{name}</p>
            {!catalog ? (
              <div className="mt-3 h-10 w-28 rounded-lg bg-current opacity-10 animate-pulse" />
            ) : live ? (
              <>
                <p className="mt-2 text-[34px] font-bold tracking-tight">{rupees(m1.amount)}<span className={`text-[14px] font-medium ${featured ? "text-white/70" : "text-[#6E6A76]"}`}> / month</span></p>
                <p className={`text-[13px] ${featured ? "text-white/70" : "text-[#6E6A76]"}`}>{m4 ? `or ${rupees(m4.amount)} for 4 months` : " "}</p>
              </>
            ) : (
              <>
                <p className="mt-2 text-[22px] font-bold tracking-tight">Coming soon</p>
                <p className={`text-[13px] ${featured ? "text-white/70" : "text-[#6E6A76]"}`}>Launching with paid plans shortly.</p>
              </>
            )}
            <ul className="mt-5 space-y-2.5 flex-1">
              {(catalog?.features?.[tier] ?? (tier === "pro" ? ["More AI doubts every day", "Deeper step-by-step solving", "Everything in Free"] : ["The most AI doubts", "Our strongest model for tough problems", "Everything in Pro"])).map((t) => (
                <li key={t} className={`flex gap-2.5 text-[14px] leading-snug ${featured ? "text-white/90" : "text-[#3A3741]"}`}>
                  <Check size={16} className={`mt-0.5 shrink-0 ${featured ? "text-[#5EEAD4]" : "text-[#0D9488]"}`} />{t}
                </li>
              ))}
            </ul>
            <Link to="/register" className={`mt-6 text-center px-4 py-2.5 rounded-xl font-semibold ${featured ? "bg-white text-[#17161C] hover:bg-[#F1EFEA]" : "border border-[#E2DED6] hover:border-[#0D9488]/60"}`}>
              {live ? "Start free, upgrade anytime" : "Start free"}
            </Link>
          </div>
        );
      })}
    </div>
  );
}

export function PaymentFacts() {
  const facts = [
    ["Prepaid pass", "1 month (30 days) or 4 months (120 days). It never renews on its own — no saved card, no UPI mandate."],
    ["Safe checkout", "Payments are processed by Razorpay (UPI, cards, net banking). We never see your card or UPI details."],
    ["Instant access", "Your plan switches on the moment the payment is confirmed, and you get a receipt by email."],
    ["Clear refunds", "If you are charged twice or a plan doesn't activate because of us, we refund it in 5–7 working days."],
  ];
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {facts.map(([h, p]) => (
        <div key={h} className="bg-white rounded-2xl border border-[#E7E4DD] p-5">
          <p className="font-semibold text-[15px]">{h}</p>
          <p className="mt-1.5 text-[14px] leading-relaxed text-[#5F5B67]">{p}</p>
        </div>
      ))}
    </div>
  );
}
