import { Dimensions, Platform } from "react-native";

export const screen = Dimensions.get("window");

export const layout = {
  screen,
  isSmallDevice: screen.width < 375,
  headerHeight: Platform.select({ ios: 44, android: 56, default: 56 }),
  spacing: {
    xs: 6,
    sm: 10,
    md: 14,
    lg: 18,
    xl: 24,
    '2xl': 32,
  },
  radius: {
    sm: 10,
    md: 14,
    lg: 16,
    xl: 20,
  },
} as const;
