import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { getSecureItem, removeSecureItem, setSecureItem } from "@/lib/secureStorage";

type ApiErrorShape = {
  message?: string;
  code?: string;
};

type RefreshResponse = {
  data: {
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
  };
};

const baseURL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";

export const api: AxiosInstance = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

function isAuthExcluded(url?: string) {
  if (!url) return false;
  return url.includes("/auth/login") || url.includes("/auth/signup") || url.includes("/auth/refresh");
}

api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  if (!isAuthExcluded(config.url)) {
    const token = await getSecureItem("accessToken");
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

let refreshPromise: Promise<{ accessToken: string; refreshToken: string } | null> | null = null;

async function refreshTokens(): Promise<{ accessToken: string; refreshToken: string } | null> {
  const refreshToken = await getSecureItem("refreshToken");
  if (!refreshToken) return null;

  try {
    const res = await api.post<any, RefreshResponse>("/auth/refresh", { refreshToken });
    const { accessToken, refreshToken: newRefreshToken } = res.data.tokens;
    await setSecureItem("accessToken", accessToken);
    await setSecureItem("refreshToken", newRefreshToken);
    return { accessToken, refreshToken: newRefreshToken };
  } catch {
    await removeSecureItem("accessToken");
    await removeSecureItem("refreshToken");
    return null;
  }
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<any>) => {
    const status = error.response?.status;
    const data: ApiErrorShape | undefined = error.response?.data;

    const originalRequest = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;

    if (!originalRequest) throw error;

    if (status === 401 && data?.code === "AUTH_TOKEN_EXPIRED" && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!refreshPromise) {
        refreshPromise = refreshTokens().finally(() => {
          refreshPromise = null;
        });
      }

      const tokens = await refreshPromise;
      if (!tokens?.accessToken) {
        throw error;
      }

      originalRequest.headers = originalRequest.headers ?? {};
      originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
      return api.request(originalRequest);
    }

    throw error;
  }
);

export default api;
