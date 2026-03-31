"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, Volume2, VolumeX } from "lucide-react";

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Try to auto-play after first user interaction
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
        // Try to play music after first click
        if (audioRef.current) {
          audioRef.current.volume = 0.3;
          audioRef.current.play().then(() => {
            setIsPlaying(true);
          }).catch(() => {
            // Auto-play blocked - user can click button
          });
        }
        document.removeEventListener("click", handleFirstInteraction);
      }
    };

    document.addEventListener("click", handleFirstInteraction);
    return () => document.removeEventListener("click", handleFirstInteraction);
  }, [hasInteracted]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.volume = 0.3;
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        // Play failed
      });
    }
  };

  return (
    <>
      <audio ref={audioRef} loop preload="none">
        {/* User sẽ tải file nhạc lên public/music/ */}
        <source src="/music/wedding-song.mp3" type="audio/mpeg" />
      </audio>

      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 3, type: "spring" }}
        onClick={togglePlay}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg border border-primary-light/30 flex items-center justify-center hover:bg-white hover:shadow-xl transition-all duration-300 cursor-pointer group"
        aria-label={isPlaying ? "Tắt nhạc" : "Bật nhạc"}
      >
        <AnimatePresence mode="wait">
          {isPlaying ? (
            <motion.div
              key="playing"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <Volume2 className="w-5 h-5 text-primary" />
            </motion.div>
          ) : (
            <motion.div
              key="muted"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <VolumeX className="w-5 h-5 text-text-muted group-hover:text-primary transition-colors" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Music note animation when playing */}
        {isPlaying && (
          <div className="absolute -top-1 -right-1">
            <Music className="w-3 h-3 text-gold animate-bounce-soft" />
          </div>
        )}
      </motion.button>
    </>
  );
}
