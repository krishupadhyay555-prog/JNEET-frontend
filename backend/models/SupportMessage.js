// ============================================================
//  JNEET+ AI — models/SupportMessage.js
//  Messages sent from the public Contact page (anyone, signed in or not).
//  The founder reads them on /admin → Support inbox.
// ============================================================

import mongoose from "mongoose";

export const SUPPORT_TOPICS = ["general", "account", "payment", "bug", "content", "privacy", "grievance"];

const supportMessageSchema = new mongoose.Schema(
  {
    ref:     { type: String, required: true, unique: true }, // short code shown to the sender, e.g. JN-7K2Q9
    name:    { type: String, required: true, maxlength: 80 },
    email:   { type: String, required: true, lowercase: true, maxlength: 254 },
    topic:   { type: String, enum: SUPPORT_TOPICS, required: true },
    message: { type: String, required: true, maxlength: 2000 },
    userId:  { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    status:  { type: String, enum: ["open", "closed"], default: "open", index: true },
    closedAt: Date,
  },
  { timestamps: true }
);

supportMessageSchema.index({ status: 1, createdAt: -1 });
supportMessageSchema.index({ email: 1, createdAt: -1 });

export default mongoose.model("SupportMessage", supportMessageSchema);
