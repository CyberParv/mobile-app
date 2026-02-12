import React from "react";
import { ActivityIndicator, View } from "react-native";

type SpinnerSize = "sm" | "md" | "lg";

export type SpinnerProps = {
  size?: SpinnerSize;
  color?: string;
  className?: string;
};

const sizeMap: Record<SpinnerSize, number> = {
  sm: 16,
  md: 22,
  lg: 30,
};

export function Spinner({ size = "md", color = "#3B82F6", className }: SpinnerProps) {
  return (
    <View className={className}>
      <ActivityIndicator size={sizeMap[size]} color={color} />
    </View>
  );
}
