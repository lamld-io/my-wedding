"use client";

import ScrollReveal from "./ScrollReveal";
import GoldOrnament from "./GoldOrnament";
import { Video, PlayCircle, Clock } from "lucide-react";
import type { GuestEvent } from "@/lib/types";

interface VideoDirectionsProps {
  guestEvent?: GuestEvent | null;
  defaultVideoUrl?: string;
}

export default function VideoDirections({ guestEvent, defaultVideoUrl }: VideoDirectionsProps) {
  // Nếu venue cấu hình tắt video → ẩn hoàn toàn section
  if (guestEvent?.showVideo === false) {
    return null;
  }

  const videoUrl = guestEvent?.videoUrl || defaultVideoUrl;

  return (
    <section id="video" className="section-padding bg-white relative">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Title */}
        <ScrollReveal className="text-center mb-10 md:mb-14">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Video className="w-4 h-4 text-gold" />
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-gold">
              Direction Guide
            </p>
          </div>
          <h2 className="font-script text-4xl md:text-5xl lg:text-6xl text-primary mb-4">
            Video Dẫn Đường
          </h2>
          <GoldOrnament variant="small-divider" />
        </ScrollReveal>

        <div className="max-w-3xl mx-auto">
          <ScrollReveal delay={0.15}>
            {videoUrl ? (
              /* Video Player */
              <div className="rounded-2xl overflow-hidden shadow-xl border-2 border-gold/20">
                <video
                  controls
                  className="w-full aspect-video"
                  poster="/images/494A1240.jpg"
                  preload="metadata"
                >
                  <source src={videoUrl} type="video/mp4" />
                  Trình duyệt không hỗ trợ video.
                </video>
              </div>
            ) : (
              /* Placeholder - Chưa có video */
              <div className="glass-card rounded-2xl border-2 border-dashed border-gold/30 p-10 md:p-16 text-center">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
                  <PlayCircle className="w-10 h-10 text-primary" />
                </div>
                <h3 className="font-serif text-xl md:text-2xl text-primary-dark mb-3">
                  Video Dẫn Đường
                </h3>
                <div className="gold-line w-16 mx-auto mb-4" />
                <div className="flex items-center justify-center gap-2 text-text-muted">
                  <Clock className="w-4 h-4" />
                  <p className="font-sans text-sm md:text-base">
                    Video hướng dẫn đường đi sẽ được cập nhật trước hôn lễ
                  </p>
                </div>
                <p className="font-sans text-xs text-text-muted/60 mt-3">
                  Mọi người vui lòng quay lại sau để xem hướng dẫn chi tiết nha!!!
                </p>
              </div>
            )}
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
