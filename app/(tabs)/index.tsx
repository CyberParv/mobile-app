import React from "react";
import { Text, View } from "react-native";
import { Button, Card, Avatar } from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/providers/ToastProvider";

export default function HomeScreen() {
  const { user, logout } = useAuth();
  const toast = useToast();

  const onLogout = async () => {
    try {
      await logout();
      toast.info("Signed out", "You have been logged out.");
    } catch {
      toast.error("Logout failed", "Please try again.");
    }
  };

  return (
    <View className="flex-1 bg-slate-50 px-5 pt-16 dark:bg-slate-950">
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="text-sm text-slate-600 dark:text-slate-300">Welcome</Text>
          <Text className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">{user?.name ?? "User"}</Text>
        </View>
        <Avatar name={user?.name ?? user?.email} size="md" />
      </View>

      <Card className="mt-6">
        <Text className="text-base font-semibold text-slate-900 dark:text-slate-100">Dashboard</Text>
        <Text className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          This scaffold includes auth, theming, toasts, and a production-ready UI foundation.
        </Text>
        <View className="mt-4">
          <Button variant="outline" onPress={onLogout}>
            Logout
          </Button>
        </View>
      </Card>

      <Card className="mt-4">
        <Text className="text-base font-semibold text-slate-900 dark:text-slate-100">Account</Text>
        <Text className="mt-2 text-sm text-slate-600 dark:text-slate-300">Email: {user?.email ?? "—"}</Text>
        <Text className="mt-1 text-sm text-slate-600 dark:text-slate-300">ID: {user?.id ?? "—"}</Text>
      </Card>
    </View>
  );
}
