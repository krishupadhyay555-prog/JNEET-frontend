// ============================================================
//  JNEET+ AI — models/User.js  (v7 — email verification fields)
//  ADDED (for Signup Email Verification / OTP feature):
//    - isEmailVerified: false by default. A newly registered user
//      cannot log in until this becomes true (see login() in
//      authController.js). Verified the same way password-reset
//      OTPs work — hashed OTP, 10-min expiry, 3-attempt cap.
//    - emailOtpHash / emailOtpExpiresAt / emailOtpAttempts: same
//      pattern as resetOtpHash/resetOtpExpiresAt/resetOtpAttempts,
//      but for the SEPARATE signup-verification flow — kept as
//      distinct fields (not reused) so a pending password-reset
//      OTP and a pending email-verification OTP never collide if
//      both happen to be in flight for the same user at once.
//  Everything else — name/email/password rules, examMode,
//  targetExam, forgot-password fields, comparePassword — UNCHANGED
//  from v6.
// ============================================================

import mongoose from "mongoose";
import bcrypt   from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type:      String,
      required:  [true, "Name is required"],
      trim:      true,
      minlength: [2,  "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type:      String,
      required:  [true, "Email is required"],
      unique:    true,
      lowercase: true,
      trim:      true,
      index:     true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type:      String,
      required:  [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select:    false,
    },
    examMode: {
      type: String,
      enum: {
        values:  ["NEET", "JEE"],
        message: "examMode must be either NEET or JEE",
      },
      required: [true, "Please select your exam mode (NEET or JEE)"],
    },
    targetExam: { type: String, trim: true, default: null },
    targetExamPromptDismissed: { type: Boolean, default: false },

    lastLogin: { type: Date, default: null },
    isActive: { type: Boolean, default: true },

    // ── Forgot Password / OTP fields ────────────────────────────
    resetOtpHash:       { type: String, default: null, select: false },
    resetOtpExpiresAt:  { type: Date,   default: null, select: false },
    resetOtpAttempts:   { type: Number, default: 0,    select: false },
    passwordChangedAt:  { type: Date,   default: null },

    // ── Signup Email Verification / OTP fields (NEW) ────────────
    isEmailVerified:    { type: Boolean, default: false },
    emailOtpHash:       { type: String, default: null, select: false },
    emailOtpExpiresAt:  { type: Date,   default: null, select: false },
    emailOtpAttempts:   { type: Number, default: 0,    select: false },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);