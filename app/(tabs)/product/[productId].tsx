import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useProduct } from '@/hooks/useProduct';
import { Button, SkeletonLoader, EmptyState, ErrorView } from '@/components/ui';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function ProductDetailScreen() {
  const { productId } = useLocalSearchParams();
  const { data, isLoading, error, refetch } = useProduct(productId);
  const router = useRouter();

  if (isLoading) return <SkeletonLoader />;
  if (error) return <ErrorView message="Failed to load product" retry={refetch} />;
  if (!data) return <EmptyState title="Product not found" />;

  return (
    <ScrollView className="p-4">
      <Text className="text-2xl font-bold mb-2">{data.title}</Text>
      <Text className="text-lg mb-4">{data.description}</Text>
      <Button onPress={() => { /* Add to cart logic */ }}>
        <Text>Add to Cart</Text>
      </Button>
    </ScrollView>
  );
}
