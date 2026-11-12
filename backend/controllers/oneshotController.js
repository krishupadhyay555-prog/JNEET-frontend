// ============================================================
//  JNEET+ AI — controllers/oneshotController.js
//    GET /api/oneshot          chapters with a OneShot for my exam
//    GET /api/oneshot/:slug    one chapter's OneShot
// ============================================================

import { listOneShots, getOneShot } from "../services/oneshot.js";

export const list = (req, res) => {
  return res.json({ success: true, chapters: listOneShots(req.user.examMode) });
};

export const getOne = (req, res) => {
  const doc = getOneShot(req.user.examMode, String(req.params.slug ?? ""));
  if (!doc) return res.status(404).json({ success: false, error: "This OneShot isn't available for your exam yet." });
  return res.json({ success: true, oneshot: doc });
};
