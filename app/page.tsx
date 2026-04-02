"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import HeroSection from "@/components/HeroSection";
import CoupleSection from "@/components/CoupleSection";
import InvitationCard from "@/components/InvitationCard";
import EventDetails from "@/components/EventDetails";
import PhotoGallery from "@/components/PhotoGallery";
import MapSection from "@/components/MapSection";
import VideoDirections from "@/components/VideoDirections";
import WishBook from "@/components/WishBook";
import Footer from "@/components/Footer";
import { useGuestInfo } from "@/hooks/useGuestInfo";

// Dynamic imports for non-critical components
const SplashScreen = dynamic(() => import("@/components/SplashScreen"), {
  ssr: false,
});
const FloatingPetals = dynamic(() => import("@/components/FloatingPetals"), {
  ssr: false,
});
const MusicPlayer = dynamic(() => import("@/components/MusicPlayer"), {
  ssr: false,
});

function HomeContent() {
  const { guest, isLoading } = useGuestInfo();

  return (
    <main className="relative">
      {/* Splash Screen - fullscreen overlay */}
      <SplashScreen />

      {/* Floating Petals - subtle background effect */}
      <FloatingPetals />

      {/* Music Player - floating button */}
      <MusicPlayer />

      {/* Main Content Sections */}
      <HeroSection />
      <CoupleSection />
      <InvitationCard guest={guest} isLoading={isLoading} />
      <EventDetails guestEvent={guest?.event} />
      <PhotoGallery />
      <MapSection guestEvent={guest?.event} />
      <VideoDirections guestEvent={guest?.event} />
      <WishBook />
      <Footer />
    </main>
  );
}

export default function Home() {
  return (
    <Suspense>
      <HomeContent />
    </Suspense>
  );
}
