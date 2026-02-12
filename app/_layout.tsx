import "../global.css";

import React, { useEffect, useMemo, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Slot, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import * as Linking from "expo-linking";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AuthProvider, useAuth } from "@/providers/AuthProvider";
import { ToastProvider } from "@/providers/ToastProvider";
import { ThemeProvider, useTheme } from "@/providers/ThemeProvider";

SplashScreen.preventAutoHideAsync().catch(() => {
  // ignore
});

function DeepLinkListener() {
  const router = useRouter();

  useEffect(() => {
    const sub = Linking.addEventListener("url", ({ url }) => {
      try {
        const parsed = Linking.parse(url);
        const path = parsed.path ? `/${parsed.path}` : "/";
        // Only handle in-app routes; ignore external.
        if (path.startsWith("/")) {
          router.push(path);
        }
      } catch {
        // ignore
      }
    });

    return () => sub.remove();
  }, [router]);

  return null;
}

function SplashGate({ children }: { children: React.ReactNode }) {
  const { isLoading } = useAuth();
  const { isReady: themeReady } = useTheme();
  const [hidden, setHidden] = useState(false);

  const ready = useMemo(() => !isLoading && themeReady, [isLoading, themeReady]);

  useEffect(() => {
    if (ready && !hidden) {
      SplashScreen.hideAsync().catch(() => {
        // ignore
      });
      setHidden(true);
    }
  }, [ready, hidden]);

  if (!ready) return null;
  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <ThemeProvider>
            <ToastProvider>
              <AuthProvider>
                <DeepLinkListener />
                <SplashGate>
                  <Slot />
                </SplashGate>
              </AuthProvider>
            </ToastProvider>
          </ThemeProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
