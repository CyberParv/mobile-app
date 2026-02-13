import { renderHook, act } from '@testing-library/react-hooks';
import useXxx from '@/hooks/useXxx';
import { mockApi } from '../utils/test-utils';

const apiMock = mockApi();

describe('useXxx', () => {
  beforeEach(() => {
    apiMock.reset();
  });

  it('returns loading=true initially', () => {
    const { result } = renderHook(() => useXxx());
    expect(result.current.loading).toBe(true);
  });

  it('returns data on successful fetch', async () => {
    apiMock.onGet('/xxx').reply(200, { data: 'some data' });
    const { result, waitForNextUpdate } = renderHook(() => useXxx());
    await waitForNextUpdate();
    expect(result.current.data).toEqual('some data');
  });

  it('returns error on failed fetch', async () => {
    apiMock.onGet('/xxx').reply(500);
    const { result, waitForNextUpdate } = renderHook(() => useXxx());
    await waitForNextUpdate();
    expect(result.current.error).toBeTruthy();
  });

  it('refetch works after error', async () => {
    apiMock.onGet('/xxx').reply(500);
    const { result, waitForNextUpdate } = renderHook(() => useXxx());
    await waitForNextUpdate();
    apiMock.onGet('/xxx').reply(200, { data: 'some data' });
    act(() => {
      result.current.refetch();
    });
    await waitForNextUpdate();
    expect(result.current.data).toEqual('some data');
  });

  it('handles empty response', async () => {
    apiMock.onGet('/xxx').reply(200, null);
    const { result, waitForNextUpdate } = renderHook(() => useXxx());
    await waitForNextUpdate();
    expect(result.current.data).toBeNull();
  });
});