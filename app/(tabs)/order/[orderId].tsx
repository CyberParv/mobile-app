import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useOrder } from '@/hooks/useOrder';
import { SkeletonLoader, EmptyState, ErrorView } from '@/components/ui';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function OrderDetailScreen() {
  const { orderId } = useLocalSearchParams();
  const { data, isLoading, error, refetch } = useOrder(orderId);
  const router = useRouter();

  if (isLoading) return <SkeletonLoader />;
  if (error) return <ErrorView message="Failed to load order" retry={refetch} />;
  if (!data) return <EmptyState title="Order not found" />;

  return (
    <ScrollView className="p-4">
      <Text className="text-2xl font-bold mb-2">Order #{data.orderNumber}</Text>
      <Text className="text-lg mb-4">Status: {data.status}</Text>
      {/* Order details */}
    </ScrollView>
  );
}
