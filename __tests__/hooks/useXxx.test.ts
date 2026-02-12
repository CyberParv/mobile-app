import { renderHook } from '@testing-library/react-hooks';
import { mockApi } from '../utils/test-utils';
import useXxx from '@/hooks/useXxx';

describe('useXxx Hook', () => {
  it('returns loading=true initially', () => {
    const { result } = renderHook(() => useXxx());
    expect(result.current.loading).toBe(true);
  });

  it('returns data on successful fetch', async () => {
    const mockData = { id: 1, name: 'Item 1' };
    mockApi.mockResolvedValueOnce(mockData);
    const { result, waitForNextUpdate } = renderHook(() => useXxx());
    await waitForNextUpdate();
    expect(result.current.data).toEqual(mockData);
  });

  it('returns error on failed fetch', async () => {
    mockApi.mockRejectedValueOnce(new Error('Failed Fetch'));
    const { result, waitForNextUpdate } = renderHook(() => useXxx());
    await waitForNextUpdate();
    expect(result.current.error).toBe('Failed Fetch');
  });

  it('refetch works after error', async () => {
    mockApi.mockRejectedValueOnce(new Error('Failed Fetch'));
    const { result, waitForNextUpdate } = renderHook(() => useXxx());
    await waitForNextUpdate();
    mockApi.mockResolvedValueOnce({ id: 1, name: 'Recovered' });
    result.current.refetch();
    await waitForNextUpdate();
    expect(result.current.data).toEqual({ id: 1, name: 'Recovered' });
  });

  it('handles empty response', async () => {
    mockApi.mockResolvedValueOnce([]);
    const { result, waitForNextUpdate } = renderHook(() => useXxx());
    await waitForNextUpdate();
    expect(result.current.data).toEqual([]);
    expect(result.current.noData).toBe(true);
  });
});