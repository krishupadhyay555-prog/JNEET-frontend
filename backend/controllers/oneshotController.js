// ============================================================
//  JNEET+ AI — controllers/oneshotController.js
//    GET /api/oneshot          chapters with a OneShot for my exam
//    GET /api/oneshot/:slug    one chapter's OneShot (?lang=english|hinglish)
// ============================================================

import { listOneShots, getOneShot } from "../services/oneshot.js";

// ?lang=english|hinglish (a per-page switch) overrides the saved study language.
function langFor(req) {
  const q = String(req.query.lang ?? "");
  return q === "english" || q === "hinglish" ? q : req.user.studyLanguage;
}

export const list = (req, res) => {
  return res.json({ success: true, chapters: listOneShots(req.user.examMode, langFor(req)) });
};

export const getOne = (req, res) => {
  const doc = getOneShot(req.user.examMode, String(req.params.slug ?? ""), langFor(req));
  if (!doc) return res.status(404).json({ success: false, error: "This OneShot isn't available for your exam yet." });
  return res.json({ success: true, oneshot: doc });
};
