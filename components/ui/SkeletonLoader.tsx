import React, { useEffect } from "react";
import { View, ViewStyle } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming
} from "react-native-reanimated";
import { cn } from "@/lib/utils";

export type SkeletonLoaderProps = {
  width?: number | string;
  height?: number;
  radius?: number;
  className?: string;
  style?: ViewStyle;
};

export function SkeletonLoader({ width = "100%", height = 12, radius = 12, className, style }: SkeletonLoaderProps) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 1100, easing: Easing.inOut(Easing.quad) }),
      -1,
      true
    );
  }, [progress]);

  const shimmerStyle = useAnimatedStyle(() => {
    const opacity = interpolate(progress.value, [0, 1], [0.35, 0.75]);
    return { opacity };
  });

  return (
    <View
      style={[{ width, height, borderRadius: radius, overflow: "hidden" }, style]}
      className={cn("bg-slate-200 dark:bg-slate-800", className)}
    >
      <Animated.View style={[{ flex: 1, backgroundColor: "#FFFFFF" }, shimmerStyle]} />
    </View>
  );
}
