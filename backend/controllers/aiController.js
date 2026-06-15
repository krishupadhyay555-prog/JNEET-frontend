import User from "../models/User.js";
import { generateAIResponseStream } from "../services/geminiService.js";

export const askAI = async (req, res, next) => {
  const { prompt } = req.body;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  let clientDisconnected = false;
  req.on("close", () => {
    clientDisconnected = true;
  });

  try {
    const userData = await User.findById(req.user.id)
      .select("wmsData")
      .lean();

    const wmsContext = userData?.wmsData || [];

    if (clientDisconnected) return;

    await generateAIResponseStream(
      prompt.trim(),
      req.user.examMode,
      wmsContext,
      res
    );

  } catch (err) {
    if (!clientDisconnected && !res.writableEnded) {
      res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
    }
    console.error("[AI Controller] Error:", err.message);

  } finally {
    if (!res.writableEnded) {
      res.end(); // ✅ FIXED
    }
  }
};

export const pingAI = (req, res) => {
  return res.status(200).json({
    success: true,
    status: "ok",
  });
};
