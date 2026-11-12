// ============================================================
//  JNEET+ AI — controllers/recapController.js
//    GET  /api/recap         what the student studied in their last chat
//                            (null when there is nothing honest to offer)
//    POST /api/recap/start   5–10 verified bank questions on it, as a
//                            normal instant-feedback Revision attempt
// ============================================================

import { findRecap, startRecap } from "../services/recap.js";

export const getRecap = async (req, res, next) => {
  try {
    return res.json({ success: true, recap: await findRecap(req.user) });
  } catch (err) {
    next(err);
  }
};

export const start = async (req, res, next) => {
  try {
    const out = await startRecap(req.user, { sessionId: req.body.sessionId, count: req.body.count });
    if (!out) {
      return res.status(404).json({ success: false, error: "There's nothing to recap from your last chat right now." });
    }
    return res.json(out);
  } catch (err) {
    next(err);
  }
};
