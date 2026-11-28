// ============================================================
//  JNEET+ AI — middleware/allIndiaLock.js
//  While a student's All-India Mock is open (sitting in progress, or
//  submitted but the window hasn't closed), the PYQ papers and Explain
//  with AI are paused for them — otherwise a PYQ in the mock could be
//  looked up with its NTA answer, unfair to everyone else's rank.
// ============================================================
import TestAttempt from "../models/TestAttempt.js";
import AllIndiaMock from "../models/AllIndiaMock.js";

export async function inOpenAllIndia(userId, now = new Date()) {
  const recent = await TestAttempt.find({
    userId, allIndiaMockId: { $exists: true }, startedAt: { $gt: new Date(now.getTime() - 12 * 3600 * 1000) },
  }).select("allIndiaMockId").lean();
  if (!recent.length) return false;
  return Boolean(await AllIndiaMock.exists({ _id: { $in: recent.map((r) => r.allIndiaMockId) }, closesAt: { $gt: now } }));
}

export async function blockDuringAllIndia(req, res, next) {
  try {
    if (await inOpenAllIndia(req.user.id)) {
      return res.status(423).json({
        success: false, code: "ALL_INDIA_OPEN",
        error: "PYQs and Explain with AI are paused until this week's All-India Mock closes. They'll be back right after.",
      });
    }
    return next();
  } catch (err) { return next(err); }
}
