import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { useProducts } from '@/hooks/useProducts';
import { ProductCard, SkeletonLoader, EmptyState, ErrorView } from '@/components/ui';
import { useRouter } from 'expo-router';

export default function ProductListingScreen() {
  const { data, isLoading, error, refetch } = useProducts();
  const router = useRouter();

  if (isLoading) return <SkeletonLoader />;
  if (error) return <ErrorView message="Failed to load products" retry={refetch} />;
  if (!data || data.length === 0) return <EmptyState title="No products found" />;

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ProductCard
          item={item}
          onPress={() => router.push(`/(tabs)/product/${item.id}`)}
        />
      )}
      ListHeaderComponent={() => <Text className="text-2xl font-bold mb-4">Product Listing</Text>}
    />
  );
}
