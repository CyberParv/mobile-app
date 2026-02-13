import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { Pressable, Text, TextInput, TextInputProps, View } from "react-native";

import { colors } from "@/constants/colors";
import { cn } from "@/lib/utils";

export type InputProps = TextInputProps & {
  label?: string;
  error?: string;
  leftIcon?: React.ComponentProps<typeof Ionicons>["name"];
  rightIcon?: React.ComponentProps<typeof Ionicons>["name"];
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
    if (isFocused) return "border-brand-600";
    return "border-slate-300 dark:border-slate-700";
  }, [error, isFocused]);

  const right = useMemo(() => {
    if (isPassword) {
      return (
        <Pressable
          accessibilityRole="button"
          onPress={() => setShowPassword((v) => !v)}
          className="px-3"
          hitSlop={10}
        >
          <Ionicons
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            size={20}
            color={colors.slate[500]}
          />
        </Pressable>
      );
    }

    if (rightIcon) {
      return (
        <Pressable
          accessibilityRole="button"
          onPress={onRightIconPress}
          className="px-3"
          hitSlop={10}
        >
          <Ionicons name={rightIcon} size={20} color={colors.slate[500]} />
        </Pressable>
      );
    }

    return null;
  }, [isPassword, rightIcon, onRightIconPress, showPassword]);

  return (
    <View>
      {label ? <Text className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-200">{label}</Text> : null}

      <View
        className={cn(
          "h-12 flex-row items-center rounded-xl border bg-white dark:bg-slate-900",
          borderClass,
          className
        )}
      >
        {leftIcon ? (
          <View className="pl-3 pr-2">
            <Ionicons name={leftIcon} size={20} color={colors.slate[500]} />
          </View>
        ) : null}

        <TextInput
          className={cn(
            "flex-1 px-3 text-base text-slate-900 dark:text-slate-50",
            leftIcon ? "pl-0" : "pl-3"
          )}
          placeholderTextColor={colors.slate[400]}
          secureTextEntry={effectiveSecure}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          {...props}
        />

        {right}
      </View>

      {error ? <Text className="mt-2 text-sm text-red-600 dark:text-red-300">{error}</Text> : null}
    </View>
  );
}
