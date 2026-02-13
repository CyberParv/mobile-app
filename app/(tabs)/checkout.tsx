import React from 'react';
import { View, Text } from 'react-native';
import { useCheckout } from '@/hooks/useCheckout';
import { Button, SkeletonLoader, EmptyState, ErrorView } from '@/components/ui';
import { useRouter } from 'expo-router';

export default function CheckoutScreen() {
  const { data, isLoading, error, refetch } = useCheckout();
  const router = useRouter();

  if (isLoading) return <SkeletonLoader />;
  if (error) return <ErrorView message="Failed to load checkout" retry={refetch} />;
  if (!data) return <EmptyState title="Checkout not available" />;

  return (
    <View className="p-4">
      <Text className="text-2xl font-bold mb-4">Checkout</Text>
      <Button onPress={() => { /* Payment logic */ }}>
        <Text>Pay Now</Text>
      </Button>
    </View>
  );
}
