import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { useCart } from '@/hooks/useCart';
import { CartItemRow, SkeletonLoader, EmptyState, ErrorView } from '@/components/ui';
import { useRouter } from 'expo-router';

export default function CartScreen() {
  const { data, isLoading, error, refetch } = useCart();
  const router = useRouter();

  if (isLoading) return <SkeletonLoader />;
  if (error) return <ErrorView message="Failed to load cart" retry={refetch} />;
  if (!data || data.items.length === 0) return <EmptyState title="Your cart is empty" />;

  return (
    <FlatList
      data={data.items}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <CartItemRow item={item} />}
      ListHeaderComponent={() => <Text className="text-2xl font-bold mb-4">Shopping Cart</Text>}
    />
  );
}
