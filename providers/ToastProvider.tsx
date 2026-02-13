import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { Animated, Platform, Pressable, Text, View } from "react-native";

import { cn } from "@/lib/utils";

type ToastVariant = "success" | "error" | "warning" | "info";

type Toast = {
  id: string;
  variant: ToastVariant;
  title: string;
  message?: string;
};

type ToastContextValue = {
  show: (variant: ToastVariant, title: string, message?: string) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

function variantClasses(variant: ToastVariant) {
  switch (variant) {
    case "success":
      return "bg-emerald-600";
    case "error":
      return "bg-red-600";
    case "warning":
      return "bg-amber-600";
    default:
      return "bg-slate-900";
  }
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<Toast | null>(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-10)).current;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hide = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }

    Animated.parallel([
      Animated.timing(opacity, { toValue: 0, duration: 160, useNativeDriver: Platform.OS !== "web" }),
      Animated.timing(translateY, { toValue: -10, duration: 160, useNativeDriver: Platform.OS !== "web" }),
    ]).start(({ finished }) => {
      if (finished) setToast(null);
    });
  }, [opacity, translateY]);

  const show = useCallback(
    (variant: ToastVariant, title: string, message?: string) => {
      const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      setToast({ id, variant, title, message });

      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: Platform.OS !== "web" }),
        Animated.timing(translateY, { toValue: 0, duration: 180, useNativeDriver: Platform.OS !== "web" }),
      ]).start();

      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(hide, 3200);
    },
    [hide, opacity, translateY]
  );

  const value = useMemo<ToastContextValue>(
    () => ({
      show,
      success: (t, m) => show("success", t, m),
      error: (t, m) => show("error", t, m),
      warning: (t, m) => show("warning", t, m),
      info: (t, m) => show("info", t, m),
    }),
    [show]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast ? (
        <View pointerEvents="box-none" className="absolute left-0 right-0 top-0">
          <Animated.View
            style={{ opacity, transform: [{ translateY }] }}
            className={cn(
              "mx-4 mt-12 rounded-2xl px-4 py-3",
              variantClasses(toast.variant)
            )}
          >
            <Pressable onPress={hide} className="flex-row items-start">
              <View className="flex-1">
                <Text className="text-white font-semibold">{toast.title}</Text>
                {toast.message ? (
                  <Text className="text-white/90 mt-1">{toast.message}</Text>
                ) : null}
              </View>
              <Text className="text-white/90 ml-3">✕</Text>
            </Pressable>
          </Animated.View>
        </View>
      ) : null}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
