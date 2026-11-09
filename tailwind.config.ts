import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        carbon: {
          950: "#07080c",
          900: "#0b0d14",
          850: "#10131e",
          800: "#171b2b",
          700: "#22273d",
          600: "#2e3452",
        },
        racing: {
          red: "#e10600",
          hoverRed: "#ff1801",
          gold: "#e5b83b",
          cyan: "#00d2be",
          purple: "#9b51e0",
          green: "#00a35c",
        },
        tyre: {
          soft: "#e10600",
          medium: "#ffd12f",
          hard: "#ffffff",
          intermediate: "#39b54a",
          wet: "#0072ce",
        },
      },
      fontFamily: {
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      animation: {
        "pulse-fast": "pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        glow: {
          "0%": { boxShadow: "0 0 5px rgba(225, 6, 0, 0.2)" },
          "100%": { boxShadow: "0 0 20px rgba(225, 6, 0, 0.6)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
