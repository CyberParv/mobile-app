import React from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export type ErrorViewProps = {
  message?: string;
  onRetry?: () => void;
  className?: string;
};

export function ErrorView({ message = "Something went wrong.", onRetry, className }: ErrorViewProps) {
  return (
    <View className={cn("items-center justify-center p-6", className)}>
      <View className="h-12 w-12 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-950/30">
        <Ionicons name="alert-circle" size={22} color="#DC2626" />
      </View>
      <Text className="mt-4 text-center text-lg font-semibold text-slate-900 dark:text-slate-100">Error</Text>
      <Text className="mt-2 text-center text-sm text-slate-600 dark:text-slate-300">{message}</Text>
      {!!onRetry && (
        <View className="mt-5 w-full">
          <Button variant="outline" onPress={onRetry}>
            Retry
          </Button>
        </View>
      )}
    </View>
  );
}
