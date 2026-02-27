import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./sections/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        metaverse: {
          navy: "#142030",
          pink: "#ff2d7d",
          plum: "#732654",
          beige: "#E9D8C8",
          slate: "#86A3B3",
          "dark-blue": "#203644",
        },
        dark: {
          DEFAULT: "#142030",
          100: "#1a2234",
          200: "#203644",
          300: "#0a0f1e",
          400: "#020408",
        },
      },
      fontFamily: {
        orbitron: ["var(--font-orbitron)", "monospace"],
        inter: ["var(--font-inter)", "sans-serif"],
      },
      backgroundImage: {
        "meta-gradient": "linear-gradient(135deg, #142030, #732654, #ff2d7d)",
        "card-gradient":
          "linear-gradient(135deg, rgba(115,38,84,0.1), rgba(20,32,48,0.2))",
        "hero-gradient":
          "radial-gradient(ellipse at center, rgba(255,45,125,0.15) 0%, rgba(134,163,179,0.05) 50%, transparent 100%)",
        "metaverse-pattern": "url('/images/metaverse-bg.png')",
      },
      boxShadow: {
        meta: "0 0 20px rgba(255,45,125,0.4), 0 0 40px rgba(115,38,84,0.2)",
        "meta-pink": "0 0 20px rgba(255,45,125,0.4), 0 0 40px rgba(255,45,125,0.2)",
        "meta-slate": "0 0 20px rgba(134,163,179,0.4), 0 0 40px rgba(134,163,179,0.2)",
        "card-hover":
          "0 0 30px rgba(255,45,125,0.3), 0 8px 32px rgba(0,0,0,0.4)",
        "prize-glow":
          "0 0 40px rgba(255,45,125,0.5), 0 0 80px rgba(115,38,84,0.2)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
        "scan": "scan 3s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 20px rgba(255,45,125,0.3)" },
          "100%": { boxShadow: "0 0 40px rgba(255,45,125,0.7), 0 0 60px rgba(134,163,179,0.3)" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
