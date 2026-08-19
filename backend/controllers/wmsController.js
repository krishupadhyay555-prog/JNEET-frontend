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

import mongoose from "mongoose";
import TestAttempt from "../models/TestAttempt.js";
import { buildWMSSummary } from "../services/wmsScoringService.js";

// ── GET /wms/summary ─────────────────────────────────────────
export const getSummary = async (req, res, next) => {
  try {
    const rows = await TestAttempt.aggregate([
      {
        $match: {
          // FIX: .aggregate() does NOT auto-cast string IDs to
          // ObjectId the way .find()/.findOne() do — it talks to
          // MongoDB directly, bypassing Mongoose's casting layer.
          // Without this explicit conversion, this match would
          // silently match zero documents (a string never equals
          // a real ObjectId), and every student would just see an
          // empty WMS summary forever with no error to explain why.
          userId: new mongoose.Types.ObjectId(req.user.id),
          status: "submitted",
        },
      },
      { $unwind: "$questions" },
      {
        $group: {
          _id: { subject: "$questions.subject", chapter: "$questions.chapter" },
          total: { $sum: 1 },
          correct: {
            $sum: {
              $cond: [
                { $eq: ["$questions.selectedIndex", "$questions.correctIndex"] },
                1, 0,
              ],
            },
          },
          unattempted: {
            $sum: {
              $cond: [
                { $eq: ["$questions.selectedIndex", null] },
                1, 0,
              ],
            },
          },
        },
      },
    ]);

    const summary = buildWMSSummary(rows);

    return res.json({ success: true, summary });

  } catch (err) {
    next(err);
  }
};