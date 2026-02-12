import React from "react";
import { ActivityIndicator } from "react-native";
import colors from "@/constants/colors";

type SpinnerSize = "sm" | "md" | "lg";

const sizes: Record<SpinnerSize, number> = {
  sm: 16,
  md: 24,
  lg: 32
};

export default function Spinner({ size = "md", color = colors.primary }: { size?: SpinnerSize; color?: string }) {
  return <ActivityIndicator size={sizes[size]} color={color} />;
}
