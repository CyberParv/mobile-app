import React from 'react';
import { View, FlatList, Text } from 'react-native';
import { useOrders } from '@/hooks/useOrders';
import { Card, Spinner, EmptyState, ErrorView } from '@/components/ui';

export default function OrdersListScreen() {
  const { data, isLoading, error } = useOrders();

  if (isLoading) return <Spinner />;
  if (error) return <ErrorView message="Failed to load orders" />;
  if (!data || data.length === 0) return <EmptyState title="No orders yet" />;

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Card>
          <Text>{item.orderNumber}</Text>
        </Card>
      )}
    />
  );
}