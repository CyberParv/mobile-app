import React from 'react';
import { View, Text } from 'react-native';
import { useProfile } from '@/hooks/useProfile';
import { Button, SkeletonLoader, EmptyState, ErrorView } from '@/components/ui';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const { data, isLoading, error, refetch } = useProfile();
  const router = useRouter();

  if (isLoading) return <SkeletonLoader />;
  if (error) return <ErrorView message="Failed to load profile" retry={refetch} />;
  if (!data) return <EmptyState title="Profile not available" />;

  return (
    <View className="p-4">
      <Text className="text-2xl font-bold mb-4">Profile</Text>
      <Text className="text-lg mb-2">Name: {data.fullName}</Text>
      <Text className="text-lg mb-4">Email: {data.email}</Text>
      <Button onPress={() => router.push('/(tabs)/profile/edit')}>
        <Text>Edit Profile</Text>
      </Button>
    </View>
  );
}
