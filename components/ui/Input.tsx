import React, { useMemo, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, TextInput, TextInputProps, View } from "react-native";
import { cn } from "@/lib/utils";

export type InputProps = TextInputProps & {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
};

export function Input({
  label,
  error,
  leftIcon,
  rightIcon,
  secureTextEntry,
  containerClassName,
  className,
  ...props
}: InputProps) {
  const [isSecure, setIsSecure] = useState(!!secureTextEntry);

  const showToggle = useMemo(() => !!secureTextEntry, [secureTextEntry]);

  return (
    <View className={cn("w-full", containerClassName)}>
      {label ? <Text className="mb-2 text-sm font-medium text-white/90">{label}</Text> : null}

      <View
        className={cn(
          "h-12 flex-row items-center rounded-2xl border px-3",
          error ? "border-red-400/60" : "border-white/15",
          "bg-white/5"
        )}
      >
        {leftIcon ? <View className="mr-2">{leftIcon}</View> : null}

        <TextInput
          className={cn(
            "flex-1 text-base text-white",
            "placeholder:text-white/40",
            className
          )}
          placeholderTextColor="rgba(255,255,255,0.4)"
          secureTextEntry={isSecure}
          autoCapitalize={props.autoCapitalize ?? "none"}
          autoCorrect={props.autoCorrect ?? false}
          {...props}
        />

        {showToggle ? (
          <Pressable
            onPress={() => setIsSecure((v) => !v)}
            hitSlop={10}
            className="ml-2"
            accessibilityRole="button"
            accessibilityLabel={isSecure ? "Show password" : "Hide password"}
          >
            <Ionicons name={isSecure ? "eye" : "eye-off"} size={20} color="rgba(255,255,255,0.75)" />
          </Pressable>
        ) : rightIcon ? (
          <View className="ml-2">{rightIcon}</View>
        ) : null}
      </View>

      {error ? <Text className="mt-2 text-sm text-red-300">{error}</Text> : null}
    </View>
  );
}
