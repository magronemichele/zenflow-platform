/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      // ─── ZenFlow Design Tokens ───────────────────────────────
      colors: {
        // Primary teal palette — main brand colour
        teal: {
          50: "#e6f9f8", 100: "#b3efec", 200: "#80e4e0",
          300: "#4dd9d4", 400: "#26cfc8", 500: "#00c4bc",
          600: "#00a8a1", 700: "#007a75", 800: "#004d4a",
          900: "#002120",
        },
        // Amber gold — accent / headings
        gold: {
          DEFAULT: "#e8a020", light: "#f2be60",
          dark: "#c07010", pale: "#fdf0d5",
        },
        // Violet — subscription / premium screens
        violet: {
          DEFAULT: "#7c4dba", light: "#a67edd",
          dark: "#5a2e9a", pale: "#f0eafa",
        },
        // Surface colours for glass cards
        surface: {
          DEFAULT: "rgba(255,255,255,0.08)",
          hover:   "rgba(255,255,255,0.13)",
          border:  "rgba(255,255,255,0.14)",
        },
      },

      // ─── Typography ───────────────────────────────────────────
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body:    ["var(--font-body)", "system-ui", "sans-serif"],
      },

      // ─── Gradients ────────────────────────────────────────────
      backgroundImage: {
        "zen-teal":   "linear-gradient(145deg, #004d4a 0%, #00a8a1 55%, #4dd9d4 100%)",
        "zen-violet": "linear-gradient(145deg, #2d1060 0%, #7c4dba 55%, #a67edd 100%)",
        "zen-ocean":  "linear-gradient(180deg, #020b14 0%, #061a2e 55%, #0a2d4a 100%)",
        "zen-card":   "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 100%)",
        "hero-overlay": "linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(0,20,20,0.92) 100%)",
      },

      // ─── Shadows ──────────────────────────────────────────────
      boxShadow: {
        card:      "0 4px 32px rgba(0,0,0,0.28)",
        "card-lg": "0 8px 48px rgba(0,0,0,0.38)",
        glow:      "0 0 24px rgba(0,196,188,0.35)",
        "glow-gold": "0 0 20px rgba(232,160,32,0.45)",
      },

      // ─── Animations ───────────────────────────────────────────
      animation: {
        "fade-in":    "fadeIn 0.45s ease-out both",
        "slide-up":   "slideUp 0.45s ease-out both",
        "slide-left": "slideLeft 0.35s ease-out both",
        "slide-right":"slideRight 0.35s ease-out both",
        "scale-in":   "scaleIn 0.3s ease-out both",
        shimmer:      "shimmer 1.8s infinite linear",
      },
      keyframes: {
        fadeIn:     { from: { opacity: "0" },                    to: { opacity: "1" } },
        slideUp:    { from: { opacity: "0", transform: "translateY(20px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        slideLeft:  { from: { opacity: "0", transform: "translateX(32px)" }, to: { opacity: "1", transform: "translateX(0)" } },
        slideRight: { from: { opacity: "0", transform: "translateX(-32px)" }, to: { opacity: "1", transform: "translateX(0)" } },
        scaleIn:    { from: { opacity: "0", transform: "scale(0.94)" },  to: { opacity: "1", transform: "scale(1)" } },
        shimmer:    { from: { backgroundPosition: "-200% 0" },   to: { backgroundPosition: "200% 0" } },
      },

      // ─── Misc ─────────────────────────────────────────────────
      borderRadius: { "4xl": "2rem", "5xl": "2.5rem" },
      opacity: {
        "8":  "0.08",
        "14": "0.14",
        "35": "0.35",
        "55": "0.55",
        "65": "0.65",
        "85": "0.85",
      },
      transitionDuration: { 250: "250ms" },
    },
  },
  plugins: [],
};
