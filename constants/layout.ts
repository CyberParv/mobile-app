import { Dimensions } from "react-native";

export const screen = Dimensions.get("window");

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;
