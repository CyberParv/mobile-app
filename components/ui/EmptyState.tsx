import React, { ReactNode } from "react";
import { View, Text } from "react-native";
import Button from "./Button";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({ icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View className="items-center justify-center px-6 py-8">
      {icon ? <View className="mb-4">{icon}</View> : null}
      <Text className="text-xl font-semibold text-text mb-2 text-center">{title}</Text>
      {description ? <Text className="text-text/70 text-center mb-4">{description}</Text> : null}
      {actionLabel && onAction ? (
        <Button variant="primary" size="md" onPress={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </View>
  );
}
