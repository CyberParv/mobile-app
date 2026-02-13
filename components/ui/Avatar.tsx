import React, { useMemo } from 'react';
import { Image, ImageProps, Text, View } from 'react-native';

import { cn } from '@/lib/utils';

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

export type AvatarProps = {
  name: string;
  uri?: string;
  size?: AvatarSize;
  className?: string;
  imageProps?: Omit<ImageProps, 'source'>;
};

function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? '?';
  const second = parts.length > 1 ? parts[parts.length - 1]?.[0] : '';
  return (first + second).toUpperCase();
}

export function Avatar({ name, uri, size = 'md', className, imageProps }: AvatarProps) {
  const dims = useMemo(() => {
    switch (size) {
      case 'sm':
        return { px: 32, text: 'text-xs' };
      case 'lg':
        return { px: 56, text: 'text-lg' };
      case 'xl':
        return { px: 72, text: 'text-xl' };
      case 'md':
      default:
        return { px: 44, text: 'text-base' };
    }
  }, [size]);

  const initials = useMemo(() => initialsFromName(name), [name]);

  return (
    <View
      className={cn(
        'items-center justify-center rounded-full bg-border border border-border overflow-hidden',
        className
      )}
      style={{ width: dims.px, height: dims.px }}
    >
      {uri ? (
        <Image
          source={{ uri }}
          style={{ width: dims.px, height: dims.px }}
          resizeMode="cover"
          {...imageProps}
        />
      ) : (
        <Text className={cn('font-semibold text-foreground', dims.text)}>{initials}</Text>
      )}
    </View>
  );
}
