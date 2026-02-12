import React, { ReactNode } from "react";
import { View, Text } from "react-native";
import Button from "./Button";

interface ErrorViewProps {
  icon?: ReactNode;
  message: string;
  onRetry?: () => void;
}

export default function ErrorView({ icon, message, onRetry }: ErrorViewProps) {
  return (
    <View className="items-center justify-center px-6 py-8">
      {icon ? <View className="mb-3">{icon}</View> : null}
      <Text className="text-base text-text mb-4 text-center">{message}</Text>
      {onRetry ? (
        <Button variant="secondary" size="md" onPress={onRetry}>
          Retry
        </Button>
      ) : null}
    </View>
  );
}
