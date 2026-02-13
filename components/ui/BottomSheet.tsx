import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  PanResponder,
  Pressable,
  View,
  ViewProps
} from 'react-native';

import { cn } from '@/lib/utils';

export type BottomSheetProps = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  height?: number;
  className?: string;
} & Omit<ViewProps, 'children'>;

export function BottomSheet({
  visible,
  onClose,
  children,
  height,
  className,
  ...props
}: BottomSheetProps) {
  const screenH = Dimensions.get('window').height;
  const sheetHeight = useMemo(() => {
    const h = height ?? Math.min(520, Math.round(screenH * 0.6));
    return Math.max(240, Math.min(h, screenH - 80));
  }, [height, screenH]);

  const translateY = useRef(new Animated.Value(sheetHeight)).current;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      Animated.timing(translateY, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true
      }).start();
    } else if (mounted) {
      Animated.timing(translateY, {
        toValue: sheetHeight,
        duration: 180,
        useNativeDriver: true
      }).start(({ finished }) => {
        if (finished) setMounted(false);
      });
    }
  }, [visible, mounted, sheetHeight, translateY]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dy) > 6,
        onPanResponderMove: (_, gesture) => {
          if (gesture.dy > 0) translateY.setValue(gesture.dy);
        },
        onPanResponderRelease: (_, gesture) => {
          if (gesture.dy > 80 || gesture.vy > 1.2) {
            onClose();
          } else {
            Animated.spring(translateY, {
              toValue: 0,
              useNativeDriver: true,
              speed: 20,
              bounciness: 6
            }).start();
          }
        }
      }),
    [onClose, translateY]
  );

  if (!mounted) return null;

  return (
    <Modal visible={mounted} transparent animationType="none" onRequestClose={onClose}>
      <View className="flex-1 justify-end">
        <Pressable className="absolute inset-0 bg-black/50" onPress={onClose} />

        <Animated.View
          style={{ transform: [{ translateY }], height: sheetHeight }}
          className={cn('rounded-t-3xl bg-card border border-border px-5 pt-3', className)}
          {...panResponder.panHandlers}
          {...props}
        >
          <View className="items-center pb-3">
            <View className="h-1.5 w-12 rounded-full bg-border" />
          </View>

          <View className="flex-1">{children}</View>
        </Animated.View>
      </View>
    </Modal>
  );
}
