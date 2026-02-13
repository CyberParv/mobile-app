import "../global.css";

import React, { useEffect, useMemo, useState } from "react";
import { Platform, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as SplashScreen from "expo-splash-screen";
import * as Linking from "expo-linking";
import { Slot } from "expo-router";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AuthProvider } from "@/providers/AuthProvider";
import { ToastProvider } from "@/providers/ToastProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";

SplashScreen.preventAutoHideAsync().catch(() => {
  // ignore
});

function RootContainer({ children }: { children: React.ReactNode }) {
  if (Platform.OS !== "web") {
    return <GestureHandlerRootView style={{ flex: 1 }}>{children}</GestureHandlerRootView>;
  }
  return <View style={{ flex: 1 }}>{children}</View>;
}

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    const prepare = async () => {
      // Place for font loading or other boot tasks.
      // AuthProvider handles its own bootstrap; we just ensure a minimum splash duration.
      await new Promise((r) => setTimeout(r, 250));
      if (mounted) setIsReady(true);
    };

    prepare();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isReady) return;
    SplashScreen.hideAsync().catch(() => {
      // ignore
    });
  }, [isReady]);

  useEffect(() => {
    if (Platform.OS === "web") return;

    const sub = Linking.addEventListener("url", (event) => {
      // Central place to observe deep links for analytics/debug.
      // expo-router handles routing; we avoid getInitialURL per requirement.
      console.log("Deep link:", event.url);
    });

    return () => {
      sub.remove();
    };
  }, []);

  const content = useMemo(() => {
    return (
      <ErrorBoundary>
        <SafeAreaProvider>
          <ThemeProvider>
            <ToastProvider>
              <AuthProvider>
                <Slot />
              </AuthProvider>
            </ToastProvider>
          </ThemeProvider>
        </SafeAreaProvider>
      </ErrorBoundary>
    );
  }, []);

  return <RootContainer>{content}</RootContainer>;
}
