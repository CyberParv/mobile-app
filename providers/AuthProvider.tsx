import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AxiosError } from "axios";
import api from "@/lib/api";
import { getSecureItem, removeSecureItem, setSecureItem } from "@/lib/secureStorage";

export type User = {
  id: string;
  name?: string;
  email: string;
  avatarUrl?: string | null;
};

type AuthResponse = {
  data: {
    user: User;
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
  };
};

type AuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  signup: (email: string, password: string, name: string) => Promise<User>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function getApiMessage(err: unknown, fallback = "Something went wrong") {
  const e = err as AxiosError<any>;
  const msg = e?.response?.data?.message;
  if (typeof msg === "string" && msg.trim()) return msg;
  return fallback;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  const storeTokens = useCallback(async (accessToken: string, refreshToken: string) => {
    await setSecureItem("accessToken", accessToken);
    await setSecureItem("refreshToken", refreshToken);
  }, []);

  const clearTokens = useCallback(async () => {
    await removeSecureItem("accessToken");
    await removeSecureItem("refreshToken");
  }, []);

  const refreshAndFetchMe = useCallback(async (): Promise<User | null> => {
    const refreshToken = await getSecureItem("refreshToken");
    if (!refreshToken) return null;

    try {
      const refreshRes = await api.post<any, { data: { tokens: { accessToken: string; refreshToken: string } } }>(
        "/auth/refresh",
        { refreshToken }
      );
      const tokens = refreshRes.data.tokens;
      await storeTokens(tokens.accessToken, tokens.refreshToken);

      const meRes = await api.get<any, { data: { user: User } }>("/auth/me");
      return meRes.data.user;
    } catch {
      await clearTokens();
      return null;
    }
  }, [clearTokens, storeTokens]);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const accessToken = await getSecureItem("accessToken");
        if (!accessToken) {
          setUser(null);
          return;
        }

        try {
          const meRes = await api.get<any, { data: { user: User } }>("/auth/me");
          setUser(meRes.data.user);
        } catch (err) {
          const e = err as AxiosError<any>;
          const status = e.response?.status;
          const code = e.response?.data?.code;

          if (status === 401 && code === "AUTH_TOKEN_EXPIRED") {
            const refreshedUser = await refreshAndFetchMe();
            setUser(refreshedUser);
          } else {
            await clearTokens();
            setUser(null);
          }
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, [clearTokens, refreshAndFetchMe]);

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const res = await api.post<any, AuthResponse>("/auth/login", { email, password });
        const { user: nextUser, tokens } = res.data;
        await storeTokens(tokens.accessToken, tokens.refreshToken);
        setUser(nextUser);
        return nextUser;
      } catch (err) {
        throw new Error(getApiMessage(err, "Invalid credentials"));
      }
    },
    [storeTokens]
  );

  const signup = useCallback(
    async (email: string, password: string, name: string) => {
      try {
        const res = await api.post<any, AuthResponse>("/auth/signup", { email, password, name });
        const { user: nextUser, tokens } = res.data;
        await storeTokens(tokens.accessToken, tokens.refreshToken);
        setUser(nextUser);
        return nextUser;
      } catch (err) {
        throw new Error(getApiMessage(err, "Unable to create account"));
      }
    },
    [storeTokens]
  );

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // ignore network errors; still clear local state
    } finally {
      await clearTokens();
      setUser(null);
    }
  }, [clearTokens]);

  const value = useMemo<AuthContextValue>(
    () => ({ user, isAuthenticated, isLoading, login, signup, logout }),
    [user, isAuthenticated, isLoading, login, signup, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
