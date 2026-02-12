import React, { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { Animated, Text, TextInput, TextInputProps, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "@/constants/colors";
import { cn } from "@/lib/utils";

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  secureToggle?: boolean;
  maxLength?: number;
  containerClassName?: string;
}

export default function Input({
  label,
  error,
  leftIcon,
  rightIcon,
  secureToggle,
  maxLength,
  containerClassName,
  value,
  onFocus,
  onBlur,
  ...props
}: InputProps) {
  const [focused, setFocused] = useState(false);
  const [secure, setSecure] = useState(!!props.secureTextEntry);
  const animated = useRef(new Animated.Value(value ? 1 : 0)).current;
  const ring = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animated, {
      toValue: focused || !!value ? 1 : 0,
      duration: 180,
      useNativeDriver: false
    }).start();
  }, [focused, value, animated]);

  useEffect(() => {
    Animated.timing(ring, {
      toValue: focused ? 1 : 0,
      duration: 150,
      useNativeDriver: false
    }).start();
  }, [focused, ring]);

  const labelStyle = {
    top: animated.interpolate({ inputRange: [0, 1], outputRange: [18, -6] }),
    fontSize: animated.interpolate({ inputRange: [0, 1], outputRange: [14, 12] }),
    color: animated.interpolate({ inputRange: [0, 1], outputRange: [colors.muted, colors.primary] })
  };

  const ringStyle = {
    borderColor: ring.interpolate({ inputRange: [0, 1], outputRange: [colors.border, colors.primary] })
  } as const;

  const showCounter = useMemo(() => typeof maxLength === "number", [maxLength]);

  return (
    <View className={cn("w-full", containerClassName)}>
      <Animated.View style={[{ borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingTop: 14, paddingBottom: 10 }, ringStyle]}>
        <View className="flex-row items-center">
          {leftIcon ? <View className="mr-2">{leftIcon}</View> : null}
          <View className="flex-1">
            <Animated.Text style={[{ position: "absolute" }, labelStyle]}>{label}</Animated.Text>
            <TextInput
              {...props}
              value={value}
              maxLength={maxLength}
              secureTextEntry={secure}
              onFocus={(e) => {
                setFocused(true);
                onFocus?.(e);
              }}
              onBlur={(e) => {
                setFocused(false);
                onBlur?.(e);
              }}
              className="text-text text-base"
              placeholder={focused ? props.placeholder : ""}
              placeholderTextColor={colors.muted}
            />
          </View>
          {secureToggle ? (
            <Pressable onPress={() => setSecure((prev) => !prev)} accessibilityRole="button">
              <Ionicons name={secure ? "eye-off" : "eye"} size={20} color={colors.muted} />
            </Pressable>
          ) : rightIcon ? (
            <View className="ml-2">{rightIcon}</View>
          ) : null}
        </View>
      </Animated.View>
      {showCounter ? (
        <Text className="text-xs text-muted mt-1 text-right">
          {(value?.length ?? 0)}/{maxLength}
        </Text>
      ) : null}
      {error ? <Text className="text-xs text-error mt-1">{error}</Text> : null}
    </View>
  );
}
