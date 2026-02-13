import "../global.css";

import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import * as Linking from "expo-linking";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Platform, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AuthProvider } from "@/providers/AuthProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { ToastProvider } from "@/providers/ToastProvider";

SplashScreen.preventAutoHideAsync().catch(() => {
  // no-op: can throw if called twice
});

function RootContainer({ children }: { children: React.ReactNode }) {
  if (Platform.OS === "web") return <View style={{ flex: 1 }}>{children}</View>;
  return <GestureHandlerRootView style={{ flex: 1 }}>{children}</GestureHandlerRootView>;
}

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  const onReady = useCallback(async () => {
    try {
      await SplashScreen.hideAsync();
    } finally {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    // Keep splash visible briefly while providers mount and storage is read.
    const t = setTimeout(() => {
      onReady();
    }, 250);
    return () => clearTimeout(t);
  }, [onReady]);

  useEffect(() => {
    if (Platform.OS === "web") return;

    const handler = (event: { url: string }) => {
      // Expo Router handles linking; this is here for side-effects/analytics if needed.
      // Intentionally not calling Linking.getInitialURL() per requirement.
      const url = event?.url;
      if (!url) return;
      // Example: could log or parse
      Linking.parse(url);
    };

    const sub = Linking.addEventListener("url", handler);
    return () => sub.remove();
  }, []);

  const stackScreenOptions = useMemo(
    () => ({
      headerShown: false,
      animation: Platform.OS === "android" ? "fade" : "default",
    }),
    []
  );

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <ThemeProvider>
          <ToastProvider>
            <AuthProvider>
              <RootContainer>
                <Stack screenOptions={stackScreenOptions} />
                {/* Render nothing special while splash is visible; providers still mount */}
                {!isReady ? null : null}
              </RootContainer>
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
