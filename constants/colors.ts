export const colors = {
  bg: {
    default: "#0B1220",
    subtle: "#0F172A",
    card: "#111B2E",
  },
  text: {
    default: "#E5E7EB",
    muted: "#9CA3AF",
    subtle: "#CBD5E1",
  },
  border: {
    default: "#22304A",
    subtle: "#1F2A44",
  },
  primary: {
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
    default: "#3B82F6",
  },
  success: {
    default: "#22C55E",
    subtle: "#DCFCE7",
  },
  warning: {
    default: "#F59E0B",
    subtle: "#FEF3C7",
  },
  danger: {
    default: "#EF4444",
    subtle: "#FEE2E2",
  },
  info: {
    default: "#06B6D4",
    subtle: "#CFFAFE",
  },
} as const;

export type AppColors = typeof colors;
