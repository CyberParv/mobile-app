import React from 'react';
import { render } from '@testing-library/react-native';
import { AuthProvider } from '@/providers/AuthProvider';
import { ToastProvider } from '@/providers/ToastProvider';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import axios from 'axios';

export function renderWithProviders(ui, { overrideAuth } = {}) {
  return render(
    <AuthProvider overrideAuth={overrideAuth}>
      <ToastProvider>
        <SafeAreaProvider>
          {ui}
        </SafeAreaProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

export function mockApi(response) {
  jest.spyOn(axios, 'request').mockImplementation(() => Promise.resolve(response));
}

export function createMockUser(overrides) {
  return {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    ...overrides
  };
}

export function createMockEntity(overrides) {
  return {
    id: 1,
    name: 'Sample Entity',
    ...overrides
  };
}