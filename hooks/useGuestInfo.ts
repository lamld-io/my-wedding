"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import type { Guest } from "@/lib/types";

export function useGuestInfo() {
  const searchParams = useSearchParams();
  const inviteId = searchParams.get("invite");

  const [guest, setGuest] = useState<Guest | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!inviteId) {
      setGuest(null);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    fetch(`/api/guests?id=${encodeURIComponent(inviteId)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Không tìm thấy thiệp mời");
        return res.json();
      })
      .then((data) => {
        if (!cancelled) {
          setGuest(data.guest || null);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message);
          setGuest(null);
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [inviteId]);

  return { guest, isLoading, error, hasInvite: !!inviteId };
}
