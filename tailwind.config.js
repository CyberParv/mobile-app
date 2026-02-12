/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./providers/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#0B1220",
          subtle: "#0F172A",
          card: "#111B2E",
        },
        text: {
          DEFAULT: "#E5E7EB",
          muted: "#9CA3AF",
          subtle: "#CBD5E1",
        },
        border: {
          DEFAULT: "#22304A",
          subtle: "#1F2A44",
        },
        primary: {
          DEFAULT: "#3B82F6",
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          300: "#93C5FD",
          400: "#60A5FA",
          500: "#3B82F6",
          600: "#2563EB",
          700: "#1D4ED8",
          800: "#1E40AF",
          900: "#1E3A8A",
        },
        success: {
          DEFAULT: "#22C55E",
          subtle: "#DCFCE7",
        },
        warning: {
          DEFAULT: "#F59E0B",
          subtle: "#FEF3C7",
        },
        danger: {
          DEFAULT: "#EF4444",
          subtle: "#FEE2E2",
        },
        info: {
          DEFAULT: "#06B6D4",
          subtle: "#CFFAFE",
        },
      },
      borderRadius: {
        xl: "16px",
        '2xl': "20px",
      },
      boxShadow: {
        card: "0px 10px 30px rgba(0,0,0,0.25)",
      },
    },
  },
  plugins: [],
};
