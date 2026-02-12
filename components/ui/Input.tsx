import React, { useMemo, useState } from "react";
import { Pressable, Text, TextInput, TextInputProps, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { cn } from "@/lib/utils";

export type InputProps = TextInputProps & {
  label?: string;
  error?: string | null;
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
  const [isSecure, setIsSecure] = useState<boolean>(!!secureTextEntry);

  const showPasswordToggle = !!secureTextEntry;

  const resolvedRightIcon = useMemo(() => {
    if (showPasswordToggle) return isSecure ? "eye" : "eye-off";
    return rightIcon;
  }, [showPasswordToggle, isSecure, rightIcon]);

  const handleRightPress = () => {
    if (showPasswordToggle) {
      setIsSecure((v) => !v);
      return;
    }
    onRightIconPress?.();
  };

  return (
    <View className={cn("w-full", containerClassName)}>
      {label ? <Text className="text-text-muted mb-2 text-sm">{label}</Text> : null}

      <View
        className={cn(
          "flex-row items-center rounded-xl border px-3",
          "bg-bg-subtle",
          error ? "border-danger" : "border-border",
          "h-12"
        )}
      >
        {leftIcon ? (
          <Ionicons name={leftIcon} size={18} color={"#9CA3AF"} style={{ marginRight: 8 }} />
        ) : null}

        <TextInput
          placeholderTextColor="#6B7280"
          className={cn("flex-1 text-text", className)}
          secureTextEntry={showPasswordToggle ? isSecure : secureTextEntry}
          autoCapitalize={props.autoCapitalize ?? "none"}
          {...props}
        />

        {resolvedRightIcon ? (
          <Pressable onPress={handleRightPress} hitSlop={10}>
            <Ionicons name={resolvedRightIcon} size={18} color={"#9CA3AF"} />
          </Pressable>
        ) : null}
      </View>

      {error ? <Text className="text-danger mt-2 text-sm">{error}</Text> : null}
    </View>
  );
}
