import React from "react";
import { ScrollView, Text, View } from "react-native";
import { Button, Card } from "@/components/ui";
import { useAuth } from "@/providers/AuthProvider";
import { useTheme } from "@/providers/ThemeProvider";

export default function SettingsScreen() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <ScrollView className="flex-1 bg-bg" contentContainerClassName="px-5 pt-6 pb-10">
      <Text className="text-text text-2xl font-bold">Settings</Text>

      <Card className="mt-6">
        <Text className="text-text font-semibold">Account</Text>
        <Text className="text-text-muted mt-2">Signed in as {user?.email ?? ""}</Text>
        <View className="mt-4">
          <Button variant="destructive" onPress={logout}>
            Sign out
          </Button>
        </View>
      </Card>

      <Card className="mt-4">
        <Text className="text-text font-semibold">Appearance</Text>
        <Text className="text-text-muted mt-2">Current theme: {theme}</Text>
        <View className="mt-4">
          <Button variant="outline" onPress={toggleTheme}>
            Toggle theme
          </Button>
        </View>
      </Card>
    </ScrollView>
  );
}
