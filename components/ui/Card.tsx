import React from "react";
import { Pressable, View, ViewProps } from "react-native";
import { cn } from "@/lib/utils";

export type CardProps = ViewProps & {
  onPress?: () => void;
  className?: string;
  children: React.ReactNode;
};

export function Card({ onPress, className, children, ...props }: CardProps) {
  const base =
    "rounded-2xl border border-white/10 bg-white/5 dark:bg-white/5 p-4 shadow";

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        className={cn(base, "active:opacity-90", className)}
      >
        <View {...props}>{children}</View>
      </Pressable>
    );
  }

  return (
    <View className={cn(base, className)} {...props}>
      {children}
    </View>
  );
}
