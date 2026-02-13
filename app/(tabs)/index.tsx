import React from 'react';
import { Text, View } from 'react-native';

import { Button, Card, Avatar } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';

export default function HomeScreen() {
  const { user, logout, isLoading } = useAuth();

  return (
    <View className="flex-1 bg-background px-5 pt-14">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Avatar name={user?.name ?? user?.email ?? 'User'} size="md" />
          <View className="ml-3">
            <Text className="text-sm text-muted">Welcome</Text>
            <Text className="text-xl font-semibold text-foreground">
              {user?.name ?? user?.email ?? '—'}
            </Text>
          </View>
        </View>
      </View>

      <Card className="mt-6 p-4">
        <Text className="text-base font-semibold text-foreground">Dashboard</Text>
        <Text className="mt-2 text-sm text-muted">
          This is a production-ready Expo Router scaffold with auth, theming, toasts, and a UI kit.
        </Text>

        <Button
          className="mt-4"
          variant="outline"
          size="md"
          loading={isLoading}
          onPress={logout}
        >
          Log out
        </Button>
      </Card>
    </View>
  );
}
