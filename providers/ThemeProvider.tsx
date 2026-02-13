import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Platform } from "react-native";

import { storage } from "@/lib/storage";

type ThemeMode = "light" | "dark";

type ThemeContextType = {
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => Promise<void>;
  toggleTheme: () => Promise<void>;
  isHydrated: boolean;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

const STORAGE_KEY = "themeMode";

function applyWebThemeClass(mode: ThemeMode) {
  if (Platform.OS !== "web") return;
  const root = document.documentElement;
  if (mode === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>("light");
  const [isHydrated, setIsHydrated] = useState(false);

  const setTheme = useCallback(async (mode: ThemeMode) => {
    setThemeState(mode);
    applyWebThemeClass(mode);
    await storage.set(STORAGE_KEY, mode);
  }, []);

  const toggleTheme = useCallback(async () => {
    await setTheme(theme === "dark" ? "light" : "dark");
  }, [setTheme, theme]);

  useEffect(() => {
    (async () => {
      const saved = await storage.get<ThemeMode>(STORAGE_KEY);
      const next = saved === "dark" || saved === "light" ? saved : "light";
      setThemeState(next);
      applyWebThemeClass(next);
      setIsHydrated(true);
    })();
  }, []);

  const value = useMemo<ThemeContextType>(
    () => ({ theme, setTheme, toggleTheme, isHydrated }),
    [theme, setTheme, toggleTheme, isHydrated]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
