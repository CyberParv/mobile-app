import axios from 'axios';
import { getToken } from '@/lib/secureStorage';
import { apiRequest } from '@/lib/api';

jest.mock('axios');

jest.mock('@/lib/secureStorage', () => ({
  getToken: jest.fn()
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;


describe('apiRequest', () => {
  it('adds auth header when token exists', async () => {
    getToken.mockImplementationOnce(() => Promise.resolve('token'));
    mockedAxios.request.mockResolvedValue({ data: {} });
    await apiRequest({ url: '/test' });
    expect(mockedAxios.request).toHaveBeenCalledWith(expect.objectContaining({
      headers: { Authorization: 'Bearer token' }
    }));
  });

  it('does not add auth header when no token', async () => {
    getToken.mockImplementationOnce(() => Promise.resolve(null));
    mockedAxios.request.mockResolvedValue({ data: {} });
    await apiRequest({ url: '/test' });
    expect(mockedAxios.request).toHaveBeenCalledWith(expect.not.objectContaining({
      headers: { Authorization: 'Bearer token' }
    }));
  });

  it('handles network timeout', async () => {
    mockedAxios.request.mockRejectedValueOnce(new Error('timeout'));
    await expect(apiRequest({ url: '/test' })).rejects.toThrow('timeout');
  });

  it('retries on network failure', async () => {
    mockedAxios.request.mockRejectedValueOnce(new Error('Network Error'));
    mockedAxios.request.mockResolvedValueOnce({ data: {} });
    await apiRequest({ url: '/test' });
    expect(mockedAxios.request).toHaveBeenCalledTimes(2);
  });
});