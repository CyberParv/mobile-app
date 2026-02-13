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

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

async function persistTokens(tokens: Tokens) {
  await Promise.all([
    setSecureItem("accessToken", tokens.accessToken),
    setSecureItem("refreshToken", tokens.refreshToken)
  ]);
}

async function clearTokens() {
  await Promise.all([removeSecureItem("accessToken"), removeSecureItem("refreshToken")]);
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

  const bootstrap = useCallback(async () => {
    setIsLoading(true);
    try {
      const accessToken = await getSecureItem("accessToken");
      if (!accessToken) {
        setUser(null);
        return;
      }

      try {
        const res = await api.get("/auth/me");
        // /auth/me returns { success: true, data: { id, email, name } }
        setUser(res.data as User);
      } catch (e: any) {
        const code = e?.response?.data?.error?.code;
        if (e?.response?.status === 401 && code === "AUTH_TOKEN_EXPIRED") {
          // api interceptor should refresh and retry; if we still got here, refresh failed.
          await clearTokens();
          setUser(null);
          return;
        }
        // Any other error: treat as signed out to avoid boot loops.
        await clearTokens();
        setUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  const value = useMemo<AuthContextType>(
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
