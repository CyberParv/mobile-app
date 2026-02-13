import axios from 'axios';
import { getApiClient } from '@/lib/api';
import { mockApi } from '../utils/test-utils';

const apiMock = mockApi();

describe('API Client', () => {
  beforeEach(() => {
    apiMock.reset();
  });

  it('adds auth header when token exists', async () => {
    const apiClient = getApiClient('fake-token');
    apiMock.onGet('/test').reply(200);
    await apiClient.get('/test');
    expect(apiMock.history.get[0].headers.Authorization).toBe('Bearer fake-token');
  });

  it('does not add auth header when no token', async () => {
    const apiClient = getApiClient();
    apiMock.onGet('/test').reply(200);
    await apiClient.get('/test');
    expect(apiMock.history.get[0].headers.Authorization).toBeUndefined();
  });

  it('handles network timeout', async () => {
    const apiClient = getApiClient();
    apiMock.onGet('/test').timeout();
    await expect(apiClient.get('/test')).rejects.toThrow('timeout');
  });

  it('retries on network failure', async () => {
    const apiClient = getApiClient();
    apiMock.onGet('/test').networkErrorOnce();
    apiMock.onGet('/test').reply(200);
    await expect(apiClient.get('/test')).resolves.toBeTruthy();
    expect(apiMock.history.get.length).toBe(2);
  });
});