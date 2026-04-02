"use client";

import { useCountdown } from "@/hooks/useCountdown";
import { SECTION_IMAGES, WEDDING } from "@/lib/constants";
import type { Guest } from "@/lib/types";
import Image from "next/image";
import GoldOrnament from "./GoldOrnament";
import ScrollReveal from "./ScrollReveal";

interface InvitationCardProps {
  guest: Guest | null;
  isLoading: boolean;
}

/* ───────────────────── Skeleton loader ───────────────────── */
function InvitationSkeleton() {
  return (
    <div className="animate-pulse flex flex-col items-center gap-4 py-4">
      <div className="h-3 w-28 bg-white/20 rounded" />
      <div className="h-10 w-60 bg-white/20 rounded" />
      <div className="h-4 w-36 bg-white/20 rounded" />
      <div className="h-12 w-52 bg-white/20 rounded mt-2" />
      <div className="h-4 w-40 bg-white/20 rounded" />
      <div className="h-4 w-56 bg-white/20 rounded mt-4" />
    </div>
  );
}

/* ────────────────── Default countdown view ────────────────── */
function DefaultCountdown() {
  const { days, hours, minutes, seconds, isExpired } = useCountdown(
    WEDDING.date,
  );

  const timeBlocks = [
    { value: days, label: "Ngày" },
    { value: hours, label: "Giờ" },
    { value: minutes, label: "Phút" },
    { value: seconds, label: "Giây" },
  ];

  return (
    <>
      <ScrollReveal>
        <p className="font-sans text-xs tracking-[0.3em] uppercase text-gold-light mb-3">
          Save The Date
        </p>
        <h2 className="font-script text-4xl md:text-5xl text-white mb-2">
          {isExpired ? "Ngày Hạnh Phúc Đã Đến!" : "Đếm Ngược Ngày Trọng Đại"}
        </h2>
        <GoldOrnament
          variant="small-divider"
          className="[&_*]:!text-gold-light [&_.gold-line]:!opacity-50"
        />
      </ScrollReveal>

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

      <ScrollReveal delay={0.4}>
        <p className="font-serif text-base md:text-lg text-white/80 mt-8 tracking-wide">
          {WEDDING.displayDateFull}
        </p>
      </ScrollReveal>
    </>
  );
}

/* ────────────── Personalized invitation view ────────────── */
function PersonalizedInvitation({ guest }: { guest: Guest }) {
  return (
    <>
      {/* Header */}
      <ScrollReveal>
        <p className="font-sans text-xs tracking-[0.3em] uppercase text-gold-light mb-3">
          Wedding Invitation
        </p>
        <h2 className="font-script text-4xl md:text-5xl text-white mb-2">
          Trân Trọng Kính Mời
        </h2>
        <GoldOrnament
          variant="small-divider"
          className="[&_*]:!text-gold-light [&_.gold-line]:!opacity-50"
        />
      </ScrollReveal>

      {/* Host name */}
      <ScrollReveal delay={0.15}>
        <div className="mt-8">
          <p className="font-serif text-xl md:text-2xl text-white font-semibold tracking-wide">
            {guest.hostName}
          </p>
        </div>
      </ScrollReveal>

      {/* "kính mời" */}
      <ScrollReveal delay={0.3}>
        <p className="font-serif text-base md:text-lg text-white/60 italic mt-4 mb-2">
          kính mời
        </p>
      </ScrollReveal>

      {/* Guest name — highlighted */}
      <ScrollReveal delay={0.45}>
        <div className="relative inline-block mt-2">
          {/* Decorative corners */}
          <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-gold/70 rounded-tl-sm" />
          <div className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-gold/70 rounded-tr-sm" />
          <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-gold/70 rounded-bl-sm" />
          <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-gold/70 rounded-br-sm" />

          <div className="guest-card-shimmer guest-card-glow bg-gradient-to-b from-[#2a1810]/90 via-[#3d2518]/85 to-[#2a1810]/90 backdrop-blur-sm rounded-lg px-10 py-6 md:px-14 md:py-8 border border-gold/30">
            <p className="guest-name-glow font-script text-3xl md:text-4xl lg:text-5xl leading-tight text-white">
              {guest.guestName}
            </p>
            {guest.guestTitle && (
              <p className="font-serif text-sm md:text-base text-gold-light mt-2 italic tracking-wide">
                {guest.guestTitle}
              </p>
            )}
          </div>
        </div>
      </ScrollReveal>

      {/* "đến dự…" */}
      <ScrollReveal delay={0.6}>
        <p className="font-serif text-base md:text-lg text-white/80 mt-6 tracking-wide max-w-sm mx-auto">
          {guest.invitationText || "đến dự Lễ Thành Hôn của chúng tôi"}
        </p>
      </ScrollReveal>

      {/* Date display */}
      {/* <ScrollReveal delay={0.75}>
        <p className="font-serif text-base md:text-lg text-white/80 mt-6 tracking-wide">
          {guest.event?.displayDate || WEDDING.displayDateFull}
        </p>
      </ScrollReveal> */}
    </>
  );
}

/* ═══════════════════ Main Component ═══════════════════ */
export default function InvitationCard({
  guest,
  isLoading,
}: InvitationCardProps) {
  return (
    <section
      id="invitation"
      className="relative py-20 md:py-28 overflow-hidden"
    >
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
        {isLoading ? (
          <InvitationSkeleton />
        ) : guest ? (
          <PersonalizedInvitation guest={guest} />
        ) : (
          <DefaultCountdown />
        )}
      </div>
    </section>
  );
}
