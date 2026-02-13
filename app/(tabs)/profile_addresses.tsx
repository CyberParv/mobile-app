import React from 'react';
import { View, FlatList, Text } from 'react-native';
import { useProfile } from '@/hooks/useProfile';
import { Card, Spinner, EmptyState, ErrorView } from '@/components/ui';

export default function ProfileAddressesScreen() {
  const { data, isLoading, error } = useProfile();

  if (isLoading) return <Spinner />;
  if (error) return <ErrorView message="Failed to load profile" />;
  if (!data || data.length === 0) return <EmptyState title="No addresses found" />;

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Card>
          <Text>{item.fullName}</Text>
        </Card>
      )}
    />
  );
}