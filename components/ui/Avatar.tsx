import React, { useMemo } from "react";
import { Image, Text, View } from "react-native";
import { cn } from "@/lib/utils";

type AvatarSize = "sm" | "md" | "lg";

export function Avatar({
  name,
  uri,
  size = "md",
  className,
}: {
  name?: string;
  uri?: string | null;
  size?: AvatarSize;
  className?: string;
}) {
  const dims = useMemo(() => {
    switch (size) {
      case "sm":
        return { box: 32, text: "text-xs" };
      case "lg":
        return { box: 56, text: "text-lg" };
      case "md":
      default:
        return { box: 40, text: "text-sm" };
    }
  }, [size]);

  const initials = useMemo(() => {
    const n = (name ?? "").trim();
    if (!n) return "?";
    const parts = n.split(/\s+/).slice(0, 2);
    return parts.map((p) => p[0]?.toUpperCase()).join("");
  }, [name]);

  return (
    <View
      style={{ width: dims.box, height: dims.box }}
      className={cn(
        "items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/10",
        className
      )}
    >
      {uri ? (
        <Image source={{ uri }} style={{ width: dims.box, height: dims.box }} />
      ) : (
        <Text className={cn("font-semibold text-white", dims.text)}>{initials}</Text>
      )}
    </View>
  );
}
