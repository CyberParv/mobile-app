import { renderHook, act } from '@testing-library/react-hooks';
import useXxx from '@/hooks/useXxx';
import { mockApi } from '../utils/test-utils';

describe('useXxx', () => {
  it('returns loading=true initially', () => {
    const { result } = renderHook(() => useXxx());
    expect(result.current.loading).toBe(true);
  });

  it('returns data on successful fetch', async () => {
    mockApi({ data: { id: 1, name: 'Data' } });
    const { result, waitForNextUpdate } = renderHook(() => useXxx());
    await waitForNextUpdate();
    expect(result.current.data).toEqual({ id: 1, name: 'Data' });
  });

  it('returns error on failed fetch', async () => {
    mockApi(Promise.reject(new Error('Fetch error')));
    const { result, waitForNextUpdate } = renderHook(() => useXxx());
    await waitForNextUpdate();
    expect(result.current.error).toEqual('Fetch error');
  });

  it('refetch works after error', async () => {
    mockApi(Promise.reject(new Error('Fetch error')));
    const { result, waitForNextUpdate } = renderHook(() => useXxx());
    await waitForNextUpdate();
    mockApi({ data: { id: 1, name: 'Data' } });
    act(() => {
      result.current.refetch();
    });
    await waitForNextUpdate();
    expect(result.current.data).toEqual({ id: 1, name: 'Data' });
  });

  it('handles empty response', async () => {
    mockApi({ data: null });
    const { result, waitForNextUpdate } = renderHook(() => useXxx());
    await waitForNextUpdate();
    expect(result.current.data).toBeNull();
  });
});