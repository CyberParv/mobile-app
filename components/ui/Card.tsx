import React from "react";
import { Platform, Pressable, PressableProps, View, ViewProps } from "react-native";

import { cn } from "@/lib/utils";

export type CardProps = {
  children: React.ReactNode;
  className?: string;
  onPress?: PressableProps["onPress"];
} & Omit<ViewProps, "children">;

export function Card({ children, className, onPress, ...props }: CardProps) {
  const Container: any = onPress ? Pressable : View;

  return (
    <Container
      onPress={onPress}
      className={cn(
        "rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900",
        className
      )}
      style={
        Platform.select({
          ios: {
            shadowColor: "#000",
            shadowOpacity: 0.08,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 6 }
          },
          android: {
            elevation: 2
          },
          default: {
            // web
            shadowColor: "#000",
            shadowOpacity: 0.06,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 6 }
          }
        })
      }
      {...props}
    >
      {children}
    </Container>
  );
}
