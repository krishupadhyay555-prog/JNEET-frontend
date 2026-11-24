// Shared bits of the Free Quick Mock page and its CBT screen.
import { CAPTCHA_ERROR } from "../../utils/turnstile.js";

export const EXAMS = {
  JEE:  { title: "JEE Main", qs: 30, min: 60, split: "10 Maths · 10 Physics · 10 Chemistry", note: "incl. 6 numericals" },
  NEET: { title: "NEET UG",  qs: 45, min: 45, split: "11 Physics · 11 Chemistry · 23 Biology", note: "all MCQs" },
};

export function friendly(err, fallback) {
  if (err?.isCaptchaError) return CAPTCHA_ERROR;
  if (err?.isNetworkError || err?.isTimeout) return "Your internet looks slow. Please check it and try again.";
  return err?.response?.data?.error || fallback;
}
export const nowMs = () => Date.now();
export const fmtTime = (s) => `${Math.floor(s / 60)}m ${String(s % 60).padStart(2, "0")}s`;
