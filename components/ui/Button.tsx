import React, { ReactNode, useMemo, useRef } from "react";
import {
  ActivityIndicator,
  Animated,
  Platform,
  Pressable,
  PressableProps,
  Text,
  View,
} from "react-native";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "destructive";
type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = PressableProps & {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  leftIcon,
  rightIcon,
  className,
  ...props
}: ButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const isDisabled = disabled || loading;

  const styles = useMemo(() => {
    const base = "rounded-2xl flex-row items-center justify-center";

    const sizeStyles: Record<ButtonSize, string> = {
      sm: "h-10 px-3",
      md: "h-12 px-4",
      lg: "h-14 px-5",
    };

    const variantStyles: Record<ButtonVariant, { container: string; text: string; spinner: string }> = {
      primary: {
        container: "bg-brand-600 dark:bg-brand-500",
        text: "text-white",
        spinner: "#FFFFFF",
      },
      secondary: {
        container: "bg-white/10 dark:bg-white/10",
        text: "text-white",
        spinner: "#FFFFFF",
      },
      outline: {
        container: "border border-white/20 bg-transparent",
        text: "text-white",
        spinner: "#FFFFFF",
      },
      ghost: {
        container: "bg-transparent",
        text: "text-white",
        spinner: "#FFFFFF",
      },
      destructive: {
        container: "bg-red-600",
        text: "text-white",
        spinner: "#FFFFFF",
      },
    };

    return {
      container: cn(
        base,
        sizeStyles[size],
        variantStyles[variant].container,
        isDisabled ? "opacity-60" : "opacity-100",
        className
      ),
      text: cn("text-base font-semibold", variantStyles[variant].text),
      spinnerColor: variantStyles[variant].spinner,
    };
  }, [className, isDisabled, size, variant]);

  const onPressIn = () => {
    if (isDisabled) return;
    Animated.spring(scale, {
      toValue: 0.98,
      useNativeDriver: Platform.OS !== "web",
      speed: 30,
      bounciness: 0,
    }).start();
  };

  const onPressOut = () => {
    if (isDisabled) return;
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: Platform.OS !== "web",
      speed: 30,
      bounciness: 0,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        accessibilityRole="button"
        disabled={isDisabled}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        className={styles.container}
        {...props}
      >
        {loading ? (
          <ActivityIndicator color={styles.spinnerColor} />
        ) : (
          <View className="flex-row items-center gap-2">
            {leftIcon ? <View className="-ml-0.5">{leftIcon}</View> : null}
            <Text className={styles.text}>{children}</Text>
            {rightIcon ? <View className="-mr-0.5">{rightIcon}</View> : null}
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}
