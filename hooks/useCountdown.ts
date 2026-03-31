"use client";
import { useState, useEffect } from "react";
import { formatCountdown } from "@/lib/utils";

export function useCountdown(targetDate: string) {
  const [countdown, setCountdown] = useState(formatCountdown(targetDate));

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(formatCountdown(targetDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return countdown;
}
