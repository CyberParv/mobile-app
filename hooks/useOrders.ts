import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export function useOrders() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/v1/orders');
        setData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return { data, isLoading, error, refetch: fetchOrders };
}
