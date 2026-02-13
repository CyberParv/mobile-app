import React from 'react';
import { View, Text } from 'react-native';
import { Button, SkeletonLoader, EmptyState, ErrorView } from '@/components/ui';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
  const router = useRouter();

  return (
    <View className="p-4">
      <Text className="text-2xl font-bold mb-4">Settings</Text>
      <Button onPress={() => { /* Toggle dark mode logic */ }}>
        <Text>Toggle Dark Mode</Text>
      </Button>
      <Button onPress={() => { /* Sign out logic */ }}>
        <Text>Sign Out</Text>
      </Button>
    </View>
  );
}
