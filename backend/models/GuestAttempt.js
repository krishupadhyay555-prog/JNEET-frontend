// ============================================================
//  JNEET+ AI — models/GuestAttempt.js
//  A no-signup "Free Quick Mock" sitting. Owned by a guest id (signed
//  httpOnly cookie), scored on the server. Answers/solutions are never
//  sent to the guest; on signup the attempt moves into the account as a
//  normal TestAttempt. Unclaimed sittings expire after 7 days.
// ============================================================
import mongoose from "mongoose";

const guestAttemptSchema = new mongoose.Schema(
  {
    guestId:  { type: String, required: true, index: true },
    examMode: { type: String, enum: ["NEET", "JEE"], required: true },
    // Snapshots incl. the key — server-side only, never returned as-is.
    questions: { type: Array, default: [] },
    durationMinutes: { type: Number, required: true },
    maxMarks: { type: Number, required: true },
    startedAt: { type: Date, default: Date.now },
    endsAt:    { type: Date, required: true },
    status:    { type: String, enum: ["in-progress", "submitted"], default: "in-progress" },
    submittingAt: { type: Date, default: null },
    submittedAt:  { type: Date, default: null },
    result:    { type: Object, default: null },
    source:    { type: Object, default: null },     // utm / src at start
    claimedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    claimedAt: { type: Date, default: null },
    testAttemptId: { type: mongoose.Schema.Types.ObjectId, default: null },
    expiresAt: { type: Date, default: () => new Date(Date.now() + 7 * 24 * 3600 * 1000) },
  },
  { versionKey: false }
);
guestAttemptSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
guestAttemptSchema.index({ guestId: 1, startedAt: -1 });

export default mongoose.models.GuestAttempt || mongoose.model("GuestAttempt", guestAttemptSchema);
