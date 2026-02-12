import React, { useEffect } from "react";
import { View, ViewProps } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { cn } from "@/lib/utils";

export type SkeletonLoaderProps = ViewProps & {
  className?: string;
  rounded?: "sm" | "md" | "lg" | "full";
};

export function SkeletonLoader({ className, rounded = "md", style, ...props }: SkeletonLoaderProps) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 1100, easing: Easing.inOut(Easing.quad) }),
      -1,
      true
    );
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(progress.value, [0, 1], [0.45, 0.85]);
    return { opacity };
  });

  const radiusClass =
    rounded === "sm" ? "rounded-lg" : rounded === "md" ? "rounded-xl" : rounded === "lg" ? "rounded-2xl" : "rounded-full";

  return (
    <Animated.View
      {...props}
      style={[animatedStyle, style]}
      className={cn("bg-border-subtle", radiusClass, className)}
    />
  );
}
