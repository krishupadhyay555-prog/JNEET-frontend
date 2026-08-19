// ============================================================
//  JNEET+ AI — models/User.js  (v5 — wmsData removed)
//  REMOVED: the `wmsData` embedded array and its sub-schema. WMS
//  is no longer manually self-reported — it's now calculated live
//  from the student's TestAttempt history (see wmsController.js /
//  wmsScoringService.js). Nothing reads or writes user.wmsData
//  anymore, so keeping it around would just be dead weight —
//  same reasoning as removing `language` earlier.
//  Safe change: any existing wmsData on old documents in MongoDB
//  just becomes an orphaned, ignored field — Mongoose won't touch
//  it, nothing reads it, no migration needed.
//  Everything else — password rule, examMode, targetExam, etc — is
//  UNCHANGED.
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