import React from 'react';
import { Text, View } from 'react-native';

import { Button } from './Button';
import { cn } from '@/lib/utils';

export type EmptyStateProps = {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
};

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className
}: EmptyStateProps) {
  return (
    <View className={cn('flex-1 items-center justify-center px-6 py-10', className)}>
      {icon ? <View className="mb-4">{icon}</View> : null}
      <Text className="text-lg font-semibold text-foreground text-center">{title}</Text>
      {description ? (
        <Text className="mt-2 text-sm text-muted text-center">{description}</Text>
      ) : null}
      {actionLabel && onAction ? (
        <Button className="mt-5" variant="primary" size="md" onPress={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </View>
  );
}
