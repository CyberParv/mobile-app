import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { Animated, Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { cn } from "@/lib/utils";

export type ToastVariant = "success" | "error" | "warning" | "info";

type Toast = {
  id: string;
  variant: ToastVariant;
  title?: string;
  message: string;
  durationMs: number;
};

type ToastContextValue = {
  show: (message: string, opts?: { variant?: ToastVariant; title?: string; durationMs?: number }) => void;
  success: (message: string, opts?: { title?: string; durationMs?: number }) => void;
  error: (message: string, opts?: { title?: string; durationMs?: number }) => void;
  warning: (message: string, opts?: { title?: string; durationMs?: number }) => void;
  info: (message: string, opts?: { title?: string; durationMs?: number }) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

function variantStyles(variant: ToastVariant) {
  switch (variant) {
    case "success":
      return { bg: "bg-success", icon: "checkmark-circle" as const };
    case "error":
      return { bg: "bg-danger", icon: "alert-circle" as const };
    case "warning":
      return { bg: "bg-warning", icon: "warning" as const };
    case "info":
    default:
      return { bg: "bg-info", icon: "information-circle" as const };
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
      Animated.timing(opacity, { toValue: 0, duration: 160, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: -10, duration: 160, useNativeDriver: true }),
    ]).start(({ finished }) => {
      if (finished) setToast(null);
    });
  }, [opacity, translateY]);

  const show = useCallback(
    (message: string, opts?: { variant?: ToastVariant; title?: string; durationMs?: number }) => {
      const next: Toast = {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        variant: opts?.variant ?? "info",
        title: opts?.title,
        message,
        durationMs: opts?.durationMs ?? 2800,
      };

      setToast(next);
      opacity.setValue(0);
      translateY.setValue(-10);

      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: 180, useNativeDriver: true }),
      ]).start();

      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(hide, next.durationMs);
    },
    [hide, opacity, translateY]
  );

  const value = useMemo<ToastContextValue>(
    () => ({
      show,
      success: (message, opts) => show(message, { ...opts, variant: "success" }),
      error: (message, opts) => show(message, { ...opts, variant: "error" }),
      warning: (message, opts) => show(message, { ...opts, variant: "warning" }),
      info: (message, opts) => show(message, { ...opts, variant: "info" }),
    }),
    [show]
  );

  const v = toast ? variantStyles(toast.variant) : null;

  return (
    <ToastContext.Provider value={value}>
      {children}

      {toast && v ? (
        <View pointerEvents="box-none" className="absolute left-0 right-0 top-0">
          <Animated.View
            style={{ opacity, transform: [{ translateY }] }}
            className={cn(
              "mx-4 mt-14 rounded-2xl px-4 py-3 flex-row items-start gap-3",
              v.bg
            )}
          >
            <Ionicons name={v.icon} size={20} color="#0B1220" />
            <View className="flex-1">
              {toast.title ? (
                <Text className="text-bg font-semibold">{toast.title}</Text>
              ) : null}
              <Text className="text-bg">{toast.message}</Text>
            </View>
            <Pressable onPress={hide} hitSlop={10}>
              <Ionicons name="close" size={18} color="#0B1220" />
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
