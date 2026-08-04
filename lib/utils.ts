import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Formats a number using Arabic-Indic aware but locale-safe digits (kept Western for clarity on a queue board). */
export function formatQueueNumber(n: number): string {
  return String(n).padStart(3, "0");
}

export function formatArabicDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("ar-SA", { day: "numeric", month: "long", year: "numeric" }).format(d);
}

export function formatArabicTime(time: string): string {
  // time is "HH:mm:ss" or "HH:mm"
  const [h, m] = time.split(":").map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return new Intl.DateTimeFormat("ar-SA", { hour: "numeric", minute: "2-digit", hour12: true }).format(d);
}

export function formatWaitMinutes(mins: number): string {
  if (mins <= 0) return "دورك الآن";
  if (mins < 60) return `${mins} دقيقة`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h} ساعة و ${m} دقيقة` : `${h} ساعة`;
}

/** Estimated wait = (patients ahead) * avg consultation minutes, floored at 0. */
export function estimateWaitMinutes(patientsAhead: number, avgConsultMinutes: number): number {
  return Math.max(0, patientsAhead) * avgConsultMinutes;
}

export function priorityWeight(priority: string): number {
  const weights: Record<string, number> = {
    emergency: 0,
    disability: 1,
    pregnant: 1,
    elderly: 2,
    normal: 3,
  };
  return weights[priority] ?? 3;
}

/**
 * Creates a debounced function that delays invocation until after the specified wait time
 * Useful for search inputs, resizing handlers, etc.
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttles a function to execute at most once per specified wait time
 * Useful for scroll and resize handlers
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  let previous = 0;

  return function executedFunction(...args: Parameters<T>) {
    const now = Date.now();
    const remaining = wait - (now - previous);

    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      func(...args);
    } else if (!timeout) {
      timeout = setTimeout(() => {
        previous = Date.now();
        timeout = null;
        func(...args);
      }, remaining);
    }
  };
}
