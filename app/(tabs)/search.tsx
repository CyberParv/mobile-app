import React from 'react';
import { View, TextInput, FlatList, Text } from 'react-native';
import { useSearch } from '@/hooks/useSearch';
import { Card, Spinner, EmptyState, ErrorView } from '@/components/ui';

export default function SearchScreen() {
  const { data, isLoading, error, search } = useSearch();

  if (isLoading) return <Spinner />;
  if (error) return <ErrorView message="Failed to load search results" />;
  if (!data || data.length === 0) return <EmptyState title="No results found" />;

  return (
    <View>
      <TextInput placeholder="Search..." onChangeText={search} />
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card>
            <Text>{item.title}</Text>
          </Card>
        )}
      />
    </View>
  );
}