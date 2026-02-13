import React from 'react';
import { View, FlatList, Text } from 'react-native';
import { useCart } from '@/hooks/useCart';
import { Card, Spinner, EmptyState, ErrorView } from '@/components/ui';

export default function CartScreen() {
  const { data, isLoading, error } = useCart();

  if (isLoading) return <Spinner />;
  if (error) return <ErrorView message="Failed to load cart" />;
  if (!data || data.length === 0) return <EmptyState title="Your cart is empty" />;

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