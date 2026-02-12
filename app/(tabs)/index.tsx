import React from "react";
import { View, Text } from "react-native";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-background px-6 py-8">
      <Text className="text-3xl font-bold text-text mb-4">Today</Text>
      <Card className="mb-4">
        <Text className="text-text text-lg font-semibold">Steps</Text>
        <Text className="text-text/70 mt-2">0 steps • Sync to see data</Text>
      </Card>
      <Card className="mb-4">
        <Text className="text-text text-lg font-semibold">Active Calories</Text>
        <Text className="text-text/70 mt-2">0 kcal • Sync to see data</Text>
      </Card>
      <Button variant="primary" size="lg" onPress={() => {}}>
        Log Workout
      </Button>
    </View>
  );
}
