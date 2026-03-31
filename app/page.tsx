"use client";

import dynamic from "next/dynamic";
import HeroSection from "@/components/HeroSection";
import CoupleSection from "@/components/CoupleSection";
import CountdownTimer from "@/components/CountdownTimer";
import EventDetails from "@/components/EventDetails";
import PhotoGallery from "@/components/PhotoGallery";
import MapSection from "@/components/MapSection";
import VideoDirections from "@/components/VideoDirections";
import WishBook from "@/components/WishBook";
import Footer from "@/components/Footer";

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

export default function Home() {
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
      <CountdownTimer />
      <EventDetails />
      <PhotoGallery />
      <MapSection />
      <VideoDirections />
      <WishBook />
      <Footer />
    </main>
  );
}
