import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import Login from '@/app/(auth)/login';
import { renderWithProviders } from '../utils/test-utils';

jest.mock('@/lib/api', () => ({
  login: jest.fn()
}));

const { login } = require('@/lib/api');

login.mockImplementation(() => Promise.resolve({ token: 'fake-token' }));

describe('Login Screen', () => {
  it('renders email and password inputs', () => {
    const { getByPlaceholderText } = renderWithProviders(<Login />);
    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
  });

  it('shows validation errors for empty fields on submit', async () => {
    const { getByText, getByRole } = renderWithProviders(<Login />);
    fireEvent.press(getByRole('button'));
    await waitFor(() => {
      expect(getByText('Email is required')).toBeTruthy();
      expect(getByText('Password is required')).toBeTruthy();
    });
  });

  it('shows validation error for invalid email format', async () => {
    const { getByText, getByPlaceholderText, getByRole } = renderWithProviders(<Login />);
    fireEvent.changeText(getByPlaceholderText('Email'), 'invalid-email');
    fireEvent.press(getByRole('button'));
    await waitFor(() => {
      expect(getByText('Invalid email format')).toBeTruthy();
    });
  });

  it('calls login() with credentials on valid submit', async () => {
    const { getByPlaceholderText, getByRole } = renderWithProviders(<Login />);
    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    fireEvent.press(getByRole('button'));
    await waitFor(() => {
      expect(login).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password123' });
    });
  });

  it('shows loading state during login', async () => {
    const { getByRole, getByTestId } = renderWithProviders(<Login />);
    fireEvent.press(getByRole('button'));
    expect(getByTestId('loading-spinner')).toBeTruthy();
  });

  it('shows error message when login fails (401)', async () => {
    login.mockImplementationOnce(() => Promise.reject({ response: { status: 401 } }));
    const { getByText, getByRole } = renderWithProviders(<Login />);
    fireEvent.press(getByRole('button'));
    await waitFor(() => {
      expect(getByText('Invalid credentials')).toBeTruthy();
    });
  });

  it('shows error message when network is down', async () => {
    login.mockImplementationOnce(() => Promise.reject(new Error('Network Error')));
    const { getByText, getByRole } = renderWithProviders(<Login />);
    fireEvent.press(getByRole('button'));
    await waitFor(() => {
      expect(getByText('Network Error')).toBeTruthy();
    });
  });

  it('navigates to main app on successful login', async () => {
    const { getByRole } = renderWithProviders(<Login />);
    fireEvent.press(getByRole('button'));
    await waitFor(() => {
      expect(useRouter().push).toHaveBeenCalledWith('/main');
    });
  });

  it('navigates to signup screen when link tapped', () => {
    const { getByText } = renderWithProviders(<Login />);
    fireEvent.press(getByText('Sign up'));
    expect(useRouter().push).toHaveBeenCalledWith('/signup');
  });
});