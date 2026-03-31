"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ScrollReveal from "./ScrollReveal";
import GoldOrnament from "./GoldOrnament";
import { BookHeart, Send, Heart, User, MessageSquareHeart } from "lucide-react";

interface Wish {
  id: string;
  name: string;
  message: string;
  timestamp: string;
}

export default function WishBook() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Load wishes
  useEffect(() => {
    fetchWishes();
  }, []);

  const fetchWishes = async () => {
    try {
      const res = await fetch("/api/wishes");
      if (res.ok) {
        const data = await res.json();
        setWishes(data.wishes || []);
      }
    } catch {
      // Silently fail - wishes are non-critical
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/wishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), message: message.trim() }),
      });

      if (res.ok) {
        setName("");
        setMessage("");
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        fetchWishes();
      }
    } catch {
      alert("Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="wishes" className="section-padding bg-bg-rose relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-10 left-10 w-40 h-40 bg-primary/5 rounded-full blur-2xl" />
      <div className="absolute bottom-10 right-10 w-56 h-56 bg-gold/5 rounded-full blur-2xl" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Section Title */}
        <ScrollReveal className="text-center mb-10 md:mb-14">
          <div className="flex items-center justify-center gap-2 mb-3">
            <BookHeart className="w-4 h-4 text-gold" />
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-gold">
              Guest Book
            </p>
          </div>
          <h2 className="font-script text-4xl md:text-5xl lg:text-6xl text-primary mb-4">
            Sổ Lưu Bút
          </h2>
          <GoldOrnament variant="small-divider" />
          <p className="font-serif text-text-muted text-sm md:text-base mt-4">
            Gửi lời chúc phúc đến cô dâu và chú rể
          </p>
        </ScrollReveal>

        <div className="max-w-2xl mx-auto">
          {/* Form */}
          <ScrollReveal delay={0.1}>
            <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 md:p-8 mb-8">
              {/* Name Input */}
              <div className="mb-4">
                <label className="flex items-center gap-2 font-serif text-sm text-primary-dark mb-2">
                  <User className="w-4 h-4" />
                  Tên của bạn
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nhập tên..."
                  maxLength={50}
                  className="w-full px-4 py-3 rounded-xl border border-primary-light/30 bg-white/80 font-sans text-sm text-text-body placeholder:text-text-muted/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  required
                />
              </div>

              {/* Message Input */}
              <div className="mb-5">
                <label className="flex items-center gap-2 font-serif text-sm text-primary-dark mb-2">
                  <MessageSquareHeart className="w-4 h-4" />
                  Lời chúc
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Viết lời chúc tốt đẹp nhất đến cô dâu và chú rể..."
                  rows={4}
                  maxLength={500}
                  className="w-full px-4 py-3 rounded-xl border border-primary-light/30 bg-white/80 font-sans text-sm text-text-body placeholder:text-text-muted/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !name.trim() || !message.trim()}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-serif text-sm tracking-wider hover:bg-primary-dark transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? "Đang gửi..." : "Gửi Lời Chúc"}
              </button>

              {/* Success message */}
              <AnimatePresence>
                {showSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center gap-2 mt-4 text-green-600 font-sans text-sm"
                  >
                    <Heart className="w-4 h-4" fill="currentColor" />
                    Cảm ơn bạn đã gửi lời chúc!
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </ScrollReveal>

          {/* Wishes List */}
          {wishes.length > 0 && (
            <ScrollReveal delay={0.2}>
              <h3 className="font-serif text-lg text-primary-dark text-center mb-5">
                Lời Chúc Từ Mọi Người ({wishes.length})
              </h3>
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                {wishes.map((wish, i) => (
                  <motion.div
                    key={wish.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="glass-card rounded-xl p-4 md:p-5"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Heart className="w-3.5 h-3.5 text-primary" fill="currentColor" />
                      </div>
                      <span className="font-serif text-sm font-semibold text-primary-dark">
                        {wish.name}
                      </span>
                      <span className="font-sans text-[10px] text-text-muted ml-auto">
                        {new Date(wish.timestamp).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                    <p className="font-sans text-sm text-text-body leading-relaxed pl-10">
                      {wish.message}
                    </p>
                  </motion.div>
                ))}
              </div>
            </ScrollReveal>
          )}
        </div>
      </div>
    </section>
  );
}
