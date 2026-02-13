import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { AuthProvider, useAuth } from '@/providers/AuthProvider';
import { mockApi } from '../utils/test-utils';

const apiMock = mockApi();

describe('AuthProvider', () => {
  beforeEach(() => {
    apiMock.reset();
  });

  it('provides isAuthenticated=false when no token', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    });
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('provides isAuthenticated=true when valid token exists', async () => {
    apiMock.onGet('/auth/validate').reply(200);
    const { result, waitForNextUpdate } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    });
    await waitForNextUpdate();
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('login stores token and updates state', async () => {
    apiMock.onPost('/auth/login').reply(200, { token: 'fake-token' });
    const { result, waitForNextUpdate } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    });
    act(() => {
      result.current.login('test@example.com', 'Password123!');
    });
    await waitForNextUpdate();
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('logout clears token and updates state', async () => {
    apiMock.onPost('/auth/logout').reply(200);
    const { result, waitForNextUpdate } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    });
    act(() => {
      result.current.logout();
    });
    await waitForNextUpdate();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('signup creates account and stores token', async () => {
    apiMock.onPost('/auth/signup').reply(200, { token: 'fake-token' });
    const { result, waitForNextUpdate } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    });
    act(() => {
      result.current.signup('test@example.com', 'Password123!');
    });
    await waitForNextUpdate();
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('handles token refresh on 401', async () => {
    apiMock.onGet('/auth/validate').reply(401);
    apiMock.onPost('/auth/refresh').reply(200, { token: 'new-token' });
    const { result, waitForNextUpdate } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    });
    await waitForNextUpdate();
    expect(result.current.isAuthenticated).toBe(true);
  });
});