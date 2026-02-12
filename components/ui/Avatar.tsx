import React, { useMemo } from "react";
import { Image, Text, View } from "react-native";
import { cn } from "@/lib/utils";

type AvatarSize = "sm" | "md" | "lg" | "xl";

export type AvatarProps = {
  name?: string | null;
  uri?: string | null;
  size?: AvatarSize;
  className?: string;
};

const sizeMap: Record<AvatarSize, { box: number; text: string }> = {
  sm: { box: 32, text: "text-xs" },
  md: { box: 40, text: "text-sm" },
  lg: { box: 56, text: "text-base" },
  xl: { box: 72, text: "text-lg" },
};

function initialsFromName(name?: string | null) {
  const n = (name ?? "").trim();
  if (!n) return "?";
  const parts = n.split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";
  return (first + last).toUpperCase() || "?";
}

export function Avatar({ name, uri, size = "md", className }: AvatarProps) {
  const s = sizeMap[size];
  const initials = useMemo(() => initialsFromName(name), [name]);

  return (
    <View
      className={cn("bg-bg-subtle border border-border items-center justify-center overflow-hidden", "rounded-full", className)}
      style={{ width: s.box, height: s.box }}
      accessibilityRole="image"
      accessibilityLabel={name ? `Avatar for ${name}` : "Avatar"}
    >
      {uri ? (
        <Image source={{ uri }} style={{ width: s.box, height: s.box }} resizeMode="cover" />
      ) : (
        <Text className={cn("text-text font-semibold", s.text)}>{initials}</Text>
      )}
    </View>
  );
}
