// ============================================================
//  JNEET+ AI — controllers/userController.js  (v2 — language removed)
//  REMOVED:
//    - `language` from toStudent() — the field no longer exists on
//      User.js, so `user.language ?? "en"` was always resolving to
//      "en" from nothing.
//    - updateLanguage() entirely — nothing calls it anymore
//      (AuthContext.jsx and Settings.jsx's language section were
//      already removed).
//  If userRoutes.js still has a route pointing at updateLanguage,
//  that route needs removing too — send that file and I'll clean
//  it up in the same pass.
//  Everything else — updateProfile, changePassword, deleteAccount —
//  is UNCHANGED.
// ============================================================

import User from "../models/User.js";
import { env } from "../config/env.js";

function toStudent(user) {
  return {
    _id:       user._id,
    name:      user.name,
    email:     user.email,
    examMode:  user.examMode,
    targetExam: user.targetExam ?? null,
    targetExamPromptDismissed: !!user.targetExamPromptDismissed,
    wmsData:   user.wmsData,
    lastLogin: user.lastLogin,
    createdAt: user.createdAt,
  };
}

// ── PATCH /user/profile — Update name ─────────────────────────
export const updateProfile = async (req, res, next) => {
  try {
    const { name } = req.body;

    const user = await User.findById(req.user.id);
    if (!user || !user.isActive) {
      return res.status(404).json({ success: false, error: "User not found." });
    }

    if (name !== undefined) user.name = name;
    await user.save();

    return res.json({
      success: true,
      message: "Profile updated.",
      student: toStudent(user),
    });

  } catch (err) {
    next(err);
  }
};

// ── PATCH /user/password — Change password ────────────────────
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Need password field explicitly — schema has select:false by default
    const user = await User.findById(req.user.id).select("+password");
    if (!user || !user.isActive) {
      return res.status(404).json({ success: false, error: "User not found." });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error:   "Current password is incorrect.",
        fieldErrors: [{ field: "currentPassword", message: "Current password is incorrect." }],
      });
    }

    // Assigning triggers the pre('save') hash hook automatically.
    // The model's minlength:[8,...] validator runs here too (save()
    // isn't passed validateBeforeSave:false), so length is enforced —
    // but the letter+number REGEX rule only lives in authSchemas.js
    // (Zod), which register/login routes use via validate() middleware.
    // This route's letter+number enforcement depends entirely on
    // whatever validate() + schema userRoutes.js wires up here — not
    // visible in this file. Flagging this, not guessing: send
    // userRoutes.js to confirm the same strength rule actually applies
    // to password changes, not just registration.
    user.password = newPassword;
    await user.save();

    return res.json({ success: true, message: "Password updated successfully." });

  } catch (err) {
    next(err);
  }
};

// ── DELETE /user/account — Deactivate own account ─────────────
// Soft delete (isActive: false) — not a hard delete. This means:
//   - Login/protect() middleware immediately rejects this account
//     everywhere in the app (they already check `isActive`), with
//     zero extra code needed elsewhere.
//   - Support can reverse it if it was accidental or disputed.
// Requires the current password as confirmation — a destructive
// action should never fire from a single misplaced click.
export const deleteAccount = async (req, res, next) => {
  try {
    const { password } = req.body;

    const user = await User.findById(req.user.id).select("+password");
    if (!user || !user.isActive) {
      return res.status(404).json({ success: false, error: "User not found." });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error:   "Incorrect password.",
        fieldErrors: [{ field: "password", message: "Incorrect password." }],
      });
    }

    user.isActive = false;
    await user.save({ validateBeforeSave: false });

    res.clearCookie("jneet_token", {
      httpOnly: true,
      secure:   env.NODE_ENV === "production",
      sameSite: env.NODE_ENV === "production" ? "none" : "lax",
      path:     "/",
    });

    return res.json({ success: true, message: "Account deleted." });

  } catch (err) {
    next(err);
  }
};