import { speak } from "../services/ai/tts.js";
import { isAiConfigured } from "../services/ai/index.js";
import { isOverBudget } from "../services/ai/budget.js";
import { checkMonthlyCap } from "../services/ai/monthlyCap.js";

// POST /api/ai/tts { text } → audio/mpeg (Elite; route is tier-gated)
export const tts = async (req, res, next) => {
  try {
    if (!isAiConfigured() || await isOverBudget()) {
      return res.status(503).json({ success: false, code: "AI_BUSY", error: "Voice is busy right now. Please try again later." });
    }
    if (!(await checkMonthlyCap(req.user)).ok) {
      return res.status(429).json({ success: false, code: "MONTHLY_CAP", error: "You've reached this month's fair-use limit for AI. It resets on the 1st." });
    }
    const out = await speak(req.body.text, { userId: req.user.id, plan: req.user.plan });
    if (!out) return res.status(400).json({ success: false, error: "Nothing to read." });
    res.set({ "Content-Type": "audio/mpeg", "Cache-Control": "private, max-age=86400", "X-TTS-Cached": out.cached ? "1" : "0" });
    return res.send(out.audio);
  } catch (err) {
    if (err?.name === "AiProviderError" || err?.name === "TimeoutError") {
      return res.status(503).json({ success: false, code: "AI_BUSY", error: "Voice is busy right now. Please try again in a minute." });
    }
    next(err);
  }
};
