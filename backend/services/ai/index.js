// ============================================================
//  JNEET+ AI — services/ai/index.js
//  The AI facade the rest of the app uses. Responsibilities:
//    - pick model + reasoning effort for a plan (all via env vars)
//    - build the system prompt (persona, distress handling)
//    - stream the answer, with retry-then-fallback BEFORE the first
//      token is sent (once text has reached the student we never
//      retry — that would duplicate or contradict what they read)
//    - classify provider errors into student-friendly messages
// ============================================================

import { env } from "../../config/env.js";
import { buildSystemPrompt, detectDistress } from "./persona.js";
import { streamResponse, createResponse, AiProviderError } from "./openaiClient.js";

export { detectDistress };

export function isAiConfigured() {
  return Boolean(env.OPENAI_API_KEY);
}

export function resolveRoute(plan, { deep = false } = {}) {
  if (deep) return { model: env.AI_MODEL_DEEP, effort: "high" };
  switch (plan) {
    case "elite": return { model: env.AI_MODEL_ELITE, effort: env.AI_EFFORT_ELITE };
    case "pro":   return { model: env.AI_MODEL_PRO,   effort: env.AI_EFFORT_PRO };
    default:      return { model: env.AI_MODEL_FREE,  effort: env.AI_EFFORT_FREE };
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export function classifyAiError(err) {
  const status = Number(err?.status) || null;
  const msg = `${err?.message || ""}`.toLowerCase();

  if (err?.timeout || msg.includes("timed out") || msg.includes("stalled")) {
    return { code: "AI_TIMEOUT", statusCode: 504, message: "The AI is taking too long to answer. Please try again." };
  }
  if (status === 429) {
    return { code: "AI_BUSY", statusCode: 503, message: "The AI is very busy right now. Please try again in a minute." };
  }
  if (status === 401 || status === 403) {
    console.error("[AI] Provider rejected our credentials/permissions:", err.message);
    return { code: "AI_UNAVAILABLE", statusCode: 503, message: "The AI mentor is temporarily unavailable. We're on it — please try again shortly." };
  }
  if (status === 404) {
    console.error("[AI] Model not found — check AI_MODEL_* env vars:", err.message);
    return { code: "AI_UNAVAILABLE", statusCode: 503, message: "The AI mentor is temporarily unavailable. We're on it — please try again shortly." };
  }
  if (status === 400) {
    return { code: "AI_BAD_REQUEST", statusCode: 400, message: "I couldn't process that message. Try rephrasing your question." };
  }
  return { code: "AI_ERROR", statusCode: 503, message: "The AI mentor hit a snag. Please try again in a moment." };
}

// Streams an answer. `onToken(text)` is called for every chunk.
// Resolves to { fullText, usage, status, model, effort, usedFallback }.
// Rejects with the provider error (already logged) if nothing could be produced.
export async function streamAnswer({
  userId, plan, persona, examMode, prompt, history = [], signal, onToken, deep = false,
}) {
  const route = resolveRoute(plan, { deep });
  const distress = detectDistress(prompt);
  const instructions = buildSystemPrompt({ examMode, persona, distress });
  const input = [...history, { role: "user", content: prompt }];

  const attempts = [{ ...route, kind: "primary" }, { ...route, kind: "retry" }];
  if (env.AI_MODEL_FALLBACK && env.AI_MODEL_FALLBACK !== route.model) {
    attempts.push({ model: env.AI_MODEL_FALLBACK, effort: route.effort, kind: "fallback" });
  }

  let lastError;
  let emitted = false;

  for (let i = 0; i < attempts.length; i++) {
    const c = attempts[i];
    let fullText = "";
    try {
      if (c.kind === "retry") await sleep(500);

      for await (const evt of streamResponse({
        model: c.model,
        instructions,
        input,
        effort: c.effort,
        maxOutputTokens: env.AI_MAX_OUTPUT_TOKENS,
        userId,
      }, signal)) {
        if (evt.type === "delta") {
          emitted = true;
          fullText += evt.text;
          onToken?.(evt.text);
        } else if (evt.type === "done") {
          return {
            fullText,
            usage: evt.usage,
            status: evt.status,
            incompleteReason: evt.incompleteReason,
            model: c.model,
            effort: c.effort,
            usedFallback: c.kind === "fallback",
            distress,
          };
        }
      }
    } catch (err) {
      lastError = err;
      if (signal?.aborted) throw err;
      console.warn("[AI] attempt failed", {
        model: c.model, kind: c.kind, status: err?.status ?? null,
        retryable: err?.retryable ?? null, message: err?.message,
      });

      // Text already reached the student: never retry (it would duplicate it).
      if (emitted) { err.partialText = fullText; throw err; }

      const fallbackIndex = attempts.findIndex((p) => p.kind === "fallback");
      const modelSpecific = err?.status === 400 || err?.status === 404;

      if (c.kind === "primary") {
        if (err?.retryable) continue;                       // -> same-model retry
        if (modelSpecific && fallbackIndex !== -1) { i = fallbackIndex - 1; continue; }
        break;
      }
      if (c.kind === "retry") continue;                     // -> fallback if there is one
      break;                                                // fallback failed too
    }
  }

  throw lastError ?? new AiProviderError("AI unavailable");
}

// Short chat title (3–6 words). Returns null on any failure.
export async function generateChatTitle(userMessageContent) {
  if (!isAiConfigured()) return null;
  try {
    const { text } = await createResponse({
      model: env.AI_MODEL_TITLE,
      instructions:
        "Write a chat title of 3 to 6 words summarising what the student is asking about. Reply with ONLY the title: no quotes, no trailing punctuation, no prefix.",
      input: [{ role: "user", content: String(userMessageContent).slice(0, 500) }],
      effort: "none",
      maxOutputTokens: 120,
    });

    const title = (text ?? "")
      .trim()
      .replace(/^["'“”]+|["'“”]+$/g, "")
      .replace(/[.!]+$/, "")
      .split("\n")[0]
      .trim();

    return title.length >= 2 && title.length <= 80 ? title : null;
  } catch (err) {
    console.warn("[AI] title generation failed:", err?.message);
    return null;
  }
}
