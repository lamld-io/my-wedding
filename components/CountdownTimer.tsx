"use client";

import Image from "next/image";
import { WEDDING, SECTION_IMAGES } from "@/lib/constants";
import { useCountdown } from "@/hooks/useCountdown";
import ScrollReveal from "./ScrollReveal";
import GoldOrnament from "./GoldOrnament";

export default function CountdownTimer() {
  const { days, hours, minutes, seconds, isExpired } = useCountdown(WEDDING.date);

  const timeBlocks = [
    { value: days, label: "Ngày" },
    { value: hours, label: "Giờ" },
    { value: minutes, label: "Phút" },
    { value: seconds, label: "Giây" },
  ];

  return (
    <section id="countdown" className="relative py-20 md:py-28 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={SECTION_IMAGES.countdown}
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          quality={60}
        />
        <div className="absolute inset-0 bg-primary-dark/60 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center">
        <ScrollReveal>
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-gold-light mb-3">
            Save The Date
          </p>
          <h2 className="font-script text-4xl md:text-5xl text-white mb-2">
            {isExpired ? "Ngày Hạnh Phúc Đã Đến!" : "Đếm Ngược Ngày Trọng Đại"}
          </h2>
          <GoldOrnament variant="small-divider" className="[&_*]:!text-gold-light [&_.gold-line]:!opacity-50" />
        </ScrollReveal>

        {/* Countdown blocks */}
        <ScrollReveal delay={0.2}>
          <div className="flex justify-center gap-3 md:gap-5 mt-8">
            {timeBlocks.map((block) => (
              <div
                key={block.label}
                className="glass-card rounded-xl md:rounded-2xl p-4 md:p-6 min-w-[72px] md:min-w-[100px] border border-white/20 shadow-xl"
              >
                <span className="font-serif text-3xl md:text-5xl lg:text-6xl font-bold text-white block leading-none">
                  {String(block.value).padStart(2, "0")}
                </span>
                <span className="font-sans text-[10px] md:text-xs text-white/70 tracking-[0.15em] uppercase mt-2 block">
                  {block.label}
                </span>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* Date display */}
        <ScrollReveal delay={0.4}>
          <p className="font-serif text-base md:text-lg text-white/80 mt-8 tracking-wide">
            {WEDDING.displayDateFull}
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
