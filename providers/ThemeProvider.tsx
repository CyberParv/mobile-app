import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { View } from "react-native";

import { storage } from "@/lib/storage";

type ThemeMode = "light" | "dark";

type ThemeContextValue = {
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => Promise<void>;
  toggleTheme: () => Promise<void>;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "themeMode";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>("light");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const saved = await storage.get<ThemeMode>(STORAGE_KEY);
      if (!cancelled && (saved === "light" || saved === "dark")) {
        setThemeState(saved);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const setTheme = useCallback(async (mode: ThemeMode) => {
    setThemeState(mode);
    await storage.set(STORAGE_KEY, mode);
  }, []);

  const toggleTheme = useCallback(async () => {
    await setTheme(theme === "dark" ? "light" : "dark");
  }, [setTheme, theme]);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme]
  );

  // NativeWind class-based dark mode: apply "dark" class at the root.
  return (
    <ThemeContext.Provider value={value}>
      <View className={theme === "dark" ? "flex-1 dark" : "flex-1"}>{children}</View>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
