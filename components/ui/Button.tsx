import React, { ReactNode, useMemo, useRef } from "react";
import { ActivityIndicator, Animated, Platform, Pressable, Text, ViewStyle } from "react-native";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "destructive";
type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = {
  children: ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  testID?: string;
};

function variantClasses(variant: ButtonVariant, disabled?: boolean) {
  const base = disabled ? "opacity-60" : "";
  switch (variant) {
    case "secondary":
      return cn(base, "bg-slate-200 dark:bg-slate-800");
    case "outline":
      return cn(base, "bg-transparent border border-slate-300 dark:border-slate-700");
    case "ghost":
      return cn(base, "bg-transparent");
    case "destructive":
      return cn(base, "bg-red-600");
    default:
      return cn(base, "bg-brand-600");
  }
}

function textClasses(variant: ButtonVariant) {
  switch (variant) {
    case "secondary":
      return "text-slate-900 dark:text-slate-100";
    case "outline":
      return "text-slate-900 dark:text-slate-100";
    case "ghost":
      return "text-brand-700 dark:text-brand-300";
    case "destructive":
      return "text-white";
    default:
      return "text-white";
  }
}

function sizeClasses(size: ButtonSize) {
  switch (size) {
    case "sm":
      return "h-10 px-3";
    case "lg":
      return "h-14 px-5";
    default:
      return "h-12 px-4";
  }
}

export function Button({
  children,
  onPress,
  disabled,
  loading,
  variant = "primary",
  size = "md",
  className,
  testID
}: ButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const spinnerColor = useMemo(() => {
    if (variant === "secondary" || variant === "outline") return Platform.OS === "web" ? "#0F172A" : undefined;
    return "white";
  }, [variant]);

  const pressIn = () => {
    Animated.spring(scale, {
      toValue: 0.98,
      useNativeDriver: Platform.OS !== "web",
      speed: 30,
      bounciness: 0
    }).start();
  };

  const pressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: Platform.OS !== "web",
      speed: 30,
      bounciness: 6
    }).start();
  };

  const isDisabled = disabled || loading;

  const animatedStyle: ViewStyle = {
    transform: [{ scale }]
  };

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        testID={testID}
        onPress={onPress}
        disabled={isDisabled}
        onPressIn={pressIn}
        onPressOut={pressOut}
        className={cn(
          "w-full flex-row items-center justify-center rounded-2xl",
          sizeClasses(size),
          variantClasses(variant, isDisabled),
          className
        )}
        accessibilityRole="button"
        accessibilityState={{ disabled: isDisabled, busy: !!loading }}
      >
        {loading ? (
          <ActivityIndicator color={spinnerColor} />
        ) : (
          <Text className={cn("text-base font-semibold", textClasses(variant))}>{children}</Text>
        )}
      </Pressable>
    </Animated.View>
  );
}
