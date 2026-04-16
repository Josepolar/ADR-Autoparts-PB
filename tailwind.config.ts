import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Neo-Industrial Dark Mode color palette
        "cyber-blue": {
          50: "#ffe0e0",
          100: "#ffcccc",
          200: "#ff9999",
          300: "#ff6666",
          400: "#ff3333",
          500: "#ff0000", // Primary - Vibrant Red
          600: "#dd0000",
          700: "#bb0000",
          800: "#990000",
          900: "#660000",
        },
        "nardo-gray": {
          50: "#f8f8f9",
          100: "#f1f1f3",
          200: "#dcdce0",
          300: "#c7c7cc",
          400: "#a8a8ae",
          500: "#6d6e71", // Primary - Nardo Gray (Professional surfaces)
          600: "#565759",
          700: "#3f3f41",
          800: "#282829",
          900: "#111111",
        },
        "vivid-amber": {
          50: "#fffaf0",
          100: "#fff5e1",
          200: "#ffe0b2",
          300: "#ffcd83",
          400: "#ffb400", // Primary - Vivid Amber (Critical CTAs)
          500: "#ff9800",
          600: "#f57c00",
          700: "#e65100",
          800: "#bf360c",
          900: "#4e342e",
        },
      },
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
        display: ["'Bebas Neue'", "'Squada One'", "sans-serif"],
        mono: ["Fira Code", ...defaultTheme.fontFamily.mono],
      },
      backgroundColor: {
        "surface-dark": "#111111",
        "surface-light": "#1a1a1c",
        "surface-alt": "#282829",
      },
      borderColor: {
        "surface": "#3f3f41",
      },
      textColor: {
        "primary": "#f1f1f3",
        "secondary": "#a8a8ae",
        "muted": "#6d6e71",
      },
      boxShadow: {
        "glow-blue": "0 0 20px rgba(255, 0, 0, 0.4)",
        "glow-amber": "0 0 20px rgba(255, 180, 0, 0.3)",
      },
      animation: {
        "pulse-glow": "pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "slide-in": "slide-in 0.3s ease-out",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": {
            boxShadow: "0 0 20px rgba(0, 212, 255, 0.3)",
          },
          "50%": {
            boxShadow: "0 0 30px rgba(0, 212, 255, 0.5)",
          },
        },
        "slide-in": {
          "0%": {
            transform: "translateX(-100%)",
            opacity: "0",
          },
          "100%": {
            transform: "translateX(0)",
            opacity: "1",
          },
        },
      },
      transitionDuration: {
        "250": "250ms",
        "350": "350ms",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms") as any,
    require("@tailwindcss/typography") as any,
    require("tailwindcss-animate") as any,
  ],
} as Config;

export default config;
