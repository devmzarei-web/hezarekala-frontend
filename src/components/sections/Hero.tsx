"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle, ChevronDown, Play, Pause } from "lucide-react";
import { motion } from "framer-motion";
import type { Settings } from "@/payload-types";
import { getMediaUrl } from "@/lib/media";

interface HeroSlide {
  image: string;
  video?: string | null;
  title: string;
}

interface HeroProps {
  slides: HeroSlide[];
  heroVideoUrl?: string | null;
  settings: Settings | null;
}

const DEFAULT_SLIDES: HeroSlide[] = [
  { image: "/images/hero-bg.jpg", title: "طراحی و ساخت پمپ‌های فشار قوی" },
  { image: "/images/hero-bg-2.jpg", title: "تولید پمپ‌های دنده‌ای صنعتی" },
  { image: "/images/hero-bg-3.jpg", title: "مونتاژ و تست پمپ‌های پیستونی" },
];

export default function Hero({ slides = DEFAULT_SLIDES, heroVideoUrl = null, settings }: HeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loadedSlides, setLoadedSlides] = useState<Set<number>>(new Set([0]));
  const [videoLoaded, setVideoLoaded] = useState<Set<number>>(new Set());
  const [mainVideoLoaded, setMainVideoLoaded] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(0);
  const preloadedRef = useRef<Set<number>>(new Set([0]));
  const videoRefs = useRef<Map<number, HTMLVideoElement>>(new Map());
  const mainVideoRef = useRef<HTMLVideoElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const displaySlides = slides.length > 0 ? slides : DEFAULT_SLIDES;

  useEffect(() => {
    const setHeight = () => setViewportHeight(window.innerHeight);
    setHeight();
    window.addEventListener("resize", setHeight);
    return () => window.removeEventListener("resize", setHeight);
  }, []);

  const processedSlides = displaySlides.map((slide) => {
    const imageUrl = getMediaUrl(slide.image);
    const videoUrl = slide.video ? getMediaUrl(slide.video) : null;

    return { ...slide, image: imageUrl, video: videoUrl };
  });

  useEffect(() => {
    if (heroVideoUrl) return;
    if (!preloadedRef.current.has(currentSlide)) {
      preloadedRef.current = new Set([...preloadedRef.current, currentSlide]);
      setLoadedSlides(new Set([...preloadedRef.current]));
    }
    for (let i = 1; i <= 2; i++) {
      const nextIndex = (currentSlide + i) % processedSlides.length;
      if (!preloadedRef.current.has(nextIndex)) {
        preloadedRef.current = new Set([...preloadedRef.current, nextIndex]);
        const img = new window.Image();
        img.src = processedSlides[nextIndex].image;
      }
    }
  }, [currentSlide, processedSlides, heroVideoUrl]);

  useEffect(() => {
    if (heroVideoUrl || isPaused) return;
    intervalRef.current = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % processedSlides.length);
    }, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [processedSlides.length, heroVideoUrl, isPaused]);

  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (index === currentSlide) {
        video.play().catch(() => {});
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, [currentSlide]);

  const setVideoRef = (index: number, el: HTMLVideoElement | null) => {
    if (el) {
      videoRefs.current.set(index, el);
      el.addEventListener("canplay", () => setVideoLoaded(prev => new Set([...prev, index])));
      if (el.readyState >= 2) setVideoLoaded(prev => new Set([...prev, index]));
    }
  };

  const aboutText =
    settings?.aboutText ||
    "هزاره کالا با تکیه بر دانش فنی پیشرفته، تیم مهندسی متخصص و تجهیزات مدرن، پمپ‌های سانتریفیوژ، پیستونی و دنده‌ای را برای صنایع نفت، گاز، پتروشیمی و نیروگاهی طراحی و تولید می‌کند.";

  return (
    <section
      className="relative overflow-hidden"
      style={{ height: viewportHeight > 0 ? `${viewportHeight}px` : "100vh" }}
      dir="rtl"
      aria-label="اسلایدر معرفی هزاره کالا"
    >
      {/* Background Video */}
      {heroVideoUrl && (
        <video
          ref={mainVideoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover z-0"
          onCanPlay={() => setMainVideoLoaded(true)}
        >
          <source src={heroVideoUrl} type="video/mp4" />
        </video>
      )}

      {heroVideoUrl && !mainVideoLoaded && (
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: `url('${processedSlides[0]?.image}')` }}
        />
      )}

      {/* Slide Backgrounds */}
      {!heroVideoUrl && processedSlides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? "opacity-100" : "opacity-0"}`}
        >
          {slide.video && (
            <video
              ref={el => setVideoRef(index, el)}
              autoPlay
              loop
              muted
              playsInline
              preload={index === 0 ? "auto" : "none"}
              className="absolute inset-0 w-full h-full object-cover"
              poster={slide.image}
            >
              <source src={slide.video} type="video/mp4" />
            </video>
          )}
          {(!slide.video || !videoLoaded.has(index)) && (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${slide.image}')` }}
            />
          )}
        </div>
      ))}

      {/* Preload hidden images */}
      {!heroVideoUrl && processedSlides.map((slide, index) =>
        !loadedSlides.has(index) ? (
          <img
            key={`preload-${index}`}
            src={slide.image}
            alt=""
            className="hidden"
            onLoad={() => {
              if (!preloadedRef.current.has(index)) {
                preloadedRef.current = new Set([...preloadedRef.current, index]);
                setLoadedSlides(new Set([...preloadedRef.current]));
              }
            }}
          />
        ) : null
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#060f1c]/70 via-[#060f1c]/40 to-[#060f1c]/95 z-10" />
      <div className="absolute inset-0 bg-[#060f1c] -z-10" />

      {/* Content */}
      <div className="relative z-30 h-full flex flex-col justify-between">
        {/* Top spacing for transparent header */}
        <div className="pt-20 md:pt-24 lg:pt-28" />

        {/* Main Content - vertically centered */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full px-4 md:px-10 lg:px-14 max-w-4xl mx-auto text-center flex flex-col items-center">
            {/* Badge - centered directly above the title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-[#c49a2c] px-4 md:px-5 py-1.5 md:py-2 rounded-full text-xs md:text-sm mb-5 md:mb-6 backdrop-blur-sm shadow-md"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c49a2c] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#c49a2c]" />
              </span>
              <span className="font-bold">بیش از ۷ سال تجربه در صنعت پمپ‌سازی</span>
            </motion.div>

            {/* Title - Three lines, each independently styled */}
            <h1 className="mb-4 md:mb-5 text-center">
              {/* Line 1 - White Bold */}
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.5 }}
                className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-5xl text-white leading-[1.3] text-center"
                style={{
                  fontFamily: "'IRANSansX', 'Vazirmatn', sans-serif",
                  fontWeight: 800,
                  textShadow: "0 2px 8px rgba(0,0,0,0.5), 0 4px 16px rgba(0,0,0,0.3)",
                }}
              >
                طراحی و ساخت
              </motion.span>

              {/* Line 2 - Gold Bold */}
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.7 }}
                className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-[#c49a2c] leading-[1.4] text-center"
                style={{
                  fontFamily: "'IRANSansX', 'Vazirmatn', sans-serif",
                  fontWeight: 800,
                  textShadow: "0 2px 12px rgba(196,154,44,0.5), 0 4px 24px rgba(196,154,44,0.3)",
                }}
              >
                پمپ‌های صنعتی بزرگ
              </motion.span>

              {/* Line 3 - White Medium */}
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.9 }}
                className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-5xl text-white leading-[1.4] text-center"
                style={{
                  fontFamily: "'IRANSansX', 'Vazirmatn', sans-serif",
                  fontWeight: 700,
                  textShadow: "0 2px 8px rgba(0,0,0,0.5), 0 4px 16px rgba(0,0,0,0.3)",
                }}
              >
                برای حیاتی‌ترین صنایع ایران
              </motion.span>
            </h1>

            {/* Description - centered */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.1 }}
              className="text-xs sm:text-sm md:text-base text-gray-400/80 leading-relaxed max-w-2xl mb-6 md:mb-8 text-center"
              style={{
                fontFamily: "'IRANSansX', 'Vazirmatn', sans-serif",
                fontWeight: 400,
              }}
            >
              {aboutText}
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.3 }}
              className="flex flex-wrap gap-2 md:gap-3 justify-center"
            >
                <Link
                  href="/products"
                  className="group inline-flex items-center gap-2 bg-[#c49a2c] hover:bg-[#d4a82c] text-black px-5 md:px-6 py-2.5 md:py-3 rounded-lg font-bold text-sm md:text-base transition-all duration-300 hover:shadow-xl hover:shadow-[#c49a2c]/30 hover:-translate-y-0.5 active:scale-95"
                  aria-label="مشاهده محصولات پمپ صنعتی"
                  style={{ fontFamily: "'IRANSansX', sans-serif", fontWeight: 700 }}
                >
                  مشاهده محصولات
                  <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
                </Link>
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-2 border border-white/30 hover:border-white/60 text-white px-5 md:px-6 py-2.5 md:py-3 rounded-lg font-bold text-sm md:text-base transition-all duration-300 hover:bg-white/5 hover:-translate-y-0.5 active:scale-95 backdrop-blur-sm"
                  aria-label="درخواست مشاوره فنی رایگان"
                  style={{ fontFamily: "'IRANSansX', sans-serif", fontWeight: 700 }}
                >
                  درخواست مشاوره
                </Link>
              </motion.div>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="w-full px-4 md:px-10 lg:px-14 pb-6 md:pb-8 flex flex-col items-center gap-5 md:gap-6">
          {/* Slide Indicators */}
          {!heroVideoUrl && (
            <div className="flex items-center gap-2 md:gap-3">
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center transition-all"
                aria-label={isPaused ? "شروع اسلایدر" : "توقف اسلایدر"}
              >
                {isPaused ? <Play size={10} className="text-white/70" /> : <Pause size={10} className="text-white/70" />}
              </button>
              <div className="flex items-center gap-1.5 md:gap-2">
                {processedSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-1.5 md:h-2 rounded-full transition-all duration-300 ${
                      index === currentSlide
                        ? "bg-[#c49a2c] w-6 md:w-8 shadow-lg shadow-[#c49a2c]/50"
                        : "bg-white/30 hover:bg-white/50 w-1.5 md:w-2"
                    }`}
                    aria-label={`رفتن به اسلاید ${index + 1} از ${processedSlides.length}`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Scroll Indicator */}
          <button
            onClick={() => window.scrollBy({ top: viewportHeight, behavior: "smooth" })}
            className="flex flex-col items-center gap-1 cursor-pointer group"
            aria-label="اسکرول به پایین"
          >
            <div className="animate-bounce">
              <div className="w-4 h-7 md:w-5 md:h-8 rounded-full border-2 border-white/40 flex items-start justify-center pt-1 md:pt-1.5 group-hover:border-[#c49a2c]/60 transition-colors">
                <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-white/60 group-hover:bg-[#c49a2c] transition-colors" />
              </div>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}