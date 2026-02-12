import React, { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import api, { setOnAuthFailure } from "@/lib/api";
import { getSecureItem, removeSecureItem, setSecureItem } from "@/lib/secureStorage";
import { get, set } from "@/lib/storage";

interface AuthState {
  user: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (payload: Record<string, any>) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

const ACCESS_TOKEN_KEY = "accessToken";
const ACCESS_EXP_KEY = "accessTokenExpiresAt";
const REFRESH_TOKEN_KEY = "refreshToken";
const DEVICE_ID_KEY = "deviceId";

async function getDeviceId() {
  const existing = await get<string>(DEVICE_ID_KEY);
  if (existing) return existing;
  const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  await set(DEVICE_ID_KEY, id);
  return id;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const hydrate = useCallback(async () => {
    try {
      const accessToken = await getSecureItem(ACCESS_TOKEN_KEY);
      const accessExp = await getSecureItem(ACCESS_EXP_KEY);
      const refreshToken = await getSecureItem(REFRESH_TOKEN_KEY);
      if (!refreshToken) {
        setUser(null);
        return;
      }

      const now = Date.now();
      const exp = accessExp ? Number(accessExp) : 0;

      if (!accessToken || exp < now) {
        await refreshSession();
      }

      const me = await api.get("/me");
      setUser(me.data.user ?? null);
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshSession = useCallback(async () => {
    const refreshToken = await getSecureItem(REFRESH_TOKEN_KEY);
    if (!refreshToken) throw new Error("No refresh token");
    const deviceId = await getDeviceId();
    const response = await api.post("/auth/refresh", { refreshToken, deviceId });
    const tokens = response.data.tokens;
    await setSecureItem(ACCESS_TOKEN_KEY, tokens.accessToken);
    await setSecureItem(ACCESS_EXP_KEY, String(Date.now() + tokens.accessTokenExpiresInSec * 1000));
    await setSecureItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const deviceId = await getDeviceId();
      const response = await api.post("/auth/login", { email, password, deviceId });
      const tokens = response.data.tokens;
      await setSecureItem(ACCESS_TOKEN_KEY, tokens.accessToken);
      await setSecureItem(ACCESS_EXP_KEY, String(Date.now() + tokens.accessTokenExpiresInSec * 1000));
      await setSecureItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
      setUser(response.data.user ?? null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signup = useCallback(async (payload: Record<string, any>) => {
    setIsLoading(true);
    try {
      const response = await api.post("/auth/register", payload);
      const tokens = response.data.tokens;
      await setSecureItem(ACCESS_TOKEN_KEY, tokens.accessToken);
      await setSecureItem(ACCESS_EXP_KEY, String(Date.now() + tokens.accessTokenExpiresInSec * 1000));
      await setSecureItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
      setUser(response.data.user ?? null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      const deviceId = await getDeviceId();
      await api.post("/auth/logout", { deviceId });
    } catch {
      // Ignore network errors on logout
    } finally {
      await removeSecureItem(ACCESS_TOKEN_KEY);
      await removeSecureItem(ACCESS_EXP_KEY);
      await removeSecureItem(REFRESH_TOKEN_KEY);
      setUser(null);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setOnAuthFailure(async () => {
      await logout();
    });
    hydrate();
  }, [hydrate, logout]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
      signup
    }),
    [user, isLoading, login, logout, signup]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
