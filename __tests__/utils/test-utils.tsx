import React from 'react';
import { render } from '@testing-library/react-native';
import { AuthProvider } from '@/providers/AuthProvider';
import { ToastProvider } from '@/providers/ToastProvider';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import axios from 'axios';

export const renderWithProviders = (component, { overrideAuth } = {}) => {
  return render(
    <AuthProvider {...overrideAuth}>
      <ToastProvider>
        <SafeAreaProvider>{component}</SafeAreaProvider>
      </ToastProvider>
    </AuthProvider>
  );
};

export const mockApi = jest.fn((response) => {
  jest.spyOn(axios, 'get').mockResolvedValue({ data: response });
  jest.spyOn(axios, 'post').mockResolvedValue({ data: response });
});

export const createMockUser = (id = 1) => ({ id, name: `User ${id}`, email: `user${id}@example.com` });
export const createMockEntity = (id = 1) => ({ id, name: `Entity ${id}` });