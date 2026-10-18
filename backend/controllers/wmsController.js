// ============================================================
//  JNEET+ AI — controllers/wmsController.js  (v2 — auto-calculated)
//  REPLACED entirely — no more manual CRUD (getWMS/upsertEntry/
//  updateEntry/deleteEntry). WMS is now a single read-only
//  aggregation over the student's own TestAttempt history (both
//  "test" and "revision" modes combined, matching what was asked:
//  "100 test+revision combined, 23 chemistry, 13 correct").
//  There's nothing to delete here by design — this is a live view
//  over TestAttempt data, not a separate stored/editable record.
// ============================================================

import TestAttempt from "../models/TestAttempt.js";
import { buildWMSSummary, foldAttempts } from "../services/wmsScoringService.js";

// Only the most recent attempts count: a student who has improved must see
// that improvement, and the work done per request stays bounded.
export const WMS_RECENT_ATTEMPTS = 30;

// ── GET /wms/summary ─────────────────────────────────────────
export const getSummary = async (req, res, next) => {
  try {
    const attempts = await TestAttempt.find({
      userId: req.user.id,
      examMode: req.user.examMode,   // each exam has its own weak/strong map
      status: "submitted",
    })
      .sort({ submittedAt: -1 })
      .limit(WMS_RECENT_ATTEMPTS)
      .select("questions.subject questions.chapter questions.selectedIndex questions.correctIndex")
      .lean();

    const summary = buildWMSSummary(foldAttempts(attempts));
    summary.window = { attempts: attempts.length, max: WMS_RECENT_ATTEMPTS };

    return res.json({ success: true, summary });
  } catch (err) {
    next(err);
  }
};
