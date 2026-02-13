import React, { useMemo, useState } from 'react';
import { Pressable, Text, TextInput, TextInputProps, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { cn } from '@/lib/utils';
import { colors } from '@/constants/colors';

export type InputProps = TextInputProps & {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
};

export function Input({
  label,
  error,
  leftIcon,
  rightIcon,
  secureTextEntry,
  className,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isSecure, setIsSecure] = useState(!!secureTextEntry);

  const showToggle = useMemo(() => !!secureTextEntry, [secureTextEntry]);

  const borderClass = useMemo(() => {
    if (error) return 'border-destructive';
    if (isFocused) return 'border-primary';
    return 'border-border';
  }, [error, isFocused]);

  return (
    <View className={cn('w-full', className)}>
      {label ? <Text className="mb-2 text-sm font-medium text-foreground">{label}</Text> : null}

      <View className={cn('flex-row items-center rounded-xl border bg-background px-3', borderClass)}>
        {leftIcon ? <View className="mr-2">{leftIcon}</View> : null}

        <TextInput
          {...props}
          secureTextEntry={isSecure}
          placeholderTextColor={colors.muted}
          className={cn(
            // Explicit height for web compatibility
            'h-12 flex-1 text-base text-foreground',
            props.editable === false ? 'opacity-60' : ''
          )}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
        />

        {showToggle ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => setIsSecure((v) => !v)}
            hitSlop={10}
            className="ml-2"
          >
            <Ionicons
              name={isSecure ? 'eye' : 'eye-off'}
              size={18}
              color={error ? colors.destructive : colors.muted}
            />
          </Pressable>
        ) : rightIcon ? (
          <View className="ml-2">{rightIcon}</View>
        ) : null}
      </View>

      {error ? <Text className="mt-2 text-xs text-destructive">{error}</Text> : null}
    </View>
  );
}
