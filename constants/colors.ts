export const colors = {
  bg: {
    light: "#FFFFFF",
    dark: "#0B1220"
  },
  surface: {
    light: "#F8FAFC",
    dark: "#111827"
  },
  text: {
    light: "#0F172A",
    dark: "#E5E7EB"
  },
  muted: {
    light: "#64748B",
    dark: "#9CA3AF"
  },
  border: {
    light: "#E2E8F0",
    dark: "#1F2937"
  },
  brand: {
    50: "#EEF2FF",
    100: "#E0E7FF",
    200: "#C7D2FE",
    300: "#A5B4FC",
    400: "#818CF8",
    500: "#6366F1",
    600: "#4F46E5",
    700: "#4338CA",
    800: "#3730A3",
    900: "#312E81"
  },
  success: "#16A34A",
  warning: "#F59E0B",
  danger: "#DC2626",
  info: "#0EA5E9"
} as const;

export type AppColors = typeof colors;
