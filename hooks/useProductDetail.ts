import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export function useProductDetail(id) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/v1/products/${id}`);
        setData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return { data, isLoading, error };
}
