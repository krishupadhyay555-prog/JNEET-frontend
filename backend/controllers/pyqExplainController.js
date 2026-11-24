import { pyqByRef, pyqById } from "../services/pyqPool.js";
import { cachedExplanation, generateExplanation } from "../services/pyqExplain.js";
import { isAiConfigured } from "../services/ai/index.js";
import { isOverBudget } from "../services/ai/budget.js";
import { reserveDoubt } from "../services/ai/quota.js";
import { checkMonthlyCap } from "../services/ai/monthlyCap.js";

const NOT_AVAILABLE = "Our AI could not match NTA's official answer for this question, so we are not showing an explanation (we never show a solution that disagrees with the key).";

// POST /api/pyq-explain { ref, lang }
export const explain = async (req, res, next) => {
  let reservation = null;
  try {
    const p = req.body.ref ? pyqByRef(req.body.ref) : pyqById(req.body.questionId);
    const ref = p?.ref;
    const lang = req.body.lang ?? (req.user.studyLanguage === "hinglish" ? "hinglish" : "english");
    if (!p) return res.status(404).json({ success: false, error: "Question not found." });

    const hit = await cachedExplanation(ref, lang);
    if (hit?.status === "ok") return res.json({ success: true, available: true, cached: true, text: hit.text });
    if (hit?.status === "failed") return res.json({ success: true, available: false, message: NOT_AVAILABLE });

    if (req.user.aiLocked) return res.status(403).json({ success: false, code: "AI_LOCKED", error: "AI features are paused on your account." });
    if (!isAiConfigured() || await isOverBudget()) {
      return res.status(503).json({ success: false, code: "AI_BUSY", error: "The AI is busy right now. Please try again later." });
    }
    if (!(await checkMonthlyCap(req.user)).ok) {
      return res.status(429).json({ success: false, code: "MONTHLY_CAP", error: "You've reached this month's fair-use limit for AI. It resets on the 1st." });
    }
    reservation = await reserveDoubt(req.user.id, req.user.plan);
    if (!reservation.ok) {
      return res.status(429).json({ success: false, code: "DAILY_LIMIT", error: `You've used all ${reservation.limit} AI doubts for today. They reset at midnight IST.` });
    }

    const out = await generateExplanation(ref, lang, { userId: req.user.id, plan: req.user.plan });
    if (out.status !== "ok") {
      await reservation.release();
      return res.json({ success: true, available: false, message: NOT_AVAILABLE });
    }
    return res.json({ success: true, available: true, cached: false, text: out.text });
  } catch (err) {
    if (reservation?.ok) await reservation.release().catch(() => {});
    if (err?.name === "AiProviderError") {
      return res.status(503).json({ success: false, code: "AI_BUSY", error: "The AI is busy right now. Please try again in a minute." });
    }
    next(err);
  }
};
