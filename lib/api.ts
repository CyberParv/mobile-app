import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

import { getSecureItem, removeSecureItem, setSecureItem } from '@/lib/secureStorage';

const baseURL = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:3000';

export const api = axios.create({ baseURL, timeout: 15000 });
export default api;

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

function isAuthExcluded(url?: string) {
  if (!url) return false;
  return url.includes('/auth/login') || url.includes('/auth/signup') || url.includes('/auth/refresh');
}

api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  if (!isAuthExcluded(config.url)) {
    const token = await getSecureItem('accessToken');
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    // unwrap AxiosResponse -> return response.data
    return response.data;
  },
  async (error: AxiosError<any>) => {
    const status = error.response?.status;
    const code = error.response?.data?.error?.code;

    const originalRequest: any = error.config;

    if (status === 401 && code === 'AUTH_TOKEN_EXPIRED' && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = (async () => {
          try {
            const refreshToken = await getSecureItem('refreshToken');
            if (!refreshToken) return null;

            // Use a bare axios instance to avoid interceptor loops.
            const res = await axios.post(
              `${baseURL}/auth/refresh`,
              { refreshToken },
              { timeout: 15000 }
            );

            // Do not assume unwrap here; res is AxiosResponse
            const tokens = res.data?.data?.tokens;
            const accessToken = tokens?.accessToken;
            const nextRefreshToken = tokens?.refreshToken;
            if (!accessToken || !nextRefreshToken) return null;

            await Promise.all([
              setSecureItem('accessToken', accessToken),
              setSecureItem('refreshToken', nextRefreshToken)
            ]);

            return accessToken as string;
          } catch {
            return null;
          } finally {
            isRefreshing = false;
          }
        })();
      }

      const newAccessToken = await refreshPromise;
      if (newAccessToken) {
        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      }

      await Promise.all([removeSecureItem('accessToken'), removeSecureItem('refreshToken')]);
    }

    return Promise.reject(error);
  }
);
