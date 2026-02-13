import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import api from "@/lib/api";
import { getSecureItem, removeSecureItem, setSecureItem } from "@/lib/secureStorage";

export type User = {
  id: string;
  email: string;
  name: string;
};

type Tokens = {
  accessToken: string;
  refreshToken: string;
};

type AuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function persistTokens(tokens: Tokens) {
  await setSecureItem("accessToken", tokens.accessToken);
  await setSecureItem("refreshToken", tokens.refreshToken);
}

async function clearTokens() {
  await removeSecureItem("accessToken");
  await removeSecureItem("refreshToken");
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  const login = useCallback(async (email: string, password: string) => {
    const res = await api.post("/auth/login", { email, password });
    // axios interceptor unwraps to { success, data }
    const nextUser = res.data.user as User;
    const tokens = res.data.tokens as Tokens;

    await persistTokens(tokens);
    setUser(nextUser);
  }, []);

  const signup = useCallback(async (email: string, password: string, name: string) => {
    const res = await api.post("/auth/signup", { email, password, name });
    const nextUser = res.data.user as User;
    const tokens = res.data.tokens as Tokens;

    await persistTokens(tokens);
    setUser(nextUser);
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      await clearTokens();
      setUser(null);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const bootstrap = async () => {
      setIsLoading(true);
      try {
        const accessToken = await getSecureItem("accessToken");
        if (!accessToken) {
          if (!cancelled) setUser(null);
          return;
        }

        try {
          const res = await api.get("/auth/me");
          // /auth/me returns { success: true, data: { id, email, name } }
          // axios unwrap => res = { success, data }
          if (!cancelled) setUser(res.data as User);
        } catch (e: any) {
          const code = e?.response?.data?.error?.code;
          if (e?.response?.status === 401 && code === "AUTH_TOKEN_EXPIRED") {
            // api.ts interceptor should refresh+retry; if we still got here, treat as logged out.
            await clearTokens();
            if (!cancelled) setUser(null);
          } else {
            // For any other error, keep user logged out but don't crash.
            if (!cancelled) setUser(null);
          }
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    bootstrap();

    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated,
      isLoading,
      login,
      signup,
      logout,
    }),
    [user, isAuthenticated, isLoading, login, signup, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
