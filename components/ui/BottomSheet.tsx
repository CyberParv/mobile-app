import React, { useEffect, useMemo, useRef } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  PanResponder,
  Platform,
  Pressable,
  View,
} from "react-native";
import { cn } from "@/lib/utils";

type BottomSheetProps = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  height?: number;
  className?: string;
};

export function BottomSheet({ visible, onClose, children, height, className }: BottomSheetProps) {
  const screenH = Dimensions.get("window").height;
  const sheetHeight = useMemo(() => Math.min(height ?? Math.round(screenH * 0.55), Math.round(screenH * 0.85)), [height, screenH]);

  const translateY = useRef(new Animated.Value(sheetHeight)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 220,
          useNativeDriver: Platform.OS !== "web",
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 220,
          useNativeDriver: Platform.OS !== "web",
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: sheetHeight,
          duration: 200,
          useNativeDriver: Platform.OS !== "web",
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: Platform.OS !== "web",
        }),
      ]).start();
    }
  }, [visible, sheetHeight, translateY, backdropOpacity]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dy) > 6,
        onPanResponderMove: (_, gesture) => {
          if (gesture.dy > 0) translateY.setValue(gesture.dy);
        },
        onPanResponderRelease: (_, gesture) => {
          const shouldClose = gesture.dy > 90 || gesture.vy > 1.2;
          if (shouldClose) {
            onClose();
          } else {
            Animated.spring(translateY, {
              toValue: 0,
              useNativeDriver: Platform.OS !== "web",
              speed: 28,
              bounciness: 0,
            }).start();
          }
        },
      }),
    [onClose, translateY]
  );

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View className="flex-1 justify-end">
        <Animated.View
          style={{ opacity: backdropOpacity }}
          className="absolute inset-0 bg-black/60"
        >
          <Pressable className="flex-1" onPress={onClose} />
        </Animated.View>

        <Animated.View
          style={{ transform: [{ translateY }], height: sheetHeight }}
          className={cn(
            "rounded-t-3xl border border-white/10 bg-[#0F1A2E] p-4",
            className
          )}
          {...panResponder.panHandlers}
        >
          <View className="items-center pb-3">
            <View className="h-1.5 w-12 rounded-full bg-white/20" />
          </View>
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
}
