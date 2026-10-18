// ============================================================
//  JNEET+ AI — services/ai/moderation.js
//  18+ / adult-content detection for student messages.
//
//  Two layers:
//    1. A deterministic pattern list (English, Hinglish, Hindi). It is
//       deliberately about EXPLICIT / sexual-content-seeking language
//       only. Syllabus words (sexual reproduction, sex determination,
//       sex hormones, gametes, menstrual cycle, "naked seeds",
//       "naked eye" …) must never trigger it — there are tests for that.
//    2. The provider's free moderation endpoint as a second opinion for
//       phrasing the list does not know. It FAILS OPEN (a timeout or
//       error means "not flagged") so a provider hiccup can never block
//       a student, and it is skipped under NODE_ENV=test.
// ============================================================

import { env } from "../../config/env.js";

const EXPLICIT_EN = [
  "porn\\w*", "pr0n", "xxx", "nsfw", "hentai", "onlyfans",
  "nudes?", "naked\\s+(?:girls?|boys?|women|woman|men|man|pics?|photos?|videos?|body|bodies)",
  "sexting", "sexy\\s+(?:pics?|photos?|videos?|stor(?:y|ies)|girls?|boys?)",
  "erotic\\w*", "horny", "blow\\s?jobs?", "hand\\s?jobs?", "boobs?", "tits", "titties", "pussy",
  "dick\\s?pics?", "cock", "orgasm\\w*", "masturbat\\w*", "fap+ing", "bdsm", "fetish\\w*", "incest",
  "sex\\s+(?:chat|stor(?:y|ies)|videos?|scenes?|toys?|tape)",
  "(?:have|having|do|doing|wanna|want\\s+to)\\s+sex",
  "sleep\\s+with\\s+me", "dirty\\s+talk",
  "send\\s+(?:me\\s+)?(?:nudes?|pics)",
  "chudai", "chudwa\\w*", "lund", "lauda", "bhosd\\w*", "bhosad\\w*", "choot", "randi",
  "gaand\\s?(?:marw|mara)\\w*", "sex\\s+karo", "sex\\s+karna\\s+hai",
];
const EXPLICIT_RE = new RegExp(`(?<![a-z0-9])(?:${EXPLICIT_EN.join("|")})(?![a-z0-9])`, "i");

// Roleplay / story requests of a sexual or romantic kind.
const ROLEPLAY_RE = /(?:role\s?play|story|stories|chat|baat|talk)[^.\n]{0,40}\b(?:sexual|erotic|18\s?\+|adult|romantic\s+night|hot\s+scene)\b/i;

const DEVANAGARI_RE = /(चुदाई|चूदाई|लंड|लौड़ा|भोसड़|रंडी|पॉर्न|पोर्न|नंगी|सेक्स\s*(चैट|स्टोरी|वीडियो))/;

const ADULT_TAG_RE = /(?<![a-z0-9])(?:18\s?\+|adult\s+content|adults?\s+only)(?![a-z0-9])/i;

// Light de-obfuscation: "p0rn", "s3xting", "n.u.d.e.s", "porrrn".
export function normalizeForModeration(text) {
  return String(text ?? "")
    .normalize("NFKC")
    .replace(/[\u200b-\u200f\u2060\ufeff]/g, "")
    .toLowerCase()
    .replace(/(?<=[a-z])0(?=[a-z])/g, "o")
    .replace(/(?<=[a-z])3(?=[a-z])/g, "e")
    .replace(/(?<=[a-z])1(?=[a-z])/g, "i")
    .replace(/(?<=[a-z])\$(?=[a-z])/g, "s")
    .replace(/(?<=[a-z])@(?=[a-z])/g, "a")
    .replace(/\b(?:[a-z][.\-_*]){3,}[a-z]\b/g, (m) => m.replace(/[.\-_*]/g, ""))
    .replace(/([a-z])\1{2,}/g, "$1$1");
}

export function detectAdultContent(text) {
  if (typeof text !== "string" || !text.trim()) return false;
  const t = normalizeForModeration(text);
  return EXPLICIT_RE.test(t) || ROLEPLAY_RE.test(t) || DEVANAGARI_RE.test(text) ||
    (ADULT_TAG_RE.test(t) && /(?:send|show|share|give|chat|video|photo|pic|story|content)/.test(t));
}

const PROVIDER_TIMEOUT_MS = 1500;
const PROVIDER_SEXUAL_THRESHOLD = 0.85;

export async function moderateWithProvider(text, { fetchImpl = globalThis.fetch } = {}) {
  if (!env.OPENAI_API_KEY || typeof fetchImpl !== "function") return false;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), PROVIDER_TIMEOUT_MS);
  try {
    const res = await fetchImpl(`${env.OPENAI_BASE_URL}/moderations`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${env.OPENAI_API_KEY}` },
      body: JSON.stringify({ model: "omni-moderation-latest", input: String(text).slice(0, 2000) }),
      signal: controller.signal,
    });
    if (!res.ok) return false;
    const r = (await res.json())?.results?.[0];
    if (!r) return false;
    if (r.categories?.["sexual/minors"]) return true;
    return Boolean(r.categories?.sexual) && Number(r.category_scores?.sexual) >= PROVIDER_SEXUAL_THRESHOLD;
  } catch {
    return false; // fail open
  } finally {
    clearTimeout(timer);
  }
}

// What askAI calls: patterns first (instant, free), provider second.
export async function isAdultRequest(text) {
  if (detectAdultContent(text)) return true;
  if (env.NODE_ENV === "test" || !env.AI_MODERATION_PROVIDER) return false;
  return moderateWithProvider(text);
}
