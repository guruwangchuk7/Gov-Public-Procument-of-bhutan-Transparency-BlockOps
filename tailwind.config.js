/** @type {import('tailwindcss').Config} */
module.exports = {
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
          50: "#EAF6FF",
          100: "#C1E5FF",
          200: "#9CD5FF",
          300: "#6AB0E3",
          DEFAULT: "#6AB0E3",
        },
      },
    },
  },
  plugins: [],
};
