"use client";

import { WEDDING } from "@/lib/constants";
import ScrollReveal from "./ScrollReveal";
import GoldOrnament from "./GoldOrnament";
import { MapPin, Navigation, ExternalLink } from "lucide-react";

export default function MapSection() {
  const { venue } = WEDDING;
  const mapEmbedUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3000!2d${venue.coordinates.lng}!3d${venue.coordinates.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOcKwNTQnMjIuOCJOIDEwNsKwMDknMDguNiJF!5e0!3m2!1svi!2svn!4v1`;

  return (
    <section id="map" className="section-padding bg-bg-cream relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Title */}
        <ScrollReveal className="text-center mb-10 md:mb-14">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Navigation className="w-4 h-4 text-gold" />
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-gold">
              Location
            </p>
          </div>
          <h2 className="font-script text-4xl md:text-5xl lg:text-6xl text-primary mb-4">
            Bản Đồ Chỉ Đường
          </h2>
          <GoldOrnament variant="small-divider" />
        </ScrollReveal>

        <div className="max-w-4xl mx-auto">
          {/* Address Card */}
          <ScrollReveal delay={0.1}>
            <div className="glass-card rounded-2xl p-6 md:p-8 text-center mb-6">
              <div className="flex items-center justify-center gap-2 mb-3">
                <MapPin className="w-5 h-5 text-primary" />
                <h3 className="font-serif text-xl md:text-2xl text-primary-dark font-semibold">
                  {venue.name}
                </h3>
              </div>
              <p className="font-sans text-text-body text-sm md:text-base mb-5">
                {venue.address}
              </p>
              <a
                href={venue.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-white font-sans text-sm tracking-wider hover:bg-primary-dark transition-colors duration-300 shadow-lg hover:shadow-xl cursor-pointer"
              >
                <Navigation className="w-4 h-4" />
                Chỉ Đường Trên Google Maps
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </ScrollReveal>

          {/* Embedded Map */}
          <ScrollReveal delay={0.2}>
            <div className="rounded-2xl overflow-hidden shadow-xl border-2 border-gold/20">
              <iframe
                src={mapEmbedUrl}
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Bản đồ địa điểm tổ chức"
                className="w-full h-[300px] md:h-[400px]"
              />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
