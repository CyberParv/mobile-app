import React, { useMemo } from "react";
import { ActivityIndicator, ActivityIndicatorProps } from "react-native";

import { colors } from "@/constants/colors";

type SpinnerSize = "sm" | "md" | "lg";

export type SpinnerProps = Omit<ActivityIndicatorProps, "size" | "color"> & {
  size?: SpinnerSize;
  color?: string;
};

export function Spinner({ size = "md", color, ...props }: SpinnerProps) {
  const resolvedSize = useMemo(() => {
    switch (size) {
      case "sm":
        return "small" as const;
      case "lg":
        return "large" as const;
      default:
        return "small" as const;
    }
  }, [size]);

  const resolvedColor = color ?? colors.brand[600];

  return <ActivityIndicator size={resolvedSize} color={resolvedColor} {...props} />;
}
