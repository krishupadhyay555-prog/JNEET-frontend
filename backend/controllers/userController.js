// ============================================================
//  JNEET+ AI — controllers/userController.js  (v3 — launch hardening)
//  CHANGED:
//    - changePassword now records passwordChangedAt (so every OTHER
//      device is logged out — previously a changed password left
//      old sessions alive) and re-issues THIS device's cookie so the
//      user isn't kicked out of the session they just used.
//    - deleteAccount: deactivates immediately, stamps deletedAt and
//      starts a 30-day grace period; services/accountPurge.js then
//      permanently erases the data. Cookie cleared with the SAME
//      attributes it was set with.
//    - toStudent comes from utils/studentPayload.js (the old local
//      copy returned a field that no longer exists).
//  ADDED: setDateOfBirth (legacy accounts), updatePreferences (AI
//  persona).
// ============================================================

import User from "../models/User.js";
import { toStudent } from "../utils/studentPayload.js";
import { setSessionCookie, clearSessionCookie } from "../utils/authCookie.js";
import { parseDob, calcAge, ADULT_AGE } from "../utils/age.js";
import { requestParentConsent, parentEmailIsSelf } from "../services/consentService.js";
import { TERMS_VERSION, PRIVACY_VERSION } from "../config/legal.js";

export const updateProfile = async (req, res, next) => {
  try {
    const { name } = req.body;

    const user = await User.findById(req.user.id);
    if (!user || !user.isActive) {
      return res.status(404).json({ success: false, error: "User not found." });
    }

    if (name !== undefined) user.name = name;
    await user.save();

    return res.json({ success: true, message: "Profile updated.", student: toStudent(user) });

  } catch (err) {
    next(err);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select("+password");
    if (!user || !user.isActive) {
      return res.status(404).json({ success: false, error: "User not found." });
    }

    if (!(await user.comparePassword(currentPassword))) {
      return res.status(401).json({
        success: false,
        error:   "Current password is incorrect.",
        fieldErrors: [{ field: "currentPassword", message: "Current password is incorrect." }],
      });
    }

    if (await user.comparePassword(newPassword)) {
      return res.status(400).json({
        success: false,
        error:   "Your new password must be different from the current one.",
        fieldErrors: [{ field: "newPassword", message: "Your new password must be different from the current one." }],
      });
    }

    user.password = newPassword;
    user.passwordChangedAt = new Date();
    user.tokenVersion = (user.tokenVersion || 0) + 1;
    await user.save();

    // Other devices are now logged out; keep THIS one signed in.
    setSessionCookie(res, user);

    return res.json({ success: true, message: "Password updated. Other devices have been logged out." });

  } catch (err) {
    next(err);
  }
};

export const deleteAccount = async (req, res, next) => {
  try {
    const { password } = req.body;

    const user = await User.findById(req.user.id).select("+password");
    if (!user || !user.isActive) {
      return res.status(404).json({ success: false, error: "User not found." });
    }

    if (!(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        error:   "Incorrect password.",
        fieldErrors: [{ field: "password", message: "Incorrect password." }],
      });
    }

    user.isActive = false;
    user.deletedAt = new Date();
    await user.save({ validateBeforeSave: false });

    clearSessionCookie(res);

    return res.json({
      success: true,
      message: "Account deleted. Your data will be permanently erased within 30 days.",
    });

  } catch (err) {
    next(err);
  }
};

// ── Legacy accounts: add a date of birth ─────────────────────────
export const setDateOfBirth = async (req, res, next) => {
  try {
    const { dateOfBirth, parentEmail } = req.body;

    const user = await User.findById(req.user.id);
    if (!user || !user.isActive) {
      return res.status(404).json({ success: false, error: "User not found." });
    }
    if (user.dateOfBirth) {
      return res.status(409).json({ success: false, error: "Date of birth is already set. Contact support to change it." });
    }

    const minor = calcAge(dateOfBirth) < ADULT_AGE;

    if (minor && !parentEmail) {
      return res.status(400).json({
        success: false,
        error: "A parent or guardian's email is required for students under 18.",
        fieldErrors: [{ field: "parentEmail", message: "A parent or guardian's email is required for students under 18." }],
      });
    }
    if (minor && parentEmailIsSelf(user.email, parentEmail)) {
      return res.status(400).json({
        success: false,
        error: "This must be your parent or guardian's email, not yours.",
        fieldErrors: [{ field: "parentEmail", message: "This must be your parent or guardian's email, not yours." }],
      });
    }

    user.dateOfBirth = parseDob(dateOfBirth);
    user.consent.ageGroup = minor ? "minor" : "adult";
    user.consent.parentStatus = minor ? "pending" : "not_required";
    // Existing users accept the current documents by continuing to use the service.
    user.consent.termsVersion = user.consent.termsVersion ?? TERMS_VERSION;
    user.consent.privacyVersion = user.consent.privacyVersion ?? PRIVACY_VERSION;
    user.consent.acceptedAt = user.consent.acceptedAt ?? new Date();
    await user.save({ validateBeforeSave: false });

    let parentRequestSent = null;
    if (minor) {
      parentRequestSent = (await requestParentConsent(user, { parentEmail })).sent;
    }

    return res.json({ success: true, student: toStudent(user), parentRequestSent });

  } catch (err) {
    next(err);
  }
};

export const updatePreferences = async (req, res, next) => {
  try {
    await User.updateOne({ _id: req.user.id }, { $set: { persona: req.body.persona } });
    const user = await User.findById(req.user.id).lean();

    if (!user || !user.isActive) {
      return res.status(404).json({ success: false, error: "User not found." });
    }

    return res.json({ success: true, student: toStudent(user) });

  } catch (err) {
    next(err);
  }
};
