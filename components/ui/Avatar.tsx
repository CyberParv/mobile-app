import React, { useMemo } from "react";
import { Image, Text, View } from "react-native";
import { cn } from "@/lib/utils";

type AvatarSize = "sm" | "md" | "lg";

export type AvatarProps = {
  name?: string;
  uri?: string | null;
  size?: AvatarSize;
  className?: string;
};

function sizeMap(size: AvatarSize) {
  switch (size) {
    case "sm":
      return { box: 32, text: "text-xs" };
    case "lg":
      return { box: 56, text: "text-lg" };
    default:
      return { box: 40, text: "text-sm" };
  }
}

function initials(name?: string) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/).slice(0, 2);
  const letters = parts.map((p) => p[0]?.toUpperCase()).filter(Boolean);
  return letters.join("") || "?";
}

export function Avatar({ name, uri, size = "md", className }: AvatarProps) {
  const s = useMemo(() => sizeMap(size), [size]);

  return (
    <View
      style={{ width: s.box, height: s.box, borderRadius: s.box / 2 }}
      className={cn("items-center justify-center overflow-hidden bg-slate-200 dark:bg-slate-800", className)}
    >
      {uri ? (
        <Image source={{ uri }} style={{ width: s.box, height: s.box }} resizeMode="cover" />
      ) : (
        <Text className={cn("font-semibold text-slate-700 dark:text-slate-200", s.text)}>{initials(name)}</Text>
      )}
    </View>
  );
}
