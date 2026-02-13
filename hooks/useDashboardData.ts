import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';

export function useDashboardData() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [workouts, meals] = await Promise.all([
        api.get('/workouts'),
        api.get('/meals')
      ]);
      setData({ workouts: workouts.data, meals: meals.data });
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}