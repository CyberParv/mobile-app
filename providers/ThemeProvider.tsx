import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Appearance, Platform } from 'react-native';

import { storage } from '@/lib/storage';

type ThemeMode = 'light' | 'dark' | 'system';

type ThemeContextType = {
  mode: ThemeMode;
  resolvedTheme: 'light' | 'dark';
  setMode: (mode: ThemeMode) => Promise<void>;
  toggle: () => Promise<void>;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

const STORAGE_KEY = 'themeMode';

function resolveTheme(mode: ThemeMode): 'light' | 'dark' {
  if (mode === 'system') {
    return Appearance.getColorScheme() === 'dark' ? 'dark' : 'light';
  }
  return mode;
}

function applyNativeWindClass(theme: 'light' | 'dark') {
  // NativeWind v4 uses class-based dark mode.
  // On web, we can set documentElement class.
  if (Platform.OS === 'web') {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(resolveTheme('system'));

  const setMode = useCallback(async (next: ThemeMode) => {
    setModeState(next);
    await storage.set(STORAGE_KEY, next);
    const resolved = resolveTheme(next);
    setResolvedTheme(resolved);
    applyNativeWindClass(resolved);
  }, []);

  const toggle = useCallback(async () => {
    const next: ThemeMode = resolvedTheme === 'dark' ? 'light' : 'dark';
    await setMode(next);
  }, [resolvedTheme, setMode]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const saved = await storage.get<ThemeMode>(STORAGE_KEY);
      const initial = saved ?? 'system';
      if (!mounted) return;
      setModeState(initial);
      const resolved = resolveTheme(initial);
      setResolvedTheme(resolved);
      applyNativeWindClass(resolved);
    })();

    const sub = Appearance.addChangeListener(() => {
      setResolvedTheme((prev) => {
        const nextResolved = resolveTheme(mode);
        if (nextResolved !== prev) {
          applyNativeWindClass(nextResolved);
        }
        return nextResolved;
      });
    });

    return () => {
      mounted = false;
      sub.remove();
    };
  }, [mode]);

  const value = useMemo<ThemeContextType>(
    () => ({ mode, resolvedTheme, setMode, toggle }),
    [mode, resolvedTheme, setMode, toggle]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
}
