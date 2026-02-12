import React from 'react';
import { renderWithProviders } from '../utils/test-utils';
import { AuthProvider, useAuth } from '@/providers/AuthProvider';
import { act } from 'react-dom/test-utils';


describe('AuthProvider', () => {
  const TestComponent = () => {
    const { isAuthenticated, login, logout } = useAuth();
    return (
      <>
        <div>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</div>
        <button onClick={() => login({ token: 'valid-token' })}>Login</button>
        <button onClick={() => logout()}>Logout</button>
      </>
    );
  };

  it('provides isAuthenticated=false when no token', () => {
    const { getByText } = renderWithProviders(<TestComponent />);
    expect(getByText('Authenticated: No')).toBeTruthy();
  });

  it('provides isAuthenticated=true when valid token exists', async () => {
    const { getByText } = renderWithProviders(<TestComponent />, { overrideAuth: { initialToken: 'valid-token' } });
    expect(getByText('Authenticated: Yes')).toBeTruthy();
  });

  it('login stores token and updates state', async () => {
    const { getByText, getByRole } = renderWithProviders(<TestComponent />);
    await act(async () => { fireEvent.click(getByRole('button', { name: 'Login' })); });
    expect(getByText('Authenticated: Yes')).toBeTruthy();
  });

  it('logout clears token and updates state', async () => {
    const { getByText, getByRole } = renderWithProviders(<TestComponent />, { overrideAuth: { initialToken: 'valid-token' } });
    await act(async () => { fireEvent.click(getByRole('button', { name: 'Logout' })); });
    expect(getByText('Authenticated: No')).toBeTruthy();
  });

  it('signup creates account and stores token', async () => {
    // implement signup logic and test here
  });

  it('handles token refresh on 401', async () => {
    // implement refresh token logic and test here
  });
});