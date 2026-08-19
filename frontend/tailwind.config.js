/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // presence of "light" class = light mode; absence = dark (default)
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'DM Sans'", "system-ui", "-apple-system", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        // 🔄 CSS-variable-driven — these now automatically flip
        // between dark (default) and light (".light" class on
        // <html>) because the underlying variables are redefined
        // in index.css. No component using these tokens needs to
        // change — that's the whole point of using tokens.
        bg: {
          base:    "rgb(var(--bg-base) / <alpha-value>)",
          surface: "rgb(var(--bg-surface) / <alpha-value>)",
          panel:   "rgb(var(--bg-panel) / <alpha-value>)",
          card:    "rgb(var(--bg-card) / <alpha-value>)",
          border:  "rgb(var(--bg-border) / <alpha-value>)",
          hover:   "rgb(var(--bg-hover) / <alpha-value>)",
        },
        // Semantic text tokens — use these instead of hardcoded
        // "text-white" going forward so text also flips correctly.
        fg: {
          primary:   "rgb(var(--fg-primary) / <alpha-value>)",
          secondary: "rgb(var(--fg-secondary) / <alpha-value>)",
        },
        // 🔄 FIX: violet is now ALSO CSS-variable-driven, same
        // pattern as bg/fg above. This used to be static hex —
        // meaning every bg-violet-600 / text-violet-400 / etc
        // across the whole app was frozen on the terracotta ramp
        // no matter what accent skin (Normal/NEET/JEE) was active.
        // That was the real reason the orange never went away
        // even after index.css's --violet-main got fixed — nothing
        // here was reading that variable. Now every one of these
        // 11 stops is wired to index.css's --violet-{N} variables,
        // which index.css redefines per data-accent. One config
        // change, and every component using violet-* anywhere in
        // the app — Dashboard, Sidebar, ProfileMenu, buttons,
        // badges, everything — now correctly follows the active
        // accent automatically. No component file needs editing.
        violet: {
          50:  "rgb(var(--violet-50)  / <alpha-value>)",
          100: "rgb(var(--violet-100) / <alpha-value>)",
          200: "rgb(var(--violet-200) / <alpha-value>)",
          300: "rgb(var(--violet-300) / <alpha-value>)",
          400: "rgb(var(--violet-400) / <alpha-value>)",
          500: "rgb(var(--violet-500) / <alpha-value>)",
          600: "rgb(var(--violet-600) / <alpha-value>)",
          700: "rgb(var(--violet-700) / <alpha-value>)",
          800: "rgb(var(--violet-800) / <alpha-value>)",
          900: "rgb(var(--violet-900) / <alpha-value>)",
          950: "rgb(var(--violet-950) / <alpha-value>)",
        },
        accent: {
          emerald: "#10b981",
          amber:   "#f59e0b",
          red:     "#ef4444",
          blue:    "#3b82f6",
        },
      },
      animation: {
        "fade-in":       "fadeIn 0.2s ease-out forwards",
        "fade-up":       "fadeUp 0.25s ease-out forwards",
        "slide-in":      "slideIn 0.25s ease-out forwards",
        "bounce-dots":   "bounceDots 1.1s ease-in-out infinite",
        "spin-slow":     "spin 1.2s linear infinite",
        "pulse-soft":    "pulseSoft 2s ease-in-out infinite",
        "skeleton":      "skeleton 1.5s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: { from: { opacity: "0" }, to: { opacity: "1" } },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          from: { opacity: "0", transform: "translateX(-10px)" },
          to:   { opacity: "1", transform: "translateX(0)" },
        },
        bounceDots: {
          "0%, 80%, 100%": { transform: "translateY(0)",    opacity: "0.35" },
          "40%":           { transform: "translateY(-6px)", opacity: "1" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%":      { opacity: "0.6" },
        },
        skeleton: {
          "0%":   { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
      },
      boxShadow: {
        // 🔄 Now reads the accent glow variable too, instead of a
        // hardcoded terracotta rgba — glows correctly tint green/
        // blue/gray depending on the active accent skin.
        "glow-violet": "0 0 20px var(--violet-glow)",
        "glow-sm":     "0 0 10px var(--violet-glow)",
        "card":        "0 1px 3px rgba(0,0,0,0.4), 0 4px 12px rgba(0,0,0,0.3)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};