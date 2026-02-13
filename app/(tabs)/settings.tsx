import React from 'react';
import { View, Text } from 'react-native';
import { useSettings } from '@/hooks/useSettings';
import { Card, Spinner, EmptyState, ErrorView } from '@/components/ui';

export default function SettingsScreen() {
  const { data, isLoading, error } = useSettings();

  if (isLoading) return <Spinner />;
  if (error) return <ErrorView message="Failed to load settings" />;
  if (!data) return <EmptyState title="Settings unavailable" />;

  return (
    <Card>
      <Text>Settings</Text>
    </Card>
  );
}