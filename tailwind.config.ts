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
        base: {
          950: "#000000",
          900: "#0a0a0a",
          800: "#111111",
          700: "#1a1a1a",
          600: "#2a2a2a",
        },
        lime: {
          DEFAULT: "#C8FF00",
          400: "#e0ff4d",
          500: "#C8FF00",
          600: "#a8d600",
          700: "#7da300",
        },
        muted: {
          DEFAULT: "#888888",
          dark: "#555555",
          light: "#aaaaaa",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
        pixel: ["'Press Start 2P'", "monospace"],
      },
      boxShadow: {
        "glow-lime": "0 0 20px rgba(200, 255, 0, 0.25)",
        "glow-lime-sm": "0 0 10px rgba(200, 255, 0, 0.15)",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { opacity: "0.5", filter: "brightness(1)" },
          "50%": { opacity: "1", filter: "brightness(1.4)" },
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
