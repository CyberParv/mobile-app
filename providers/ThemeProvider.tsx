import React, { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Appearance, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { cn } from "@/lib/utils";

type Theme = "light" | "dark" | "system";

type ThemeContextValue = {
  theme: Theme;
  colorScheme: "light" | "dark";
  toggleTheme: (next?: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);
const THEME_KEY = "themePreference";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("system");
  const [systemScheme, setSystemScheme] = useState<"light" | "dark">(Appearance.getColorScheme() ?? "light");

  useEffect(() => {
    AsyncStorage.getItem(THEME_KEY).then((stored) => {
      if (stored === "light" || stored === "dark" || stored === "system") {
        setTheme(stored);
      }
    });
    const listener = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemScheme(colorScheme ?? "light");
    });
    return () => listener.remove();
  }, []);

  const toggleTheme = useCallback((next?: Theme) => {
    const newTheme = next ?? (theme === "dark" ? "light" : "dark");
    setTheme(newTheme);
    AsyncStorage.setItem(THEME_KEY, newTheme).catch(() => undefined);
  }, [theme]);

  const colorScheme = theme === "system" ? systemScheme : theme;

  const value = useMemo(() => ({ theme, colorScheme, toggleTheme }), [theme, colorScheme, toggleTheme]);

  return (
    <ThemeContext.Provider value={value}>
      <View className={cn("flex-1", colorScheme === "dark" && "dark")}>{children}</View>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
