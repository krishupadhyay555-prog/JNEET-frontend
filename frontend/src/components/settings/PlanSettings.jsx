// ============================================================
//  JNEET+ AI — components/settings/PlanSettings.jsx
//  Settings → "Plan & billing": current plan, end date, last receipt.
//  Inside the Play Store app it shows the plan only (no prices/links).
// ============================================================

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { paymentApi } from "../../api/paymentApi.js";
import { Spinner } from "../ui/Spinner.jsx";
import { isAppShell } from "../../utils/appShell.js";
import { rupees, istDate } from "../../utils/razorpay.js";

const NAMES = { free: "Free", pro: "Pro", elite: "Elite" };

export function PlanSettings() {
  const [me, setMe] = useState(null);
  const [error, setError] = useState(false);
  const inApp = isAppShell();

  useEffect(() => {
    let cancelled = false;
    paymentApi.mine()
      .then((r) => { if (!cancelled) setMe(r.data); })
      .catch(() => { if (!cancelled) setError(true); });
    return () => { cancelled = true; };
  }, []);

  if (error) return <p className="text-xs text-gray-600">Couldn't load your plan details. Please try again later.</p>;
  if (!me) return <Spinner size={16} />;

  const last = me.history?.[0];
  return (
    <div className="space-y-3 text-xs">
      <div className="flex items-center justify-between">
        <span className="text-gray-600">Plan</span>
        <span className="font-semibold">{NAMES[me.plan]}</span>
      </div>
      {me.expiresAt && (
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Valid till</span>
          <span className="font-semibold">{istDate(me.expiresAt)} · no auto-renew</span>
        </div>
      )}
      {last && !inApp && (
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Last payment</span>
          <span>{rupees(last.amount)} · {istDate(last.paidAt)}</span>
        </div>
      )}
      <Link to="/plans" className="flex items-center justify-between rounded-xl border border-bg-border px-3 py-2.5 hover:bg-bg-hover transition">
        <span className="font-medium">{inApp ? "Plan details" : me.plan === "free" ? "See Pro & Elite plans" : "Extend or upgrade · receipts"}</span>
        <ChevronRight size={14} className="text-gray-600" />
      </Link>
    </div>
  );
}
