import React, { useEffect, useMemo, useRef, useState } from "react";
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
  title?: string;
  className?: string;
  maxHeightPercent?: number; // 0..1
};

export function BottomSheet({
  visible,
  onClose,
  children,
  className,
  maxHeightPercent = 0.85
}: BottomSheetProps) {
  const { height } = useWindowDimensions();
  const maxHeight = Math.max(240, Math.floor(height * maxHeightPercent));

  const translateY = useRef(new Animated.Value(maxHeight)).current;
  const [mounted, setMounted] = useState(visible);

  const open = () => {
    setMounted(true);
    Animated.timing(translateY, {
      toValue: 0,
      duration: 220,
      useNativeDriver: Platform.OS !== "web"
    }).start();
  };

  const close = (cb?: () => void) => {
    Animated.timing(translateY, {
      toValue: maxHeight,
      duration: 200,
      useNativeDriver: Platform.OS !== "web"
    }).start(({ finished }) => {
      if (finished) {
        setMounted(false);
        cb?.();
      }
    });
  };

  useEffect(() => {
    if (visible) open();
    else if (mounted) close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const panResponder = useMemo(() => {
    let startY = 0;
    return PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dy) > 6,
      onPanResponderGrant: () => {
        translateY.stopAnimation((value: number) => {
          startY = value;
        });
      },
      onPanResponderMove: (_, gesture) => {
        const next = Math.max(0, startY + gesture.dy);
        translateY.setValue(next);
      },
      onPanResponderRelease: (_, gesture) => {
        const shouldClose = gesture.vy > 1.2 || gesture.dy > maxHeight * 0.25;
        if (shouldClose) {
          close(onClose);
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: Platform.OS !== "web",
            speed: 24,
            bounciness: 0
          }).start();
        }
      }
    });
  }, [maxHeight, onClose, translateY]);

  if (!mounted) return null;

  return (
    <Modal visible transparent animationType="none" onRequestClose={() => close(onClose)}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={() => close(onClose)} />

        <Animated.View
          style={[
            styles.sheet,
            { maxHeight, transform: [{ translateY }] }
          ]}
          className={cn("bg-white dark:bg-slate-900", className)}
        >
          <View {...panResponder.panHandlers} className="items-center py-3">
            <View className="h-1.5 w-12 rounded-full bg-slate-300 dark:bg-slate-700" />
          </View>
          <View className="px-5 pb-6">{children}</View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.35)"
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden"
  }
});
