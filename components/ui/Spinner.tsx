import React, { useMemo } from "react";
import { ActivityIndicator, View } from "react-native";

type SpinnerSize = "sm" | "md" | "lg";

export function Spinner({ size = "md", color }: { size?: SpinnerSize; color?: string }) {
  const indicatorSize = useMemo(() => {
    switch (size) {
      case "sm":
        return "small" as const;
      case "lg":
        return "large" as const;
      case "md":
      default:
        return "small" as const;
    }
  }, [size]);

  const resolvedColor = color ?? "rgba(255,255,255,0.85)";

  return (
    <View className="items-center justify-center">
      <ActivityIndicator size={indicatorSize} color={resolvedColor} />
    </View>
  );
}
