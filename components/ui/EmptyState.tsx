import React, { ReactNode } from "react";
import { Text, View } from "react-native";
import { Button } from "@/components/ui/Button";

export type EmptyStateProps = {
  icon?: ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({ icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View className="items-center justify-center px-6 py-10">
      {icon ? <View className="mb-4">{icon}</View> : null}
      <Text className="text-text text-lg font-semibold text-center">{title}</Text>
      {description ? <Text className="text-text-muted mt-2 text-center">{description}</Text> : null}
      {actionLabel && onAction ? (
        <View className="mt-6 w-full">
          <Button onPress={onAction} variant="primary">
            {actionLabel}
          </Button>
        </View>
      ) : null}
    </View>
  );
}
