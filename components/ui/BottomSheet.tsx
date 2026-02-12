import React, { ReactNode, useEffect } from "react";
import { Dimensions, Modal, Pressable, View } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue, withSpring, runOnJS } from "react-native-reanimated";
import colors from "@/constants/colors";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  snapPoints?: number[];
  children: ReactNode;
}

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function BottomSheet({ isOpen, onClose, snapPoints = [0.6], children }: BottomSheetProps) {
  const translateY = useSharedValue(SCREEN_HEIGHT);
  const maxHeight = Math.max(...snapPoints) * SCREEN_HEIGHT;

  useEffect(() => {
    translateY.value = withSpring(isOpen ? SCREEN_HEIGHT - maxHeight : SCREEN_HEIGHT, { damping: 18 });
  }, [isOpen, maxHeight, translateY]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }]
  }));

  return (
    <Modal transparent visible={isOpen} animationType="fade" onRequestClose={onClose}>
      <Pressable onPress={onClose} style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }} />
      <PanGestureHandler
        onGestureEvent={(event) => {
          translateY.value = Math.max(SCREEN_HEIGHT - maxHeight, translateY.value + event.nativeEvent.translationY);
        }}
        onEnded={(event) => {
          const shouldClose = event.nativeEvent.translationY > 80;
          if (shouldClose) {
            translateY.value = withSpring(SCREEN_HEIGHT, { damping: 18 }, () => runOnJS(onClose)());
          } else {
            translateY.value = withSpring(SCREEN_HEIGHT - maxHeight, { damping: 18 });
          }
        }}
      >
        <Animated.View
          style={[
            {
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: maxHeight,
              backgroundColor: colors.surface,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: 16
            },
            style
          ]}
        >
          <View className="items-center mb-3">
            <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: colors.muted }} />
          </View>
          {children}
        </Animated.View>
      </PanGestureHandler>
    </Modal>
  );
}
