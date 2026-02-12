import "../global.css";
import React, { useEffect, useMemo, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Slot, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import * as Linking from "expo-linking";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { View } from "react-native";
import ErrorBoundary from "@/components/ErrorBoundary";
import { AuthProvider, useAuth } from "@/providers/AuthProvider";
import { ToastProvider } from "@/providers/ToastProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";

SplashScreen.preventAutoHideAsync().catch(() => undefined);

function AppBootstrap() {
  const { isLoading } = useAuth();
  const router = useRouter();
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setAppReady(true);
      SplashScreen.hideAsync().catch(() => undefined);
    }
  }, [isLoading]);

  useEffect(() => {
    const handleUrl = (url: string | null) => {
      if (!url) return;
      const parsed = Linking.parse(url);
      if (parsed.path) {
        router.push(`/${parsed.path}`);
      }
    };

    Linking.getInitialURL().then(handleUrl).catch(() => undefined);
    const subscription = Linking.addEventListener("url", (event) => handleUrl(event.url));

    return () => subscription.remove();
  }, [router]);

  const content = useMemo(
    () => (
      <View className="flex-1 bg-background">
        <Slot />
        <StatusBar style="light" />
      </View>
    ),
    []
  );

  if (!appReady) {
    return <View className="flex-1 bg-background" />;
  }

  return content;
}

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <AuthProvider>
            <ThemeProvider>
              <ToastProvider>
                <AppBootstrap />
              </ToastProvider>
            </ThemeProvider>
          </AuthProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
