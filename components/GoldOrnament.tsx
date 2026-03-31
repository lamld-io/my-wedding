import { cn } from "@/lib/utils";

interface GoldOrnamentProps {
  variant?: "divider" | "corner-tl" | "corner-br" | "frame-top" | "frame-bottom" | "small-divider";
  className?: string;
}

export default function GoldOrnament({ variant = "divider", className }: GoldOrnamentProps) {
  if (variant === "divider") {
    return (
      <div className={cn("flex items-center justify-center gap-3 py-6", className)}>
        <div className="gold-line flex-1 max-w-24" />
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-gold">
          <path
            d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
            fill="currentColor"
            opacity="0.8"
          />
        </svg>
        <div className="gold-line flex-1 max-w-24" />
      </div>
    );
  }

  if (variant === "small-divider") {
    return (
      <div className={cn("flex items-center justify-center gap-2 py-3", className)}>
        <div className="gold-line flex-1 max-w-16" />
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-gold">
          <path
            d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
            fill="currentColor"
            opacity="0.6"
          />
        </svg>
        <div className="gold-line flex-1 max-w-16" />
      </div>
    );
  }

  if (variant === "frame-top") {
    return (
      <svg
        viewBox="0 0 400 60"
        fill="none"
        className={cn("w-48 md:w-72 text-gold opacity-60", className)}
      >
        <path
          d="M200 55 C200 55, 160 10, 100 15 C40 20, 10 45, 0 55"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
        />
        <path
          d="M200 55 C200 55, 240 10, 300 15 C360 20, 390 45, 400 55"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
        />
        <circle cx="200" cy="50" r="3" fill="currentColor" opacity="0.6" />
        <path
          d="M185 50 Q193 35, 200 40 Q207 35, 215 50"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
        />
      </svg>
    );
  }

  if (variant === "frame-bottom") {
    return (
      <svg
        viewBox="0 0 400 60"
        fill="none"
        className={cn("w-48 md:w-72 text-gold opacity-60 rotate-180", className)}
      >
        <path
          d="M200 55 C200 55, 160 10, 100 15 C40 20, 10 45, 0 55"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
        />
        <path
          d="M200 55 C200 55, 240 10, 300 15 C360 20, 390 45, 400 55"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
        />
        <circle cx="200" cy="50" r="3" fill="currentColor" opacity="0.6" />
      </svg>
    );
  }

  // Corner ornaments
  const isTopLeft = variant === "corner-tl";
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      className={cn(
        "w-16 md:w-24 text-gold opacity-40",
        isTopLeft ? "" : "rotate-180",
        className
      )}
    >
      <path
        d="M0 0 Q50 0, 50 50 Q50 0, 100 0"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
      />
      <path
        d="M0 0 Q0 50, 50 50 Q0 50, 0 100"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
      />
      <circle cx="25" cy="25" r="2" fill="currentColor" opacity="0.5" />
    </svg>
  );
}
