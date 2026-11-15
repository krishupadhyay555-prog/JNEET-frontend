// ============================================================
//  JNEET+ AI — controllers/publicController.js
//    GET /api/public/stats   numbers shown on the public home/About
//  pages (question count, chapters, OneShots). Cached for 1 hour.
// ============================================================

import Question from "../models/Question.js";
import { listOneShots } from "../services/oneshot.js";

let cache = { at: 0, data: null };
const TTL = 60 * 60 * 1000;

export async function buildPublicStats() {
  const [questions, chapterGroups] = await Promise.all([
    Question.estimatedDocumentCount(),
    Question.aggregate([{ $group: { _id: { e: "$examMode", s: "$subject", c: "$chapter" } } }, { $count: "n" }]),
  ]);
  const one = new Set([...listOneShots("NEET"), ...listOneShots("JEE")].map((o) => o.slug));
  return { questions, chapters: chapterGroups[0]?.n || 0, oneshots: one.size, exams: ["NEET UG", "JEE Main"] };
}

export const getPublicStats = async (req, res, next) => {
  try {
    if (!cache.data || Date.now() - cache.at > TTL || process.env.NODE_ENV === "test") {
      cache = { at: Date.now(), data: await buildPublicStats() };
    }
    res.setHeader("Cache-Control", "public, max-age=600");
    return res.json({ success: true, ...cache.data });
  } catch (err) { return next(err); }
};
