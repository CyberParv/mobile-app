import React, { useMemo, useState } from "react";
import { Pressable, Text, TextInput, TextInputProps, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { cn } from "@/lib/utils";

export type InputProps = TextInputProps & {
  label?: string;
  error?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  containerClassName?: string;
};

export function Input({
  label,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  secureTextEntry,
  containerClassName,
  className,
  ...props
}: InputProps) {
  const [isSecure, setIsSecure] = useState(!!secureTextEntry);

  const showPasswordToggle = useMemo(() => {
    const hint = props.textContentType === "password" || props.autoComplete === "password";
    return !!secureTextEntry || hint;
  }, [secureTextEntry, props.textContentType, props.autoComplete]);

  const effectiveRightIcon = showPasswordToggle ? (isSecure ? "eye" : "eye-off") : rightIcon;

  return (
    <View className={cn("w-full", containerClassName)}>
      {!!label && <Text className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-200">{label}</Text>}

      <View
        className={cn(
          "h-12 w-full flex-row items-center rounded-2xl border bg-white px-3 dark:bg-slate-950",
          error ? "border-red-500" : "border-slate-200 dark:border-slate-800"
        )}
      >
        {!!leftIcon && (
          <Ionicons name={leftIcon} size={18} color={error ? "#EF4444" : "#64748B"} style={{ marginRight: 8 }} />
        )}

        <TextInput
          {...props}
          secureTextEntry={showPasswordToggle ? isSecure : secureTextEntry}
          className={cn(
            "flex-1 text-base text-slate-900 dark:text-slate-100",
            className
          )}
          placeholderTextColor="#94A3B8"
          style={[{ height: 48 }]}
        />

        {!!effectiveRightIcon && (
          <Pressable
            onPress={() => {
              if (showPasswordToggle) setIsSecure((v) => !v);
              else onRightIconPress?.();
            }}
            hitSlop={10}
            className="ml-2"
            accessibilityRole="button"
          >
            <Ionicons name={effectiveRightIcon} size={18} color={error ? "#EF4444" : "#64748B"} />
          </Pressable>
        )}
      </View>

      {!!error && <Text className="mt-2 text-sm text-red-600">{error}</Text>}
    </View>
  );
}
