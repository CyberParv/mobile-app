const colors = require("./constants/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./providers/**/*.{ts,tsx}", "./hooks/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ...colors
      },
      borderRadius: {
        sm: 8,
        md: 12,
        lg: 16,
        xl: 24
      },
      boxShadow: {
        sm: "0 1px 2px rgba(0,0,0,0.25)",
        md: "0 6px 16px rgba(0,0,0,0.35)"
      }
    }
  },
  plugins: []
};
