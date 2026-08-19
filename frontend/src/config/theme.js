// ============================================================
//  JNEET+ AI — config/theme.js  (Updated)
//  Exam-based accent theming (NEET / JEE / Mono / Neutral).
//  getTheme() now takes an optional accentStyle param — existing
//  calls like getTheme(examMode) still work unchanged (backward
//  compatible), so nothing that already uses this file breaks.
// ============================================================

export const EXAM_THEMES = {
  NEET: {
    key: "NEET",
    userBubble: "bg-[#E1F5EE] text-[#085041]",
    accentBg: "bg-[#5EEAD4]",     // light "water drop" teal
    accentText: "text-[#0D9488]",
    accentBorder: "border-[#5EEAD4]",
  },
  JEE: {
    key: "JEE",
    userBubble: "bg-[#EEEDFE] text-[#26215C]",
    accentBg: "bg-[#A5B4FC]",     // light indigo
    accentText: "text-[#4F46E5]",
    accentBorder: "border-[#A5B4FC]",
  },
  mono: {
    key: "mono",
    userBubble: "bg-gray-100 text-gray-900",
    accentBg: "bg-gray-900",
    accentText: "text-gray-900",
    accentBorder: "border-gray-900",
  },
  neutral: {
    key: "neutral",
    userBubble: "bg-gray-100 text-gray-800",
    accentBg: "bg-gray-500",
    accentText: "text-gray-500",
    accentBorder: "border-gray-400",
  },
};

/**
 * Returns the theme object for a given exam mode + accent style.
 * accentStyle: "auto" (default, follows NEET/JEE) | "mono" (black & white)
 * Falls back to neutral if examMode is missing/unrecognised.
 */
export function getTheme(examMode, accentStyle = "auto") {
  if (accentStyle === "mono") return EXAM_THEMES.mono;
  return EXAM_THEMES[examMode] || EXAM_THEMES.neutral;
}