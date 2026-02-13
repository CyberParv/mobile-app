import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import Login from '@/app/(auth)/login';
import { mockApi, renderWithProviders } from '../utils/test-utils';

const apiMock = mockApi();

describe('Login Screen', () => {
  beforeEach(() => {
    apiMock.reset();
  });

  it('renders email and password inputs', () => {
    const { getByPlaceholderText } = renderWithProviders(<Login />);
    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
  });

  it('shows validation errors for empty fields on submit', async () => {
    const { getByText } = renderWithProviders(<Login />);
    fireEvent.press(getByText('Login'));
    await waitFor(() => {
      expect(getByText('Email is required')).toBeTruthy();
      expect(getByText('Password is required')).toBeTruthy();
    });
  });

  it('shows validation error for invalid email format', async () => {
    const { getByText, getByPlaceholderText } = renderWithProviders(<Login />);
    fireEvent.changeText(getByPlaceholderText('Email'), 'invalid-email');
    fireEvent.press(getByText('Login'));
    await waitFor(() => {
      expect(getByText('Invalid email format')).toBeTruthy();
    });
  });

  it('calls login() with credentials on valid submit', async () => {
    const { getByText, getByPlaceholderText } = renderWithProviders(<Login />);
    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'Password123!');
    fireEvent.press(getByText('Login'));
    await waitFor(() => {
      expect(apiMock.history.post.length).toBe(1);
    });
  });

  it('shows loading state during login', async () => {
    const { getByText, getByPlaceholderText } = renderWithProviders(<Login />);
    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'Password123!');
    fireEvent.press(getByText('Login'));
    expect(getByText('Loading...')).toBeTruthy();
  });

  it('shows error message when login fails (401)', async () => {
    apiMock.onPost('/login').reply(401);
    const { getByText, getByPlaceholderText } = renderWithProviders(<Login />);
    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'Password123!');
    fireEvent.press(getByText('Login'));
    await waitFor(() => {
      expect(getByText('Invalid credentials')).toBeTruthy();
    });
  });

  it('shows error message when network is down', async () => {
    apiMock.onPost('/login').networkError();
    const { getByText, getByPlaceholderText } = renderWithProviders(<Login />);
    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'Password123!');
    fireEvent.press(getByText('Login'));
    await waitFor(() => {
      expect(getByText('Network error')).toBeTruthy();
    });
  });

  it('navigates to main app on successful login', async () => {
    apiMock.onPost('/login').reply(200, { token: 'fake-token' });
    const { getByText, getByPlaceholderText } = renderWithProviders(<Login />);
    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'Password123!');
    fireEvent.press(getByText('Login'));
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/main');
    });
  });

  it('navigates to signup screen when link tapped', () => {
    const { getByText } = renderWithProviders(<Login />);
    fireEvent.press(getByText('Sign up'));
    expect(mockRouter.push).toHaveBeenCalledWith('/signup');
  });
});