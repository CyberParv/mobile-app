import axios from 'axios';
import { getToken } from '@/lib/secureStorage';
import { mockApi } from '../utils/test-utils';
import api from '@/lib/api';

jest.mock('axios');

jest.mock('@/lib/secureStorage', () => ({
  getToken: jest.fn()
}));

describe('API Tests', () => {
  it('adds auth header when token exists', async () => {
    getToken.mockResolvedValue('valid-token');
    await api.get('/data');
    expect(axios.get).toHaveBeenCalledWith('/data', { headers: { Authorization: 'Bearer valid-token' } });
  });

  it('does not add auth header when no token', async () => {
    getToken.mockResolvedValue(null);
    await api.get('/data');
    expect(axios.get).toHaveBeenCalledWith('/data', { headers: {} });
  });

  it('handles network timeout', async () => {
    axios.get.mockRejectedValueOnce({ code: 'ECONNABORTED' });
    await expect(api.get('/timeout')).rejects.toThrow('Network timeout');
  });

  it('retries on network failure', async () => {
    axios.get.mockRejectedValueOnce(new Error('Network Error'));
    mockApi.mockResolvedValueOnce({ retry: true });
    await api.get('/data');
    expect(axios.get).toHaveBeenCalledTimes(2);
  });
});