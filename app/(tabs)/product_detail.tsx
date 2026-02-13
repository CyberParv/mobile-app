import React from 'react';
import { View, Text, Image } from 'react-native';
import { useProductDetail } from '@/hooks/useProductDetail';
import { Card, Spinner, EmptyState, ErrorView } from '@/components/ui';

export default function ProductDetailScreen({ route }) {
  const { id } = route.params;
  const { data, isLoading, error } = useProductDetail(id);

  if (isLoading) return <Spinner />;
  if (error) return <ErrorView message="Failed to load product details" />;
  if (!data) return <EmptyState title="Product unavailable" />;

  return (
    <Card>
      <Image source={{ uri: data.image }} style={{ height: 200 }} />
      <Text>{data.title}</Text>
      <Text>{data.description}</Text>
    </Card>
  );
}