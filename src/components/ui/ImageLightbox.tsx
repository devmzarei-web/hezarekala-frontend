"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, ChevronLeft, ZoomIn, ZoomOut, RotateCcw, ExternalLink } from "lucide-react";
import Link from "next/link";

export interface LightboxImage {
  url: string;
  alt?: string;
  title?: string;
  thumbnailUrl?: string;
  sourceLink?: string;
  sourceTitle?: string;
  categoryLabel?: string;
}

interface ImageLightboxProps {
  images: LightboxImage[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function ImageLightbox({
  images,
  initialIndex = 0,
  isOpen,
  onClose,
}: ImageLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  // Sync current index when initialIndex changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(Math.max(0, Math.min(initialIndex, images.length - 1)));
      setZoomLevel(1);
    }
  }, [isOpen, initialIndex, images.length]);

  // Lock scroll when open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  const handleNext = useCallback(() => {
    setZoomLevel(1);
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const handlePrev = useCallback(() => {
    setZoomLevel(1);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const toggleZoom = useCallback(() => {
    setZoomLevel((prev) => (prev === 1 ? 2 : prev === 2 ? 3 : 1));
  }, []);

  const resetZoom = useCallback(() => {
    setZoomLevel(1);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        // In RTL, left arrow goes to next item
        handleNext();
      } else if (e.key === "ArrowRight") {
        // In RTL, right arrow goes to prev item
        handlePrev();
      } else if (e.key === "+" || e.key === "=") {
        setZoomLevel((prev) => Math.min(prev + 0.5, 3));
      } else if (e.key === "-") {
        setZoomLevel((prev) => Math.max(prev - 0.5, 1));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, handleNext, handlePrev]);

  // Touch swipe handling
  const onTouchStart = (e: React.TouchEvent) => {
    if (zoomLevel > 1) return; // Disable swipe when zoomed
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (zoomLevel > 1) return;
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd || zoomLevel > 1) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex] || images[0];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-[999999] flex flex-col justify-between bg-black/95 backdrop-blur-xl text-white select-none"
        dir="rtl"
        onClick={onClose}
      >
        {/* Top Control Bar */}
        <div
          className="relative z-20 flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-b from-black/90 to-transparent"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Counter / Title / Category */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <span className="text-xs sm:text-sm font-bold bg-white/10 border border-white/10 px-3 py-1.5 rounded-full text-[#c49a2c] tracking-wider">
              {currentIndex + 1} / {images.length}
            </span>
            {currentImage.categoryLabel && (
              <span className="text-xs font-semibold bg-[#c49a2c]/15 text-[#e5c158] border border-[#c49a2c]/30 px-2.5 py-1 rounded-full">
                {currentImage.categoryLabel}
              </span>
            )}
            {currentImage.title && (
              <span className="text-xs sm:text-sm text-gray-200 truncate max-w-[150px] sm:max-w-md font-medium">
                {currentImage.title}
              </span>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {/* Direct Source Link button if present */}
            {currentImage.sourceLink && (
              <Link
                href={currentImage.sourceLink}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#c49a2c] hover:bg-[#d4a82c] text-black font-bold text-xs transition-all shadow-md hover:shadow-lg"
                title={currentImage.sourceTitle ? `مشاهده ${currentImage.sourceTitle}` : "مشاهده صفحه مربوطه"}
              >
                <span>{currentImage.sourceTitle || "مشاهده منبع"}</span>
                <ExternalLink size={13} />
              </Link>
            )}

            {/* Zoom Button */}
            <button
              type="button"
              onClick={toggleZoom}
              className="p-2 sm:p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-200 hover:text-white transition-colors cursor-pointer"
              title={zoomLevel > 1 ? "بزرگ‌نمایی بیشتر / بازنشانی" : "بزرگ‌نمایی"}
              aria-label="بزرگ‌نمایی"
            >
              {zoomLevel > 1 ? <ZoomOut size={18} /> : <ZoomIn size={18} />}
            </button>

            {zoomLevel > 1 && (
              <button
                type="button"
                onClick={resetZoom}
                className="p-2 sm:p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-200 hover:text-white transition-colors cursor-pointer"
                title="اندازه اصلی"
                aria-label="اندازه اصلی"
              >
                <RotateCcw size={18} />
              </button>
            )}

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 sm:p-2.5 rounded-xl bg-white/10 hover:bg-red-500/20 hover:text-red-400 text-gray-200 transition-colors cursor-pointer"
              title="بستن (Esc)"
              aria-label="بستن"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Main Image Stage */}
        <div
          className="relative flex-1 flex items-center justify-center p-2 sm:p-6 overflow-hidden"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              {/* Right Button (Previous in RTL) */}
              <button
                type="button"
                onClick={handlePrev}
                className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/40 hover:bg-black/80 border border-white/15 text-white flex items-center justify-center backdrop-blur-md transition-all hover:scale-110 active:scale-95 shadow-2xl cursor-pointer"
                aria-label="تصویر قبلی"
              >
                <ChevronRight size={26} />
              </button>

              {/* Left Button (Next in RTL) */}
              <button
                type="button"
                onClick={handleNext}
                className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/40 hover:bg-black/80 border border-white/15 text-white flex items-center justify-center backdrop-blur-md transition-all hover:scale-110 active:scale-95 shadow-2xl cursor-pointer"
                aria-label="تصویر بعدی"
              >
                <ChevronLeft size={26} />
              </button>
            </>
          )}

          {/* Active Image */}
          <div className="relative max-w-full max-h-full flex items-center justify-center overflow-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: zoomLevel }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center justify-center cursor-zoom-in"
                onClick={toggleZoom}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={currentImage.url}
                  alt={currentImage.alt || currentImage.title || "تصویر"}
                  className="max-w-[92vw] max-h-[70vh] sm:max-h-[74vh] object-contain rounded-xl shadow-2xl transition-transform duration-200"
                  draggable={false}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom Thumbnail Strip & Caption */}
        <div
          className="relative z-20 px-4 py-3 sm:py-4 bg-gradient-to-t from-black/95 via-black/80 to-transparent"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Captions / Source Link Mobile Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mb-3 text-center">
            {currentImage.alt && currentImage.alt !== currentImage.title && (
              <p className="text-xs sm:text-sm text-gray-300 truncate max-w-xl">
                {currentImage.alt}
              </p>
            )}

            {currentImage.sourceLink && (
              <Link
                href={currentImage.sourceLink}
                className="sm:hidden inline-flex items-center gap-1 text-xs text-[#c49a2c] font-bold hover:underline"
              >
                <span>{currentImage.sourceTitle ? `مشاهده ${currentImage.sourceTitle}` : "مشاهده صفحه مربوطه"}</span>
                <ExternalLink size={12} />
              </Link>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex items-center justify-center gap-2 sm:gap-3 overflow-x-auto py-1 max-w-2xl mx-auto scrollbar-none">
              {images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setZoomLevel(1);
                    setCurrentIndex(i);
                  }}
                  className={`relative shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                    i === currentIndex
                      ? "border-[#c49a2c] scale-105 shadow-md shadow-[#c49a2c]/30 opacity-100"
                      : "border-white/10 hover:border-white/40 opacity-50 hover:opacity-80"
                  }`}
                  aria-label={`رفتن به تصویر ${i + 1}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.thumbnailUrl || img.url}
                    alt={img.alt || `پیش‌نمایش ${i + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
