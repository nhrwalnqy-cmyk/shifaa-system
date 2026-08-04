import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: "375px",
      },
      colors: {
        // Deep teal system — Shifaa brand
        teal: {
          50: "#EEF7F5",
          100: "#DCF0EB",
          200: "#B4E0D7",
          300: "#82C9BB",
          400: "#4CAC9B",
          500: "#25907D",
          600: "#177066",
          700: "#125A53",
          800: "#0E4A45",
          900: "#0A3733", // primary brand
          950: "#052422", // deepest ink-teal
        },
        // Amber — the queue-board signature accent
        amber: {
          50: "#FFF8EB",
          100: "#FFEBC2",
          300: "#FFCB6B",
          400: "#F5B440",
          500: "#E8A33D", // signature LED amber
          600: "#C77F1F",
          700: "#9C6316",
        },
        paper: "#FAFAF7",
        ink: "#0B1F1D",
        line: "#E2E9E7",
        danger: "#C4443A",
        success: "#1F8A6F",
        priority: "#B84A64",
      },
      fontFamily: {
        display: ["var(--font-cairo)", "Tahoma", "sans-serif"],
        body: ["var(--font-tajawal)", "Tahoma", "sans-serif"],
        mono: ["var(--font-ibm-mono)", "monospace"],
      },
      boxShadow: {
        soft: "0 2px 10px rgba(10, 55, 51, 0.06)",
        card: "0 4px 20px rgba(10, 55, 51, 0.08)",
        board: "0 0 0 1px rgba(232,163,61,0.25), 0 0 40px rgba(232,163,61,0.15)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.55" },
        },
        digitFlip: {
          "0%": { transform: "translateY(-6px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        pulseSoft: "pulseSoft 2s ease-in-out infinite",
        digitFlip: "digitFlip 0.35s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
