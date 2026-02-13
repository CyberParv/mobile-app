import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const layout = {
  screen: {
    width,
    height
  },
  spacing: {
    xs: 6,
    sm: 10,
    md: 14,
    lg: 18,
    xl: 24,
    "2xl": 32
  },
  radius: {
    sm: 10,
    md: 14,
    lg: 18,
    xl: 24
  }
} as const;
