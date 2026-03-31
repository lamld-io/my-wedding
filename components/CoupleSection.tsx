"use client";

import { SECTION_IMAGES, WEDDING } from "@/lib/constants";
import { Heart } from "lucide-react";
import Image from "next/image";
import GoldOrnament from "./GoldOrnament";
import ScrollReveal from "./ScrollReveal";

export default function CoupleSection() {
  return (
    <section
      id="couple"
      className="section-padding bg-white relative overflow-hidden"
    >
      {/* Decorative background */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-gold/5 rounded-full translate-x-1/3 translate-y-1/3" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Section Title */}
        <ScrollReveal className="text-center mb-12 md:mb-16">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-gold mb-3">
            Our Love Story
          </p>
          <h2 className="font-script text-4xl md:text-5xl lg:text-6xl text-primary mb-4">
            Cô Dâu & Chú Rể
          </h2>
          <GoldOrnament variant="small-divider" />
        </ScrollReveal>

        {/* Couple Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-20 max-w-5xl mx-auto items-center">
          {/* Groom */}
          <ScrollReveal animation="fadeInLeft" className="text-center">
            <div className="relative inline-block mb-6">
              <div className="w-56 h-56 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-gold/30 shadow-xl mx-auto relative">
                <Image
                  src={SECTION_IMAGES.groom}
                  alt={WEDDING.groom.name}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 224px, 256px"
                  quality={80}
                />
              </div>
              {/* Decorative ring */}
              <div className="absolute inset-0 rounded-full border-2 border-gold/20 scale-110" />
            </div>
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-gold mb-2">
              {WEDDING.groom.role}
            </p>
            <h3 className="font-script text-3xl md:text-4xl text-primary-dark mb-3">
              {WEDDING.groom.name}
            </h3>
            <div className="gold-line w-16 mx-auto mb-3" />
            <p className="font-serif text-text-muted text-sm md:text-base max-w-xs mx-auto leading-relaxed">
              Út Nam
            </p>
          </ScrollReveal>

          {/* Heart Center - Desktop only */}
          <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center border border-primary-light/30">
              <Heart
                className="w-6 h-6 text-primary animate-heartbeat"
                fill="currentColor"
              />
            </div>
          </div>

          {/* Heart Center - Mobile */}
          <div className="flex md:hidden justify-center -my-4">
            <div className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center border border-primary-light/30">
              <Heart
                className="w-5 h-5 text-primary animate-heartbeat"
                fill="currentColor"
              />
            </div>
          </div>

          {/* Bride */}
          <ScrollReveal animation="fadeInRight" className="text-center">
            <div className="relative inline-block mb-6">
              <div className="w-56 h-56 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-gold/30 shadow-xl mx-auto relative">
                <Image
                  src={SECTION_IMAGES.bride}
                  alt={WEDDING.bride.name}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 224px, 256px"
                  quality={80}
                />
              </div>
              <div className="absolute inset-0 rounded-full border-2 border-gold/20 scale-110" />
            </div>
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-gold mb-2">
              {WEDDING.bride.role}
            </p>
            <h3 className="font-script text-3xl md:text-4xl text-primary-dark mb-3">
              {WEDDING.bride.name}
            </h3>
            <div className="gold-line w-16 mx-auto mb-3" />
            <p className="font-serif text-text-muted text-sm md:text-base max-w-xs mx-auto leading-relaxed">
              Trưởng Nữ
            </p>
          </ScrollReveal>
        </div>

        {/* Couple photo strip */}
        <ScrollReveal delay={0.3} className="mt-12 md:mt-16">
          <div className="grid grid-cols-2 gap-3 md:gap-4 max-w-2xl mx-auto">
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-lg group">
              <Image
                src={SECTION_IMAGES.coupleLeft}
                alt="Khoảnh khắc đáng nhớ"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 45vw, 300px"
                quality={75}
              />
            </div>
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-lg group mt-8">
              <Image
                src={SECTION_IMAGES.coupleRight}
                alt="Tình yêu đích thực"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 45vw, 300px"
                quality={75}
              />
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
