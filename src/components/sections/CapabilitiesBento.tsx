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
  const cardBg = "bg-[#0d1f33] border-white/[0.04]";
  const cardHover = "hover:border-[#c49a2c]/40 hover:bg-[#10243d]";

  const getSizeClass = (size: string) => {
    switch (size) {
      case "large":
        return "md:col-span-2 md:row-span-2";
      case "tall":
        return "md:row-span-2";
      default:
        return "";
    }
  };

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

      <div className="relative z-10 w-full px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 md:mb-14"
        >
          <span className="text-[#c49a2c] text-xs md:text-sm font-bold uppercase tracking-widest">
            زیرساخت و تجهیزات کارخانه‌ای
          </span>
          <h2
            id="capabilities-heading"
            className={`section-title text-2xl md:text-4xl lg:text-5xl mt-3 md:mt-4 mb-4 md:mb-6 font-extrabold ${titleClass}`}
          >
            {title}
          </h2>
          {subtitle && (
            <p className={`max-w-3xl mx-auto text-sm md:text-base leading-relaxed ${subClass}`}>
              {subtitle}
            </p>
          )}
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {items.map((item, index) => {
            const IconComponent = ICON_MAP[item.icon] || Settings;
            const sizeClass = getSizeClass(item.size);
            const imageUrl = item.image ? getMediaUrl(item.image) : null;

            return (
              <motion.div
                key={item.id || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className={`group ${sizeClass}`}
              >
                <Link
                  href="/capabilities"
                  className="block h-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#c49a2c]"
                >
                  <div
                    className={`relative h-full ${cardBg} rounded-2xl overflow-hidden transition-all duration-300 ${cardHover} shadow-lg ${
                      imageUrl ? "p-0" : "p-5 md:p-8"
                    } border border-transparent`}
                  >
                    {imageUrl && (
                      <>
                        <img
                          src={imageUrl}
                          alt={item.title}
                          className="absolute inset-0 w-full h-full object-cover opacity-10 group-hover:opacity-20 group-hover:scale-105 transition-all duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/60 to-transparent" />
                      </>
                    )}

                    <div
                      className={`relative z-10 ${
                        imageUrl ? "p-5 md:p-8 flex flex-col justify-end h-full" : ""
                      }`}
                    >
                      <div className="w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br from-[#c49a2c]/20 to-[#c49a2c]/5 rounded-xl flex items-center justify-center mb-3 md:mb-4 group-hover:from-[#c49a2c] group-hover:to-[#d4a82c] group-hover:scale-110 transition-all duration-500">
                        <IconComponent className="w-5 h-5 md:w-7 md:h-7 text-[#c49a2c] group-hover:text-[#0a1628] transition-colors" />
                      </div>
                      <h3 className="card-title text-base md:text-xl text-white font-bold mb-1.5 md:mb-2 group-hover:text-[#c49a2c] transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-gray-400 text-xs md:text-sm leading-relaxed mb-4">
                        {item.description}
                      </p>
                      <div className="flex items-center text-xs font-semibold text-[#c49a2c] gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                        <span>مشاهده تجهیزات و مشخصات فنی</span>
                        <ArrowLeft size={13} className="group-hover:-translate-x-1 transition-transform" />
                      </div>
                    </div>

                    {/* Subtle border glow on hover */}
                    <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-[#c49a2c]/30 transition-all duration-500 pointer-events-none" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Action Link to Full Capabilities */}
        <div className="mt-10 md:mt-14 text-center">
          <Link
            href="/capabilities"
            className="inline-flex items-center gap-2 bg-[#0a1628] hover:bg-[#10243d] text-white font-bold text-sm px-8 py-4 rounded-xl transition-all duration-200 border border-[#c49a2c]/40 shadow-lg shadow-[#0a1628]/10 group"
          >
            <span>مشاهده مشخصات فنی کامل ۷ واحد کارخانه و ماشین‌آلات</span>
            <ArrowLeft
              size={16}
              className="text-[#c49a2c] group-hover:-translate-x-1.5 transition-transform"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}