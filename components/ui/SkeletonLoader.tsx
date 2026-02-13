import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { cn } from "@/lib/utils";

export function SkeletonLoader({
  className,
  height = 12,
  width = "100%",
  rounded = "rounded-xl",
}: {
  className?: string;
  height?: number;
  width?: number | string;
  rounded?: string;
}) {
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
    <View style={{ width }} className={cn("overflow-hidden", rounded, className)}>
      <Animated.View
        style={[{ height, backgroundColor: "rgba(255,255,255,0.12)" }, shimmerStyle]}
      />
    </View>
  );
}
