// Feature gate by paid tier (req.user.plan is already the effective plan).
import { TIER_RANK } from "../config/plans.js";

export function requireTier(min) {
  return (req, res, next) => {
    if ((TIER_RANK[req.user?.plan] ?? 0) >= TIER_RANK[min]) return next();
    return res.status(403).json({
      success: false,
      code: "PLAN_REQUIRED",
      requiredPlan: min,
      error: min === "elite" ? "This is part of the Elite plan." : "This is part of the Pro and Elite plans.",
    });
  };
}

export const hasTier = (plan, min) => (TIER_RANK[plan] ?? 0) >= TIER_RANK[min];
