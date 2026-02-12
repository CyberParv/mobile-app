import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import Constants from "expo-constants";
import { getSecureItem, setSecureItem, removeSecureItem } from "@/lib/secureStorage";
import { get } from "@/lib/storage";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || Constants.expoConfig?.extra?.apiUrl || "";
const baseUrl = `${BASE_URL.replace(/\/$/, "")}/v1`;

let onAuthFailure: (() => void) | null = null;
let refreshPromise: Promise<void> | null = null;

export function setOnAuthFailure(fn: () => void) {
  onAuthFailure = fn;
}

async function getDeviceId() {
  return get<string>("deviceId");
}

export const api = axios.create({
  baseURL: baseUrl,
  timeout: 15000
});

api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = await getSecureItem("accessToken");
  const deviceId = await getDeviceId();
  config.headers.Authorization = token ? `Bearer ${token}` : undefined;
  config.headers["X-Device-Id"] = deviceId ?? "";
  config.headers["Accept"] = "application/json";
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest: any = error.config;

    if (!error.response) {
      if (!originalRequest.__retry) {
        originalRequest.__retry = true;
        return api(originalRequest);
      }
      return Promise.reject(error);
    }

    if (error.response.status === 401 && !originalRequest.__isRetryRequest) {
      if (!refreshPromise) {
        refreshPromise = refreshToken().finally(() => {
          refreshPromise = null;
        });
      }

      try {
        await refreshPromise;
        originalRequest.__isRetryRequest = true;
        return api(originalRequest);
      } catch (refreshError) {
        await removeSecureItem("accessToken");
        await removeSecureItem("accessTokenExpiresAt");
        await removeSecureItem("refreshToken");
        onAuthFailure?.();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

async function refreshToken() {
  const refreshToken = await getSecureItem("refreshToken");
  const deviceId = await getDeviceId();
  if (!refreshToken || !deviceId) throw new Error("Missing refresh token");

  const response = await axios.post(`${baseUrl}/auth/refresh`, { refreshToken, deviceId });
  const tokens = response.data.tokens;
  await setSecureItem("accessToken", tokens.accessToken);
  await setSecureItem("accessTokenExpiresAt", String(Date.now() + tokens.accessTokenExpiresInSec * 1000));
  await setSecureItem("refreshToken", tokens.refreshToken);
}

export default api;
