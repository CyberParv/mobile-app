import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import Login from '@/app/(auth)/login';
import { mockApi } from '../utils/test-utils';
import { useRouter } from 'expo-router';

jest.mock('expo-router', () => ({
  useRouter: jest.fn(() => ({ navigate: jest.fn() })),
}));

describe('Login Screen', () => {
  it('renders email and password inputs', () => {
    const { getByPlaceholderText } = render(<Login />);
    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
  });

  it('shows validation errors for empty fields on submit', () => {
    const { getByText, getByRole } = render(<Login />);
    fireEvent.press(getByRole('button', { name: 'Login' }));
    expect(getByText('Email is required')).toBeTruthy();
    expect(getByText('Password is required')).toBeTruthy();
  });

  it('shows validation error for invalid email format', () => {
    const { getByText, getByPlaceholderText, getByRole } = render(<Login />);
    fireEvent.changeText(getByPlaceholderText('Email'), 'invalid-email');
    fireEvent.press(getByRole('button', { name: 'Login' }));
    expect(getByText('Invalid email format')).toBeTruthy();
  });

  it('calls login() with credentials on valid submit', async () => {
    const { getByPlaceholderText, getByRole } = render(<Login />);
    const mockLogin = jest.fn();
    mockApi.mockImplementation(() => mockLogin({ token: 'jwt-token' }));
    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password');
    fireEvent.press(getByRole('button', { name: 'Login' }));
    expect(mockLogin).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password' });
  });

  it('shows loading state during login', () => {
    const { getByRole } = render(<Login />);
    fireEvent.press(getByRole('button', { name: 'Login' }));
    expect(getByRole('button', { name: 'Loading...' })).toBeTruthy();
  });

  it('shows error message when login fails (401)', async () => {
    mockApi.mockRejectedValueOnce({ response: { status: 401 } });
    const { getByText, getByRole } = render(<Login />);
    fireEvent.press(getByRole('button', { name: 'Login' }));
    expect(await getByText('Invalid credentials')).toBeTruthy();
  });

  it('shows error message when network is down', async () => {
    mockApi.mockRejectedValueOnce({ message: 'Network Error' });
    const { getByText, getByRole } = render(<Login />);
    fireEvent.press(getByRole('button', { name: 'Login' }));
    expect(await getByText('Network error')).toBeTruthy();
  });

  it('navigates to main app on successful login', async () => {
    const { getByRole } = render(<Login />);
    const router = useRouter();
    mockApi.mockResolvedValueOnce({ token: 'jwt-token' });
    fireEvent.press(getByRole('button', { name: 'Login' }));
    expect(router.navigate).toHaveBeenCalledWith('/main');
  });

  it('navigates to signup screen when link tapped', () => {
    const { getByText } = render(<Login />);
    const router = useRouter();
    fireEvent.press(getByText('Signup'));
    expect(router.navigate).toHaveBeenCalledWith('/signup');
  });
});