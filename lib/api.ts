import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";

import { getSecureItem, removeSecureItem, setSecureItem } from "@/lib/secureStorage";

const baseURL = process.env.EXPO_PUBLIC_API_BASE_URL ?? "https://api.example.com";

type RefreshResponse = {
  success: boolean;
  data: {
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
  };
};

export const api = axios.create({ baseURL, timeout: 15000 });
export default api;

function isAuthRoute(url?: string) {
  if (!url) return false;
  return url.includes("/auth/login") || url.includes("/auth/signup");
}

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(client: AxiosInstance): Promise<string | null> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const refreshToken = await getSecureItem("refreshToken");
    if (!refreshToken) return null;

    try {
      // Use a bare request to avoid infinite interceptor loops.
      const res = await axios.post<any, any, any>(
        `${baseURL}/auth/refresh`,
        { refreshToken },
        { timeout: 15000 }
      );
      // If server also uses the same unwrap shape, res.data is already the payload.
      const payload: RefreshResponse = res.data;
      const tokens = payload?.data?.tokens;
      if (!tokens?.accessToken || !tokens?.refreshToken) return null;

      await Promise.all([
        setSecureItem("accessToken", tokens.accessToken),
        setSecureItem("refreshToken", tokens.refreshToken)
      ]);

      return tokens.accessToken;
    } catch {
      await Promise.all([removeSecureItem("accessToken"), removeSecureItem("refreshToken")]);
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

api.interceptors.request.use(async (config) => {
  if (isAuthRoute(config.url)) return config;

  const token = await getSecureItem("accessToken");
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    // Unwrap AxiosResponse -> payload
    return response.data;
  },
  async (error: AxiosError<any>) => {
    const status = error.response?.status;
    const code = error.response?.data?.error?.code;

    const originalConfig = error.config as (AxiosRequestConfig & { _retry?: boolean }) | undefined;

    if (
      status === 401 &&
      code === "AUTH_TOKEN_EXPIRED" &&
      originalConfig &&
      !originalConfig._retry &&
      !isAuthRoute(originalConfig.url)
    ) {
      originalConfig._retry = true;

      const newToken = await refreshAccessToken(api);
      if (!newToken) {
        await Promise.all([removeSecureItem("accessToken"), removeSecureItem("refreshToken")]);
        return Promise.reject(error);
      }

      originalConfig.headers = originalConfig.headers ?? {};
      (originalConfig.headers as any).Authorization = `Bearer ${newToken}`;

      return api.request(originalConfig);
    }

    if (status === 401) {
      // Any other 401: clear tokens to avoid stuck sessions.
      await Promise.all([removeSecureItem("accessToken"), removeSecureItem("refreshToken")]);
    }

    return Promise.reject(error);
  }
);
