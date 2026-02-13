import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { useWishlist } from '@/hooks/useWishlist';
import { WishlistItemCard, SkeletonLoader, EmptyState, ErrorView } from '@/components/ui';
import { useRouter } from 'expo-router';

export default function WishlistScreen() {
  const { data, isLoading, error, refetch } = useWishlist();
  const router = useRouter();

  if (isLoading) return <SkeletonLoader />;
  if (error) return <ErrorView message="Failed to load wishlist" retry={refetch} />;
  if (!data || data.length === 0) return <EmptyState title="Your wishlist is empty" />;

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <WishlistItemCard
          item={item}
          onPress={() => router.push(`/(tabs)/product/${item.productId}`)}
        />
      )}
      ListHeaderComponent={() => <Text className="text-2xl font-bold mb-4">Wishlist</Text>}
    />
  );
}
