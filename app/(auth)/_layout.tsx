import React, { useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import { useAuth } from "@/hooks/useAuth";

export default function AuthLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#0B1220" },
      }}
    />
  );
}
