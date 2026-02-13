import React from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';
import { useDashboardData } from '@/hooks/useDashboardData';
import { Card, EmptyState, SkeletonLoader, ErrorView } from '@/components/ui';

export default function DashboardScreen() {
  const { data, isLoading, error, refetch } = useDashboardData();

  if (isLoading) {
    return <SkeletonLoader count={5} />;
  }

  if (error) {
    return <ErrorView onRetry={refetch} />;
  }

  if (!data || data.length === 0) {
    return <EmptyState title="No data available" />;
  }

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <Card>{item.name}</Card>}
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
    />
  );
}