// ============================================================
//  JNEET+ AI — models/WebhookEvent.js
//  Razorpay can deliver the same webhook more than once. Every event
//  we have fully processed is remembered by its X-Razorpay-Event-Id
//  (unique), so a repeat is answered 200 without touching anything.
//  Kept 45 days (Razorpay retries for at most ~24 hours).
// ============================================================

import mongoose from "mongoose";

const webhookEventSchema = new mongoose.Schema(
  {
    eventId:    { type: String, required: true, unique: true },
    event:      { type: String, default: null },
    orderId:    { type: String, default: null },
    receivedAt: { type: Date, default: Date.now, expires: 60 * 60 * 24 * 45 },
  },
  { versionKey: false }
);

export default mongoose.model("WebhookEvent", webhookEventSchema);
