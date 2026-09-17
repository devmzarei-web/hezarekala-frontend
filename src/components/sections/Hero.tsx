"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Play, Pause } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Settings } from "@/payload-types";
import { getMediaUrl } from "@/lib/media";

export interface HeroSlideData {
  image: string;
  video?: string | null;
  title?: string | null;
  badge?: string | null;
  titleLine1?: string | null;
  titleHighlight?: string | null;
  titleLine3?: string | null;
  description?: string | null;
  primaryCtaText?: string | null;
  primaryCtaLink?: string | null;
  secondaryCtaText?: string | null;
  secondaryCtaLink?: string | null;
}

export interface HeroVideoData {
  videoUrl: string;
  badge?: string | null;
  titleLine1?: string | null;
  titleHighlight?: string | null;
  titleLine3?: string | null;
  description?: string | null;
  primaryCtaText?: string | null;
  primaryCtaLink?: string | null;
  secondaryCtaText?: string | null;
  secondaryCtaLink?: string | null;
}

interface HeroProps {
  slides?: HeroSlideData[];
  heroVideoUrl?: string | null;
  heroVideo?: HeroVideoData | null;
  settings?: Settings | null;
}

const DEFAULT_BRAND_COPY = {
  badge: "بیش از ۷ سال تجربه در صنعت پمپ‌سازی",
  titleLine1: "طراحی و ساخت",
  titleHighlight: "پمپ‌های صنعتی بزرگ",
  titleLine3: "برای حیاتی‌ترین صنایع ایران",
  description:
    "هزاره کالا با تکیه بر دانش فنی پیشرفته، تیم مهندسی متخصص و تجهیزات مدرن، پمپ‌های سانتریفیوژ، پیستونی، خودمکش و دنده‌ای را برای صنایع نفت، گاز، پتروشیمی و نیروگاهی تولید می‌کند.",
  primaryCtaText: "مشاهده محصولات",
  primaryCtaLink: "/products",
  secondaryCtaText: "درخواست مشاوره",
  secondaryCtaLink: "/contact",
};

const DEFAULT_SLIDES: HeroSlideData[] = [
  {
    image: "/images/hero-bg.jpg",
    title: "طراحی و ساخت پمپ‌های فشار قوی",
    ...DEFAULT_BRAND_COPY,
  },
  {
    image: "/images/hero-bg-2.jpg",
    title: "تولید پمپ‌های دنده‌ای صنعتی",
    badge: "تجهیزات سنگین و پیشرفته کارخانه آبادان",
    titleLine1: "ماشین‌کاری فوق‌سنگین CNC",
    titleHighlight: "تراشکاری قطعات تا ۲۰ تن و طول ۶ متر",
    titleLine3: "با بالاترین دقت و استانداردهای صنعتی",
    description:
      "کارگاه تخصصی ماشین‌کاری با دستگاه‌های سنگین‌تراش تا قطر ۱.۸ متر، فرز ۴ محوره CNC تا ۱۲ تن، وایرکات و سوراخ‌کاری رادیال با بازوی ۴ متر.",
    primaryCtaText: "مشاهده توانمندی‌ها",
    primaryCtaLink: "/capabilities",
    secondaryCtaText: "مشاوره مهندسی",
    secondaryCtaLink: "/contact",
  },
  {
    image: "/images/hero-bg-3.jpg",
    title: "مونتاژ و تست پمپ‌های پیستونی",
    badge: "واحد مبدل‌شاپ و ژنراتورهای صنعتی",
    titleLine1: "ساخت و اورهال مبدل‌های حرارتی",
    titleHighlight: "و پکیج‌های دیزل ژنراتور موتورسازان",
    titleLine3: "توان ۲۵ الی ۱۵۰ کاوا با تحویل فوری",
    description:
      "طراحی و ریتوب مبدل‌های پوسته و لوله، نورد ورق تا ضخامت ۶۰ میلی‌متر، ساخت مخازن تحت فشار و عرضه انواع دیزل ژنراتور و موتورهای صنعتی موتورسازان تبریز.",
    primaryCtaText: "درخواست استعلام قیمت",
    primaryCtaLink: "/contact",
    secondaryCtaText: "کاتالوگ توانمندی‌ها",
    secondaryCtaLink: "/capabilities",
  },
];

export default function Hero({
  slides = DEFAULT_SLIDES,
  heroVideoUrl = null,
  heroVideo = null,
  settings,
}: HeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [loadedSlides, setLoadedSlides] = useState<Set<number>>(new Set([0]));
  const [videoLoaded, setVideoLoaded] = useState<Set<number>>(new Set());
  const [mainVideoLoaded, setMainVideoLoaded] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(0);
  const preloadedRef = useRef<Set<number>>(new Set([0]));
  const videoRefs = useRef<Map<number, HTMLVideoElement>>(new Map());
  const mainVideoRef = useRef<HTMLVideoElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const effectiveVideoUrl = heroVideo?.videoUrl || heroVideoUrl || null;
  const isVideoMode = Boolean(effectiveVideoUrl);

  const rawSlides = slides && slides.length > 0 ? slides : DEFAULT_SLIDES;

  useEffect(() => {
    const setHeight = () => setViewportHeight(window.innerHeight);
    setHeight();
    window.addEventListener("resize", setHeight);
    return () => window.removeEventListener("resize", setHeight);
  }, []);

  const processedSlides = rawSlides.map((slide) => {
    const imageUrl = getMediaUrl(slide.image);
    const videoUrl = slide.video ? getMediaUrl(slide.video) : null;

    return { ...slide, image: imageUrl, video: videoUrl };
  });

  // Preload next slides
  useEffect(() => {
    if (isVideoMode) return;
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
  }, [currentSlide, processedSlides, isVideoMode]);

  // Handle slide transitions and auto-rotation
  const goToSlide = (nextIndex: number) => {
    if (nextIndex === currentSlide) return;
    setDirection(nextIndex > currentSlide ? 1 : -1);
    setCurrentSlide(nextIndex);
  };

  useEffect(() => {
    if (isVideoMode || isPaused || processedSlides.length <= 1) return;
    intervalRef.current = setInterval(() => {
      setDirection(1);
      setCurrentSlide((prev) => (prev + 1) % processedSlides.length);
    }, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [processedSlides.length, isVideoMode, isPaused]);

  // Video autoplay per slide
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
      el.addEventListener("canplay", () => setVideoLoaded((prev) => new Set([...prev, index])));
      if (el.readyState >= 2) setVideoLoaded((prev) => new Set([...prev, index]));
    }
  };

  // Determine active slide copy or video copy
  const activeSlide = processedSlides[currentSlide] || processedSlides[0];

  const isAnySlideConfigured = processedSlides.some((s) =>
    Boolean(
      s.titleLine1?.trim() ||
      s.titleHighlight?.trim() ||
      s.titleLine3?.trim() ||
      s.description?.trim() ||
      s.badge?.trim()
    )
  );

  const activeSlideHasText = Boolean(
    activeSlide?.titleLine1?.trim() ||
    activeSlide?.titleHighlight?.trim() ||
    activeSlide?.titleLine3?.trim() ||
    activeSlide?.description?.trim() ||
    activeSlide?.badge?.trim()
  );

  const videoHasText = Boolean(
    heroVideo?.titleLine1?.trim() ||
    heroVideo?.titleHighlight?.trim() ||
    heroVideo?.titleLine3?.trim() ||
    heroVideo?.description?.trim() ||
    heroVideo?.badge?.trim()
  );

  let displayCopy: {
    badge?: string | null;
    titleLine1?: string | null;
    titleHighlight?: string | null;
    titleLine3?: string | null;
    description?: string | null;
    primaryCtaText?: string | null;
    primaryCtaLink?: string | null;
    secondaryCtaText?: string | null;
    secondaryCtaLink?: string | null;
  } | null = null;

  if (isVideoMode) {
    displayCopy = videoHasText ? heroVideo! : DEFAULT_BRAND_COPY;
  } else {
    if (activeSlideHasText) {
      displayCopy = activeSlide;
    } else if (!isAnySlideConfigured) {
      displayCopy = DEFAULT_BRAND_COPY;
    } else {
      displayCopy = null; // Clean visual slide mode
    }
  }

  // Framer motion variants for directional slide text
  const textContainerVariants = {
    enter: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? 40 : -40,
    }),
    center: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut" as const,
      },
    },
    exit: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? -40 : 40,
      transition: {
        duration: 0.3,
        ease: "easeIn" as const,
      },
    }),
  };

  return (
    <section
      className="relative overflow-hidden w-full"
      style={{ height: viewportHeight > 0 ? `${viewportHeight}px` : "100vh" }}
      dir="rtl"
      aria-label="اسلایدر معرفی شرکت هزاره کالا دانش اروند"
    >
      {/* Background Video (Standalone Video Mode) */}
      {effectiveVideoUrl && (
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
          <source src={effectiveVideoUrl} type="video/mp4" />
        </video>
      )}

      {effectiveVideoUrl && !mainVideoLoaded && (
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: `url('${processedSlides[0]?.image}')` }}
        />
      )}

      {/* Slide Backgrounds (Carousel Mode) */}
      {!effectiveVideoUrl &&
        processedSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            {slide.video && (
              <video
                ref={(el) => setVideoRef(index, el)}
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
      {!effectiveVideoUrl &&
        processedSlides.map((slide, index) =>
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

      {/* Cinematic Dark Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#060f1c]/80 via-[#060f1c]/45 to-[#060f1c]/95 z-10" />
      <div className="absolute inset-0 bg-[#060f1c] -z-10" />

      {/* Content Container */}
      <div className="relative z-30 h-full flex flex-col justify-between">
        {/* Header Spacing */}
        <div className="pt-20 md:pt-24 lg:pt-28" />

        {/* Main Content Area */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full px-4 md:px-8 lg:px-16 xl:px-20 max-w-5xl mx-auto text-center flex flex-col items-center">
            <AnimatePresence mode="wait" custom={direction}>
              {displayCopy && (
                <motion.div
                  key={isVideoMode ? "video-content" : `slide-content-${currentSlide}`}
                  custom={direction}
                  variants={textContainerVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="w-full flex flex-col items-center"
                >
                  {/* Pill Badge */}
                  {displayCopy.badge && (
                    <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 text-[#c49a2c] px-4 md:px-5 py-1.5 md:py-2 rounded-full text-xs md:text-sm mb-5 md:mb-6 backdrop-blur-md shadow-lg">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c49a2c] opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#c49a2c]" />
                      </span>
                      <span
                        className="font-bold tracking-wide"
                        style={{ fontFamily: "'IRANSansX', 'Vazirmatn', sans-serif" }}
                      >
                        {displayCopy.badge}
                      </span>
                    </div>
                  )}

                  {/* 3-Tier Dynamic Headline */}
                  <h1 className="mb-4 md:mb-5 text-center flex flex-col items-center gap-1 md:gap-2">
                    {/* Line 1 - White Bold */}
                    {displayCopy.titleLine1 && (
                      <span
                        className="block text-2xl sm:text-3xl md:text-5xl lg:text-6xl text-white leading-[1.3] text-center"
                        style={{
                          fontFamily: "'IRANSansX', 'Vazirmatn', sans-serif",
                          fontWeight: 800,
                          textShadow: "0 2px 8px rgba(0,0,0,0.6), 0 4px 16px rgba(0,0,0,0.4)",
                        }}
                      >
                        {displayCopy.titleLine1}
                      </span>
                    )}

                    {/* Line 2 - Gold Accent Highlight */}
                    {displayCopy.titleHighlight && (
                      <span
                        className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-[#c49a2c] leading-[1.35] text-center"
                        style={{
                          fontFamily: "'IRANSansX', 'Vazirmatn', sans-serif",
                          fontWeight: 900,
                          textShadow:
                            "0 2px 12px rgba(196,154,44,0.6), 0 4px 28px rgba(196,154,44,0.35)",
                        }}
                      >
                        {displayCopy.titleHighlight}
                      </span>
                    )}

                    {/* Line 3 - White Subtitle */}
                    {displayCopy.titleLine3 && (
                      <span
                        className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white/95 leading-[1.4] text-center"
                        style={{
                          fontFamily: "'IRANSansX', 'Vazirmatn', sans-serif",
                          fontWeight: 700,
                          textShadow: "0 2px 8px rgba(0,0,0,0.6), 0 4px 16px rgba(0,0,0,0.4)",
                        }}
                      >
                        {displayCopy.titleLine3}
                      </span>
                    )}
                  </h1>

                  {/* Descriptive Paragraph */}
                  {displayCopy.description && (
                    <p
                      className="text-xs sm:text-sm md:text-base text-gray-300/90 leading-relaxed max-w-3xl mb-6 md:mb-8 text-center"
                      style={{
                        fontFamily: "'IRANSansX', 'Vazirmatn', sans-serif",
                        fontWeight: 400,
                      }}
                    >
                      {displayCopy.description}
                    </p>
                  )}

                  {/* Dynamic CTA Buttons */}
                  {(displayCopy.primaryCtaText || displayCopy.secondaryCtaText) && (
                    <div className="flex flex-wrap gap-3 md:gap-4 justify-center items-center">
                      {displayCopy.primaryCtaText && displayCopy.primaryCtaLink && (
                        <Link
                          href={displayCopy.primaryCtaLink}
                          className="group inline-flex items-center gap-2 bg-[#c49a2c] hover:bg-[#d4a82c] text-black px-6 md:px-7 py-3 md:py-3.5 rounded-xl font-bold text-sm md:text-base transition-all duration-300 hover:shadow-xl hover:shadow-[#c49a2c]/30 hover:-translate-y-0.5 active:scale-95 cursor-pointer"
                          style={{ fontFamily: "'IRANSansX', sans-serif", fontWeight: 700 }}
                        >
                          {displayCopy.primaryCtaText}
                          <ArrowLeft
                            size={18}
                            className="group-hover:-translate-x-1.5 transition-transform"
                            aria-hidden="true"
                          />
                        </Link>
                      )}

                      {displayCopy.secondaryCtaText && displayCopy.secondaryCtaLink && (
                        <Link
                          href={displayCopy.secondaryCtaLink}
                          className="group inline-flex items-center gap-2 border border-white/30 hover:border-[#c49a2c]/80 text-white hover:text-[#c49a2c] px-6 md:px-7 py-3 md:py-3.5 rounded-xl font-bold text-sm md:text-base transition-all duration-300 hover:bg-white/5 hover:-translate-y-0.5 active:scale-95 backdrop-blur-md cursor-pointer"
                          style={{ fontFamily: "'IRANSansX', sans-serif", fontWeight: 700 }}
                        >
                          {displayCopy.secondaryCtaText}
                        </Link>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom Navigation & Controls */}
        <div className="w-full px-4 md:px-8 lg:px-16 xl:px-20 pb-6 md:pb-8 flex flex-col items-center gap-5 md:gap-6">
          {/* Slide Indicators with 5-Second Linear Progress Fill */}
          {!effectiveVideoUrl && processedSlides.length > 1 && (
            <div className="flex items-center gap-3 md:gap-4 bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
              {/* Play / Pause Toggle Button */}
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/25 border border-white/15 flex items-center justify-center transition-all cursor-pointer text-white/80 hover:text-white"
                aria-label={isPaused ? "ادامه چرخش اسلایدر" : "توقف چرخش اسلایدر"}
              >
                {isPaused ? <Play size={11} /> : <Pause size={11} />}
              </button>

              {/* Progress Indicators */}
              <div className="flex items-center gap-2">
                {processedSlides.map((_, index) => {
                  const isActive = index === currentSlide;
                  return (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`h-2 rounded-full transition-all duration-300 relative overflow-hidden cursor-pointer ${
                        isActive
                          ? "w-10 md:w-14 bg-white/20 shadow-sm"
                          : "w-2.5 bg-white/30 hover:bg-white/60"
                      }`}
                      aria-label={`رفتن به اسلاید ${index + 1} از ${processedSlides.length}`}
                    >
                      {isActive && (
                        <motion.div
                          key={`progress-${currentSlide}-${isPaused}`}
                          className="h-full bg-[#c49a2c] rounded-full"
                          initial={{ width: "0%" }}
                          animate={{ width: isPaused ? "0%" : "100%" }}
                          transition={{
                            duration: 5,
                            ease: "linear",
                          }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Scroll Down Cue */}
          <button
            onClick={() => window.scrollBy({ top: viewportHeight, behavior: "smooth" })}
            className="flex flex-col items-center gap-1 cursor-pointer group"
            aria-label="اسکرول به بخش بعدی"
          >
            <div className="animate-bounce">
              <div className="w-5 h-8 rounded-full border-2 border-white/40 flex items-start justify-center pt-1.5 group-hover:border-[#c49a2c]/80 transition-colors">
                <div className="w-1.5 h-1.5 rounded-full bg-white/70 group-hover:bg-[#c49a2c] transition-colors" />
              </div>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}
