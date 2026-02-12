import React, { ReactNode } from "react";
import { Pressable, PressableProps, View } from "react-native";
import { cn } from "@/lib/utils";

export type CardProps = {
  children: ReactNode;
  onPress?: PressableProps["onPress"];
  className?: string;
};

export function Card({ children, onPress, className }: CardProps) {
  const Container: any = onPress ? Pressable : View;

  return (
    <Container
      onPress={onPress}
      className={cn(
        "bg-bg-card border border-border rounded-2xl p-4",
        "shadow-card",
        onPress && "active:opacity-90",
        className
      )}
    >
      {children}
    </Container>
  );
}
