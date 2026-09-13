// ============================================================
//  JNEET+ AI — models/User.js  (v8 — account lockout + TTL cleanup)
//  ADDED (standard production hardening):
//    - failedLoginAttempts / accountLockedUntil: PER-ACCOUNT login
//      lockout, separate from the existing PER-IP rate limiter
//      (authLimiter.js). The rate limiter alone doesn't stop an
//      attacker who spreads password guesses across many IPs at one
//      specific victim's account — this does. 5 wrong passwords
//      locks that one account for 15 minutes, independent of who's
//      trying or from where.
//    - A partial TTL index on `createdAt`, scoped to
//      { isEmailVerified: false }: MongoDB automatically deletes any
//      account that never completed email verification within 48
//      hours. This is standard hygiene — without it, unverified
//      "ghost" accounts (typos, abandoned signups, someone testing
//      whether an email works) accumulate forever and permanently
//      occupy that email address's uniqueness slot. Once an account
//      verifies, isEmailVerified flips to true and it falls outside
//      this filter permanently — verified accounts are NEVER
//      auto-deleted.
//  Everything else — password-reset OTP fields, email-verification
//  OTP fields, passwordChangedAt — UNCHANGED from v7.
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

    // ── Signup Email Verification / OTP fields ──────────────────
    isEmailVerified:    { type: Boolean, default: false },
    emailOtpHash:       { type: String, default: null, select: false },
    emailOtpExpiresAt:  { type: Date,   default: null, select: false },
    emailOtpAttempts:   { type: Number, default: 0,    select: false },

    // ── Per-account login lockout (NEW) ─────────────────────────
    failedLoginAttempts: { type: Number, default: 0,    select: false },
    accountLockedUntil:  { type: Date,   default: null, select: false },
  },
  { timestamps: true }
);

// Partial TTL index — only applies to documents where
// isEmailVerified is false. MongoDB's background TTL monitor
// deletes matching documents once `createdAt` is older than
// expireAfterSeconds (48 hours here). Verified accounts (the vast
// majority, long-term) are completely unaffected by this index.
userSchema.index(
  { createdAt: 1 },
  {
    expireAfterSeconds: 48 * 60 * 60,
    partialFilterExpression: { isEmailVerified: false },
  }
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