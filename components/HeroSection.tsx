"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { WEDDING, SECTION_IMAGES } from "@/lib/constants";
import { ChevronDown } from "lucide-react";

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image with Parallax Effect */}
      <div className="absolute inset-0">
        <Image
          src={SECTION_IMAGES.hero}
          alt="Duy Lam và Thanh Thoảng"
          fill
          className="object-cover object-top"
          priority
          sizes="100vw"
          quality={85}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary-dark/40 via-primary-dark/20 to-bg-rose/90" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 pt-20">
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="font-serif text-white/80 tracking-[0.4em] uppercase text-xs md:text-sm mb-6"
        >
          We're Getting Married
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="font-script text-5xl md:text-7xl lg:text-8xl text-white mb-3 [text-shadow:_0_4px_20px_rgba(0,0,0,0.3)]"
        >
          {WEDDING.groom.name}
        </motion.h2>

        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.5 }}
          className="shimmer-gold font-serif text-3xl md:text-4xl inline-block my-2"
        >
          &
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="font-script text-5xl md:text-7xl lg:text-8xl text-white mb-8 [text-shadow:_0_4px_20px_rgba(0,0,0,0.3)]"
        >
          {WEDDING.bride.name}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="gold-line w-40 mx-auto mb-6"
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.8 }}
          className="font-serif text-xl md:text-2xl text-white/90 tracking-widest"
        >
          {WEDDING.displayDate}
        </motion.p>

        {/* Quote */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.0, duration: 1 }}
          className="font-serif italic text-white/70 text-sm md:text-base mt-8 max-w-md mx-auto"
        >
          &ldquo;{WEDDING.quote}&rdquo;
        </motion.p>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center"
      >
        <span className="font-sans text-[10px] text-white/50 tracking-[0.2em] uppercase mb-2">
          Cuộn xuống
        </span>
        <ChevronDown className="w-5 h-5 text-white/50 animate-bounce-soft" />
      </motion.div>
    </section>
  );
}
