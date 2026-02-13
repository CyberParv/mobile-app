import React, { ReactNode, useMemo, useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  Platform,
  Pressable,
  PressableProps,
  Text,
  View
} from 'react-native';

import { cn } from '@/lib/utils';
import { colors } from '@/constants/colors';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonProps = Omit<PressableProps, 'children'> & {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  className?: string;
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className,
  ...props
}: ButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const isDisabled = disabled || loading;

  const sizeClasses = useMemo(() => {
    switch (size) {
      case 'sm':
        return 'h-10 px-3';
      case 'lg':
        return 'h-14 px-5';
      case 'md':
      default:
        return 'h-12 px-4';
    }
  }, [size]);

  const variantClasses = useMemo(() => {
    switch (variant) {
      case 'secondary':
        return 'bg-card border border-border';
      case 'outline':
        return 'bg-transparent border border-border';
      case 'ghost':
        return 'bg-transparent';
      case 'destructive':
        return 'bg-destructive';
      case 'primary':
      default:
        return 'bg-primary';
    }
  }, [variant]);

  const textClasses = useMemo(() => {
    const base = 'font-semibold';
    if (variant === 'outline' || variant === 'ghost' || variant === 'secondary') {
      return cn(base, 'text-foreground');
    }
    return cn(base, 'text-white');
  }, [variant]);

  function animateTo(toValue: number) {
    Animated.spring(scale, {
      toValue,
      useNativeDriver: Platform.OS !== 'web',
      speed: 20,
      bounciness: 6
    }).start();
  }

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      onPressIn={(e) => {
        animateTo(0.98);
        props.onPressIn?.(e);
      }}
      onPressOut={(e) => {
        animateTo(1);
        props.onPressOut?.(e);
      }}
      className={cn('rounded-xl overflow-hidden', className)}
      {...props}
    >
      <Animated.View
        style={{ transform: [{ scale }], opacity: isDisabled ? 0.7 : 1 }}
        className={cn(
          'w-full flex-row items-center justify-center rounded-xl',
          sizeClasses,
          variantClasses
        )}
      >
        {loading ? (
          <View className="flex-row items-center">
            <ActivityIndicator
              color={variant === 'primary' || variant === 'destructive' ? '#FFFFFF' : colors.primary}
            />
            <Text className={cn('ml-2', textClasses)}>{children}</Text>
          </View>
        ) : (
          <Text className={textClasses}>{children}</Text>
        )}
      </Animated.View>
    </Pressable>
  );
}
