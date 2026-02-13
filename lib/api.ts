import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import Constants from "expo-constants";
import { getSecureItem, removeSecureItem, setSecureItem } from "@/lib/secureStorage";

const baseURL =
  (Constants.expoConfig?.extra as any)?.API_BASE_URL ||
  process.env.EXPO_PUBLIC_API_BASE_URL ||
  "http://localhost:3000";

type ApiSuccess<T> = { success: true; data: T };

type TokenPair = {
  accessToken: string;
  refreshToken: string;
};

let refreshPromise: Promise<TokenPair> | null = null;

async function clearTokens() {
  await Promise.all([removeSecureItem("accessToken"), removeSecureItem("refreshToken")]);
}

async function refreshTokens(instance: AxiosInstance): Promise<TokenPair> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const refreshToken = await getSecureItem("refreshToken");
    if (!refreshToken) throw new Error("Missing refresh token");

    // Use a bare request without interceptors to avoid recursion.
    const res = await axios.post<ApiSuccess<{ tokens: TokenPair }>>(
      `${baseURL}/auth/refresh`,
      { refreshToken },
      { timeout: 15000 }
    );

    const tokens = res.data.data.tokens;
    await Promise.all([
      setSecureItem("accessToken", tokens.accessToken),
      setSecureItem("refreshToken", tokens.refreshToken),
    ]);

    return tokens;
  })();

  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
}

export const api = axios.create({ baseURL, timeout: 15000 });
export default api;

api.interceptors.request.use(async (config) => {
  const url = config.url ?? "";
  const isAuthRoute = url.includes("/auth/login") || url.includes("/auth/signup") || url.includes("/auth/refresh");

  if (!isAuthRoute) {
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
    // unwrap AxiosResponse -> response.data
    return response.data;
  },
  async (error: AxiosError<any>) => {
    const status = error.response?.status;
    const code = error.response?.data?.error?.code;

    const originalConfig = error.config as (AxiosRequestConfig & { _retry?: boolean }) | undefined;

    if (status === 401 && code === "AUTH_TOKEN_EXPIRED" && originalConfig && !originalConfig._retry) {
      originalConfig._retry = true;
      try {
        const tokens = await refreshTokens(api);
        originalConfig.headers = {
          ...(originalConfig.headers ?? {}),
          Authorization: `Bearer ${tokens.accessToken}`,
        };
        return api.request(originalConfig);
      } catch (e) {
        await clearTokens();
        return Promise.reject(e);
      }
    }

    if (status === 401) {
      // Any other 401: clear tokens to force re-auth.
      await clearTokens();
    }

    return Promise.reject(error);
  }
);
