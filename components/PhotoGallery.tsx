"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { GALLERY_PHOTOS } from "@/lib/constants";
import ScrollReveal from "./ScrollReveal";
import GoldOrnament from "./GoldOrnament";
import Lightbox from "./Lightbox";
import { Camera, Images, ChevronDown } from "lucide-react";

const INITIAL_COUNT = 15;
const LOAD_MORE_COUNT = 11;

/*
 * Bento Pattern cho 4 cột. Mỗi block = 8 items, lấp đầy chính xác 4 cột.
 *
 * Block layout (4 cột × 3 hàng = 12 ô, 8 items):
 * ┌───────┬───┬───┐
 * │ 2×2   │ 1 │ 1 │  Row 1: items 0(2cols), 1, 2 = 4 cols
 * │       │ 1 │ 1 │  Row 2: item 0 continues, 3, 4 = 4 cols
 * ├───┬───┴───┼───┤
 * │ 1 │ 2×1   │ 1 │  Row 3: items 5, 6(2cols), 7 = 4 cols
 * └───┴───────┴───┘
 */
const BENTO_BLOCK: [number, number][] = [
  [2, 2], // 0: featured lớn
  [1, 1], // 1: nhỏ
  [1, 1], // 2: nhỏ
  [1, 1], // 3: nhỏ
  [1, 1], // 4: nhỏ
  [1, 1], // 5: nhỏ
  [2, 1], // 6: rộng ngang
  [1, 1], // 7: nhỏ
];

const BLOCK_SIZE = BENTO_BLOCK.length; // 8

/**
 * Trả về [colSpan, rowSpan] cho ảnh tại vị trí index.
 * Bento pattern cho blocks hoàn chỉnh, 1×1 cho tail.
 */
function getBentoSpan(index: number, totalVisible: number): [number, number] {
  const blockStart = Math.floor(index / BLOCK_SIZE) * BLOCK_SIZE;
  const itemsInThisBlock = Math.min(BLOCK_SIZE, totalVisible - blockStart);

  if (itemsInThisBlock >= BLOCK_SIZE) {
    return BENTO_BLOCK[index % BLOCK_SIZE];
  }

  return [1, 1];
}

/**
 * Tính colSpan cần thiết cho item cuối cùng để lấp đầy hàng cuối.
 *
 * Trên mobile (gridCols ≤ 2), CSS override tất cả span thành 1,
 * TRỪ item đầu (span 2, row span 2 = 4 ô).
 * Nên tổng slots trên mobile = 4 + (totalVisible - 1) × 1.
 *
 * Trên tablet/desktop, CSS KHÔNG override → items giữ bento spans.
 * Tổng slots = sum(colSpan * rowSpan) cho tất cả items.
 *
 * @returns colSpan cần thiết cho item cuối, hoặc 1 nếu không cần fill
 */
function getLastItemFillSpan(
  totalVisible: number,
  gridCols: number
): number {
  const cols = Math.max(gridCols, 2);

  if (cols <= 2) {
    // Mobile: item 0 = 2 cols × 2 rows = 4 ô, rest = 1 ô each
    const totalSlots = 4 + (totalVisible - 1);
    const remainder = totalSlots % cols;
    if (remainder === 0) return 1; // đã đầy
    return cols - remainder + 1; // item cuối span thêm để lấp
  }

  // Tablet/Desktop: tính tổng slots dựa trên bento pattern
  let totalSlots = 0;
  for (let i = 0; i < totalVisible; i++) {
    const [c, r] = getBentoSpan(i, totalVisible);
    totalSlots += c * r;
  }

  // NOTE: bento blocks [2,2] chiếm 4 ô, [2,1] chiếm 2 ô, v.v.
  // Tổng slots ÷ cols = số hàng (có thể dư)
  const remainder = totalSlots % cols;
  if (remainder === 0) return 1; // đã đầy

  // Item cuối (1×1) cần span thêm để lấp
  return cols - remainder + 1;
}

export default function PhotoGallery() {
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const gridRef = useRef<HTMLDivElement>(null);
  const [gridCols, setGridCols] = useState(2); // mobile-first default

  // Track số cột thực tế của CSS Grid
  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;

    const updateCols = () => {
      const style = getComputedStyle(el);
      const cols = style.gridTemplateColumns.split(" ").length;
      setGridCols(cols);
    };

    updateCols();

    const observer = new ResizeObserver(() => updateCols());
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  // Sort: featured first, then interleave groups for visual variety
  const sortedPhotos = useMemo(() => {
    const featured = GALLERY_PHOTOS.filter((p) => p.featured);
    const outdoor = GALLERY_PHOTOS.filter((p) => p.group === "outdoor");
    const studio = GALLERY_PHOTOS.filter((p) => p.group === "studio");
    const artistic = GALLERY_PHOTOS.filter((p) => p.group === "artistic");
    const portrait = GALLERY_PHOTOS.filter((p) => p.group === "portrait");

    const interleaved: typeof GALLERY_PHOTOS = [];
    const groups = [outdoor, studio, artistic, portrait];
    const maxLen = Math.max(...groups.map((g) => g.length));

    for (let i = 0; i < maxLen; i++) {
      for (const group of groups) {
        if (i < group.length) {
          interleaved.push(group[i]);
        }
      }
    }

    return [...featured, ...interleaved];
  }, []);

  const visiblePhotos = sortedPhotos.slice(0, visibleCount);
  const hasMore = visibleCount < sortedPhotos.length;
  const remainingCount = sortedPhotos.length - visibleCount;

  const handleLoadMore = () => {
    setVisibleCount((prev) =>
      Math.min(prev + LOAD_MORE_COUNT, sortedPhotos.length)
    );
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = "";
  };

  return (
    <section id="gallery" className="section-padding bg-white relative">
      <div className="gallery-container">
        {/* Section Title */}
        <ScrollReveal className="text-center mb-10 md:mb-14">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Camera className="w-4 h-4 text-gold" />
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-gold">
              Photo Gallery
            </p>
          </div>
          <h2 className="font-script text-4xl md:text-5xl lg:text-6xl text-primary mb-4">
            Album Ảnh Cưới
          </h2>
          <GoldOrnament variant="small-divider" />
          <p className="font-serif text-text-muted text-sm md:text-base mt-4">
            Những khoảnh khắc đáng nhớ của chúng tôi
          </p>
        </ScrollReveal>

        {/* ====== Gallery Grid ====== */}
        <div className="gallery-grid" ref={gridRef}>
          <AnimatePresence mode="popLayout">
            {visiblePhotos.map((photo, index) => {
              let [colSpan, rowSpan] = getBentoSpan(index, visiblePhotos.length);

              // Item cuối cùng: tính xem cần span thêm bao nhiêu cột
              const isLastItem = index === visiblePhotos.length - 1;
              if (isLastItem) {
                const fillSpan = getLastItemFillSpan(visiblePhotos.length, gridCols);
                if (fillSpan > 1) {
                  colSpan = fillSpan;
                  rowSpan = 1;
                }
              }

              const isTailFill = isLastItem && colSpan > 1;

              return (
                <motion.div
                  key={photo.src}
                  layout
                  initial={{ opacity: 0, scale: 0.92, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{
                    duration: 0.5,
                    delay:
                      index >= INITIAL_COUNT
                        ? (index - (visibleCount - LOAD_MORE_COUNT)) * 0.06
                        : Math.min(index * 0.04, 0.6),
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  className={`gallery-item${isTailFill ? ' tail-fill' : ''}`}
                  style={{
                    gridColumn: `span ${colSpan}`,
                    gridRow: `span ${rowSpan}`,
                  }}
                >
                  <div
                    className="relative w-full h-full overflow-hidden rounded-lg md:rounded-xl cursor-pointer group"
                    onClick={() => openLightbox(index)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Xem ảnh: ${photo.alt}`}
                    onKeyDown={(e) =>
                      e.key === "Enter" && openLightbox(index)
                    }
                  >
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      className="object-cover transition-all duration-700 group-hover:scale-110"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1536px) 25vw, 20vw"
                      quality={75}
                      loading={index < 6 ? "eager" : "lazy"}
                    />

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-400">
                      <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 transform translate-y-3 group-hover:translate-y-0 transition-transform duration-400">
                        <p className="font-serif text-white text-xs md:text-sm leading-snug">
                          {photo.alt}
                        </p>
                        <div className="flex items-center gap-1 mt-1.5">
                          <Images className="w-3 h-3 text-gold-light" />
                          <span className="font-sans text-[10px] text-white/60 uppercase tracking-wider">
                            {photo.group === "hero"
                              ? "Highlight"
                              : photo.group === "outdoor"
                                ? "Ngoại Cảnh"
                                : photo.group === "studio"
                                  ? "Studio"
                                  : photo.group === "artistic"
                                    ? "Nghệ Thuật"
                                    : "Chân Dung"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Inner shadow for depth */}
                    <div className="absolute inset-0 shadow-[inset_0_-2px_8px_rgba(0,0,0,0.08)] rounded-lg md:rounded-xl pointer-events-none" />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Load more button */}
        {hasMore && (
          <div className="text-center mt-10 md:mt-12">
            <button
              onClick={handleLoadMore}
              className="group inline-flex items-center gap-2.5 px-10 py-3.5 rounded-full border-2 border-primary/30 text-primary font-serif text-sm md:text-base tracking-wider hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 cursor-pointer shadow-sm hover:shadow-lg"
            >
              <Images className="w-4 h-4" />
              Xem Thêm {remainingCount} Ảnh
              <ChevronDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
            </button>
            <p className="font-sans text-xs text-text-muted mt-3">
              Đang hiển thị {visibleCount} / {sortedPhotos.length} ảnh
            </p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <Lightbox
        images={sortedPhotos.map((p) => ({ src: p.src, alt: p.alt }))}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={closeLightbox}
        onNavigate={setLightboxIndex}
      />
    </section>
  );
}
