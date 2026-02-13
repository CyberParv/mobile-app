import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export function useSearch(query) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query) return;

    const fetchSearchResults = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(`/v1/products?q=${query}`);
        setData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  return { data, isLoading, error, refetch: () => fetchSearchResults() };
}
