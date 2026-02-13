import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export function useCart() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await api.get('/v1/cart');
        setData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCart();
  }, []);

  return { data, isLoading, error, refetch: fetchCart };
}
