import axios, { AxiosError, AxiosRequestConfig } from "axios";

import { getSecureItem, removeSecureItem, setSecureItem } from "@/lib/secureStorage";

const baseURL = process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:3000";

export const api = axios.create({ baseURL, timeout: 15000 });
export default api;

type RefreshResponse = {
  success: boolean;
  data: {
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
  };
};

function isAuthExcluded(url?: string) {
  if (!url) return false;
  return url.includes("/auth/login") || url.includes("/auth/signup");
}

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const refreshToken = await getSecureItem("refreshToken");
    if (!refreshToken) return null;

    try {
      // Use a bare axios instance to avoid interceptor loops.
      const res = await axios.post<RefreshResponse>(
        `${baseURL}/auth/refresh`,
        { refreshToken },
        { timeout: 15000 }
      );

      const tokens = res.data?.data?.tokens;
      if (!tokens?.accessToken || !tokens?.refreshToken) return null;

      await setSecureItem("accessToken", tokens.accessToken);
      await setSecureItem("refreshToken", tokens.refreshToken);

      return tokens.accessToken;
    } catch {
      await removeSecureItem("accessToken");
      await removeSecureItem("refreshToken");
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

api.interceptors.request.use(async (config) => {
  const url = config.url;
  if (!isAuthExcluded(url)) {
    const token = await getSecureItem("accessToken");
    if (token) {
      config.headers = {
        ...(config.headers ?? {}),
        Authorization: `Bearer ${token}`,
      };
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    // unwrap AxiosResponse -> { success, data }
    return response.data;
  },
  async (error: AxiosError<any>) => {
    const status = error.response?.status;
    const code = error.response?.data?.error?.code;

    const originalConfig = error.config as (AxiosRequestConfig & { _retry?: boolean }) | undefined;

    if (status === 401 && code === "AUTH_TOKEN_EXPIRED" && originalConfig && !originalConfig._retry) {
      originalConfig._retry = true;

      const newToken = await refreshAccessToken();
      if (!newToken) {
        return Promise.reject(error);
      }

      originalConfig.headers = {
        ...(originalConfig.headers ?? {}),
        Authorization: `Bearer ${newToken}`,
      };

      return api.request(originalConfig);
    }

    if (status === 401) {
      // Any other 401: clear tokens to force re-auth.
      await removeSecureItem("accessToken");
      await removeSecureItem("refreshToken");
    }

    return Promise.reject(error);
  }
);
