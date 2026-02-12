import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Platform } from "react-native";
import { storage } from "@/lib/storage";

export type Theme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  colorScheme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
  isReady: boolean;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const THEME_KEY = "theme";

function applyWebDarkClass(theme: Theme) {
  if (Platform.OS !== "web") return;
  const root = document.documentElement;
  if (theme === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    (async () => {
      const saved = await storage.get<Theme>(THEME_KEY);
      const next = saved === "light" || saved === "dark" ? saved : "dark";
      setThemeState(next);
      applyWebDarkClass(next);
      setIsReady(true);
    })();
  }, []);

  const setTheme = useCallback(async (t: Theme) => {
    setThemeState(t);
    applyWebDarkClass(t);
    await storage.set(THEME_KEY, t);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [setTheme, theme]);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, colorScheme: theme, toggleTheme, setTheme, isReady }),
    [theme, toggleTheme, setTheme, isReady]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
