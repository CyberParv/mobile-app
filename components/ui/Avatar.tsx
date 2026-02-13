import React, { useMemo } from "react";
import { Image, Text, View } from "react-native";

import { cn, truncateText } from "@/lib/utils";

type AvatarSize = "sm" | "md" | "lg";

export type AvatarProps = {
  name?: string;
  uri?: string | null;
  size?: AvatarSize;
  className?: string;
};

function initialsFromName(name?: string) {
  const n = (name ?? "").trim();
  if (!n) return "?";
  const parts = n.split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";
  return (first + last).toUpperCase();
}

export function Avatar({ name, uri, size = "md", className }: AvatarProps) {
  const dims = useMemo(() => {
    switch (size) {
      case "sm":
        return { w: 32, text: "text-xs" };
      case "lg":
        return { w: 56, text: "text-lg" };
      default:
        return { w: 40, text: "text-sm" };
    }
  }, [size]);

  const initials = useMemo(() => initialsFromName(name), [name]);

  return (
    <View
      style={{ width: dims.w, height: dims.w, borderRadius: dims.w / 2 }}
      className={cn(
        "bg-slate-200 dark:bg-slate-800 items-center justify-center overflow-hidden",
        className
      )}
    >
      {uri ? (
        <Image
          source={{ uri }}
          style={{ width: dims.w, height: dims.w }}
          resizeMode="cover"
          accessibilityLabel={name ? truncateText(name, 40) : "Avatar"}
        />
      ) : (
        <Text className={cn("font-semibold text-slate-700 dark:text-slate-200", dims.text)}>
          {initials}
        </Text>
      )}
    </View>
  );
}
