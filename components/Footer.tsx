"use client";

import Image from "next/image";
import { WEDDING, SECTION_IMAGES } from "@/lib/constants";
import ScrollReveal from "./ScrollReveal";
import GoldOrnament from "./GoldOrnament";
import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer id="footer" className="relative py-16 md:py-24 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={SECTION_IMAGES.footer}
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          quality={50}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/80 via-primary-dark/70 to-primary-dark/60" />
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center">
        <ScrollReveal>
          <GoldOrnament variant="frame-top" className="mx-auto mb-6" />

          <p className="font-serif text-gold-light/80 tracking-[0.2em] uppercase text-xs mb-4">
            Thank You
          </p>

          <h2 className="font-script text-3xl md:text-5xl text-white mb-3">
            Cảm ơn bạn
          </h2>
          <p className="font-serif text-white/80 text-base md:text-lg max-w-md mx-auto mb-6">
            đã dành thời gian đến chung vui cùng chúng tôi trong ngày trọng đại này
          </p>

          <div className="gold-line w-20 mx-auto mb-6" />

          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="font-script text-2xl md:text-3xl text-white">
              {WEDDING.groom.name}
            </span>
            <Heart
              className="w-5 h-5 text-primary-light animate-heartbeat"
              fill="currentColor"
            />
            <span className="font-script text-2xl md:text-3xl text-white">
              {WEDDING.bride.name}
            </span>
          </div>

          <p className="font-serif text-gold-light tracking-widest text-sm">
            {WEDDING.displayDate}
          </p>

          <GoldOrnament variant="frame-bottom" className="mx-auto mt-8" />
        </ScrollReveal>

        {/* Copyright */}
        <div className="mt-12 pt-6 border-t border-white/10">
          <p className="font-sans text-[10px] text-white/30 tracking-wider">
            Made with{" "}
            <Heart className="w-2.5 h-2.5 inline text-primary-light" fill="currentColor" />{" "}
            for our special day
          </p>
        </div>
      </div>
    </footer>
  );
}
