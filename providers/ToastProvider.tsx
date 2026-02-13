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

type ToastContextType = {
  show: (variant: ToastVariant, title: string, message?: string) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

function variantClasses(variant: ToastVariant) {
  switch (variant) {
    case "success":
      return "border-emerald-200 bg-emerald-50 dark:border-emerald-900/50 dark:bg-emerald-950/40";
    case "error":
      return "border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/40";
    case "warning":
      return "border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/40";
    case "info":
    default:
      return "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900";
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
      Animated.timing(opacity, {
        toValue: 0,
        duration: 180,
        useNativeDriver: Platform.OS !== "web"
      }),
      Animated.timing(translateY, {
        toValue: -10,
        duration: 180,
        useNativeDriver: Platform.OS !== "web"
      })
    ]).start(({ finished }) => {
      if (finished) setToast(null);
    });
  }, [opacity, translateY]);

  const show = useCallback(
    (variant: ToastVariant, title: string, message?: string) => {
      const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      setToast({ id, variant, title, message });

      opacity.setValue(0);
      translateY.setValue(-10);

      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: Platform.OS !== "web"
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 200,
          useNativeDriver: Platform.OS !== "web"
        })
      ]).start();

      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(hide, 3200);
    },
    [hide, opacity, translateY]
  );

  const value = useMemo<ToastContextType>(
    () => ({
      show,
      success: (t, m) => show("success", t, m),
      error: (t, m) => show("error", t, m),
      warning: (t, m) => show("warning", t, m),
      info: (t, m) => show("info", t, m)
    }),
    [show]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast ? (
        <View pointerEvents="box-none" className="absolute left-0 right-0 top-0 z-50 px-4 pt-14">
          <Animated.View
            style={{ opacity, transform: [{ translateY }] }}
            className={cn("rounded-2xl border p-4", variantClasses(toast.variant))}
          >
            <Pressable onPress={hide} accessibilityRole="button">
              <Text className="text-sm font-semibold text-slate-900 dark:text-slate-50">{toast.title}</Text>
              {toast.message ? (
                <Text className="mt-1 text-sm text-slate-700 dark:text-slate-200">{toast.message}</Text>
              ) : null}
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
