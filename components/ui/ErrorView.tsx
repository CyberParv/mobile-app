import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

import { Button } from "@/components/ui/Button";
import { colors } from "@/constants/colors";

export type ErrorViewProps = {
  message?: string;
  onRetry?: () => void;
};

export function ErrorView({ message, onRetry }: ErrorViewProps) {
  return (
    <View className="flex-1 items-center justify-center bg-slate-50 px-6 dark:bg-slate-950">
      <Ionicons name="alert-circle-outline" size={44} color={colors.red[600]} />
      <Text className="mt-4 text-center text-lg font-semibold text-slate-900 dark:text-slate-50">
        Something went wrong
      </Text>
      <Text className="mt-2 text-center text-sm text-slate-600 dark:text-slate-300">
        {message ?? "An unexpected error occurred. Please try again."}
      </Text>
      {onRetry ? (
        <View className="mt-6 w-full max-w-xs">
          <Button variant="primary" onPress={onRetry}>
            Retry
          </Button>
        </View>
      ) : null}
    </View>
  );
}
