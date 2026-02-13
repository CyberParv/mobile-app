import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { useHome } from '@/hooks/useHome';
import { Card, Spinner, EmptyState, ErrorView } from '@/components/ui';

export default function HomeScreen() {
  const { data, isLoading, error } = useHome();

  if (isLoading) return <Spinner />;
  if (error) return <ErrorView message="Failed to load home data" />;
  if (!data || data.length === 0) return <EmptyState title="No featured items right now" />;

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