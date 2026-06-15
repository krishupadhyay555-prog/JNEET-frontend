/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'DM Sans'", "system-ui", "-apple-system", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },

      colors: {
        bg: {
          base:    "#08080f",
          surface: "#0e0e1c",
          panel:   "#11111f",
          card:    "#141428",
          border:  "#1e1e38",
          hover:   "#1a1a32",
        },

        // 🔵 FIX: violet ko hi replace kiya gaya hai (no class change needed)
        violet: {
          50:  "#f0faff",
          100: "#e0f3ff",
          200: "#c7e9ff",
          300: "#a5d9ff",
          400: "#7fc4ff",
          500: "#5bb3ff",   // MAIN SOFT SKY BLUE
          600: "#4aa1e6",
          700: "#3c87cc",
          800: "#316ea8",
          900: "#285a88",
          950: "#183655",
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
        fadeIn: {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
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
        // 🔵 FIX glow
        "glow-violet": "0 0 20px rgba(91, 179, 255, 0.25)",
        "glow-sm":     "0 0 10px rgba(91, 179, 255, 0.15)",
        "card":        "0 1px 3px rgba(0,0,0,0.4), 0 4px 12px rgba(0,0,0,0.3)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};