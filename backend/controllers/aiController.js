// ============================================================
//  JNEET+ AI — controllers/aiController.js  (v3 — OpenAI + quotas)
//
//  Request pipeline for POST /api/ai/ask:
//    1. AI configured?                     (503 JSON)
//    2. Under-18 without parent approval?  (403 JSON, code
//                                           PARENT_CONSENT_REQUIRED)
//    3. Global daily budget circuit breaker (503 JSON)
//       3a. Safety screen (services/ai/safety.js): patterns + provider
//           moderation (any language) + context judge
//       3b. AI chat locked (403 CHAT_LOCKED) or paused (429 CHAT_PAUSED)
//           after repeated rule breaks
//       3c. Rule break → policy reply (warning … lock), never counted
//           against the quota (see services/ai/policy.js); an unclear
//           case gets a polite refusal with NO strike
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
} from "../services/ai/index.js";
import { loadHistory } from "../services/ai/history.js";
import { checkMonthlyCap } from "../services/ai/monthlyCap.js";
import { reserveDoubt, getUsageSnapshot, istDayKey, isNewAccount } from "../services/ai/quota.js";
import { isOverBudget, aiPaused } from "../services/ai/budget.js";
import { estimateCost as estimateCostFor } from "../services/ai/prices.js";
import { resolveRoute } from "../services/ai/index.js";

// AI is paused (kill switch) but the student may be in distress: never
// leave them with an error — give the helplines without calling the AI.
const PAUSED_DISTRESS_MESSAGE =
  "I'm really glad you told me. What you're feeling matters, and you don't have to carry it alone. " +
  "Please talk to a parent, teacher or friend you trust today. You can also call **Tele-MANAS on 14416** " +
  "(free, 24x7, India) — and **112** in an emergency. I'm here whenever you want to talk.";

// Rough cost of a stream that stopped early (tab closed / Stop pressed /
// provider failed mid-answer): the provider still bills those tokens, so
// they count toward the daily budget and the monthly ₹ cap too.
function estimatePartialCost(plan, promptChars, outputChars) {
  const { model } = resolveRoute(plan);
  const usage = { inputTokens: Math.ceil(promptChars / 3) + 1500, cachedTokens: 0, outputTokens: Math.ceil(outputChars / 3) };
  return { model, usage, cost: estimateCostFor(model, usage) };
}
import { screenMessage, contextFromHistory, REFUSE_MESSAGE } from "../services/ai/safety.js";
import { recordFlag, getPolicySummary, getLockState, requestUnlock } from "../services/ai/policy.js";
import { estimateCost } from "../services/ai/prices.js";
import { env } from "../config/env.js";

const HEARTBEAT_MS = 15_000;

// One short SSE reply that never reaches the AI (policy / refusal).
function replyOnce(res, message, extra = {}) {
  res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders();
  res.write(`data: ${JSON.stringify({ token: message })}\n\n`);
  res.write(`data: ${JSON.stringify({ done: true, fullText: message, usage: null, ...extra })}\n\n`);
  return res.end();
}

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

    const screen = await screenMessage(prompt, {
      getContext: async () =>
        contextFromHistory(await loadHistory({ userId: user.id, examMode: user.examMode, sessionId })),
    });
    const distress = screen.distress;

    // A student in distress is never locked, paused or warned — they always get an answer.
    if (!distress && user.chatLocked) {
      return res.status(403).json({
        success: false,
        code: "CHAT_LOCKED",
        error: "The AI chat is locked because the chat rules were broken repeatedly. Tests, Revision and Notes still work.",
        lock: await getLockState(user.id),
      });
    }

    if (!distress && user.chatPausedUntil && new Date(user.chatPausedUntil) > new Date()) {
      return res.status(429).json({
        success: false,
        code: "CHAT_PAUSED",
        error: "The AI chat is paused for a while because the chat rules were broken. Tests, Revision and Notes still work.",
        resumesAt: new Date(user.chatPausedUntil).toISOString(),
      });
    }

    if (!distress && screen.verdict === "violation") {
      const v = await recordFlag(user.id, { category: screen.category });
      return replyOnce(res, v.message, {
        policy: {
          level: v.level,
          strikes: v.strikes,
          category: v.category,
          pausedUntil: v.pausedUntil?.toISOString() ?? null,
          locked: v.locked,
          lock: v.locked ? await getLockState(user.id) : null,
        },
      });
    }

    if (aiPaused()) {
      if (distress) return replyOnce(res, PAUSED_DISTRESS_MESSAGE, {});
      return res.status(503).json({
        success: false,
        code: "AI_PAUSED",
        error: "The AI mentor is taking a short break. Mock tests, PYQs and revision are still available.",
      });
    }

    if (!distress && screen.verdict === "refuse") {
      return replyOnce(res, REFUSE_MESSAGE, { refused: true });
    }

    if (!distress && (await isOverBudget())) {
      console.error("[AI] daily budget reached — refusing new questions");
      return res.status(503).json({
        success: false,
        code: "AI_BUSY",
        error: "The AI mentor is very busy today. Please try again tomorrow — mock tests and revision are still available.",
      });
    }

    if (!distress) {
      const capState = await checkMonthlyCap(user);
      if (!capState.ok) {
        return res.status(429).json({
          success: false,
          code: "MONTHLY_CAP",
          error: "You've reached this month's fair-use limit for the AI mentor. It resets on the 1st. Mock tests, PYQs and revision still work.",
          plan: user.plan,
        });
      }
    }

    let reservation = null;
    if (!distress) {
      reservation = await reserveDoubt(user.id, user.plan, new Date(), { createdAt: user.createdAt });
      if (!reservation.ok) {
        return res.status(429).json({
          success: false,
          code: "DAILY_LIMIT",
          error: user.plan === "free" && isNewAccount(user.createdAt)
            ? `New accounts get ${reservation.limit} AI doubts on their first day. You'll get the full daily limit from tomorrow — mock tests, PYQs and revision are open now.`
            : `You've used all ${reservation.limit} AI doubts for today. They reset at midnight IST.`,
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

    let streamedChars = 0;
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
        studyLanguage: user.studyLanguage,
        examMode: user.examMode,
        prompt,
        history,
        distress,
        signal: abort.signal,
        onToken: (text) => {
          emittedAny = true;
          streamedChars += text.length;
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
      const historyChars = history.reduce((n, m) => n + String(m?.content ?? "").length, 0);
      const partial = estimatePartialCost(user.plan, String(prompt ?? "").length + historyChars, streamedChars);
      const spent = { model: partial.model, inputTokens: partial.usage.inputTokens, outputTokens: partial.usage.outputTokens,
        costUsd: partial.cost.usd, costInr: partial.cost.inr };
      if (abort.signal.aborted) {
        // Student closed the tab / pressed stop. Tokens were spent, keep the
        // quota unit AND count the estimated cost (no free answers via Stop).
        await writeLedger({
          ...base,
          ...spent,
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
          ...(emittedAny ? spent : { model: env.AI_MODEL_FREE }),
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
    const snapshot = await getUsageSnapshot(req.user.id, req.user.plan, new Date(), { createdAt: req.user.createdAt });
    const paused = req.user.chatPausedUntil && new Date(req.user.chatPausedUntil) > new Date()
      ? new Date(req.user.chatPausedUntil).toISOString() : null;
    const lock = req.user.chatLocked ? await getLockState(req.user.id) : null;
    return res.json({ success: true, ...snapshot, aiLocked: req.user.aiLocked, pausedUntil: paused, chatLock: lock });
  } catch (err) {
    next(err);
  }
};

// GET /api/ai/policy — the student's own "account notices" (shown in Analytics)
export const getPolicy = async (req, res, next) => {
  try {
    return res.json({ success: true, policy: await getPolicySummary(req.user.id) });
  } catch (err) {
    next(err);
  }
};

// POST /api/ai/policy/unlock — student asks to unlock a locked chat.
// 18+: works 24 h after the lock. Under-18: (re)sends the parent link.
export const unlockChat = async (req, res, next) => {
  try {
    if (req.body?.acknowledge !== true) {
      return res.status(400).json({
        success: false, code: "ACK_REQUIRED",
        error: "Please read the chat rules and tick the box to continue.",
      });
    }
    const r = await requestUnlock(req.user.id);
    if (!r.ok) return res.status(r.status).json({ success: false, code: r.code, error: r.error, lock: r.lock ?? null });
    return res.json({ success: true, unlocked: r.unlocked, sentToParent: Boolean(r.sentToParent), lock: r.lock ?? null });
  } catch (err) {
    next(err);
  }
};

export const pingAI = (req, res) => {
  return res.status(200).json({ success: true, status: "ok" });
};
