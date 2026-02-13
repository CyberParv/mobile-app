import React from "react";
import { Text, View } from "react-native";

import { Button } from "@/components/ui/Button";

export type EmptyStateProps = {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-6 py-10">
      {icon ? <View className="mb-4">{icon}</View> : null}
      <Text className="text-lg font-semibold text-slate-900 dark:text-white text-center">
        {title}
      </Text>
      {description ? (
        <Text className="mt-2 text-slate-600 dark:text-slate-300 text-center">
          {description}
        </Text>
      ) : null}

      {actionLabel && onAction ? (
        <View className="mt-5 w-full max-w-xs">
          <Button variant="primary" size="md" onPress={onAction}>
            <Text className="text-white font-semibold">{actionLabel}</Text>
          </Button>
        </View>
      ) : null}
    </View>
  );
}
