import React from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { useDashboardData } from '@/hooks/useDashboardData';
import { Card, Spinner, EmptyState, ErrorView } from '@/components/ui';

export default function DashboardScreen() {
  const { data, isLoading, error, refetch } = useDashboardData();

  if (isLoading) return <Spinner />;
  if (error) return <ErrorView message={error.message} onRetry={refetch} />;
  if (!data) return <EmptyState message="No data available" />;

  return (
    <ScrollView
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
    >
      <View style={{ padding: 16 }}>
        <Card>
          <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Dashboard</Text>
          {/* Render dashboard data here */}
        </Card>
      </View>
    </ScrollView>
  );
}