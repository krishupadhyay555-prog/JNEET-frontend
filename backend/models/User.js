// ============================================================
//  JNEET+ AI — models/User.js  (Production v2.0)
//  FIXES:
//    - Added bcrypt pre('save') hook — passwords now hashed
//    - Added comparePassword() instance method — login works
//    - Hardened email regex
//    - Added index on email for fast lookups
// ============================================================

import mongoose from "mongoose";
import bcrypt   from "bcryptjs";

// ── WMS Sub-schema ────────────────────────────────────────────
const wmsEntrySchema = new mongoose.Schema(
  {
    topic: {
      type:     String,
      required: true,
      trim:     true,
    },
    chapter: {
      type:    String,
      trim:    true,
      default: "",
    },
    subject: {
      type:     String,
      enum:     ["Physics", "Chemistry", "Biology", "Mathematics"],
      required: true,
    },
    status: {
      type:    String,
      enum:    ["W", "M", "S"],
      default: "M",
    },
    score: {
      type:    Number,
      min:     0,
      max:     100,
      default: 0,
    },
    lastAttempted: {
      type:    Date,
      default: Date.now,
    },
  },
  { _id: false }
);

// ── Main User Schema ──────────────────────────────────────────
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
      index:     true,  // Fast lookup on login
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type:      String,
      required:  [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select:    false,
    },
    examMode: {
      type:     String,
      enum: {
        values:  ["NEET", "JEE"],
        message: "examMode must be either NEET or JEE",
      },
      required: [true, "Please select your exam mode (NEET or JEE)"],
    },
    wmsData: {
      type:    [wmsEntrySchema],
      default: [],
    },
    lastLogin: {
      type:    Date,
      default: null,
    },
    isActive: {
      type:    Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// ── Pre-save: Hash password only when modified ────────────────
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// ── Instance Method: comparePassword ─────────────────────────
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);