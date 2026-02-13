import '../global.css';

import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as Linking from 'expo-linking';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Platform, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { AuthProvider } from '@/providers/AuthProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { ToastProvider } from '@/providers/ToastProvider';

SplashScreen.preventAutoHideAsync().catch(() => {
  // ignore if already prevented
});

function RootContainer({ children }: { children: React.ReactNode }) {
  if (Platform.OS !== 'web') {
    return <GestureHandlerRootView style={{ flex: 1 }}>{children}</GestureHandlerRootView>;
  }
  return <View style={{ flex: 1 }}>{children}</View>;
}

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  const onReady = useCallback(async () => {
    // In production apps, this is where you'd await font loading, remote config, etc.
    // AuthProvider handles its own bootstrap; we just ensure at least one tick.
    setIsReady(true);
    await SplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // Allow providers to mount before hiding splash.
        await new Promise((r) => setTimeout(r, 0));
      } finally {
        if (mounted) {
          onReady();
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, [onReady]);

  useEffect(() => {
    if (Platform.OS === 'web') return;

    const sub = Linking.addEventListener('url', (event) => {
      // Expo Router handles deep links automatically; this is here for side-effects/analytics.
      // Keep minimal and safe.
      void event.url;
    });

    return () => {
      sub.remove();
    };
  }, []);

  const stackScreenOptions = useMemo(
    () => ({
      headerShown: false,
      animation: 'fade' as const
    }),
    []
  );

  return (
    <ErrorBoundary>
      <RootContainer>
        <SafeAreaProvider>
          <ThemeProvider>
            <ToastProvider>
              <AuthProvider>
                {/* Keep rendering even while splash is visible; SplashScreen controls visibility */}
                <Stack screenOptions={stackScreenOptions} />
                {/* Ensure we don't block rendering on web */}
                {Platform.OS === 'web' && !isReady ? null : null}
              </AuthProvider>
            </ToastProvider>
          </ThemeProvider>
        </SafeAreaProvider>
      </RootContainer>
    </ErrorBoundary>
  );
}
