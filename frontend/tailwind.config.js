/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ucips: {
          // ── Primarios institucionales (Pantone) ──────────────────────
          navy:       "#242236",   // Pantone 276 C
          "navy-dark":"#0d0c19",   // navy profundo (fondos oscuros)
          gold:       "#e79b42",   // Pantone 7563 C
          "gold-light":"#f0b86a",  // tono claro del dorado

          // ── Familia borgoña / carmesí ─────────────────────────────────
          burgundy:   "#5f1b2d",   // borgoña oscuro
          crimson:    "#861e34",   // carmesí medio
          "crimson-bright": "#af1731", // carmesí vivo

          // ── Familia teal / verde institucional ────────────────────────
          "teal-dark":  "#0c312d",
          teal:         "#246257",
          "teal-light": "#3d9b84",

          // ── Familia camel / crema ─────────────────────────────────────
          camel:      "#c79b66",
          tan:        "#e2be96",
          cream:      "#fffded",

          // ── Neutros ───────────────────────────────────────────────────
          charcoal:   "#484747",
          "gray-mid": "#b2b2b1",
          "gray-light":"#ececec",
        },
        // Surface colors — switch between light & dark via CSS vars
        dark: {
          DEFAULT:  "rgb(var(--surface-bg)  / <alpha-value>)",
          surface:  "rgb(var(--surface-card) / <alpha-value>)",
          elevated: "rgb(var(--surface-overlay) / <alpha-value>)",
          border:   "rgb(var(--surface-border) / <alpha-value>)",
          hover:    "rgb(var(--surface-hover) / <alpha-value>)",
        },
        // Semantic text tokens
        ink: {
          DEFAULT: "rgb(var(--ink)       / <alpha-value>)",
          soft:    "rgb(var(--ink-soft)  / <alpha-value>)",
          muted:   "rgb(var(--ink-muted) / <alpha-value>)",
          faint:   "rgb(var(--ink-faint) / <alpha-value>)",
        },
        // Accent tokens — switch with theme
        accent: {
          DEFAULT: "rgb(var(--accent)         / <alpha-value>)",
          crimson: "rgb(var(--accent-crimson) / <alpha-value>)",
          teal:    "rgb(var(--accent-teal)    / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "dark-sm": "0 1px 3px rgba(0,0,0,0.4)",
        "dark-md": "0 4px 20px rgba(0,0,0,0.3)",
        "dark-lg": "0 8px 40px rgba(0,0,0,0.4)",
        gold:    "0 0 24px rgba(231,155,66,0.30)",
        crimson: "0 0 24px rgba(175,23,49,0.25)",
      },
    },
  },
  plugins: [],
};
