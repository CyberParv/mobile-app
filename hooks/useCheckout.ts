import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export function useCheckout() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCheckout = async () => {
      try {
        const response = await api.get('/v1/checkout');
        setData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCheckout();
  }, []);

  return { data, isLoading, error, refetch: fetchCheckout };
}
