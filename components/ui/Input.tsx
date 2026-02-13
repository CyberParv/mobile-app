import React, { useMemo, useState } from "react";
import {
  Platform,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { cn } from "@/lib/utils";
import { colors } from "@/constants/colors";

export type InputProps = TextInputProps & {
  label?: string;
  error?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  className?: string;
};

export function Input({
  label,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  secureTextEntry,
  className,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = !!secureTextEntry;
  const effectiveSecure = isPassword ? !showPassword : false;

  const borderClass = useMemo(() => {
    if (error) return "border-red-500";
    if (isFocused) return "border-brand-500";
    return "border-slate-200 dark:border-slate-700";
  }, [error, isFocused]);

  const iconColor = useMemo(() => {
    if (error) return colors.red[600];
    if (isFocused) return colors.brand[600];
    return colors.slate[500];
  }, [error, isFocused]);

  return (
    <View className={cn("w-full", className)}>
      {label ? (
        <Text className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-200">
          {label}
        </Text>
      ) : null}

      <View
        className={cn(
          "flex-row items-center rounded-xl border bg-white dark:bg-slate-950 px-3",
          borderClass
        )}
      >
        {leftIcon ? (
          <View className="mr-2">
            <Ionicons name={leftIcon} size={18} color={iconColor} />
          </View>
        ) : null}

        <TextInput
          {...props}
          secureTextEntry={effectiveSecure}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          placeholderTextColor={colors.slate[400]}
          className={cn(
            "flex-1 text-slate-900 dark:text-white",
            "h-12", // explicit height for web compatibility
            Platform.OS === "web" ? "outline-none" : ""
          )}
        />

        {isPassword ? (
          <View className="ml-2">
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={18}
              color={iconColor}
              onPress={() => setShowPassword((v) => !v)}
            />
          </View>
        ) : rightIcon ? (
          <View className="ml-2">
            <Ionicons
              name={rightIcon}
              size={18}
              color={iconColor}
              onPress={onRightIconPress}
            />
          </View>
        ) : null}
      </View>

      {error ? (
        <Text className="mt-2 text-sm text-red-600 dark:text-red-400">
          {error}
        </Text>
      ) : null}
    </View>
  );
}
