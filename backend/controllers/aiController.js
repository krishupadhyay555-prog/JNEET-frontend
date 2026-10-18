// ============================================================
//  JNEET+ AI — controllers/aiController.js  (v3 — OpenAI + quotas)
//
//  Request pipeline for POST /api/ai/ask:
//    1. AI configured?                     (503 JSON)
//    2. Under-18 without parent approval?  (403 JSON, code
//                                           PARENT_CONSENT_REQUIRED)
//    3. Global daily budget circuit breaker (503 JSON)
//    4. Daily quota for the user's plan     (429 JSON, code DAILY_LIMIT)
//       — a message that looks like distress is never counted or
//         blocked: a student in trouble must always get an answer
//    5. Load recent turns of the chat so the mentor has memory
//    6. Stream the answer over SSE (heartbeat keeps proxies open;
//       client disconnect aborts the upstream request so no tokens
//       are wasted)
//    7. Write a usage-ledger row (tokens + cost, never text)
//  Failed answers (no text produced) give the quota unit back.
//
//  Errors are NEVER passed through raw: students see a friendly
//  message, the real cause goes to the server log only.
// ============================================================

import AiUsage from "../models/AiUsage.js";
import {
  streamAnswer,
  classifyAiError,
  isAiConfigured,
  detectDistress,
} from "../services/ai/index.js";
import { loadHistory } from "../services/ai/history.js";
import { reserveDoubt, getUsageSnapshot, istDayKey } from "../services/ai/quota.js";
import { isOverBudget } from "../services/ai/budget.js";
import { estimateCost } from "../services/ai/prices.js";
import { env } from "../config/env.js";

const HEARTBEAT_MS = 15_000;

async function writeLedger(row) {
  try {
    await AiUsage.create(row);
  } catch (err) {
    console.error("[AI] failed to write usage ledger:", err.message);
  }
}

export const askAI = async (req, res, next) => {
  const { prompt, sessionId, replaceFromMessageId } = req.body;
  const user = req.user;

  try {
    if (!isAiConfigured()) {
      return res.status(503).json({
        success: false,
        code: "AI_NOT_CONFIGURED",
        error: "The AI mentor isn't available right now. Please try again later.",
      });
    }

    if (user.aiLocked) {
      return res.status(403).json({
        success: false,
        code: "PARENT_CONSENT_REQUIRED",
        error: "Your parent or guardian needs to approve your account before you can use the AI mentor.",
      });
    }

    const distress = detectDistress(prompt);

    if (!distress && (await isOverBudget())) {
      console.error("[AI] daily budget reached — refusing new questions");
      return res.status(503).json({
        success: false,
        code: "AI_BUSY",
        error: "The AI mentor is very busy today. Please try again tomorrow — mock tests and revision are still available.",
      });
    }

    let reservation = null;
    if (!distress) {
      reservation = await reserveDoubt(user.id, user.plan);
      if (!reservation.ok) {
        return res.status(429).json({
          success: false,
          code: "DAILY_LIMIT",
          error: `You've used all ${reservation.limit} AI doubts for today. They reset at midnight IST.`,
          plan: user.plan,
          limit: reservation.limit,
          resetsAt: reservation.resetsAt,
        });
      }
    }

    let history = [];
    try {
      history = await loadHistory({
        userId: user.id,
        examMode: user.examMode,
        sessionId,
        replaceFromMessageId,
      });
    } catch (err) {
      console.warn("[AI] could not load history (continuing without):", err.message);
    }

    // ── Open the SSE stream ──────────────────────────────────────
    res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    res.flushHeaders();

    const abort = new AbortController();
    res.on("close", () => {
      if (!res.writableEnded) abort.abort();
    });

    const heartbeat = setInterval(() => {
      if (!res.writableEnded) res.write(": ping\n\n");
    }, HEARTBEAT_MS);

    const startedAt = Date.now();
    const send = (obj) => {
      if (!res.writableEnded) res.write(`data: ${JSON.stringify(obj)}\n\n`);
    };

    let emittedAny = false;
    const base = {
      userId: user.id,
      day: istDayKey(),
      plan: user.plan,
      kind: "chat",
    };

    try {
      const result = await streamAnswer({
        userId: user.id,
        plan: user.plan,
        persona: user.persona,
        examMode: user.examMode,
        prompt,
        history,
        signal: abort.signal,
        onToken: (text) => {
          emittedAny = true;
          send({ token: text });
        },
      });

      let fullText = result.fullText;
      if (result.status === "incomplete") {
        const note = "\n\n*(This answer was cut short. Ask me to continue and I'll pick up from here.)*";
        fullText += note;
        send({ token: note });
      }

      const cost = estimateCost(result.model, result.usage);
      await writeLedger({
        ...base,
        model: result.model,
        effort: result.effort,
        usedFallback: result.usedFallback,
        status: result.status === "incomplete" ? "incomplete" : "ok",
        inputTokens: result.usage?.inputTokens ?? null,
        cachedTokens: result.usage?.cachedTokens ?? null,
        outputTokens: result.usage?.outputTokens ?? null,
        reasoningTokens: result.usage?.reasoningTokens ?? null,
        costUsd: cost.usd,
        costInr: cost.inr,
        latencyMs: Date.now() - startedAt,
      });

      send({
        done: true,
        fullText,
        usage: reservation
          ? { remaining: reservation.remaining, limit: reservation.limit, resetsAt: reservation.resetsAt }
          : null,
      });

    } catch (err) {
      if (abort.signal.aborted) {
        // Student closed the tab / pressed stop. Tokens were spent, keep the quota unit.
        await writeLedger({
          ...base,
          model: env.AI_MODEL_FREE,
          status: "aborted",
          latencyMs: Date.now() - startedAt,
        });
      } else {
        const friendly = classifyAiError(err);
        console.error("[AI] request failed", {
          code: friendly.code, status: err?.status ?? null, message: err?.message,
        });
        await writeLedger({
          ...base,
          model: env.AI_MODEL_FREE,
          status: "error",
          errorCode: friendly.code,
          latencyMs: Date.now() - startedAt,
        });
        // Nothing useful reached the student → give the doubt back.
        if (reservation && !emittedAny) await reservation.release();
        send({ error: friendly.message, code: friendly.code });
      }
    } finally {
      clearInterval(heartbeat);
      if (!res.writableEnded) res.end();
    }

  } catch (err) {
    // Failure BEFORE the stream opened (quota/history/db) — plain JSON.
    if (!res.headersSent) return next(err);
    console.error("[AI Controller] Error after stream start:", err.message);
    if (!res.writableEnded) res.end();
  }
};

// GET /api/ai/usage — how many doubts are left today (for the UI)
export const getUsage = async (req, res, next) => {
  try {
    const snapshot = await getUsageSnapshot(req.user.id, req.user.plan);
    return res.json({ success: true, ...snapshot, aiLocked: req.user.aiLocked });
  } catch (err) {
    next(err);
  }
};

export const pingAI = (req, res) => {
  return res.status(200).json({ success: true, status: "ok" });
};
