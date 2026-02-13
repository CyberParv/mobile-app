import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Platform } from "react-native";
import { storage } from "@/lib/storage";

type ThemeMode = "light" | "dark" | "system";

type ThemeContextValue = {
  mode: ThemeMode;
  isDark: boolean;
  setMode: (mode: ThemeMode) => Promise<void>;
  toggle: () => Promise<void>;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "themeMode";

function getSystemIsDark(): boolean {
  // NativeWind uses class-based dark mode; on native it reads from Appearance.
  // We keep a simple heuristic: default to false on web unless user sets.
  if (Platform.OS === "web") return false;
  // Avoid importing Appearance to keep provider lightweight; system mode is treated as light by default.
  return false;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>("system");

  const isDark = useMemo(() => {
    if (mode === "dark") return true;
    if (mode === "light") return false;
    return getSystemIsDark();
  }, [mode]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const saved = await storage.get<ThemeMode>(STORAGE_KEY);
      if (!cancelled && saved) setModeState(saved);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    // NativeWind class-based dark mode: on web we can set document class.
    if (Platform.OS === "web") {
      try {
        const root = document.documentElement;
        if (isDark) root.classList.add("dark");
        else root.classList.remove("dark");
      } catch {
        // ignore
      }
    }
  }, [isDark]);

  const setMode = useCallback(async (next: ThemeMode) => {
    setModeState(next);
    await storage.set(STORAGE_KEY, next);
  }, []);

  const toggle = useCallback(async () => {
    await setMode(isDark ? "light" : "dark");
  }, [isDark, setMode]);

  const value = useMemo<ThemeContextValue>(() => ({ mode, isDark, setMode, toggle }), [mode, isDark, setMode, toggle]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
