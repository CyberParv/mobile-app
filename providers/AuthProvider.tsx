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

async function refreshTokens(): Promise<Tokens> {
  const refreshToken = await getSecureItem("refreshToken");
  if (!refreshToken) throw new Error("Missing refresh token");

  // api unwraps response.data, so res is { success, data }
  const res: { success: true; data: { tokens: Tokens } } = await api.post("/auth/refresh", { refreshToken });
  const tokens = res.data.tokens;
  await Promise.all([
    setSecureItem("accessToken", tokens.accessToken),
    setSecureItem("refreshToken", tokens.refreshToken),
  ]);
  return tokens;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const mountedRef = useRef(true);

  const isAuthenticated = !!user;

  const login = useCallback(async (email: string, password: string) => {
    const res: { success: true; data: { user: User; tokens: Tokens } } = await api.post("/auth/login", {
      email,
      password,
    });

    const nextUser = res.data.user;
    const tokens = res.data.tokens;

    await Promise.all([
      setSecureItem("accessToken", tokens.accessToken),
      setSecureItem("refreshToken", tokens.refreshToken),
    ]);

    setUser(nextUser);
  }, []);

  const signup = useCallback(async (email: string, password: string, name: string) => {
    const res: { success: true; data: { user: User; tokens: Tokens } } = await api.post("/auth/signup", {
      email,
      password,
      name,
    });

    const nextUser = res.data.user;
    const tokens = res.data.tokens;

    await Promise.all([
      setSecureItem("accessToken", tokens.accessToken),
      setSecureItem("refreshToken", tokens.refreshToken),
    ]);

    setUser(nextUser);
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // ignore network errors; still clear local session
    } finally {
      await clearTokens();
      setUser(null);
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

    const bootstrap = async () => {
      setIsLoading(true);
      try {
        const accessToken = await getSecureItem("accessToken");
        if (!accessToken) {
          if (!cancelled && mountedRef.current) setUser(null);
          return;
        }

        try {
          // /auth/me returns { success: true, data: { id, email, name } }
          // axios unwrap => res = { success, data }
          const res: { success: true; data: User } = await api.get("/auth/me");
          if (!cancelled && mountedRef.current) setUser(res.data);
        } catch (err: any) {
          const status = err?.response?.status;
          const code = err?.response?.data?.error?.code;

          if (status === 401 && code === "AUTH_TOKEN_EXPIRED") {
            try {
              await refreshTokens();
              const res2: { success: true; data: User } = await api.get("/auth/me");
              if (!cancelled && mountedRef.current) setUser(res2.data);
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
