import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import api from "@/lib/api";
import { getSecureItem, removeSecureItem, setSecureItem } from "@/lib/secureStorage";

export type User = {
  id: string;
  email: string;
  name?: string;
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

async function clearTokens() {
  await Promise.all([removeSecureItem("accessToken"), removeSecureItem("refreshToken")]);
}

async function storeTokens(tokens: Tokens) {
  await Promise.all([
    setSecureItem("accessToken", tokens.accessToken),
    setSecureItem("refreshToken", tokens.refreshToken)
  ]);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const mountedRef = useRef(true);

  const isAuthenticated = !!user;

  const login = useCallback(async (email: string, password: string) => {
    const res = await api.post("/auth/login", { email, password });
    // axios interceptor unwraps -> res is { success, data }
    const nextUser = res.data.user as User;
    const tokens = res.data.tokens as Tokens;
    await storeTokens(tokens);
    if (mountedRef.current) setUser(nextUser);
  }, []);

  const signup = useCallback(async (email: string, password: string, name: string) => {
    const res = await api.post("/auth/signup", { email, password, name });
    const nextUser = res.data.user as User;
    const tokens = res.data.tokens as Tokens;
    await storeTokens(tokens);
    if (mountedRef.current) setUser(nextUser);
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // ignore network errors; still clear local state
    } finally {
      await clearTokens();
      if (mountedRef.current) setUser(null);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      setIsLoading(true);
      try {
        const accessToken = await getSecureItem("accessToken");
        if (!accessToken) {
          if (!cancelled && mountedRef.current) setUser(null);
          return;
        }

        try {
          const res = await api.get("/auth/me");
          // /auth/me returns { success: true, data: { id, email, name } }
          const me = res.data as User;
          if (!cancelled && mountedRef.current) setUser(me);
        } catch (err: any) {
          const code = err?.response?.data?.error?.code;
          if (err?.response?.status === 401 && code === "AUTH_TOKEN_EXPIRED") {
            // api interceptor will attempt refresh and retry for most requests,
            // but /auth/me may still fail depending on server behavior.
            // Try once more after interceptor logic.
            try {
              const res2 = await api.get("/auth/me");
              const me2 = res2.data as User;
              if (!cancelled && mountedRef.current) setUser(me2);
              return;
            } catch {
              await clearTokens();
              if (!cancelled && mountedRef.current) setUser(null);
              return;
            }
          }

          await clearTokens();
          if (!cancelled && mountedRef.current) setUser(null);
        }
      } finally {
        if (!cancelled && mountedRef.current) setIsLoading(false);
      }
    }

    bootstrap();

    return () => {
      cancelled = true;
    };
  }, []);

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
