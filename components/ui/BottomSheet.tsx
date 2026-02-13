import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  PanResponder,
  Pressable,
  View,
} from "react-native";

import { cn } from "@/lib/utils";

export type BottomSheetProps = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  height?: number;
  className?: string;
};

export function BottomSheet({
  visible,
  onClose,
  children,
  height,
  className,
}: BottomSheetProps) {
  const screenH = Dimensions.get("window").height;
  const sheetHeight = useMemo(() => {
    const h = height ?? Math.min(520, Math.round(screenH * 0.65));
    return Math.max(240, Math.min(h, screenH - 80));
  }, [height, screenH]);

  const translateY = useRef(new Animated.Value(sheetHeight)).current;
  const dragY = useRef(new Animated.Value(0)).current;
  const [mounted, setMounted] = useState(visible);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      Animated.timing(translateY, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }).start();
    } else if (mounted) {
      Animated.timing(translateY, {
        toValue: sheetHeight,
        duration: 200,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) setMounted(false);
      });
    }
  }, [mounted, sheetHeight, translateY, visible]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dy) > 4,
        onPanResponderMove: Animated.event([null, { dy: dragY }], {
          useNativeDriver: false,
        }),
        onPanResponderRelease: (_, gesture) => {
          const shouldClose = gesture.dy > 80 || gesture.vy > 1.2;
          dragY.setValue(0);
          if (shouldClose) onClose();
        },
      }),
    [dragY, onClose]
  );

  if (!mounted) return null;

  const combinedTranslate = Animated.add(translateY, dragY).interpolate({
    inputRange: [0, sheetHeight],
    outputRange: [0, sheetHeight],
    extrapolate: "clamp",
  });

  return (
    <Modal
      visible={mounted}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end">
        <Pressable
          className="absolute inset-0 bg-black/40"
          onPress={onClose}
        />

        <Animated.View
          style={{
            transform: [{ translateY: combinedTranslate }],
            height: sheetHeight,
          }}
          className={cn(
            "bg-white dark:bg-slate-950 rounded-t-3xl border border-slate-200/70 dark:border-slate-800 overflow-hidden",
            className
          )}
        >
          <View
            {...panResponder.panHandlers}
            className="py-3 items-center border-b border-slate-200/70 dark:border-slate-800"
          >
            <View className="h-1.5 w-12 rounded-full bg-slate-300 dark:bg-slate-700" />
          </View>

          <View className="flex-1 p-4">{children}</View>
        </Animated.View>
      </View>
    </Modal>
  );
}
