/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("nativewind/preset")],
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./providers/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#0B1220",
        foreground: "#E6EEF8",
        card: "#0F1A2E",
        border: "#1E2A44",
        primary: "#4F8CFF",
        destructive: "#EF4444",
        muted: "#94A3B8"
      }
    }
  },
  plugins: []
};
