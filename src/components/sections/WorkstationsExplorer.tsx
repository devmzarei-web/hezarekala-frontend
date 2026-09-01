"use client";

import { useState } from "react";
import {
  Cog,
  Wrench,
  Gauge,
  ShieldCheck,
  CheckCircle2,
  Factory,
  Layers,
  ZoomIn,
  Sparkles,
  Maximize2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getMediaUrl } from "@/lib/media";
import ImageLightbox, { type LightboxImage } from "@/components/ui/ImageLightbox";

export interface WorkstationData {
  id?: string;
  title: string;
  description: string;
  equipment?: string;
  capacity?: string;
  image?: Parameters<typeof getMediaUrl>[0];
  icon?: string;
}

interface WorkstationsExplorerProps {
  workstations: WorkstationData[];
  sectionTitle?: string;
  sectionSubtitle?: string;
}

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  machining: Cog,
  testing: Gauge,
  balancing: CheckCircle2,
  qc: ShieldCheck,
  assembly: Wrench,
  engineering: Layers,
  facility: Factory,
  default: Factory,
};

export default function WorkstationsExplorer({
  workstations = [],
  sectionTitle = "ایستگاه‌های کاری و خطوط تولید کارخانه",
  sectionSubtitle = "زیرساخت‌های تخصصی، ماشین‌آلات پیشرفته و فرآیندهای ساخت پمپ‌های سنگین",
}: WorkstationsExplorerProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (!workstations || workstations.length === 0) return null;

  const currentWorkstation = workstations[activeIndex] || workstations[0];
  const IconComponent =
    ICON_MAP[currentWorkstation.icon || ""] || ICON_MAP.default;

  const imageUrl = currentWorkstation.image
    ? getMediaUrl(currentWorkstation.image)
    : "/images/placeholder.jpg";

  // Build lightbox images from workstations
  const lightboxImages: LightboxImage[] = workstations
    .filter((w) => Boolean(w.image))
    .map((w) => ({
      url: getMediaUrl(w.image),
      thumbnailUrl: getMediaUrl(w.image),
      title: w.title,
      alt: `${w.title} - ${w.equipment || ""}`,
      categoryLabel: "کارگاه و خط تولید",
    }));

  const openLightboxForCurrent = () => {
    if (lightboxImages.length > 0) {
      setLightboxOpen(true);
    }
  };

  return (
    <section className="py-16 md:py-24 bg-gray-50/70 border-y border-gray-100" dir="rtl" aria-labelledby="workstations-heading">
      <div className="w-full px-4 sm:px-6 md:px-12 lg:px-16 max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <span className="text-[#c49a2c] text-xs sm:text-sm font-bold uppercase tracking-wider block mb-2">
            فضاهای کاری و تجهیزات صنعتی
          </span>
          <h2 id="workstations-heading" className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0a1628]">
            {sectionTitle}
          </h2>
          <p className="text-gray-500 text-sm sm:text-base mt-3 leading-relaxed">
            {sectionSubtitle}
          </p>
        </div>

        {/* Interactive Explorer Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Navigation Tabs (Right Column in RTL) */}
          <div className="lg:col-span-4 flex flex-row lg:flex-col gap-2.5 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-none">
            {workstations.map((ws, idx) => {
              const TabIcon = ICON_MAP[ws.icon || ""] || ICON_MAP.default;
              const isActive = activeIndex === idx;

              return (
                <button
                  key={ws.id || idx}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  className={`shrink-0 w-full text-right p-4 sm:p-5 rounded-2xl border transition-all duration-300 flex items-center justify-between gap-3 cursor-pointer ${
                    isActive
                      ? "bg-[#060f1c] text-white border-[#060f1c] shadow-lg shadow-black/10 scale-[1.01]"
                      : "bg-white text-gray-700 border-gray-100 hover:border-[#c49a2c]/30 hover:bg-gray-50/80"
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        isActive
                          ? "bg-[#c49a2c] text-black"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      <TabIcon size={20} />
                    </div>
                    <div className="min-w-0">
                      <h3
                        className={`text-xs sm:text-sm font-bold truncate ${
                          isActive ? "text-white" : "text-[#0a1628]"
                        }`}
                      >
                        {ws.title}
                      </h3>
                      {ws.equipment && (
                        <p
                          className={`text-[11px] truncate mt-0.5 ${
                            isActive ? "text-gray-300" : "text-gray-400"
                          }`}
                        >
                          {ws.equipment}
                        </p>
                      )}
                    </div>
                  </div>

                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      isActive ? "bg-[#c49a2c]" : "bg-transparent"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Active Workstation Display Stage (Left Column in RTL) */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="bg-white rounded-3xl overflow-hidden border border-gray-200/80 shadow-md flex flex-col"
              >
                {/* Image Stage */}
                <div
                  className="relative aspect-[16/9] sm:aspect-[21/9] lg:aspect-[16/9] bg-gray-900 overflow-hidden cursor-pointer group"
                  onClick={openLightboxForCurrent}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt={currentWorkstation.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Badges on image */}
                  <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 bg-[#060f1c]/90 text-[#e5c158] border border-[#c49a2c]/30 text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-md">
                      <IconComponent size={14} className="text-[#c49a2c]" />
                      <span>ایستگاه تخصصی</span>
                    </span>
                  </div>

                  {/* Zoom indicator on hover */}
                  <div className="absolute top-4 left-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="inline-flex items-center gap-1.5 bg-black/70 text-white text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-md shadow-md">
                      <ZoomIn size={14} />
                      <span>بزرگ‌نمایی تصویر</span>
                    </span>
                  </div>

                  {/* Title overlay on image bottom */}
                  <div className="absolute bottom-4 right-4 left-4 z-10">
                    <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                      {currentWorkstation.title}
                    </h3>
                  </div>
                </div>

                {/* Details Body */}
                <div className="p-6 sm:p-8 space-y-6">
                  {/* Narrative Description */}
                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed text-justify">
                    {currentWorkstation.description}
                  </p>

                  {/* Specifications & Equipment Grid */}
                  {(currentWorkstation.equipment || currentWorkstation.capacity) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                      {currentWorkstation.equipment && (
                        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                          <span className="block text-xs font-bold text-gray-500 mb-1 flex items-center gap-1.5">
                            <Wrench size={13} className="text-[#c49a2c]" />
                            <span>تجهیزات و دستگاه‌های مستقر</span>
                          </span>
                          <span className="block text-xs sm:text-sm font-bold text-[#0a1628] leading-relaxed">
                            {currentWorkstation.equipment}
                          </span>
                        </div>
                      )}

                      {currentWorkstation.capacity && (
                        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                          <span className="block text-xs font-bold text-gray-500 mb-1 flex items-center gap-1.5">
                            <Gauge size={13} className="text-[#c49a2c]" />
                            <span>ظرفیت و استاندارد عملیاتی</span>
                          </span>
                          <span className="block text-xs sm:text-sm font-bold text-[#0a1628] leading-relaxed">
                            {currentWorkstation.capacity}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Lightbox for Workstations */}
      {lightboxImages.length > 0 && (
        <ImageLightbox
          images={lightboxImages}
          initialIndex={activeIndex}
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </section>
  );
}
