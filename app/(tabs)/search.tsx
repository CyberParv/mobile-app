import React, { useState } from 'react';
import { View, Text, TextInput, FlatList } from 'react-native';
import { useSearch } from '@/hooks/useSearch';
import { ProductCard, SkeletonLoader, EmptyState, ErrorView } from '@/components/ui';
import { useRouter } from 'expo-router';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const { data, isLoading, error, refetch } = useSearch(query);
  const router = useRouter();

  return (
    <View className="p-4">
      <TextInput
        placeholder="Search products"
        value={query}
        onChangeText={setQuery}
        className="mb-4 p-2 border rounded"
      />
      {isLoading && <SkeletonLoader />}
      {error && <ErrorView message="Failed to search products" retry={refetch} />}
      {!isLoading && !error && (!data || data.length === 0) && <EmptyState title="No products found" />}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductCard
            item={item}
            onPress={() => router.push(`/(tabs)/product/${item.id}`)}
          />
        )}
      />
    </View>
  );
}
