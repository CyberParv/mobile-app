import React from "react";
import { Text, View } from "react-native";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export type EmptyStateProps = {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
};

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className
}: EmptyStateProps) {
  return (
    <View className={cn("items-center justify-center px-6 py-10", className)}>
      {icon ? <View className="mb-4">{icon}</View> : null}
      <Text className="text-center text-lg font-semibold text-slate-900 dark:text-slate-50">{title}</Text>
      {description ? (
        <Text className="mt-2 text-center text-sm text-slate-600 dark:text-slate-300">{description}</Text>
      ) : null}
      {actionLabel && onAction ? (
        <View className="mt-5 w-full max-w-xs">
          <Button variant="primary" onPress={onAction}>
            {actionLabel}
          </Button>
        </View>
      ) : null}
    </View>
  );
}
