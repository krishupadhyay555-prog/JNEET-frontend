// ============================================================
//  JNEET+ AI — models/User.js  (v9 — launch hardening)
//  ADDED on top of v8:
//    - emailNormalized (unique, sparse): duplicate-signup detection
//      across Gmail dots / "+tags" (see utils/email.js). Sparse so
//      legacy users without the field don't collide.
//    - loginOtp*: passwordless "email me a code" login.
//    - dateOfBirth + consent{}: DOB age gate and the record of what
//      was accepted (Terms/Privacy version, timestamp, IP) plus the
//      parental-approval state for users under 18.
//    - persona: "mentor" (default) | "fun" AI explanation style.
//    - plan: "free" | "pro" | "elite" — drives AI quotas.
//    - deletedAt: set when an account is anonymised (hard-delete job).
//  Everything else (OTP fields, lockout, TTL cleanup of unverified
//  accounts, password hashing) is UNCHANGED.
// ============================================================

import mongoose from "mongoose";
import bcrypt   from "bcryptjs";

const consentSchema = new mongoose.Schema(
  {
    termsVersion:   { type: String, default: null },
    privacyVersion: { type: String, default: null },
    acceptedAt:     { type: Date,   default: null },
    acceptedIp:     { type: String, default: null },

    // Parental approval (only meaningful when ageGroup === "minor")
    ageGroup: {
      type:    String,
      enum:    ["adult", "minor", null],
      default: null,
    },
    parentEmail: { type: String, default: null, lowercase: true, trim: true },
    parentStatus: {
      type:    String,
      enum:    ["not_required", "pending", "granted", "revoked"],
      default: "not_required",
    },
    parentRequestedAt: { type: Date,   default: null },
    parentDecidedAt:   { type: Date,   default: null },
    parentDecidedIp:   { type: String, default: null },
    parentDecidedUa:   { type: String, default: null },
    parentMethod:      { type: String, default: null }, // e.g. "email_link"
    parentNoticeVersion: { type: String, default: null },

    // Hashed single-use tokens (never store the raw token)
    parentTokenHash:        { type: String, default: null, select: false },
    parentTokenExpiresAt:   { type: Date,   default: null, select: false },
    parentRevokeTokenHash:  { type: String, default: null, select: false },
  },
  { _id: false }
);

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
    emailNormalized: {
      type:   String,
      unique: true,
      sparse: true,
      select: false,
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

    dateOfBirth: { type: Date, default: null },
    consent:     { type: consentSchema, default: () => ({}) },

    // 18+ policy record (category + time only, never message text).
    policy: {
      strikes:     { type: Number, default: 0 },
      flagsTotal:  { type: Number, default: 0 },
      lastFlagAt:  { type: Date,   default: null },
      pausedUntil: { type: Date,   default: null },
      events: {
        type: [new mongoose.Schema(
          { at: { type: Date, required: true },
            kind: { type: String, enum: ["warning", "final_warning", "paused", "repeat_after_pause"], required: true } },
          { _id: false }
        )],
        default: [],
      },
    },

    persona: {
      type:    String,
      enum:    ["mentor", "fun"],
      default: "mentor",
    },
    plan: {
      type:    String,
      enum:    ["free", "pro", "elite"],
      default: "free",
    },

    lastLogin: { type: Date, default: null },
    isActive:  { type: Boolean, default: true },
    deletedAt: { type: Date, default: null },

    // ── Forgot Password / OTP fields ────────────────────────────
    resetOtpHash:       { type: String, default: null, select: false },
    resetOtpExpiresAt:  { type: Date,   default: null, select: false },
    resetOtpAttempts:   { type: Number, default: 0,    select: false },
    passwordChangedAt:  { type: Date,   default: null },
    // Bumped on password change/reset: every JWT carries the version it was
    // issued under, so older sessions die instantly (exact, no clock games).
    tokenVersion:       { type: Number, default: 0 },

    // ── Signup Email Verification / OTP fields ──────────────────
    isEmailVerified:    { type: Boolean, default: false },
    emailOtpHash:       { type: String, default: null, select: false },
    emailOtpExpiresAt:  { type: Date,   default: null, select: false },
    emailOtpAttempts:   { type: Number, default: 0,    select: false },

    // ── Passwordless "email me a login code" ────────────────────
    loginOtpHash:       { type: String, default: null, select: false },
    loginOtpExpiresAt:  { type: Date,   default: null, select: false },
    loginOtpAttempts:   { type: Number, default: 0,    select: false },

    // ── Per-account login lockout ───────────────────────────────
    failedLoginAttempts: { type: Number, default: 0,    select: false },
    accountLockedUntil:  { type: Date,   default: null, select: false },
  },
  { timestamps: true }
);

// Partial TTL index — only applies to documents where
// isEmailVerified is false. MongoDB's background TTL monitor
// deletes matching documents once `createdAt` is older than
// expireAfterSeconds (48 hours here). Verified accounts are never
// auto-deleted.
userSchema.index(
  { createdAt: 1 },
  {
    expireAfterSeconds: 48 * 60 * 60,
    partialFilterExpression: { isEmailVerified: false },
  }
);

// Parent-consent link lookups
userSchema.index({ "consent.parentTokenHash": 1 }, { sparse: true });
userSchema.index({ "consent.parentRevokeTokenHash": 1 }, { sparse: true });

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);
