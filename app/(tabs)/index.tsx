import React from "react";
import { ScrollView, Text, View } from "react-native";

import { Avatar, Button, Card, SkeletonLoader } from "@/components/ui";
import { useAuth } from "@/providers/AuthProvider";
import { useTheme } from "@/providers/ThemeProvider";

export default function HomeScreen() {
  const { user, logout } = useAuth();
  const { toggleTheme, theme } = useTheme();

  return (
    <ScrollView className="flex-1 bg-bg" contentContainerClassName="px-5 pt-6 pb-10">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <Avatar name={user?.name ?? user?.email ?? "User"} uri={user?.avatarUrl ?? null} size="lg" />
          <View>
            <Text className="text-text text-lg font-semibold">{user?.name ?? "Welcome"}</Text>
            <Text className="text-text-muted">{user?.email ?? ""}</Text>
          </View>
        </View>

        <Button variant="outline" size="sm" onPress={toggleTheme}>
          {theme === "dark" ? "Light" : "Dark"}
        </Button>
      </View>

      <Card className="mt-6">
        <Text className="text-text text-base font-semibold">Dashboard</Text>
        <Text className="text-text-muted mt-2">
          This is a production-ready scaffold: auth, token refresh, theming, toasts, and UI primitives.
        </Text>

        <View className="mt-4 gap-3">
          <View className="flex-row gap-3">
            <SkeletonLoader className="h-16 flex-1" rounded="lg" />
            <SkeletonLoader className="h-16 flex-1" rounded="lg" />
          </View>
          <SkeletonLoader className="h-24 w-full" rounded="lg" />
        </View>
      </Card>

      <View className="mt-6">
        <Button variant="destructive" onPress={logout}>
          Sign out
        </Button>
      </View>
    </ScrollView>
  );
}
