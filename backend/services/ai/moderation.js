// ============================================================
//  JNEET+ AI — services/ai/moderation.js
//  18+ / adult-content and abusive-language detection for student
//  messages. The decision of what to DO with a flag (strike, polite
//  refusal, distress care) lives in services/ai/safety.js.
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
  "nudes", "nude\\s+(?:pics?|photos?|videos?|selfies?|images?|girls?|boys?|women|woman|men|man)", "naked\\s+(?:girls?|boys?|women|woman|men|man|pics?|photos?|videos?|body|bodies)",
  "sexting", "sexy\\s+(?:pics?|photos?|videos?|stor(?:y|ies)|girls?|boys?)",
  "erotic\\w*", "horny", "blow\\s?jobs?", "hand\\s?jobs?", "boobs?", "titties", "pussy",
  "dick\\s?pics?", "cock\\s?(?:pics?|sucker|ring)", "orgasm\\w*", "masturbat\\w*", "fap+ing", "bdsm", "fetish\\w*",
  "sex\\s+(?:chat|stor(?:y|ies)|videos?|scenes?|toys?|tape)",
  "(?:have|having|do|doing|wanna|want\\s+to)\\s+sex",
  "sleep\\s+with\\s+me", "dirty\\s+talk",
  "send\\s+(?:me\\s+)?(?:nudes?|pics)",
  "chudai", "chudwa\\w*", "lund(?!\\s+universit)", "lauda", "bhosd\\w*", "bhosad\\w*", "choot", "randi",
  "gaand\\s?(?:marw|mara)\\w*", "sex\\s+karo", "sex\\s+karna\\s+hai",
];
const EXPLICIT_RE = new RegExp(`(?<![a-z0-9])(?:${EXPLICIT_EN.join("|")})(?![a-z0-9])`, "i");

// Roleplay / story requests of a sexual or romantic kind.
const ROLEPLAY_RE = /(?:role\s?play|story|stories|chat|baat|talk)[^.\n]{0,40}\b(?:sexual|erotic|18\s?\+|adult|romantic\s+night|hot\s+scene)\b/i;

const DEVANAGARI_RE = /(चुदाई|चूदाई|लंड|लौड़ा|भोसड़|रंडी|पॉर्न|पोर्न|नंगी|सेक्स\s*(चैट|स्टोरी|वीडियो))/;

// "18+" only as a content tag — never inside arithmetic ("show that 18 + 4√2 …",
// "x² + 18 + 2x"): a digit, bracket, root or single-letter variable after the
// plus sign means it is maths.
const ADULT_TAG_RE = /(?<![a-z0-9])(?:18\s?\+(?!\s*(?:[0-9(√π]|[a-z](?![a-z])))|adult\s+content(?!\s+of)|adults?\s+only)(?![a-z0-9])/i;

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

// ── Abusive / vulgar language (gaali) ─────────────────────────────
// Sexual slurs and direct insults. Matching here alone NEVER gives a
// strike: it only sends the message to the context judge (safety.js),
// which decides whether it is really abuse. Without the judge the
// student just gets a polite "padhai pe focus" reply.
const ABUSE_EN = [
  "madar\\s?chod\\w*", "mader\\s?chod\\w*", "maa\\s?(?:ki|ke)\\s?(?:chut|choot)\\w*",
  "b[ae]h[ae]?n\\s?chod\\w*", "bhen\\s?chod\\w*", "chutiy\\w*", "gandu\\w*",
  "la[uw]d[ae]\\s?(?:ka|ke|lag)\\w*", "lawde\\w*", "bhadw\\w*", "harami\\w*", "kamin[ae]\\w*",
  "motherfuck\\w*", "fuck\\s*(?:you|u|off|this|that)", "fuck\\w*", "bitch\\w*", "whores?", "slut\\w*", "bastards?",
];
const ABUSE_RE = new RegExp(`(?<![a-z0-9])(?:${ABUSE_EN.join("|")})(?![a-z0-9])`, "i");
const ABUSE_DEVANAGARI_RE = /(मादरचोद|मादर\s*चोद|बहनचोद|बहन\s*चोद|भेनचोद|चूतिया|चुतिया|गांडू|गान्डू|हरामी|भड़वा|कुतिया)/;

export function detectAbuse(text) {
  if (typeof text !== "string" || !text.trim()) return false;
  return ABUSE_RE.test(normalizeForModeration(text)) || ABUSE_DEVANAGARI_RE.test(text);
}

// ── Provider moderation (OpenAI omni-moderation, free, multilingual) ──
const PROVIDER_TIMEOUT_MS = 1500;
const PROVIDER_SEXUAL_THRESHOLD = 0.85;
const PROVIDER_ABUSE_THRESHOLD = 0.85;
const PROVIDER_SELF_HARM_THRESHOLD = 0.5;

const num = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);

// One call, every category we use. Returns null when the provider is
// off, slow or failing (fail open — a hiccup must never block a student).
//   { sexual, minors, abuse, selfHarm }  (booleans, thresholds applied)
export async function moderateProviderAll(text, { fetchImpl = globalThis.fetch } = {}) {
  if (!env.OPENAI_API_KEY || typeof fetchImpl !== "function") return null;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), PROVIDER_TIMEOUT_MS);
  try {
    const res = await fetchImpl(`${env.OPENAI_BASE_URL}/moderations`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${env.OPENAI_API_KEY}` },
      body: JSON.stringify({ model: "omni-moderation-latest", input: String(text).slice(0, 2000) }),
      signal: controller.signal,
    });
    if (!res.ok) return null;
    const r = (await res.json())?.results?.[0];
    if (!r) return null;
    const c = r.categories ?? {};
    const sc = r.category_scores ?? {};
    return {
      sexual: Boolean(c.sexual) && num(sc.sexual) >= PROVIDER_SEXUAL_THRESHOLD,
      minors: Boolean(c["sexual/minors"]),
      abuse:
        ["harassment/threatening", "hate/threatening", "hate"].some((k) => c[k] && num(sc[k]) >= PROVIDER_ABUSE_THRESHOLD) ||
        (Boolean(c.harassment) && num(sc.harassment) >= 0.95),
      selfHarm:
        ["self-harm/intent", "self-harm"].some((k) => c[k] || num(sc[k]) >= PROVIDER_SELF_HARM_THRESHOLD),
    };
  } catch {
    return null; // fail open
  } finally {
    clearTimeout(timer);
  }
}

// Kept for older callers/tests: true only for a high-confidence sexual result.
export async function moderateWithProvider(text, opts = {}) {
  const r = await moderateProviderAll(text, opts);
  return Boolean(r && (r.minors || r.sexual));
}

// Patterns first (instant, free), provider second.
export async function isAdultRequest(text) {
  if (detectAdultContent(text)) return true;
  if (env.NODE_ENV === "test" || !env.AI_MODERATION_PROVIDER) return false;
  return moderateWithProvider(text);
}
