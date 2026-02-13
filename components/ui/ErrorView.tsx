import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { Button } from "@/components/ui/Button";

export function ErrorView({
  message,
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <View className="items-center justify-center rounded-2xl border border-red-400/20 bg-red-500/10 p-6">
      <Ionicons name="alert-circle" size={28} color="#FCA5A5" />
      <Text className="mt-3 text-center text-base font-semibold text-white">Something went wrong</Text>
      <Text className="mt-2 text-center text-sm text-white/70">
        {message ?? "An unexpected error occurred. Please try again."}
      </Text>
      {onRetry ? (
        <View className="mt-4 w-full">
          <Button variant="outline" onPress={onRetry}>
            Retry
          </Button>
        </View>
      ) : null}
    </View>
  );
}
