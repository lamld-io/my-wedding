export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatCountdown(targetDate: string) {
  const target = new Date(targetDate).getTime();
  const now = new Date().getTime();
  const diff = target - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
    isExpired: false,
  };
}

import type { GuestEvent } from "./types";
import { WEDDING } from "./constants";

/**
 * Lấy ngày hiển thị dạng ngắn "DD . MM . YYYY" từ guestEvent, fallback WEDDING.displayDate.
 */
export function getShortDate(guestEvent?: GuestEvent | null): string {
  if (guestEvent?.date) {
    return new Date(guestEvent.date)
      .toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })
      .replace(/\//g, " . ");
  }
  if (guestEvent?.displayDate) {
    const m = guestEvent.displayDate.match(/(\d{1,2})\s+tháng\s+(\d{1,2})\s+năm\s+(\d{4})/);
    if (m) return `${m[1].padStart(2, "0")} . ${m[2].padStart(2, "0")} . ${m[3]}`;
  }
  return WEDDING.displayDate;
}

/**
 * Lấy ngày hiển thị dạng đầy đủ "Thứ X, ngày DD tháng MM năm YYYY" từ guestEvent, fallback WEDDING.displayDateFull.
 */
export function getFullDate(guestEvent?: GuestEvent | null): string {
  return guestEvent?.displayDate || WEDDING.displayDateFull;
}

/**
 * Lấy ISO date string cho countdown, fallback WEDDING.date.
 */
export function getCountdownDate(guestEvent?: GuestEvent | null): string {
  if (guestEvent?.date) return guestEvent.date;
  if (guestEvent?.displayDate) {
    const m = guestEvent.displayDate.match(/(\d{1,2})\s+tháng\s+(\d{1,2})\s+năm\s+(\d{4})/);
    if (m) {
      return new Date(parseInt(m[3]), parseInt(m[2]) - 1, parseInt(m[1]), 12, 0, 0).toISOString();
    }
  }
  return WEDDING.date;
}
