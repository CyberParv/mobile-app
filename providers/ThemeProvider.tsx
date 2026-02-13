import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Platform } from "react-native";
import { storage } from "@/lib/storage";

export type ThemeMode = "light" | "dark" | "system";

type ThemeContextValue = {
  mode: ThemeMode;
  isDark: boolean;
  setMode: (mode: ThemeMode) => void;
  toggle: () => void;
  className: string;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getSystemIsDark() {
  if (Platform.OS === "web") {
    try {
      return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    } catch {
      return false;
    }
  }
  // On native, NativeWind will follow system if you don't set dark class.
  // We still keep a best-effort boolean.
  return false;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>("system");
  const [systemIsDark, setSystemIsDark] = useState<boolean>(getSystemIsDark());

  useEffect(() => {
    let unsub: (() => void) | undefined;

    if (Platform.OS === "web") {
      try {
        const mql = window.matchMedia("(prefers-color-scheme: dark)");
        const handler = () => setSystemIsDark(mql.matches);
        handler();
        mql.addEventListener("change", handler);
        unsub = () => mql.removeEventListener("change", handler);
      } catch {
        // ignore
      }
    }

    return () => {
      unsub?.();
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const saved = await storage.get<ThemeMode>("themeMode");
      if (!cancelled && saved) setModeState(saved);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    storage.set("themeMode", next).catch(() => undefined);
  }, []);

  const isDark = mode === "dark" ? true : mode === "light" ? false : systemIsDark;

  const toggle = useCallback(() => {
    setMode(isDark ? "light" : "dark");
  }, [isDark, setMode]);

  // NativeWind class-based dark mode: apply `dark` class at a top-level View.
  const className = isDark ? "dark" : "";

  const value = useMemo<ThemeContextValue>(
    () => ({ mode, isDark, setMode, toggle, className }),
    [mode, isDark, setMode, toggle, className]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
