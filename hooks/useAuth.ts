import { useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { getSecureItem, setSecureItem } from '@/lib/secureStorage';

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      await setSecureItem('token', response.data.token);
      setIsAuthenticated(true);
    } catch (error) {
      throw new Error(error.response.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signup = useCallback(async (email, password, name) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/signup', { email, password, name });
      await setSecureItem('token', response.data.token);
      setIsAuthenticated(true);
    } catch (error) {
      throw new Error(error.response.data?.message || 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await setSecureItem('token', '');
    setIsAuthenticated(false);
  }, []);

  return { login, signup, logout, isLoading, isAuthenticated };
}