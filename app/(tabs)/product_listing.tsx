import React from 'react';
import { View, FlatList, Text } from 'react-native';
import { useProducts } from '@/hooks/useProducts';
import { Card, Spinner, EmptyState, ErrorView } from '@/components/ui';

export default function ProductListingScreen() {
  const { data, isLoading, error } = useProducts();

  if (isLoading) return <Spinner />;
  if (error) return <ErrorView message="Failed to load products" />;
  if (!data || data.length === 0) return <EmptyState title="No products found" />;

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