import React from "react";
import { Text, View } from "react-native";

import { Avatar, Button, Card } from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/providers/ToastProvider";

export default function HomeScreen() {
  const { user, logout, isLoading } = useAuth();
  const toast = useToast();

  const onLogout = async () => {
    try {
      await logout();
      toast.info("Signed out", "You have been logged out.");
    } catch (e: any) {
      toast.error("Logout failed", e?.message ?? "Please try again.");
    }
  };

  return (
    <View className="flex-1 bg-white dark:bg-slate-950 px-5 pt-14">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Avatar name={user?.name ?? "User"} size="md" />
          <View className="ml-3">
            <Text className="text-slate-500 dark:text-slate-400 text-sm">
              Welcome
            </Text>
            <Text className="text-slate-900 dark:text-white text-xl font-semibold">
              {user?.name ?? ""}
            </Text>
          </View>
        </View>
      </View>

      <View className="mt-6">
        <Card className="p-4">
          <Text className="text-slate-900 dark:text-white text-base font-semibold">
            Dashboard
          </Text>
          <Text className="mt-2 text-slate-600 dark:text-slate-300">
            This is a production-ready scaffold with auth, theming, toasts, and a
            UI kit.
          </Text>

          <View className="mt-4">
            <Button
              variant="outline"
              size="md"
              loading={isLoading}
              onPress={onLogout}
            >
              <Text className="text-slate-900 dark:text-white font-semibold">
                Logout
              </Text>
            </Button>
          </View>
        </Card>
      </View>
    </View>
  );
}
