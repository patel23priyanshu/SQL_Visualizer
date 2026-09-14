import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Base palette directly matching the 5 palette colors:
        // #2B2D42 (Dark Slate Navy)
        // #8D99AE (Cool Gray)
        // #EDF2F4 (Ice White)
        // #EF233C (Bright Red)
        // #D90429 (Crimson Red)
        slate: {
          50:  "#EDF2F4", // Exact palette white
          100: "#e0e6ea",
          150: "#cdd6de",
          200: "#b5c1cd",
          300: "#9daab9",
          400: "#8D99AE", // Exact palette cool gray
          500: "#6e7b91",
          600: "#4f5b70",
          700: "#3d425a",
          800: "#2B2D42", // Exact palette dark navy
          900: "#1d1e2e",
          950: "#13141f",
        },
        brandRed: {
          400: "#ff4d65",
          500: "#EF233C", // Exact palette bright red
          600: "#D90429", // Exact palette crimson red
          700: "#b50322",
          800: "#8f021b",
          900: "#630113",
          950: "#3d000b",
        },
        palette: {
          dark:    "#2B2D42",
          gray:    "#8D99AE",
          white:   "#EDF2F4",
          red:     "#EF233C",
          crimson: "#D90429",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(19, 20, 31, 0.7)",
        "glow-slate": "0 0 24px rgba(141, 153, 174, 0.2)",
        "glow-red": "0 0 25px rgba(239, 35, 60, 0.35)",
        "glow-active": "0 0 20px rgba(237, 242, 244, 0.15)",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { opacity: "0.6", filter: "brightness(1)" },
          "50%": { opacity: "1", filter: "brightness(1.3)" },
        },
        flowDash: {
          to: { strokeDashoffset: "-24" },
        },
      },
      animation: {
        pulseGlow: "pulseGlow 1.6s ease-in-out infinite",
        flowDash: "flowDash 1s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
