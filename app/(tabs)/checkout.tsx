import React from 'react';
import { View, Text } from 'react-native';
import { useCheckout } from '@/hooks/useCheckout';
import { Card, Spinner, EmptyState, ErrorView } from '@/components/ui';

export default function CheckoutScreen() {
  const { data, isLoading, error } = useCheckout();

  if (isLoading) return <Spinner />;
  if (error) return <ErrorView message="Failed to load checkout details" />;
  if (!data) return <EmptyState title="Add a shipping address to continue" />;

  return (
    <Card>
      <Text>Checkout Details</Text>
    </Card>
  );
}