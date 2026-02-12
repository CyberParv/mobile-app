import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import TabScreen from '@/app/(tabs)/index';
import { renderWithProviders, mockApi } from '../utils/test-utils';

describe('Tab Screen', () => {
  it('renders loading skeleton initially', () => {
    const { getByTestId } = renderWithProviders(<TabScreen />);
    expect(getByTestId('loading-skeleton')).toBeTruthy();
  });

  it('renders data after successful fetch', async () => {
    mockApi({ data: [{ id: 1, name: 'Item 1' }] });
    const { getByText } = renderWithProviders(<TabScreen />);
    await waitFor(() => {
      expect(getByText('Item 1')).toBeTruthy();
    });
  });

  it('renders empty state when no data', async () => {
    mockApi({ data: [] });
    const { getByText } = renderWithProviders(<TabScreen />);
    await waitFor(() => {
      expect(getByText('No items found')).toBeTruthy();
    });
  });

  it('renders error state when fetch fails', async () => {
    mockApi(Promise.reject(new Error('Fetch error')));
    const { getByText } = renderWithProviders(<TabScreen />);
    await waitFor(() => {
      expect(getByText('Error loading data')).toBeTruthy();
    });
  });

  it('pull-to-refresh triggers refetch', async () => {
    const { getByTestId } = renderWithProviders(<TabScreen />);
    fireEvent(getByTestId('pull-to-refresh'), 'refresh');
    await waitFor(() => {
      expect(mockApi).toHaveBeenCalledTimes(2);
    });
  });

  it('navigation to detail screen works', () => {
    const { getByText } = renderWithProviders(<TabScreen />);
    fireEvent.press(getByText('Item 1'));
    expect(useRouter().push).toHaveBeenCalledWith('/detail/1');
  });
});