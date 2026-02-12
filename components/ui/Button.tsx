import React, { ReactNode, useMemo, useRef } from "react";
import { ActivityIndicator, Pressable, PressableProps, Text, ViewStyle, Animated } from "react-native";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "destructive";
type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = Omit<PressableProps, "children"> & {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  className?: string;
  textClassName?: string;
};

const sizeStyles: Record<ButtonSize, { container: string; text: string; spinner: "small" | "large" }> = {
  sm: { container: "h-10 px-3", text: "text-sm", spinner: "small" },
  md: { container: "h-12 px-4", text: "text-base", spinner: "small" },
  lg: { container: "h-14 px-5", text: "text-base", spinner: "large" },
};

const variantStyles: Record<ButtonVariant, { container: string; text: string; spinnerColor: string }> = {
  primary: {
    container: "bg-primary border border-primary",
    text: "text-white",
    spinnerColor: "#FFFFFF",
  },
  secondary: {
    container: "bg-bg-card border border-border",
    text: "text-text",
    spinnerColor: "#E5E7EB",
  },
  outline: {
    container: "bg-transparent border border-border",
    text: "text-text",
    spinnerColor: "#E5E7EB",
  },
  ghost: {
    container: "bg-transparent border border-transparent",
    text: "text-text",
    spinnerColor: "#E5E7EB",
  },
  destructive: {
    container: "bg-danger border border-danger",
    text: "text-white",
    spinnerColor: "#FFFFFF",
  },
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  className,
  textClassName,
  onPressIn,
  onPressOut,
  ...props
}: ButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const isDisabled = disabled || loading;

  const styles = useMemo(() => {
    const v = variantStyles[variant];
    const s = sizeStyles[size];
    return {
      container: cn(
        "rounded-xl items-center justify-center flex-row gap-2",
        v.container,
        s.container,
        isDisabled && "opacity-50",
        className
      ),
      text: cn("font-semibold", v.text, s.text, textClassName),
      spinnerColor: v.spinnerColor,
      spinnerSize: s.spinner,
    };
  }, [variant, size, isDisabled, className, textClassName]);

  const handlePressIn: PressableProps["onPressIn"] = (e) => {
    Animated.spring(scale, {
      toValue: 0.98,
      useNativeDriver: true,
      speed: 30,
      bounciness: 0,
    }).start();
    onPressIn?.(e);
  };

  const handlePressOut: PressableProps["onPressOut"] = (e) => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 30,
      bounciness: 0,
    }).start();
    onPressOut?.(e);
  };

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      {...props}
    >
      <Animated.View style={{ transform: [{ scale }] } as ViewStyle} className={styles.container}>
        {loading ? (
          <ActivityIndicator size={styles.spinnerSize} color={styles.spinnerColor} />
        ) : null}
        {typeof children === "string" ? <Text className={styles.text}>{children}</Text> : children}
      </Animated.View>
    </Pressable>
  );
}
