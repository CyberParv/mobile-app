import React, { useMemo } from "react";
import { Image, ImageSourcePropType, Text, View } from "react-native";

import { cn } from "@/lib/utils";

type AvatarSize = "sm" | "md" | "lg";

export type AvatarProps = {
  name: string;
  source?: ImageSourcePropType;
  size?: AvatarSize;
  className?: string;
};

function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "U";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : "";
  return (first + last).toUpperCase();
}

export function Avatar({ name, source, size = "md", className }: AvatarProps) {
  const { container, text } = useMemo(() => {
    switch (size) {
      case "sm":
        return { container: "h-9 w-9", text: "text-xs" };
      case "lg":
        return { container: "h-14 w-14", text: "text-lg" };
      case "md":
      default:
        return { container: "h-11 w-11", text: "text-sm" };
    }
  }, [size]);

  return (
    <View
      className={cn(
        "items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-800",
        container,
        className
      )}
    >
      {source ? (
        <Image source={source} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
      ) : (
        <Text className={cn("font-semibold text-slate-700 dark:text-slate-100", text)}>
          {initialsFromName(name)}
        </Text>
      )}
    </View>
  );
}
