import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { Button } from './Button';
import { colors } from '@/constants/colors';
import { cn } from '@/lib/utils';

export type ErrorViewProps = {
  message?: string;
  onRetry?: () => void;
  className?: string;
};

export function ErrorView({ message, onRetry, className }: ErrorViewProps) {
  return (
    <View className={cn('flex-1 items-center justify-center px-6 py-10', className)}>
      <Ionicons name="alert-circle" size={44} color={colors.destructive} />
      <Text className="mt-4 text-lg font-semibold text-foreground text-center">
        Something went wrong
      </Text>
      <Text className="mt-2 text-sm text-muted text-center">
        {message ?? 'Please try again. If the problem persists, contact support.'}
      </Text>
      {onRetry ? (
        <Button className="mt-5" variant="outline" size="md" onPress={onRetry}>
          Retry
        </Button>
      ) : null}
    </View>
  );
}
