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

export function EmptyState({ icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View className="items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-6">
      {icon ? <View className="mb-3">{icon}</View> : null}
      <Text className="text-center text-lg font-semibold text-white">{title}</Text>
      {description ? (
        <Text className="mt-2 text-center text-sm leading-5 text-white/70">{description}</Text>
      ) : null}
      {actionLabel && onAction ? (
        <View className="mt-4 w-full">
          <Button variant="secondary" onPress={onAction}>
            {actionLabel}
          </Button>
        </View>
      ) : null}
    </View>
  );
}
