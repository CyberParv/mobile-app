import "../global.css";

import React, { useEffect, useMemo, useState } from "react";
import { Platform, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";
import * as Linking from "expo-linking";
import { Slot, useRouter } from "expo-router";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AuthProvider } from "@/providers/AuthProvider";
import { ToastProvider } from "@/providers/ToastProvider";
import { ThemeProvider, useTheme } from "@/providers/ThemeProvider";

SplashScreen.preventAutoHideAsync().catch(() => undefined);

function RootContainer({ children }: { children: React.ReactNode }) {
  const { className } = useTheme();
  return <View className={className} style={{ flex: 1 }}>{children}</View>;
}

export default function RootLayout() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function prepare() {
      // Place for font loading if needed.
      // Keep splash until providers mount and first paint.
      await new Promise((r) => setTimeout(r, 50));
      if (mounted) setReady(true);
    }

    prepare();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    SplashScreen.hideAsync().catch(() => undefined);
  }, [ready]);

  useEffect(() => {
    if (Platform.OS === "web") return;

    const sub = Linking.addEventListener("url", (event) => {
      const url = event.url;
      // Example: exposcaffold://path
      const parsed = Linking.parse(url);
      const path = parsed.path ? `/${parsed.path}` : "/";
      // Only navigate if it looks like an internal route.
      if (path.startsWith("/")) {
        router.push(path as any);
      }
    });

    return () => {
      sub.remove();
    };
  }, [router]);

  const Wrapper = useMemo(() => (Platform.OS !== "web" ? GestureHandlerRootView : View), []);

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <ThemeProvider>
          <ToastProvider>
            <AuthProvider>
              <Wrapper style={{ flex: 1 }}>
                <RootContainer>
                  <Slot />
                </RootContainer>
              </Wrapper>
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
