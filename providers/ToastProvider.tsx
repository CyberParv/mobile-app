import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { Animated, Platform, Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { cn } from "@/lib/utils";

type ToastVariant = "success" | "error" | "warning" | "info";

type Toast = {
  id: string;
  title: string;
  message?: string;
  variant: ToastVariant;
  createdAt: number;
};

type ToastContextValue = {
  show: (opts: { title: string; message?: string; variant?: ToastVariant; durationMs?: number }) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

function variantStyles(variant: ToastVariant) {
  switch (variant) {
    case "success":
      return { icon: "checkmark-circle", bg: "bg-emerald-600", border: "border-emerald-400/30" } as const;
    case "error":
      return { icon: "close-circle", bg: "bg-red-600", border: "border-red-400/30" } as const;
    case "warning":
      return { icon: "warning", bg: "bg-amber-600", border: "border-amber-400/30" } as const;
    case "info":
    default:
      return { icon: "information-circle", bg: "bg-sky-600", border: "border-sky-400/30" } as const;
  }
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-10)).current;

  const animateIn = useCallback(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 180,
        useNativeDriver: Platform.OS !== "web",
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 180,
        useNativeDriver: Platform.OS !== "web",
      }),
    ]).start();
  }, [opacity, translateY]);

  const animateOut = useCallback(
    (onDone?: () => void) => {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 180,
          useNativeDriver: Platform.OS !== "web",
        }),
        Animated.timing(translateY, {
          toValue: -10,
          duration: 180,
          useNativeDriver: Platform.OS !== "web",
        }),
      ]).start(({ finished }) => {
        if (finished) onDone?.();
      });
    },
    [opacity, translateY]
  );

  const dismiss = useCallback(
    (id: string) => {
      animateOut(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      });
    },
    [animateOut]
  );

  const show = useCallback(
    (opts: { title: string; message?: string; variant?: ToastVariant; durationMs?: number }) => {
      const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      const toast: Toast = {
        id,
        title: opts.title,
        message: opts.message,
        variant: opts.variant ?? "info",
        createdAt: Date.now(),
      };

      setToasts((prev) => {
        const next = [toast, ...prev].slice(0, 3);
        return next;
      });

      animateIn();

      const duration = opts.durationMs ?? 2800;
      setTimeout(() => dismiss(id), duration);
    },
    [animateIn, dismiss]
  );

  const value = useMemo<ToastContextValue>(
    () => ({
      show,
      success: (title, message) => show({ title, message, variant: "success" }),
      error: (title, message) => show({ title, message, variant: "error" }),
      warning: (title, message) => show({ title, message, variant: "warning" }),
      info: (title, message) => show({ title, message, variant: "info" }),
    }),
    [show]
  );

  const topToast = toasts[0];

  return (
    <ToastContext.Provider value={value}>
      {children}
      {topToast ? (
        <View pointerEvents="box-none" className="absolute left-0 right-0 top-0 z-50">
          <Animated.View
            style={{
              opacity,
              transform: [{ translateY }],
            }}
            className="mx-4 mt-4"
          >
            <Pressable
              onPress={() => dismiss(topToast.id)}
              className={cn(
                "flex-row items-start gap-3 rounded-2xl border p-4 shadow-lg",
                variantStyles(topToast.variant).bg,
                variantStyles(topToast.variant).border
              )}
            >
              <Ionicons name={variantStyles(topToast.variant).icon as any} size={22} color="white" />
              <View className="flex-1">
                <Text className="text-base font-semibold text-white">{topToast.title}</Text>
                {topToast.message ? (
                  <Text className="mt-0.5 text-sm text-white/90">{topToast.message}</Text>
                ) : null}
              </View>
              <Ionicons name="close" size={18} color="white" />
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
