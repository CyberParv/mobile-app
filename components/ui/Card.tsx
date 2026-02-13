import React from "react";
import { Pressable, View } from "react-native";
import { cn } from "@/lib/utils";

export type CardProps = {
  children: React.ReactNode;
  onPress?: () => void;
  className?: string;
};

export function Card({ children, onPress, className }: CardProps) {
  const Container: any = onPress ? Pressable : View;

  return (
    <Container
      onPress={onPress}
      className={cn(
        "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900",
        className
      )}
      accessibilityRole={onPress ? "button" : undefined}
    >
      {children}
    </Container>
  );
}
