"use client";

import Image from "next/image";
import { WEDDING, SECTION_IMAGES } from "@/lib/constants";
import ScrollReveal from "./ScrollReveal";
import { StaggerContainer, StaggerItem } from "./ScrollReveal";
import GoldOrnament from "./GoldOrnament";
import { Calendar, Clock, MapPin } from "lucide-react";

const events = [
  {
    icon: Calendar,
    title: "Ngày Tổ Chức",
    detail: WEDDING.displayDateFull,
    sub: "",
  },
  {
    icon: Clock,
    title: "Thời Gian",
    detail: `${WEDDING.time.receptionLabel}: ${WEDDING.time.reception}`,
    sub: `${WEDDING.time.ceremonyLabel}: ${WEDDING.time.ceremony}`,
  },
  {
    icon: MapPin,
    title: "Địa Điểm",
    detail: WEDDING.venue.name,
    sub: WEDDING.venue.address,
  },
];

export default function EventDetails() {
  return (
    <section id="event" className="section-padding bg-bg-cream relative overflow-hidden">
      {/* Background decorative image */}
      <div className="absolute top-0 right-0 w-1/3 h-full opacity-5">
        <Image
          src={SECTION_IMAGES.eventBg}
          alt=""
          fill
          className="object-cover"
          sizes="33vw"
          quality={30}
        />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Section Title */}
        <ScrollReveal className="text-center mb-12 md:mb-16">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-gold mb-3">
            Wedding Ceremony
          </p>
          <h2 className="font-script text-4xl md:text-5xl lg:text-6xl text-primary mb-4">
            Thông Tin Hôn Lễ
          </h2>
          <GoldOrnament variant="small-divider" />
        </ScrollReveal>

        {/* Event Cards */}
        <StaggerContainer
          className="grid grid-cols-1 sm:grid-cols-3 gap-5 md:gap-6 max-w-4xl mx-auto"
          staggerDelay={0.15}
        >
          {events.map((event) => (
            <StaggerItem key={event.title}>
              <div className="glass-card rounded-2xl p-6 md:p-8 text-center group hover:shadow-xl hover:border-gold/30 transition-all duration-300 h-full">
                {/* Icon */}
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                  <event.icon className="w-6 h-6 text-primary" />
                </div>

                {/* Title */}
                <h3 className="font-serif text-lg md:text-xl font-semibold text-primary-dark mb-2 tracking-wide">
                  {event.title}
                </h3>

                <div className="gold-line w-12 mx-auto mb-3" />

                {/* Detail */}
                <p className="font-serif text-base md:text-lg text-text-heading font-medium">
                  {event.detail}
                </p>
                {event.sub && (
                  <p className="font-sans text-sm text-text-muted mt-1.5">
                    {event.sub}
                  </p>
                )}
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
