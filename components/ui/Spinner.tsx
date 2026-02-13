import React from "react";
import { ActivityIndicator, Platform } from "react-native";

type SpinnerSize = "sm" | "md" | "lg";

export type SpinnerProps = {
  size?: SpinnerSize;
  color?: string;
};

function mapSize(size: SpinnerSize) {
  switch (size) {
    case "sm":
      return Platform.OS === "web" ? 16 : "small";
    case "lg":
      return Platform.OS === "web" ? 28 : "large";
    default:
      return Platform.OS === "web" ? 22 : "small";
  }
}

export function Spinner({ size = "md", color }: SpinnerProps) {
  return <ActivityIndicator size={mapSize(size) as any} color={color ?? "#6366F1"} />;
}
