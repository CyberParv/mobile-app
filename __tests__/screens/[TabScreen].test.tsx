import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import TabScreen from '@/app/(tabs)/index';
import { mockApi, renderWithProviders } from '../utils/test-utils';

const apiMock = mockApi();

describe('Tab Screen', () => {
  beforeEach(() => {
    apiMock.reset();
  });

  it('renders loading skeleton initially', () => {
    const { getByTestId } = renderWithProviders(<TabScreen />);
    expect(getByTestId('skeleton-loader')).toBeTruthy();
  });

  it('renders data after successful fetch', async () => {
    apiMock.onGet('/data').reply(200, [{ id: 1, name: 'Item 1' }]);
    const { getByText } = renderWithProviders(<TabScreen />);
    await waitFor(() => {
      expect(getByText('Item 1')).toBeTruthy();
    });
  });

  it('renders empty state when no data', async () => {
    apiMock.onGet('/data').reply(200, []);
    const { getByText } = renderWithProviders(<TabScreen />);
    await waitFor(() => {
      expect(getByText('No items available')).toBeTruthy();
    });
  });

  it('renders error state when fetch fails', async () => {
    apiMock.onGet('/data').reply(500);
    const { getByText } = renderWithProviders(<TabScreen />);
    await waitFor(() => {
      expect(getByText('Error loading data')).toBeTruthy();
    });
  });

  it('pull-to-refresh triggers refetch', async () => {
    apiMock.onGet('/data').reply(200, [{ id: 1, name: 'Item 1' }]);
    const { getByText, getByTestId } = renderWithProviders(<TabScreen />);
    await waitFor(() => {
      expect(getByText('Item 1')).toBeTruthy();
    });
    fireEvent(getByTestId('scroll-view'), 'refresh');
    await waitFor(() => {
      expect(apiMock.history.get.length).toBe(2);
    });
  });

  it('navigation to detail screen works', async () => {
    apiMock.onGet('/data').reply(200, [{ id: 1, name: 'Item 1' }]);
    const { getByText } = renderWithProviders(<TabScreen />);
    await waitFor(() => {
      expect(getByText('Item 1')).toBeTruthy();
    });
    fireEvent.press(getByText('Item 1'));
    expect(mockRouter.push).toHaveBeenCalledWith('/detail/1');
  });
});