/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ucips: {
          navy: "#0d2137",
          blue: "#1a4a7a",
          gold: "#c9a84c",
          "gold-light": "#e8c56a",
        },
        dark: {
          DEFAULT: "#0b0f1a",
          surface: "#111827",
          elevated: "#1a2235",
          border: "#1e2d45",
          hover: "#1f2f48",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "dark-sm": "0 1px 3px rgba(0,0,0,0.6)",
        "dark-md": "0 4px 20px rgba(0,0,0,0.5)",
        "dark-lg": "0 8px 40px rgba(0,0,0,0.6)",
        gold: "0 0 24px rgba(201,168,76,0.25)",
      },
    },
  },
  plugins: [],
};
