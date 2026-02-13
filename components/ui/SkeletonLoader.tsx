import React, { useEffect } from "react";
import { View, ViewProps } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming
} from "react-native-reanimated";

import { cn } from "@/lib/utils";

export type SkeletonLoaderProps = ViewProps & {
  className?: string;
  rounded?: "sm" | "md" | "lg" | "full";
};

export function SkeletonLoader({ className, rounded = "md", ...props }: SkeletonLoaderProps) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 1100, easing: Easing.inOut(Easing.quad) }),
      -1,
      true
    );
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(progress.value, [0, 1], [0.45, 0.9]);
    return { opacity };
  });

  const roundedClass =
    rounded === "full" ? "rounded-full" : rounded === "lg" ? "rounded-2xl" : rounded === "sm" ? "rounded-lg" : "rounded-xl";

  return (
    <View
      className={cn("overflow-hidden bg-slate-200 dark:bg-slate-800", roundedClass, className)}
      {...props}
    >
      <Animated.View
        style={animatedStyle}
        className={cn("absolute inset-0 bg-white/40 dark:bg-white/10")}
      />
    </View>
  );
}
