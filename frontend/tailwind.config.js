/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
    "./providers/**/*.{js,ts,jsx,tsx,mdx}",
    "./stores/**/*.{js,ts,jsx,tsx,mdx}",
    "./services/**/*.{js,ts,jsx,tsx,mdx}",
    "./types/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#A259FF",
        background: "#2B2B2B",
        "background-secondary": "#3B3B3B",
        "text-primary": "#FFFFFF",
        "text-secondary": "#CCCCCC",
        "text-caption": "#858584",
      },
      fontFamily: {
        "work-sans": ["Work Sans", "sans-serif"],
        "space-mono": ["Space Mono", "monospace"],
      },
      fontSize: {
        h1: ["67px", { lineHeight: "1.1", fontWeight: "600" }],
        h2: ["51px", { lineHeight: "1.1", fontWeight: "600" }],
        h3: ["38px", { lineHeight: "1.2", fontWeight: "600" }],
        h4: ["28px", { lineHeight: "1.4", fontWeight: "700" }],
        h5: ["22px", { lineHeight: "1.4", fontWeight: "600" }],
        body: ["16px", { lineHeight: "1.4", fontWeight: "400" }],
        "body-large": ["22px", { lineHeight: "1.6", fontWeight: "400" }],
        caption: ["12px", { lineHeight: "1.1", fontWeight: "400" }],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-primary": "linear-gradient(135deg, #A259FF 0%, #7C3AED 100%)",
        "gradient-card": "linear-gradient(145deg, #3B3B3B 0%, #2B2B2B 100%)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
