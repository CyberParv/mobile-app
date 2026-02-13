import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

export default function TabsLayout({ children }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/(auth)/login');
    }
  }, [isAuthenticated]);

  return <>{children}</>;
}