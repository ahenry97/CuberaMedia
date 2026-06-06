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
        ink: "#17202a",
        slate: "#334155",
        teal: "#0f766e",
        coral: "#f9735b",
        mint: "#d9f99d",
        paper: "#f8fafc",
        line: "#dbe3ea"
      },
      boxShadow: {
        soft: "0 16px 45px rgba(23, 32, 42, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
