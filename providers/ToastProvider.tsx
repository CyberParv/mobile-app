import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { Animated, Platform, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { cn } from '@/lib/utils';
import { colors } from '@/constants/colors';

type ToastVariant = 'success' | 'error' | 'warning' | 'info';

type Toast = {
  id: string;
  title: string;
  message?: string;
  variant: ToastVariant;
  durationMs: number;
};

type ToastContextType = {
  show: (opts: { title: string; message?: string; variant?: ToastVariant; durationMs?: number }) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

function variantMeta(variant: ToastVariant) {
  switch (variant) {
    case 'success':
      return { icon: 'checkmark-circle' as const, color: '#22C55E' };
    case 'warning':
      return { icon: 'warning' as const, color: '#F59E0B' };
    case 'info':
      return { icon: 'information-circle' as const, color: colors.primary };
    case 'error':
    default:
      return { icon: 'close-circle' as const, color: colors.destructive };
  }
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<Toast | null>(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-12)).current;
  const timerRef = useRef<any>(null);

  const hide = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    Animated.parallel([
      Animated.timing(opacity, { toValue: 0, duration: 160, useNativeDriver: Platform.OS !== 'web' }),
      Animated.timing(translateY, {
        toValue: -12,
        duration: 160,
        useNativeDriver: Platform.OS !== 'web'
      })
    ]).start(({ finished }) => {
      if (finished) setToast(null);
    });
  }, [opacity, translateY]);

  const show = useCallback(
    (opts: { title: string; message?: string; variant?: ToastVariant; durationMs?: number }) => {
      const next: Toast = {
        id: String(Date.now()),
        title: opts.title,
        message: opts.message,
        variant: opts.variant ?? 'info',
        durationMs: opts.durationMs ?? 2800
      };

      setToast(next);
      opacity.setValue(0);
      translateY.setValue(-12);

      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: Platform.OS !== 'web' }),
        Animated.timing(translateY, { toValue: 0, duration: 180, useNativeDriver: Platform.OS !== 'web' })
      ]).start();

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(hide, next.durationMs);
    },
    [hide, opacity, translateY]
  );

  const value = useMemo<ToastContextType>(
    () => ({
      show,
      success: (title, message) => show({ title, message, variant: 'success' }),
      error: (title, message) => show({ title, message, variant: 'error' }),
      warning: (title, message) => show({ title, message, variant: 'warning' }),
      info: (title, message) => show({ title, message, variant: 'info' })
    }),
    [show]
  );

  const meta = toast ? variantMeta(toast.variant) : null;

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast ? (
        <View pointerEvents="box-none" className="absolute left-0 right-0 top-0">
          <Animated.View
            style={{ opacity, transform: [{ translateY }] }}
            className={cn('mx-4 mt-14 rounded-2xl border border-border bg-card px-4 py-3')}
          >
            <Pressable onPress={hide} className="flex-row items-start">
              <Ionicons name={meta!.icon} size={20} color={meta!.color} />
              <View className="ml-3 flex-1">
                <Text className="text-sm font-semibold text-foreground">{toast.title}</Text>
                {toast.message ? (
                  <Text className="mt-1 text-xs text-muted">{toast.message}</Text>
                ) : null}
              </View>
              <Ionicons name="close" size={18} color={colors.muted} />
            </Pressable>
          </Animated.View>
        </View>
      ) : null}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}
