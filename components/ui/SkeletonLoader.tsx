import React from "react";
import { View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming, interpolate } from "react-native-reanimated";
import colors from "@/constants/colors";

interface SkeletonLoaderProps {
  height: number;
  width?: number | string;
  borderRadius?: number;
}

export default function SkeletonLoader({ height, width = "100%", borderRadius = 12 }: SkeletonLoaderProps) {
  const shimmer = useSharedValue(0);

  React.useEffect(() => {
    shimmer.value = withRepeat(withTiming(1, { duration: 1200 }), -1, true);
  }, [shimmer]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(shimmer.value, [0, 1], [0.6, 1])
  }));

  return (
    <View style={{ width, height, borderRadius, backgroundColor: colors.surface, overflow: "hidden" }}>
      <Animated.View style={[{ flex: 1, backgroundColor: colors.border }, animatedStyle]} />
    </View>
  );
}
