import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export function useSearch() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const search = async (query) => {
    setIsLoading(true);
    try {
      const response = await api.get(`/v1/search?q=${query}`);
      setData(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, error, search };
}
