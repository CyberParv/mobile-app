import React from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Button } from "@/components/ui/Button";
import { colors } from "@/constants/colors";

export type ErrorViewProps = {
  message?: string;
  onRetry?: () => void;
};

export function ErrorView({
  message = "Something went wrong.",
  onRetry,
}: ErrorViewProps) {
  return (
    <View className="flex-1 items-center justify-center px-6 py-10">
      <Ionicons name="alert-circle-outline" size={44} color={colors.red[600]} />
      <Text className="mt-3 text-lg font-semibold text-slate-900 dark:text-white text-center">
        Error
      </Text>
      <Text className="mt-2 text-slate-600 dark:text-slate-300 text-center">
        {message}
      </Text>

      {onRetry ? (
        <View className="mt-5 w-full max-w-xs">
          <Button variant="outline" size="md" onPress={onRetry}>
            <Text className="text-slate-900 dark:text-white font-semibold">Retry</Text>
          </Button>
        </View>
      ) : null}
    </View>
  );
}
