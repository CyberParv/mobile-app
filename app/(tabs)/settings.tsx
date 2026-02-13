import React from 'react';
import { View, Text } from 'react-native';
import { Button } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';

export default function SettingsScreen() {
  const { logout } = useAuth();

  return (
    <View className="p-4">
      <Text className="text-2xl font-bold mb-4">Settings</Text>
      <Button onPress={logout}>
        <Text className="text-white">Logout</Text>
      </Button>
    </View>
  );
}