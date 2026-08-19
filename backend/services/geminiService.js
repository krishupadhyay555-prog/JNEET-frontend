// ============================================================
//  JNEET+ AI — services/geminiService.js  (v2.2 — language rule fixed)
//  FIXED: buildSystemPrompt()'s language rule was just "Reply in
//  same language (Hindi/Hinglish/English)" — vague enough that the
//  model was defaulting to Hindi even for ambiguous short input
//  like "hi" (which is an English greeting, not a Hindi-language
//  signal). Now explicit: default to English always, only switch
//  when the student's own words clearly indicate another language
//  (now also explicitly includes Marathi / "any other language").
//  Nothing else in this file changed — same retry/timeout logic,
//  same streaming, same title generation, same error handling.
// ============================================================

import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "../config/env.js";

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
const GEMINI_MODEL = "gemini-2.5-flash";
const STREAM_START_TIMEOUT_MS = 15000;
const STREAM_CHUNK_TIMEOUT_MS = 30000;
const NON_STREAM_TIMEOUT_MS = 30000;
const TITLE_TIMEOUT_MS = 6000; // short — title is a nice-to-have, not critical
const MAX_RETRIES = 2;
const RETRY_BASE_DELAY_MS = 600;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function createTimeoutError(stage, timeoutMs) {
  const error = new Error(`${stage} timed out after ${timeoutMs}ms`);
  error.code = "JNEET_TIMEOUT";
  error.stage = stage;
  return error;
}

function withTimeout(promise, timeoutMs, stage) {
  let timer;
  const timeoutPromise = new Promise((_, reject) => {
    timer = setTimeout(() => reject(createTimeoutError(stage, timeoutMs)), timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => {
    clearTimeout(timer);
  });
}

function getErrorStatus(err) {
  return (
    err?.status ||
    err?.statusCode ||
    err?.response?.status ||
    err?.error?.code ||
    null
  );
}

function isRetryableGeminiError(err) {
  const status = Number(getErrorStatus(err));
  const message = `${err?.message || ""}`.toLowerCase();

  return (
    err?.code === "JNEET_TIMEOUT" ||
    status === 429 ||
    status === 500 ||
    status === 502 ||
    status === 503 ||
    status === 504 ||
    message.includes("timeout") ||
    message.includes("timed out") ||
    message.includes("temporarily unavailable") ||
    message.includes("service unavailable") ||
    message.includes("network") ||
    message.includes("fetch failed") ||
    message.includes("econnreset") ||
    message.includes("etimedout")
  );
}

async function runWithRetry(operation, label) {
  let lastError;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await operation();
    } catch (err) {
      lastError = err;

      if (!isRetryableGeminiError(err) || attempt === MAX_RETRIES) {
        throw err;
      }

      const delay = RETRY_BASE_DELAY_MS * 2 ** attempt;
      console.warn(`[Gemini] ${label} retry ${attempt + 1}/${MAX_RETRIES} in ${delay}ms`, {
        status: getErrorStatus(err),
        code: err?.code,
        message: err?.message,
      });
      await sleep(delay);
    }
  }

  throw lastError;
}

function buildSystemPrompt(examMode) {
  const subjects =
    examMode === "NEET"
      ? "Physics, Chemistry, and Biology (NEET-UG syllabus)"
      : "Physics, Chemistry, and Mathematics (JEE-Mains syllabus)";

  return `You are the JNEET+ AI Mentor — a senior teacher with 20 years of experience preparing students for ${examMode}. Your tone is that of a wise, patient, slightly exacting guide who genuinely wants this student to succeed.

CORE RULES (non-negotiable):
1. SYLLABUS GUARD: You ONLY answer questions related to ${subjects}.
2. LANGUAGE: Default to English. ONLY switch language if the student's message clearly indicates another language (Hindi, Hinglish, Marathi, or any other language/script) — match their language/script exactly in that case. Short, ambiguous greetings like "hi", "hello", "ok" are English by default — reply in English to those unless the rest of their message is clearly in another language. Never assume Hindi/Hinglish just because the topic or exam is Indian — the student's own words decide the language, nothing else.
3. RESPONSE QUALITY: Step-by-step, markdown, exam-focused.
4. WEAK TOPIC AWARENESS: Teach weak topics better (silently).
5. EXAM MODE: ${examMode}`;
}

// ── Non-streaming ────────────────────────────────────────────
export async function generateAIResponse(prompt, examMode, wmsContext = []) {
  try {
    const model = genAI.getGenerativeModel({
      model: GEMINI_MODEL,
      systemInstruction: buildSystemPrompt(examMode),
      generationConfig: {
        temperature: 0.7,
        topP: 0.9,
        maxOutputTokens: 2048,
      },
    });

    const result = await runWithRetry(
      () => withTimeout(
        model.generateContent(prompt),
        NON_STREAM_TIMEOUT_MS,
        "Gemini non-stream response"
      ),
      "non-stream response"
    );
    return result.response.text();

  } catch (err) {
    console.error("[Gemini] Non-stream error:", {
      status: getErrorStatus(err),
      code: err?.code,
      message: err?.message,
      stack: err?.stack,
    });
    throw classifyGeminiError(err);
  }
}

// ── Streaming ────────────────────────────────────────────────
export async function generateAIResponseStream(prompt, examMode, wmsContext = [], res) {
  let streamIterator = null;
  let fullResponse = "";
  let hasSentToken = false;

  try {
    const model = genAI.getGenerativeModel({
      model: GEMINI_MODEL,
      systemInstruction: buildSystemPrompt(examMode),
      generationConfig: {
        temperature: 0.7,
        topP: 0.9,
        maxOutputTokens: 2048,
      },
    });

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        const streamResult = await withTimeout(
          model.generateContentStream(prompt),
          STREAM_START_TIMEOUT_MS,
          "Gemini stream start"
        );

        streamIterator = streamResult.stream?.[Symbol.asyncIterator]?.();
        if (!streamIterator) {
          throw new Error("Gemini stream iterator was not available.");
        }

        while (!res.writableEnded) {
          const chunkResult = await withTimeout(
            streamIterator.next(),
            STREAM_CHUNK_TIMEOUT_MS,
            "Gemini stream chunk"
          );

          if (chunkResult.done) break;

          const text = chunkResult.value?.text?.();
          if (text && !res.writableEnded) {
            hasSentToken = true;
            fullResponse += text;
            res.write(`data: ${JSON.stringify({ token: text })}\n\n`);
          }
        }

        if (!res.writableEnded) {
          res.write(`data: ${JSON.stringify({ done: true, fullText: fullResponse })}\n\n`);
        }
        return;

      } catch (err) {
        if (streamIterator?.return) {
          try {
            await streamIterator.return();
          } catch (cleanupErr) {
            console.warn("[Gemini] Stream cleanup warning:", cleanupErr.message);
          }
          streamIterator = null;
        }

        const canRetry = !hasSentToken && isRetryableGeminiError(err) && attempt < MAX_RETRIES;
        if (!canRetry) {
          throw err;
        }

        const delay = RETRY_BASE_DELAY_MS * 2 ** attempt;
        console.warn(`[Gemini] stream retry ${attempt + 1}/${MAX_RETRIES} in ${delay}ms`, {
          status: getErrorStatus(err),
          code: err?.code,
          stage: err?.stage,
          message: err?.message,
        });
        await sleep(delay);
      }
    }

  } catch (err) {
    const classifiedError = classifyGeminiError(err);

    console.error("[Gemini] Stream error:", {
      status: getErrorStatus(err),
      code: err?.code,
      message: err?.message,
      stage: err?.stage,
      sentTokens: hasSentToken,
      stack: err?.stack,
    });

    if (!res.writableEnded) {
      res.write(`data: ${JSON.stringify({ error: classifiedError.message })}\n\n`);
    }
  } finally {
    if (streamIterator?.return) {
      try {
        await streamIterator.return();
      } catch (cleanupErr) {
        console.warn("[Gemini] Stream cleanup warning:", cleanupErr.message);
      }
    }
  }
}

// ── Chat title generation ───────────────────────────────────
export async function generateChatTitle(userMessageContent) {
  try {
    const model = genAI.getGenerativeModel({
      model: GEMINI_MODEL,
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 60,
        thinkingConfig: { thinkingBudget: 0 },
      },
    });

    const prompt = `Generate a short chat title (3-6 words max) summarizing what this student is asking about. Reply with ONLY the title text — no quotes, no punctuation at the end, no prefix like "Title:".

Student's message: "${userMessageContent.slice(0, 500)}"

Title:`;

    const result = await withTimeout(
      model.generateContent(prompt),
      TITLE_TIMEOUT_MS,
      "Gemini title generation"
    );

    const raw = result.response.text()?.trim() ?? "";
    const title = raw
      .replace(/^["'“”]+|["'“”]+$/g, "")
      .replace(/\.$/, "")
      .trim();

    if (!title || title.length < 2 || title.length > 80) {
      return null;
    }

    return title;

  } catch (err) {
    console.warn("[Gemini] Title generation failed — falling back to truncation:", {
      message: err?.message,
      code: err?.code,
    });
    return null;
  }
}

// ── Error handler ────────────────────────────────────────────
function classifyGeminiError(err) {
  const status = Number(getErrorStatus(err));
  const message = `${err?.message || ""}`.toLowerCase();

  let code = "AI_INTERNAL_ERROR";
  let statusCode = 500;
  let studentMessage = "AI abhi response nahi de pa raha. Please thodi der baad try karo.";

  if (err?.code === "JNEET_TIMEOUT" || message.includes("timeout") || message.includes("timed out")) {
    code = "AI_TIMEOUT";
    statusCode = 504;
    studentMessage = "AI response me zyada time lag raha hai. Please dobara try karo.";
  } else if (status === 429 || message.includes("rate limit") || message.includes("too many requests")) {
    code = "AI_RATE_LIMIT";
    statusCode = 429;
    studentMessage = "AI abhi busy hai. Thoda wait karke dobara try karo.";
  } else if (status === 400 || status === 403 || message.includes("invalid request")) {
    code = "AI_INVALID_REQUEST";
    statusCode = 400;
    studentMessage = "Is request ko process nahi kar pa raha. Sawaal ko thoda clearly likh kar try karo.";
  } else if (
    status === 500 ||
    status === 502 ||
    status === 503 ||
    status === 504 ||
    message.includes("temporarily unavailable") ||
    message.includes("service unavailable") ||
    message.includes("fetch failed") ||
    message.includes("network") ||
    message.includes("econnreset") ||
    message.includes("etimedout")
  ) {
    code = "AI_TEMPORARY_UNAVAILABLE";
    statusCode = 503;
    studentMessage = "AI service abhi temporarily busy hai. Please ek baar phir try karo.";
  }

  const e = new Error(studentMessage);
  e.statusCode = statusCode;
  e.code = code;
  return e;
}