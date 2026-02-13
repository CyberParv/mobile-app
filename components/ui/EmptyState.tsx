import React from "react";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { cn } from "@/lib/utils";

export type EmptyStateProps = {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
};

export function EmptyState({
  icon = "sparkles-outline",
  title,
  description,
  actionLabel,
  onAction,
  className
}: EmptyStateProps) {
  return (
    <View className={cn("items-center justify-center rounded-2xl border border-dashed border-slate-300 p-6 dark:border-slate-700", className)}>
      <View className="h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-900">
        <Ionicons name={icon} size={22} color="#64748B" />
      </View>
      <Text className="mt-4 text-center text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</Text>
      {!!description && (
        <Text className="mt-2 text-center text-sm text-slate-600 dark:text-slate-300">{description}</Text>
      )}
      {!!actionLabel && !!onAction && (
        <Pressable
          onPress={onAction}
          className="mt-4 rounded-2xl bg-brand-600 px-4 py-3"
          accessibilityRole="button"
        >
          <Text className="text-base font-semibold text-white">{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}
