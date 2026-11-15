// ============================================================
//  JNEET+ AI — controllers/exportController.js
//    GET /api/user/export  → "Download my data" (DPDP right of access)
//  One JSON file with everything we hold about the signed-in student.
//  Secrets (password hash, OTP/token hashes, lock fields) are never
//  included — they are select:false on the model and also stripped here.
// ============================================================

import User from "../models/User.js";
import Chat from "../models/Chat.js";
import Note from "../models/Note.js";
import TestAttempt from "../models/TestAttempt.js";
import AiUsage from "../models/AiUsage.js";
import Payment from "../models/Payment.js";
import QuestionReport from "../models/QuestionReport.js";
import SupportMessage from "../models/SupportMessage.js";

const SECRET = /Hash$|^password$|Otp|LockedUntil$|^payLockUntil$|^failedLoginAttempts$/;
function clean(obj) {
  if (Array.isArray(obj)) return obj.map(clean);
  if (obj && typeof obj === "object" && !(obj instanceof Date) && obj.constructor?.name !== "ObjectId") {
    const out = {};
    for (const [k, v] of Object.entries(obj)) {
      if (k === "__v" || SECRET.test(k)) continue;
      out[k] = clean(v);
    }
    return out;
  }
  return obj;
}

export const exportMyData = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const [user, chats, notes, attempts, usage, payments, reports, support] = await Promise.all([
      User.findById(userId).lean(),
      Chat.find({ userId }).lean(),
      Note.find({ userId }).lean(),
      TestAttempt.find({ userId }).sort({ createdAt: -1 }).lean(),
      AiUsage.find({ userId }).select("model inputTokens outputTokens createdAt").sort({ createdAt: -1 }).limit(5000).lean(),
      Payment.find({ userId }).select("tier duration amount currency status orderId paymentId paidAt validTill createdAt").lean(),
      QuestionReport.find({ userId }).select("reason note status snapshot.questionText createdAt").lean(),
      SupportMessage.find({ userId }).select("ref topic message status createdAt").lean(),
    ]);
    if (!user) return res.status(404).json({ success: false, error: "User not found." });
    const data = clean({
      exportedAt: new Date().toISOString(),
      about: "Everything JNEET+ AI holds about your account. Payment card/UPI details are never stored by us (Razorpay handles them).",
      account: user, chats, notes, testAttempts: attempts, aiUsage: usage, payments, questionReports: reports, supportMessages: support,
    });
    const day = new Date().toISOString().slice(0, 10);
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="jneet-my-data-${day}.json"`);
    res.setHeader("Cache-Control", "no-store");
    return res.send(JSON.stringify(data, null, 2));
  } catch (err) { return next(err); }
};
