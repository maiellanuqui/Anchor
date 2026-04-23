import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        anchor: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
        },
        sage: {
          50: "#f6f7f6",
          100: "#e3e7e3",
          200: "#c7d0c7",
          300: "#a3b2a3",
          400: "#7a8f7a",
          500: "#5c7360",
          600: "#485a4b",
          700: "#3c4a3e",
          800: "#313d33",
          900: "#2a332b",
        },
        sand: {
          50: "#fdfbf9",
          100: "#f7f3ed",
          200: "#ede4d3",
        }
      },
    },
  },
  plugins: [],
};

export default config;
