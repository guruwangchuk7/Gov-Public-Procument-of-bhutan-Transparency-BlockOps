export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FFFFFF",
        primary: {
          DEFAULT: "#0F0F11",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#F9F9F9",
          foreground: "#0F0F11",
        },
        muted: {
          DEFAULT: "#A1A1AA",
          foreground: "#52525B",
        },
        border: {
          subtle: "#E4E4E7",
        },
        status: {
          bug: {
            bg: "#FEE2E2",
            tx: "#EF4444",
          },
          feat: {
            bg: "#E0F2FE",
            tx: "#0284C7",
          },
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        tightest: "-0.02em",
      },
    },
  },
  plugins: [],
};
