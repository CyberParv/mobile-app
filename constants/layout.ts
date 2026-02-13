import { Dimensions, Platform } from "react-native";

const { width, height } = Dimensions.get("window");

export const layout = {
  window: {
    width,
    height
  },
  isSmallDevice: width < 375,
  headerHeight: Platform.select({ ios: 44, android: 56, default: 56 }),
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32
  },
  radius: {
    sm: 10,
    md: 14,
    lg: 18
  }
} as const;
