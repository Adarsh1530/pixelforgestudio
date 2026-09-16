import type { Config } from "tailwindcss";

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
        pf: {
          primary: "#1C2833",   // Primary dark
          secondary: "#2E4053", // Secondary dark
          muted: "#AAB7B8",     // Muted gray
          light: "#D5DBDB",     // Light gray
          bg: "#F4F6F6",        // Off-white / light background
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
      },
      backgroundImage: {
        "grid-pattern": "linear-gradient(to right, rgba(213, 219, 219, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(213, 219, 219, 0.08) 1px, transparent 1px)",
        "dots-pattern": "radial-gradient(rgba(170, 183, 184, 0.15) 1px, transparent 1px)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
