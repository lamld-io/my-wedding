"use client";

import { useEffect, useState } from "react";

interface Petal {
  id: number;
  left: number;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
  rotation: number;
}

export default function FloatingPetals() {
  const [petals, setPetals] = useState<Petal[]>([]);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    // Check reduced motion preference
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setShouldRender(false);
      return;
    }

    const generated: Petal[] = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 8 + Math.random() * 14,
      delay: Math.random() * 10,
      duration: 10 + Math.random() * 15,
      opacity: 0.2 + Math.random() * 0.4,
      rotation: Math.random() * 360,
    }));
    setPetals(generated);
  }, []);

  if (!shouldRender || petals.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden" aria-hidden="true">
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="absolute"
          style={{
            left: `${petal.left}%`,
            top: "-20px",
            animation: `floatPetal ${petal.duration}s linear ${petal.delay}s infinite`,
            opacity: petal.opacity,
          }}
        >
          <svg
            width={petal.size}
            height={petal.size}
            viewBox="0 0 20 20"
            fill="none"
            style={{ transform: `rotate(${petal.rotation}deg)` }}
          >
            <path
              d="M10 0 C10 0, 15 5, 15 10 C15 15, 10 20, 10 20 C10 20, 5 15, 5 10 C5 5, 10 0, 10 0Z"
              fill="#F9A8D4"
            />
          </svg>
        </div>
      ))}
    </div>
  );
}
