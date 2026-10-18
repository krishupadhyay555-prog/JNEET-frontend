// ============================================================
//  JNEET+ AI — controllers/consentController.js
//  Parental-consent endpoints.
//    PUBLIC (token in URL is the credential, rate-limited):
//      GET  /api/consent/parent/:token            describe link
//      POST /api/consent/parent/:token/approve    parent approves
//      GET  /api/consent/parent/revoke/:token     describe withdraw link
//      POST /api/consent/parent/revoke/:token     parent withdraws
//    STUDENT (logged in):
//      GET  /api/consent/status
//      POST /api/consent/resend                   email parent again
//      PATCH /api/consent/parent-email            fix a wrong address
// ============================================================

import User from "../models/User.js";
import {
  describeApproveToken,
  approveWithToken,
  describeRevokeToken,
  revokeWithToken,
  requestParentConsent,
  parentEmailIsSelf,
  PARENT_RESEND_COOLDOWN_MS,
} from "../services/consentService.js";
import { toStudent } from "../utils/studentPayload.js";

// ── Public: parent side ──────────────────────────────────────────
export const getApproveLink = async (req, res, next) => {
  try {
    const info = await describeApproveToken(req.params.token);
    const status = info.state === "invalid" ? 404 : 200;
    return res.status(status).json({ success: info.state !== "invalid", ...info });
  } catch (err) { next(err); }
};

export const approve = async (req, res, next) => {
  try {
    const result = await approveWithToken(req.params.token, {
      ip: req.ip,
      userAgent: req.get("user-agent"),
    });
    if (!result.ok) return res.status(result.status).json({ success: false, error: result.error });
    return res.json({ success: true, studentName: result.studentName });
  } catch (err) { next(err); }
};

export const getRevokeLink = async (req, res, next) => {
  try {
    const info = await describeRevokeToken(req.params.token);
    const status = info.state === "invalid" ? 404 : 200;
    return res.status(status).json({ success: info.state !== "invalid", ...info });
  } catch (err) { next(err); }
};

export const revoke = async (req, res, next) => {
  try {
    const result = await revokeWithToken(req.params.token, {
      ip: req.ip,
      userAgent: req.get("user-agent"),
    });
    if (!result.ok) return res.status(result.status).json({ success: false, error: result.error });
    return res.json({ success: true, studentName: result.studentName });
  } catch (err) { next(err); }
};

// ── Student side ─────────────────────────────────────────────────
export const getStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).lean();
    if (!user) return res.status(404).json({ success: false, error: "User not found." });
    return res.json({ success: true, student: toStudent(user) });
  } catch (err) { next(err); }
};

export const resendToParent = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.isActive) return res.status(404).json({ success: false, error: "User not found." });

    if (user.consent?.ageGroup !== "minor") {
      return res.status(400).json({ success: false, error: "Parental approval is not required for your account." });
    }
    if (user.consent.parentStatus === "granted") {
      return res.status(400).json({ success: false, error: "Your parent has already approved." });
    }

    const last = user.consent.parentRequestedAt?.getTime() ?? 0;
    const waitMs = PARENT_RESEND_COOLDOWN_MS - (Date.now() - last);
    if (waitMs > 0) {
      const wait = Math.ceil(waitMs / 1000);
      return res.status(429).json({
        success: false,
        error: `Please wait ${Math.ceil(wait / 60)} minute${wait > 60 ? "s" : ""} before sending another request.`,
        retryAfter: wait,
      });
    }

    const result = await requestParentConsent(user);
    if (!result.sent) return res.status(502).json({ success: false, error: result.error });

    return res.json({ success: true, message: "We emailed your parent a new approval link." });
  } catch (err) { next(err); }
};

export const updateParentEmail = async (req, res, next) => {
  try {
    const { parentEmail } = req.body;
    const user = await User.findById(req.user.id);
    if (!user || !user.isActive) return res.status(404).json({ success: false, error: "User not found." });

    if (user.consent?.ageGroup !== "minor") {
      return res.status(400).json({ success: false, error: "Parental approval is not required for your account." });
    }
    if (parentEmailIsSelf(user.email, parentEmail)) {
      return res.status(400).json({
        success: false,
        error: "This must be your parent or guardian's email, not yours.",
        fieldErrors: [{ field: "parentEmail", message: "This must be your parent or guardian's email, not yours." }],
      });
    }

    // Changing the address resets any earlier decision.
    user.consent.parentStatus = "pending";
    user.consent.parentRequestedAt = null; // allow an immediate send
    await user.save({ validateBeforeSave: false });

    const result = await requestParentConsent(user, { parentEmail });
    if (!result.sent) return res.status(502).json({ success: false, error: result.error });

    return res.json({ success: true, message: "Parent email updated and approval link sent.", student: toStudent(user) });
  } catch (err) { next(err); }
};
