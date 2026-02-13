import { Platform } from "react-native";

export function cn(...classes: Array<string | undefined | null | false>): string {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(date: Date | string | number, locale?: string): string {
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat(locale ?? undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(d);
}

export function formatCurrency(
  amount: number,
  currency: string = "USD",
  locale?: string
): string {
  if (!Number.isFinite(amount)) return "";
  return new Intl.NumberFormat(locale ?? undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function truncateText(text: string, maxLength: number): string {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, Math.max(0, maxLength - 1)).trimEnd() + "…";
}

export function debounce<T extends (...args: any[]) => void>(fn: T, waitMs: number) {
  let t: ReturnType<typeof setTimeout> | null = null;
  const debounced = (...args: Parameters<T>) => {
    if (t) clearTimeout(t);
    t = setTimeout(() => fn(...args), waitMs);
  };
  debounced.cancel = () => {
    if (t) clearTimeout(t);
    t = null;
  };
  return debounced as T & { cancel: () => void };
}

export const isWeb = Platform.OS === "web";
