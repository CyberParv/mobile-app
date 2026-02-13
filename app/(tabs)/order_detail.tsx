import React from 'react';
import { View, Text } from 'react-native';
import { useOrderDetail } from '@/hooks/useOrderDetail';
import { Card, Spinner, EmptyState, ErrorView } from '@/components/ui';

export default function OrderDetailScreen({ route }) {
  const { id } = route.params;
  const { data, isLoading, error } = useOrderDetail(id);

  if (isLoading) return <Spinner />;
  if (error) return <ErrorView message="Failed to load order details" />;
  if (!data) return <EmptyState title="Order unavailable" />;

  return (
    <Card>
      <Text>Order Details</Text>
    </Card>
  );
}