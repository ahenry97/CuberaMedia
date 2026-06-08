import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#06111F",
          900: "#071A2F",
          800: "#0B2540"
        },
        ocean: {
          700: "#0E7490",
          600: "#0891B2",
          500: "#06B6D4"
        },
        blue: {
          600: "#2563EB",
          700: "#1D4ED8"
        },
        ink: "#0F172A",
        slate: "#334155",
        muted: "#64748B",
        teal: "#0891B2",
        coral: "#F15A4A",
        paper: "#F8FAFC",
        line: "#E2E8F0"
      },
      boxShadow: {
        soft: "0 18px 50px rgba(15, 23, 42, 0.10)",
        premium: "0 24px 70px rgba(6, 17, 31, 0.22)"
      }
    }
  },
  plugins: []
};

export default config;
