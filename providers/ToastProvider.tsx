import React, { createContext, ReactNode, useCallback, useContext, useMemo, useState } from "react";
import { Animated, Text, View } from "react-native";
import colors from "@/constants/colors";

type ToastVariant = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  show: (message: string, variant?: ToastVariant, duration?: number) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const translateY = new Animated.Value(-20);

  const show = useCallback((message: string, variant: ToastVariant = "info", duration = 2800) => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setToasts((prev) => [...prev, { id, message, variant }]);

    Animated.timing(translateY, {
      toValue: 0,
      duration: 180,
      useNativeDriver: true
    }).start();

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, duration);
  }, [translateY]);

  const value = useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <View pointerEvents="none" className="absolute top-12 left-0 right-0 items-center">
        {toasts.map((toast) => (
          <Animated.View
            key={toast.id}
            style={{ transform: [{ translateY }], backgroundColor: toastColor(toast.variant), marginBottom: 8, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 }}
          >
            <Text className="text-white font-medium">{toast.message}</Text>
          </Animated.View>
        ))}
      </View>
    </ToastContext.Provider>
  );
}

function toastColor(variant: ToastVariant) {
  switch (variant) {
    case "success":
      return colors.success;
    case "error":
      return colors.error;
    case "warning":
      return colors.warning;
    default:
      return colors.primary;
  }
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
