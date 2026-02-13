import React from 'react';
import { View, FlatList, Text } from 'react-native';
import { useWishlist } from '@/hooks/useWishlist';
import { Card, Spinner, EmptyState, ErrorView } from '@/components/ui';

export default function WishlistScreen() {
  const { data, isLoading, error } = useWishlist();

  if (isLoading) return <Spinner />;
  if (error) return <ErrorView message="Failed to load wishlist" />;
  if (!data || data.length === 0) return <EmptyState title="Your wishlist is empty" />;

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Card>
          <Text>{item.title}</Text>
        </Card>
      )}
    />
  );
}