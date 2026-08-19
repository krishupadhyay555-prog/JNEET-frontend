// ============================================================
//  JNEET+ AI — context/ThemeContext.jsx  (v2 — accent system)
//  ADDED: accentOverride state ("auto" | "normal").
//    - "auto" (default): light mode automatically tints itself
//      based on the student's exam mode (NEET → green glass,
//      JEE → blue glass). The actual resolution (which needs
//      examMode from AuthContext) happens in a separate
//      <AccentSync> component in App.jsx — kept here would create
//      a circular dependency between ThemeProvider and
//      AuthProvider, since ThemeProvider sits OUTSIDE AuthProvider
//      in the provider tree.
//    - "normal": student opted out of the color tint — light mode
//      stays on the original neutral palette (unchanged from
//      before), for anyone who doesn't want the color.
//  Everything else (mode, toggleMode, dark/light) is UNCHANGED.
// ============================================================

import { createContext, useContext, useState, useLayoutEffect, useCallback } from "react";

const ThemeContext = createContext(null);
const STORAGE_KEY        = "jneet_theme_mode";
const ACCENT_STORAGE_KEY = "jneet_theme_accent";

export function ThemeProvider({ children }) {
  // CHANGED: default mode is now "light" (was "dark"). Product
  // decision — everyone should see the system-based accent
  // (NEET green / JEE blue, auto-resolved) in its light "white
  // tone" glass look by default, and switch to dark manually if
  // they prefer. accentOverride already defaulted to "auto" below,
  // so this single change is enough — no other logic needed.
  const [mode, setModeState] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === "dark" ? "dark" : "light";
    } catch {
      return "light";
    }
  });

  const [accentOverride, setAccentOverrideState] = useState(() => {
    try {
      const saved = localStorage.getItem(ACCENT_STORAGE_KEY);
      return saved === "normal" ? "normal" : "auto";
    } catch {
      return "auto";
    }
  });

  useLayoutEffect(() => {
    const root = document.documentElement;
    if (mode === "light") {
      root.classList.add("light");
    } else {
      root.classList.remove("light");
    }
  }, [mode]);

  const setMode = useCallback((next) => {
    setModeState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // localStorage unavailable (private browsing etc.) — theme
      // just won't persist across reloads, not a functional break.
    }
  }, []);

  const toggleMode = useCallback(() => {
    setMode(mode === "light" ? "dark" : "light");
  }, [mode, setMode]);

  const setAccentOverride = useCallback((next) => {
    setAccentOverrideState(next);
    try {
      localStorage.setItem(ACCENT_STORAGE_KEY, next);
    } catch {
      // Same as above — non-critical if it doesn't persist.
    }
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        mode, setMode, toggleMode, isLight: mode === "light",
        accentOverride, setAccentOverride,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}