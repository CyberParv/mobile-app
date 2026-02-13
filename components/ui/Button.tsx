import React, { ReactNode, useMemo, useRef } from "react";
import {
  ActivityIndicator,
  Animated,
  Platform,
  Pressable,
  PressableProps,
  Text,
  View
} from "react-native";

import { colors } from "@/constants/colors";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "destructive";
type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = PressableProps & {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  className?: string;
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  className,
  ...props
}: ButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const isDisabled = disabled || loading;

  const sizeClasses = useMemo(() => {
    switch (size) {
      case "sm":
        return "h-10 px-3";
      case "lg":
        return "h-14 px-5";
      case "md":
      default:
        return "h-12 px-4";
    }
  }, [size]);

  const variantClasses = useMemo(() => {
    switch (variant) {
      case "secondary":
        return "bg-slate-200 dark:bg-slate-800";
      case "outline":
        return "bg-transparent border border-slate-300 dark:border-slate-700";
      case "ghost":
        return "bg-transparent";
      case "destructive":
        return "bg-red-600";
      case "primary":
      default:
        return "bg-brand-600";
    }
  }, [variant]);

  const textClasses = useMemo(() => {
    switch (variant) {
      case "secondary":
        return "text-slate-900 dark:text-slate-50";
      case "outline":
        return "text-slate-900 dark:text-slate-50";
      case "ghost":
        return "text-brand-700 dark:text-brand-300";
      case "destructive":
        return "text-white";
      case "primary":
      default:
        return "text-white";
    }
  }, [variant]);

  function animateTo(toValue: number) {
    Animated.spring(scale, {
      toValue,
      useNativeDriver: Platform.OS !== "web",
      speed: 30,
      bounciness: 6
    }).start();
  }

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      onPressIn={(e) => {
        animateTo(0.98);
        props.onPressIn?.(e);
      }}
      onPressOut={(e) => {
        animateTo(1);
        props.onPressOut?.(e);
      }}
      className={cn("rounded-xl", isDisabled && "opacity-60", className)}
      {...props}
    >
      <Animated.View
        style={{ transform: [{ scale }] }}
        className={cn(
          "w-full flex-row items-center justify-center rounded-xl",
          sizeClasses,
          variantClasses
        )}
      >
        {loading ? (
          <View className="mr-2">
            <ActivityIndicator
              size={size === "sm" ? "small" : "small"}
              color={variant === "secondary" || variant === "outline" ? colors.slate[900] : "#FFFFFF"}
            />
          </View>
        ) : null}
        <Text className={cn("text-base font-semibold", textClasses)}>{children}</Text>
      </Animated.View>
    </Pressable>
  );
}
