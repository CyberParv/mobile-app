import React from 'react';
import { render } from '@testing-library/react-native';
import { AuthProvider } from '@/providers/AuthProvider';
import { ToastProvider } from '@/providers/ToastProvider';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

export function renderWithProviders(component, { overrideAuth } = {}) {
  return render(
    <AuthProvider overrideAuth={overrideAuth}>
      <ToastProvider>
        <SafeAreaProvider>
          {component}
        </SafeAreaProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

export function mockApi() {
  return new MockAdapter(axios);
}

export function createMockUser(id = 1) {
  return {
    id,
    name: `User ${id}`,
    email: `user${id}@example.com`
  };
}

export function createMockEntity(id = 1) {
  return {
    id,
    name: `Entity ${id}`
  };
}