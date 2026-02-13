import React from "react";
import { Pressable, PressableProps, View } from "react-native";

import { cn } from "@/lib/utils";

export type CardProps = {
  children: React.ReactNode;
  className?: string;
  onPress?: PressableProps["onPress"];
};

export function Card({ children, className, onPress }: CardProps) {
  const base =
    "rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800";
  const shadow =
    "shadow-sm";

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        className={cn(base, shadow, "active:opacity-90", className)}
      >
        {children}
      </Pressable>
    );
  }

  return <View className={cn(base, shadow, className)}>{children}</View>;
}
