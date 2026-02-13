import { useState } from 'react';
import { api } from '@/lib/api';
import { getSecureItem, setSecureItem } from '@/lib/secureStorage';

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await api.post('/v1/auth/login', { email, password });
      await setSecureItem('accessToken', response.data.accessToken);
      await setSecureItem('refreshToken', response.data.refreshToken);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email, password, name) => {
    setIsLoading(true);
    try {
      const response = await api.post('/v1/auth/signup', { email, password, fullName: name });
      await setSecureItem('accessToken', response.data.accessToken);
      await setSecureItem('refreshToken', response.data.refreshToken);
    } finally {
      setIsLoading(false);
    }
  };

  return { login, signup, isLoading };
}
