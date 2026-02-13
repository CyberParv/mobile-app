import React, { useEffect, useMemo, useRef } from "react";
import {
  Animated,
  Modal,
  PanResponder,
  Platform,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View
} from "react-native";
import { cn } from "@/lib/utils";

export type BottomSheetProps = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: React.ReactNode;
  className?: string;
  maxHeightRatio?: number;
};

export function BottomSheet({
  visible,
  onClose,
  children,
  title,
  className,
  maxHeightRatio = 0.75
}: BottomSheetProps) {
  const { height } = useWindowDimensions();
  const maxHeight = Math.max(240, Math.floor(height * maxHeightRatio));

  const translateY = useRef(new Animated.Value(maxHeight)).current;
  const backdrop = useRef(new Animated.Value(0)).current;

  const open = () => {
    Animated.parallel([
      Animated.timing(backdrop, { toValue: 1, duration: 180, useNativeDriver: Platform.OS !== "web" }),
      Animated.spring(translateY, { toValue: 0, useNativeDriver: Platform.OS !== "web", speed: 28, bounciness: 0 })
    ]).start();
  };

  const close = () => {
    Animated.parallel([
      Animated.timing(backdrop, { toValue: 0, duration: 160, useNativeDriver: Platform.OS !== "web" }),
      Animated.timing(translateY, { toValue: maxHeight, duration: 180, useNativeDriver: Platform.OS !== "web" })
    ]).start(({ finished }) => {
      if (finished) onClose();
    });
  };

  useEffect(() => {
    if (visible) open();
    else {
      translateY.setValue(maxHeight);
      backdrop.setValue(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, maxHeight]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 6,
        onPanResponderMove: (_, g) => {
          if (g.dy > 0) translateY.setValue(g.dy);
        },
        onPanResponderRelease: (_, g) => {
          if (g.dy > 80 || g.vy > 1.2) close();
          else {
            Animated.spring(translateY, {
              toValue: 0,
              useNativeDriver: Platform.OS !== "web",
              speed: 28,
              bounciness: 0
            }).start();
          }
        }
      }),
    [translateY]
  );

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={close}>
      <View style={StyleSheet.absoluteFill}>
        <Animated.View
          style={[StyleSheet.absoluteFill, { opacity: backdrop }]}
          className="bg-black/40"
        />
        <Pressable style={StyleSheet.absoluteFill} onPress={close} />

        <Animated.View
          style={{ transform: [{ translateY }], maxHeight }}
          className={cn(
            "absolute bottom-0 left-0 right-0 rounded-t-3xl border border-slate-200 bg-white px-4 pb-6 pt-3 dark:border-slate-800 dark:bg-slate-950",
            className
          )}
          {...panResponder.panHandlers}
        >
          <View className="items-center">
            <View className="h-1.5 w-12 rounded-full bg-slate-300 dark:bg-slate-700" />
          </View>
          {!!title && <View className="mt-3">{title}</View>}
          <View className="mt-4">{children}</View>
        </Animated.View>
      </View>
    </Modal>
  );
}
