import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string | number, locale = 'en-US') {
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'short', day: '2-digit' }).format(d);
}

export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
) {
  if (!Number.isFinite(amount)) return '';
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
}

export function truncateText(text: string, maxLength: number) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, Math.max(0, maxLength - 1)).trimEnd() + '…';
}

export function debounce<T extends (...args: any[]) => void>(fn: T, waitMs: number) {
  let t: any;
  return (...args: Parameters<T>) => {
    if (t) clearTimeout(t);
    t = setTimeout(() => fn(...args), waitMs);
  };
}
