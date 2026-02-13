import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { useOrders } from '@/hooks/useOrders';
import { OrderCard, SkeletonLoader, EmptyState, ErrorView } from '@/components/ui';
import { useRouter } from 'expo-router';

export default function OrdersScreen() {
  const { data, isLoading, error, refetch } = useOrders();
  const router = useRouter();

  if (isLoading) return <SkeletonLoader />;
  if (error) return <ErrorView message="Failed to load orders" retry={refetch} />;
  if (!data || data.length === 0) return <EmptyState title="No orders yet" />;

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <OrderCard
          item={item}
          onPress={() => router.push(`/(tabs)/order/${item.id}`)}
        />
      )}
      ListHeaderComponent={() => <Text className="text-2xl font-bold mb-4">Order History</Text>}
    />
  );
}
