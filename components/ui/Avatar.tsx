import React from "react";
import { Image, Text, View } from "react-native";
import colors from "@/constants/colors";
import { cn } from "@/lib/utils";

type AvatarSize = "sm" | "md" | "lg";

const sizes: Record<AvatarSize, number> = {
  sm: 32,
  md: 48,
  lg: 64
};

interface AvatarProps {
  uri?: string | null;
  name?: string;
  size?: AvatarSize;
  online?: boolean;
}

export default function Avatar({ uri, name, size = "md", online }: AvatarProps) {
  const dimension = sizes[size];
  const initials = name
    ? name
        .split(" ")
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join("")
    : "?";

  return (
    <View className="relative">
      {uri ? (
        <Image
          source={{ uri }}
          style={{ width: dimension, height: dimension, borderRadius: dimension / 2 }}
          accessibilityLabel={name ? `${name} avatar` : "User avatar"}
        />
      ) : (
        <View
          style={{ width: dimension, height: dimension, borderRadius: dimension / 2, backgroundColor: colors.secondary }}
          className="items-center justify-center"
        >
          <Text className={cn("text-white font-semibold", size === "sm" ? "text-sm" : size === "md" ? "text-lg" : "text-xl")}>{initials}</Text>
        </View>
      )}
      {online ? (
        <View
          style={{
            position: "absolute",
            bottom: 2,
            right: 2,
            width: 10,
            height: 10,
            borderRadius: 5,
            backgroundColor: colors.success,
            borderWidth: 2,
            borderColor: colors.background
          }}
        />
      ) : null}
    </View>
  );
}
