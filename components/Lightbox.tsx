"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Loader2, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

interface LightboxProps {
  images: { src: string; alt: string }[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

// Spring animation cho hiệu ứng tự nhiên, mượt mà
const springTransition = {
  type: "spring" as const,
  stiffness: 300,
  damping: 30,
  mass: 0.8,
};

// Variants cho backdrop
const backdropVariants = {
  hidden: { opacity: 0, backdropFilter: "blur(0px)" },
  visible: { opacity: 1, backdropFilter: "blur(12px)" },
  exit: { opacity: 0, backdropFilter: "blur(0px)" },
};

// Variants cho ảnh slide
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    scale: 0.85,
    rotateY: direction > 0 ? 8 : -8,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    rotateY: 0,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
    scale: 0.85,
    rotateY: direction > 0 ? -8 : 8,
  }),
};

// Variants cho container ảnh khi mở
const imageContainerVariants = {
  hidden: {
    opacity: 0,
    scale: 0.6,
    y: 40,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      ...springTransition,
      stiffness: 260,
      damping: 25,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.75,
    y: 30,
    transition: { duration: 0.25, ease: "easeIn" as const },
  },
};

// Variants cho UI controls (fade in stagger)
const controlVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay: 0.15, duration: 0.3, ease: "easeOut" as const },
  },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

export default function Lightbox({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
}: LightboxProps) {
  const [direction, setDirection] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);

  // Reset loading khi chuyển ảnh hoặc mở lightbox
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
    }
  }, [currentIndex, isOpen]);

  // Lock body scroll khi lightbox mở
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isOpen]);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setIsLoading(true);
    onNavigate(currentIndex > 0 ? currentIndex - 1 : images.length - 1);
  }, [currentIndex, images.length, onNavigate]);

  const handleNext = useCallback(() => {
    setDirection(1);
    setIsLoading(true);
    onNavigate(currentIndex < images.length - 1 ? currentIndex + 1 : 0);
  }, [currentIndex, images.length, onNavigate]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "Escape") onClose();
    },
    [handlePrev, handleNext, onClose],
  );

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
    setIsDragging(false);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      setIsDragging(true);
      if (diff > 0) handleNext();
      else handlePrev();
    }
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (!isDragging) {
      onClose();
    }
    setIsDragging(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="fixed inset-0 z-[90] bg-black/90 flex items-center justify-center"
          style={{ perspective: "1200px" }}
          onClick={handleBackdropClick}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="dialog"
          aria-label="Xem ảnh phóng to"
        >
          {/* Close button */}
          <motion.button
            variants={controlVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="absolute top-4 right-4 z-20 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 active:scale-90 flex items-center justify-center transition-all duration-200 cursor-pointer backdrop-blur-sm border border-white/10"
            aria-label="Đóng"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-5 h-5 text-white" />
          </motion.button>

          {/* Counter */}
          <motion.div
            variants={controlVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute top-5 left-1/2 -translate-x-1/2 z-20 font-sans text-sm text-white/70 bg-white/5 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/10"
          >
            {currentIndex + 1} / {images.length}
          </motion.div>

          {/* Previous button */}
          <motion.button
            variants={controlVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 active:scale-90 flex items-center justify-center transition-all duration-200 cursor-pointer backdrop-blur-sm border border-white/10"
            aria-label="Ảnh trước"
            whileHover={{ scale: 1.1, x: -2 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </motion.button>

          {/* Image container with loading — zoom-in on open */}
          <motion.div
            variants={imageContainerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full h-full max-w-4xl max-h-[85vh] mx-4 md:mx-12"
            onClick={(e) => e.stopPropagation()}
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Slide animation wrapper */}
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: springTransition,
                  opacity: { duration: 0.25 },
                  scale: { ...springTransition, stiffness: 350 },
                  rotateY: { ...springTransition, stiffness: 200 },
                }}
                className="absolute inset-0"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.15}
                onDragEnd={(_e, info) => {
                  if (Math.abs(info.offset.x) > 80) {
                    if (info.offset.x > 0) handlePrev();
                    else handleNext();
                  }
                }}
              >
                {/* Loading spinner */}
                <AnimatePresence>
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                      className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3"
                    >
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full border-2 border-white/10" />
                        <Loader2 className="absolute inset-0 w-12 h-12 text-primary-light animate-spin" />
                      </div>
                      <p className="font-sans text-xs text-white/40 tracking-wider">
                        Đang tải ảnh...
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Image with smooth fade-in on load */}
                <Image
                  src={images[currentIndex].src}
                  alt={images[currentIndex].alt}
                  fill
                  className={`object-contain select-none transition-opacity duration-500 ease-out ${
                    isLoading ? "opacity-0" : "opacity-100"
                  }`}
                  sizes="(max-width: 768px) 100vw, 80vw"
                  quality={90}
                  priority
                  onLoad={handleImageLoad}
                  draggable={false}
                />
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Next button */}
          <motion.button
            variants={controlVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 active:scale-90 flex items-center justify-center transition-all duration-200 cursor-pointer backdrop-blur-sm border border-white/10"
            aria-label="Ảnh tiếp"
            whileHover={{ scale: 1.1, x: 2 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
