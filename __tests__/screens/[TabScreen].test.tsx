import React from 'react';
import { renderWithProviders, mockApi } from '../utils/test-utils';
import { fireEvent, waitFor } from '@testing-library/react-native';
import TabScreen from '@/app/(tabs)/index';

describe('TabScreen', () => {
  it('renders loading skeleton initially', () => {
    mockApi.mockReturnValueOnce(new Promise(() => {}));
    const { getByTestId } = renderWithProviders(<TabScreen />);
    expect(getByTestId('skeleton-loader')).toBeTruthy();
  });

  it('renders data after successful fetch', async () => {
    const data = [{ id: 1, name: 'Item 1' }];
    mockApi.mockResolvedValueOnce(data);
    const { getByText } = renderWithProviders(<TabScreen />);
    await waitFor(() => expect(getByText('Item 1')).toBeTruthy());
  });

  it('renders empty state when no data', async () => {
    mockApi.mockResolvedValueOnce([]);
    const { getByText } = renderWithProviders(<TabScreen />);
    await waitFor(() => expect(getByText('No items available')).toBeTruthy());
  });

  it('renders error state when fetch fails', async () => {
    mockApi.mockRejectedValueOnce(new Error('Fetch Error'));
    const { getByText } = renderWithProviders(<TabScreen />);
    await waitFor(() => expect(getByText('Failed to load data')).toBeTruthy());
  });

  it('pull-to-refresh triggers refetch', async () => {
    const fetchData = jest.fn().mockResolvedValueOnce([{ id: 1, name: 'Item 1' }]);
    mockApi.mockImplementation(fetchData);
    const { getByText, getByTestId } = renderWithProviders(<TabScreen />);
    await waitFor(() => expect(getByText('Item 1')).toBeTruthy());
    fireEvent.scroll(getByTestId('scroll-view'), { nativeEvent: { contentOffset: { y: -100 } } });
    expect(fetchData).toHaveBeenCalledTimes(2);
  });

  it('navigation to detail screen works', () => {
    const { getByText } = renderWithProviders(<TabScreen />);
    const router = useRouter();
    fireEvent.press(getByText('Item 1'));
    expect(router.navigate).toHaveBeenCalledWith('/details/1');
  });
});