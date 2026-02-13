import React, { useEffect } from 'react';
import { View, ViewProps } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming
} from 'react-native-reanimated';

import { cn } from '@/lib/utils';

export type SkeletonLoaderProps = {
  className?: string;
  rounded?: 'sm' | 'md' | 'lg' | 'full';
} & Omit<ViewProps, 'children'>;

export function SkeletonLoader({ className, rounded = 'md', style, ...props }: SkeletonLoaderProps) {
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
    rounded === 'sm'
      ? 'rounded-md'
      : rounded === 'lg'
        ? 'rounded-2xl'
        : rounded === 'full'
          ? 'rounded-full'
          : 'rounded-xl';

  return (
    <View
      className={cn('overflow-hidden bg-border/60', roundedClass, className)}
      style={style}
      {...props}
    >
      <Animated.View className="absolute inset-0 bg-white/10" style={animatedStyle} />
    </View>
  );
}
