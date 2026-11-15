// ============================================================
//  JNEET+ AI — pages/Pricing.jsx   (public)
//  Plans + exactly how payment works (Razorpay, prepaid, no auto-renew,
//  refunds). Needed for Razorpay website review and for trust.
// ============================================================

import { useEffect } from "react";
import { Link } from "react-router-dom";
import { PublicShell, PageHero } from "../components/public/PublicShell.jsx";
import { PricingCards, PaymentFacts } from "../components/public/PricingCards.jsx";
import { usePlanCatalog } from "../hooks/usePlanCatalog.js";
import { BUSINESS } from "../legal/content.js";

export default function Pricing() {
  const catalog = usePlanCatalog();
  useEffect(() => { document.title = `Pricing — ${BUSINESS.product}`; window.scrollTo(0, 0); }, []);
  return (
    <PublicShell>
      <PageHero eyebrow="Pricing" title="Start free. Upgrade only if it helps.">
        All prices are in Indian rupees and include applicable taxes. Paid plans are bought on this website after you sign up.
      </PageHero>
      <div className="max-w-6xl mx-auto px-5 pb-16 space-y-14">
        <PricingCards catalog={catalog} />
        <section>
          <h2 className="text-[24px] font-bold tracking-tight mb-5">How payment works</h2>
          <PaymentFacts />
          <p className="mt-5 text-[14px] text-[#5F5B67] leading-relaxed">
            Students under 18 can't pay themselves: a parent or guardian pays through a link the student shares from the app.
            Full details: <Link to="/refund" className="text-[#0F766E] font-semibold hover:underline">Refund &amp; Cancellation Policy</Link> ·{" "}
            <Link to="/delivery" className="text-[#0F766E] font-semibold hover:underline">Delivery Policy</Link> ·{" "}
            <Link to="/terms" className="text-[#0F766E] font-semibold hover:underline">Terms of Service</Link>.
            Questions about a payment? <Link to="/contact?topic=payment" className="text-[#0F766E] font-semibold hover:underline">Contact us</Link>.
          </p>
        </section>
      </div>
    </PublicShell>
  );
}
