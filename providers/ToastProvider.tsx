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
      return { bg: "bg-emerald-600", icon: "checkmark-circle" as const };
    case "error":
      return { bg: "bg-red-600", icon: "close-circle" as const };
    case "warning":
      return { bg: "bg-amber-600", icon: "warning" as const };
    default:
      return { bg: "bg-sky-600", icon: "information-circle" as const };
  }
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const anim = useRef(new Animated.Value(0)).current;

  const show = useCallback(
    ({ title, message, variant = "info", durationMs = 3000 }: { title: string; message?: string; variant?: ToastVariant; durationMs?: number }) => {
      const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      const toast: Toast = { id, title, message, variant, createdAt: Date.now() };

      setToasts((prev) => [toast, ...prev].slice(0, 3));

      Animated.timing(anim, {
        toValue: 1,
        duration: 180,
        useNativeDriver: Platform.OS !== "web"
      }).start();

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, durationMs);
    },
    [anim]
  );

  const api = useMemo<ToastContextValue>(
    () => ({
      show,
      success: (title, message) => show({ title, message, variant: "success" }),
      error: (title, message) => show({ title, message, variant: "error" }),
      warning: (title, message) => show({ title, message, variant: "warning" }),
      info: (title, message) => show({ title, message, variant: "info" })
    }),
    [show]
  );

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <View pointerEvents="box-none" className="absolute left-0 right-0 top-0 z-50">
        <Animated.View
          style={{
            opacity: anim,
            transform: [
              {
                translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [-12, 0] })
              }
            ]
          }}
          className="px-4 pt-12"
          pointerEvents="box-none"
        >
          {toasts.map((t) => {
            const vs = variantStyles(t.variant);
            return (
              <Pressable
                key={t.id}
                onPress={() => dismiss(t.id)}
                className={cn(
                  "mb-2 flex-row items-start rounded-2xl px-4 py-3 shadow",
                  vs.bg
                )}
              >
                <Ionicons name={vs.icon} size={20} color="white" style={{ marginTop: 2 }} />
                <View className="ml-3 flex-1">
                  <Text className="text-base font-semibold text-white">{t.title}</Text>
                  {!!t.message && <Text className="mt-0.5 text-sm text-white/90">{t.message}</Text>}
                </View>
                <Ionicons name="close" size={18} color="white" style={{ marginTop: 2, opacity: 0.9 }} />
              </Pressable>
            );
          })}
        </Animated.View>
      </View>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
