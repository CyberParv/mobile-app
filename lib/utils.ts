import { Platform } from "react-native";

export function cn(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(input: Date | string | number, locale?: string) {
  const d = input instanceof Date ? input : new Date(input);
  try {
    return new Intl.DateTimeFormat(locale ?? undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
    }).format(d);
  } catch {
    return d.toDateString();
  }
}

export function formatCurrency(amount: number, currency = "USD", locale?: string) {
  try {
    return new Intl.NumberFormat(locale ?? undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    const sign = amount < 0 ? "-" : "";
    const abs = Math.abs(amount);
    return `${sign}${currency} ${abs.toFixed(2)}`;
  }
}

export function truncateText(text: string, max = 120) {
  if (text.length <= max) return text;
  return text.slice(0, Math.max(0, max - 1)).trimEnd() + "…";
}

export function debounce<T extends (...args: any[]) => void>(fn: T, waitMs = 250) {
  let t: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (t) clearTimeout(t);
    t = setTimeout(() => fn(...args), waitMs);
  };
}

export function isWeb() {
  return Platform.OS === "web";
}
