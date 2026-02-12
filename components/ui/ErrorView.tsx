import React from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "@/components/ui/Button";

export type ErrorViewProps = {
  message?: string;
  onRetry?: () => void;
};

export function ErrorView({ message = "Something went wrong.", onRetry }: ErrorViewProps) {
  return (
    <View className="flex-1 items-center justify-center px-6 py-10">
      <Ionicons name="alert-circle" size={44} color="#EF4444" />
      <Text className="text-text text-lg font-semibold mt-4 text-center">Error</Text>
      <Text className="text-text-muted mt-2 text-center">{message}</Text>
      {onRetry ? (
        <View className="mt-6 w-full">
          <Button onPress={onRetry} variant="outline">
            Retry
          </Button>
        </View>
      ) : null}
    </View>
  );
}
