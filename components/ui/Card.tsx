import React from 'react';
import { Pressable, PressableProps, View, ViewProps } from 'react-native';

import { cn } from '@/lib/utils';

export type CardProps = {
  children: React.ReactNode;
  className?: string;
  onPress?: PressableProps['onPress'];
} & Omit<ViewProps, 'children'>;

export function Card({ children, className, onPress, ...props }: CardProps) {
  const Container: any = onPress ? Pressable : View;

  return (
    <Container
      onPress={onPress}
      className={cn(
        'rounded-2xl bg-card border border-border',
        // Native shadow
        'shadow-black/20',
        className
      )}
      style={[
        {
          shadowOpacity: 0.18,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 6 },
          elevation: 3
        },
        props.style
      ]}
      {...props}
    >
      {children}
    </Container>
  );
}
