"use client";

import { WEDDING } from "@/lib/constants";
import type { GuestEvent } from "@/lib/types";
import { getFullDate } from "@/lib/utils";
import { Calendar, Clock, MapPin } from "lucide-react";
import GoldOrnament from "./GoldOrnament";
import ScrollReveal, { StaggerContainer, StaggerItem } from "./ScrollReveal";

interface EventDetailsProps {
  guestEvent?: GuestEvent | null;
}

function getEvents(guestEvent?: GuestEvent | null) {
  const receptionTime = guestEvent?.receptionTime || WEDDING.time.reception;
  const ceremonyTime = guestEvent?.time || WEDDING.time.ceremony;
  const isSameTime = receptionTime === ceremonyTime;

  return [
    {
      icon: Calendar,
      title: "Ngày Tổ Chức",
      detail: getFullDate(guestEvent),
      sub: "",
    },
    {
      icon: Clock,
      title: "Thời Gian",
      detail: `${isSameTime ? "Vào lúc" : WEDDING.time.receptionLabel}: ${receptionTime}`,
      sub: isSameTime ? "" : `${WEDDING.time.ceremonyLabel}: ${ceremonyTime}`,
    },
    {
      icon: MapPin,
      title: "Địa Điểm",
      detail: guestEvent?.venueName || WEDDING.venue.name,
      sub: guestEvent?.venueAddress || WEDDING.venue.address,
    },
  ];
}

export default function EventDetails({ guestEvent }: EventDetailsProps) {
  return (
    <section
      id="event"
      className="section-padding bg-bg-cream relative overflow-hidden"
    >
      {/* Background decorative image */}
      <div className="absolute top-0 right-0 w-1/3 h-full opacity-5">
        {/* <Image
          src={SECTION_IMAGES.eventBg}
          alt=""
          fill
          className="object-cover"
          sizes="33vw"
          quality={30}
        /> */}
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
          {getEvents(guestEvent).map((event) => (
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
