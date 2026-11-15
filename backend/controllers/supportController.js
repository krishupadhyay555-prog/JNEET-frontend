// ============================================================
//  JNEET+ AI — controllers/supportController.js
//    POST  /api/support/contact        public Contact form
//    GET   /api/admin/support          founder inbox
//    PATCH /api/admin/support/:id      open / close
//  The sender gets an acknowledgement email with a reference code;
//  the founder gets an alert at ADMIN_ALERT_EMAIL.
// ============================================================

import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import SupportMessage from "../models/SupportMessage.js";
import { env } from "../config/env.js";
import { sendAdminAlert, sendSupportAck } from "../services/emailService.js";

export const TOPIC_LABEL = {
  general: "General question", account: "Account or login", payment: "Payment or plan", bug: "Something is broken",
  content: "Question or content error", privacy: "Privacy or my data", grievance: "Complaint (Grievance Officer)",
};

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
function makeRef() {
  const b = crypto.randomBytes(5);
  return "JN-" + Array.from(b, (x) => ALPHABET[x % ALPHABET.length]).join("");
}

// The Contact page is public; if a valid session cookie is present we link the message to the account.
function optionalUserId(req) {
  try {
    const t = req.cookies?.jneet_token;
    if (!t) return null;
    const d = jwt.verify(t, env.JWT_SECRET, { issuer: "jneet-ai", audience: "jneet-ai-client" });
    return mongoose.isValidObjectId(d.id) ? d.id : null;
  } catch { return null; }
}

export const createMessage = async (req, res, next) => {
  try {
    const { name, email, topic, message } = req.body;
    const recent = await SupportMessage.countDocuments({ email, createdAt: { $gte: new Date(Date.now() - 86400000) } });
    if (recent >= 5) {
      return res.status(429).json({ success: false, error: "We already have your messages from today and will reply soon. Please wait for our reply." });
    }
    let doc;
    for (let i = 0; i < 3 && !doc; i++) {
      try { doc = await SupportMessage.create({ ref: makeRef(), name, email, topic, message, userId: optionalUserId(req) }); }
      catch (e) { if (e?.code !== 11000) throw e; }
    }
    sendAdminAlert(`${TOPIC_LABEL[topic]} — ${doc.ref}`, [
      `From: ${name} <${email}>${doc.userId ? " (signed-in student)" : ""}`,
      `Topic: ${TOPIC_LABEL[topic]}`, "", message, "", "Reply directly to the sender's email, then close it on /admin → Support inbox.",
    ], { area: "support" }).catch(() => {});
    sendSupportAck(email, { name, ref: doc.ref, topic: TOPIC_LABEL[topic], grievance: topic === "grievance" }).catch(() => {});
    return res.status(201).json({ success: true, ref: doc.ref, message: `Thanks, ${name.split(" ")[0]}! Your reference is ${doc.ref}. We reply within 2 working days.` });
  } catch (err) { return next(err); }
};

export const listMessages = async (req, res, next) => {
  try {
    const status = req.query.status === "closed" ? "closed" : "open";
    const [items, open, closed] = await Promise.all([
      SupportMessage.find({ status }).sort({ createdAt: -1 }).limit(100).lean(),
      SupportMessage.countDocuments({ status: "open" }),
      SupportMessage.countDocuments({ status: "closed" }),
    ]);
    return res.json({
      success: true, status, counts: { open, closed },
      items: items.map((m) => ({ id: m._id, ref: m.ref, name: m.name, email: m.email, topic: m.topic, topicLabel: TOPIC_LABEL[m.topic], message: m.message, signedIn: !!m.userId, createdAt: m.createdAt })),
    });
  } catch (err) { return next(err); }
};

export const updateMessage = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ success: false, error: "Not found." });
    const closed = req.body.status === "closed";
    const r = await SupportMessage.updateOne({ _id: req.params.id },
      closed ? { $set: { status: "closed", closedAt: new Date() } } : { $set: { status: "open" }, $unset: { closedAt: 1 } });
    if (!r.matchedCount) return res.status(404).json({ success: false, error: "Not found." });
    return res.json({ success: true });
  } catch (err) { return next(err); }
};
