"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { WEDDING, SECTION_IMAGES } from "@/lib/constants";
import GoldOrnament from "./GoldOrnament";
import type { GuestEvent } from "@/lib/types";
import { getShortDate } from "@/lib/utils";

interface SplashScreenProps {
  guestEvent?: GuestEvent | null;
}

export default function SplashScreen({ guestEvent }: SplashScreenProps) {
  const displayDate = getShortDate(guestEvent);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src={SECTION_IMAGES.splash}
              alt="Wedding splash"
              fill
              className="object-cover"
              priority
              sizes="100vw"
              quality={80}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-primary-dark/70 via-primary-dark/50 to-primary-dark/80" />
          </div>

          {/* Content */}
          <div className="relative z-10 text-center px-6 max-w-lg">
            {/* Top Ornament */}
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="flex justify-center mb-6"
            >
              <GoldOrnament variant="frame-top" />
            </motion.div>

            {/* Save the Date */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="font-serif text-gold-light tracking-[0.3em] uppercase text-xs md:text-sm mb-4"
            >
              Trân Trọng Kính Mời
            </motion.p>

            {/* Names */}
            <motion.h1
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
              className="font-script text-5xl md:text-7xl text-white mb-2 leading-tight"
            >
              {WEDDING.groom.name}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="shimmer-gold font-serif text-2xl md:text-3xl my-3"
            >
              &
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.0, duration: 1, ease: "easeOut" }}
              className="font-script text-5xl md:text-7xl text-white mb-6 leading-tight"
            >
              {WEDDING.bride.name}
            </motion.h1>

            {/* Date */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.8 }}
              className="font-serif text-lg md:text-xl text-gold-light tracking-widest mb-10"
            >
              {displayDate}
            </motion.p>

            {/* Bottom Ornament */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="flex justify-center mb-8"
            >
              <GoldOrnament variant="frame-bottom" />
            </motion.div>

            {/* Open Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.0, duration: 0.6 }}
              onClick={() => setIsOpen(true)}
              className="group relative cursor-pointer overflow-hidden rounded-full border-2 border-gold/60 px-10 py-3.5 font-serif text-sm md:text-base tracking-[0.2em] uppercase text-gold-light transition-all duration-300 hover:border-gold hover:bg-gold/10 hover:shadow-[0_0_30px_rgba(202,138,4,0.3)] animate-pulse-glow"
            >
              <span className="relative z-10">Mở Thiệp</span>
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
