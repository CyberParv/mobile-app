import React, { ReactNode, useMemo, useRef } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  PressableProps,
  StyleProp,
  Text,
  ViewStyle,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { cn } from "@/lib/utils";
import { colors } from "@/constants/colors";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "destructive";
type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = Omit<PressableProps, "children"> & {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  className?: string;
  style?: StyleProp<ViewStyle>;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  className,
  style,
  ...props
}: ButtonProps) {
  const scale = useSharedValue(1);
  const isDisabled = disabled || loading;

  const paddingClass = useMemo(() => {
    switch (size) {
      case "sm":
        return "px-3 py-2";
      case "lg":
        return "px-5 py-4";
      default:
        return "px-4 py-3";
    }
  }, [size]);

  const baseClass =
    "rounded-xl flex-row items-center justify-center gap-2";

  const variantClass = useMemo(() => {
    switch (variant) {
      case "secondary":
        return "bg-slate-100 dark:bg-slate-800";
      case "outline":
        return "bg-transparent border border-slate-200 dark:border-slate-700";
      case "ghost":
        return "bg-transparent";
      case "destructive":
        return "bg-red-600";
      default:
        return "bg-brand-600";
    }
  }, [variant]);

  const disabledClass = isDisabled ? "opacity-60" : "opacity-100";

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  }, []);

  const onPressIn = () => {
    scale.value = withSpring(0.98, { damping: 18, stiffness: 250 });
  };

  const onPressOut = () => {
    scale.value = withSpring(1, { damping: 18, stiffness: 250 });
  };

  const spinnerColor = useMemo(() => {
    if (variant === "primary" || variant === "destructive") return "#FFFFFF";
    return colors.slate[900];
  }, [variant]);

  return (
    <AnimatedPressable
      accessibilityRole="button"
      disabled={isDisabled}
      onPressIn={(e) => {
        onPressIn();
        props.onPressIn?.(e);
      }}
      onPressOut={(e) => {
        onPressOut();
        props.onPressOut?.(e);
      }}
      className={cn(baseClass, paddingClass, variantClass, disabledClass, className)}
      style={[animatedStyle, style]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          size={Platform.OS === "web" ? "small" : "small"}
          color={spinnerColor}
        />
      ) : null}
      {typeof children === "string" ? (
        <Text
          className={cn(
            "font-semibold",
            variant === "primary" || variant === "destructive"
              ? "text-white"
              : "text-slate-900 dark:text-white"
          )}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </AnimatedPressable>
  );
}
