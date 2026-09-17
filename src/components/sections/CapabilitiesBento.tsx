"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { CapabilityItem } from "@/payload-types";
import { getMediaUrl } from "@/lib/media";
import {
  PenTool,
  Wrench,
  FlaskConical,
  ShieldCheck,
  Rocket,
  Settings,
  ArrowLeft,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  design: PenTool,
  manufacturing: Wrench,
  testing: FlaskConical,
  "quality-ctrl": ShieldCheck,
  installation: Rocket,
  service: Settings,
};

interface CapabilitiesBentoProps {
  title: string;
  subtitle?: string;
  theme: "dark" | "light";
  backgroundImage?: string | null;
  items: CapabilityItem[];
}

export default function CapabilitiesBento({
  title,
  subtitle,
  theme,
  backgroundImage,
  items,
}: CapabilitiesBentoProps) {
  if (items.length === 0) return null;

  const isDark = theme === "dark";
  const bgClass = isDark ? "bg-[#0a1628]" : "bg-white";
  const titleClass = isDark
    ? "text-white section-title-dark"
    : "text-[#0a1628] section-title-light";
  const subClass = isDark ? "text-gray-400" : "text-gray-500";
  const cardBg = "bg-[#0d1f33] border border-white/[0.06]";
  const cardHover = "hover:border-[#c49a2c]/50 hover:bg-[#10243d] hover:shadow-2xl hover:shadow-[#0a1628]/40";

  return (
    <section
      className={`relative py-16 md:py-24 overflow-hidden ${bgClass}`}
      aria-labelledby="capabilities-heading"
    >
      {backgroundImage && (
        <div className="absolute inset-0 opacity-5">
          <img src={backgroundImage} alt="" className="w-full h-full object-cover" />
        </div>
      )}

      {/* ── 1920 Full Width Screen Container ── */}
      <div className="relative z-10 w-full px-4 md:px-8 lg:px-16 xl:px-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 md:mb-16 max-w-4xl mx-auto"
        >
          <span className="text-[#c49a2c] text-xs md:text-sm font-bold uppercase tracking-widest bg-[#c49a2c]/10 border border-[#c49a2c]/20 px-3.5 py-1 rounded-full">
            زیرساخت‌های مهندسی و ساخت کارخانه
          </span>
          <h2
            id="capabilities-heading"
            className={`section-title text-2xl md:text-4xl lg:text-5xl mt-4 mb-4 font-extrabold ${titleClass}`}
          >
            {title}
          </h2>
          {subtitle && (
            <p className={`text-sm md:text-base lg:text-lg leading-relaxed ${subClass}`}>
              {subtitle}
            </p>
          )}
        </motion.div>

        {/* ── Full Width Responsive Grid for 7 Industrial Divisions ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 lg:gap-6">
          {items.map((item, index) => {
            const IconComponent = ICON_MAP[item.icon] || Settings;
            const imageUrl = item.image ? getMediaUrl(item.image) : null;

            // Give the first 2 or 3 cards a wider presence on large screens if appropriate
            const isFeaturedCard = index === 0 || index === 1;
            const colSpanClass = isFeaturedCard
              ? "sm:col-span-2 lg:col-span-1 xl:col-span-2"
              : "col-span-1";

            return (
              <motion.div
                key={item.id || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.4 }}
                className={colSpanClass}
              >
                <Link
                  href="/capabilities"
                  className="block h-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#c49a2c] rounded-2xl group"
                >
                  <div
                    className={`relative h-full ${cardBg} rounded-2xl overflow-hidden transition-all duration-300 ${cardHover} ${
                      imageUrl ? "p-0" : "p-6 md:p-8"
                    } flex flex-col justify-between`}
                  >
                    {imageUrl && (
                      <>
                        <img
                          src={imageUrl}
                          alt={item.title}
                          className="absolute inset-0 w-full h-full object-cover opacity-15 group-hover:opacity-25 group-hover:scale-105 transition-all duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/75 to-transparent" />
                      </>
                    )}

                    <div className={`relative z-10 ${imageUrl ? "p-6 md:p-8 flex flex-col justify-end h-full" : ""}`}>
                      <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-[#c49a2c]/20 to-[#c49a2c]/5 rounded-xl flex items-center justify-center mb-4 group-hover:from-[#c49a2c] group-hover:to-[#d4a82c] group-hover:scale-110 transition-all duration-300 shadow-md">
                        <IconComponent className="w-6 h-6 md:w-7 md:h-7 text-[#c49a2c] group-hover:text-[#0a1628] transition-colors" />
                      </div>
                      <h3 className="text-lg md:text-xl font-bold text-white mb-2 group-hover:text-[#c49a2c] transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-gray-400 text-xs md:text-sm leading-relaxed mb-6">
                        {item.description}
                      </p>
                    </div>

                    <div className="relative z-10 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-bold text-[#c49a2c]">
                      <span>مشاهده تجهیزات و مشخصات فنی</span>
                      <ArrowLeft size={14} className="group-hover:-translate-x-1.5 transition-transform" />
                    </div>

                    {/* Subtle border glow on hover */}
                    <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-[#c49a2c]/40 transition-all duration-300 pointer-events-none" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* ── Full Width Bottom Action ── */}
        <div className="mt-12 md:mt-16 text-center">
          <Link
            href="/capabilities"
            className="inline-flex items-center gap-2.5 bg-[#0a1628] hover:bg-[#12223a] text-white font-bold text-sm md:text-base px-9 py-4 rounded-xl transition-all duration-200 border border-[#c49a2c]/50 shadow-xl shadow-[#0a1628]/20 group"
          >
            <span>مشاهده مشخصات فنی کامل ۷ واحد کارخانه و ماشین‌آلات</span>
            <ArrowLeft
              size={18}
              className="text-[#c49a2c] group-hover:-translate-x-1.5 transition-transform"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}