import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { AuthProvider, useAuth } from '@/providers/AuthProvider';
import { renderWithProviders } from '../utils/test-utils';

jest.mock('@/lib/secureStorage', () => ({
  getToken: jest.fn(),
  setToken: jest.fn(),
  deleteToken: jest.fn()
}));

const { getToken, setToken, deleteToken } = require('@/lib/secureStorage');

getToken.mockImplementation(() => Promise.resolve(null));


describe('AuthProvider', () => {
  it('provides isAuthenticated=false when no token', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('provides isAuthenticated=true when valid token exists', async () => {
    getToken.mockImplementationOnce(() => Promise.resolve('valid-token'));
    const { result, waitForNextUpdate } = renderHook(() => useAuth(), { wrapper: AuthProvider });
    await waitForNextUpdate();
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('login stores token and updates state', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
    await act(async () => {
      await result.current.login('token');
    });
    expect(setToken).toHaveBeenCalledWith('token');
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('logout clears token and updates state', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
    await act(async () => {
      await result.current.logout();
    });
    expect(deleteToken).toHaveBeenCalled();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('signup creates account and stores token', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
    await act(async () => {
      await result.current.signup('new-token');
    });
    expect(setToken).toHaveBeenCalledWith('new-token');
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('handles token refresh on 401', async () => {
    // Implement token refresh logic test
  });
});