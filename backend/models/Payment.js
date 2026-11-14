// ============================================================
//  JNEET+ AI — models/Payment.js
//  One document per Razorpay order. The order is created on OUR
//  server with the price from config/plans.js; the browser never
//  decides the amount.
//    status:    created → paid | failed
//    claimedAt: short lock while the plan is being added to the
//               account (so the checkout callback and the webhook
//               can arrive at the same moment and the days are still
//               added exactly once)
//    appliedAt: set once the days were added — the idempotency mark
//  Records are kept when an account is deleted (tax/payment law).
// ============================================================

import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    userId:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    payer:     { type: String, enum: ["student", "parent"], required: true },
    planId:    { type: String, required: true },
    tier:      { type: String, enum: ["pro", "elite"], required: true },
    days:      { type: Number, required: true },
    amount:    { type: Number, required: true },      // paise
    currency:  { type: String, default: "INR" },

    orderId:   { type: String, required: true, unique: true },
    paymentId: { type: String, default: null },
    status:    { type: String, enum: ["created", "paid", "failed"], default: "created" },
    method:    { type: String, default: null },        // upi / card / netbanking …
    payerEmail:{ type: String, default: null },        // from Razorpay, for the receipt
    source:    { type: String, enum: ["checkout", "webhook", null], default: null },

    claimedAt: { type: Date, default: null },
    appliedAt: { type: Date, default: null },
    paidAt:    { type: Date, default: null },
    planBefore:   { type: String, default: null },
    planAfter:    { type: String, default: null },
    periodEnd:    { type: Date, default: null },
    receiptSent:  { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
);

paymentSchema.index({ paymentId: 1 }, { unique: true, partialFilterExpression: { paymentId: { $type: "string" } } });
paymentSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model("Payment", paymentSchema);
