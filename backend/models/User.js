// ============================================================
//  JNEET+ AI — models/User.js  (v6 — forgot-password OTP fields added)
//  ADDED (for Forgot Password / OTP feature):
//    - resetOtpHash: the OTP is NEVER stored in plain text — only
//      its bcrypt hash, same approach already used for the login
//      password. select:false so it's never accidentally returned
//      in any query response.
//    - resetOtpExpiresAt: OTP is valid for 10 minutes only.
//    - resetOtpAttempts: counts failed verification attempts for
//      the CURRENT otp — locks after 3 to prevent brute-forcing a
//      6-digit code. Reset to 0 whenever a fresh OTP is issued.
//    - passwordChangedAt: timestamp of the last successful
//      password change (via reset). authMiddleware.js compares
//      this against the JWT's issued-at time — any token issued
//      BEFORE the last password change is rejected, so resetting
//      your password logs out every other device/session
//      automatically (session invalidation), without needing any
//      change to how tokens are generated.
//  Everything else — name/email/password rules, examMode,
//  targetExam, comparePassword — UNCHANGED from v5.
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

    // ── Forgot Password / OTP fields (NEW) ──────────────────────
    resetOtpHash:       { type: String, default: null, select: false },
    resetOtpExpiresAt:  { type: Date,   default: null, select: false },
    resetOtpAttempts:   { type: Number, default: 0,    select: false },
    passwordChangedAt:  { type: Date,   default: null },
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