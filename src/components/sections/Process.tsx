"use client";

import { motion } from "framer-motion";
import type { ProcessStep } from "@/payload-types";
import { getMediaUrl } from "@/lib/media";
import { ClipboardList, PenTool, Hammer, FlaskConical, Truck, type LucideIcon } from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  analysis: ClipboardList, design: PenTool, build: Hammer, test: FlaskConical, deliver: Truck,
};

interface ProcessProps {
  title: string;
  subtitle?: string;
  theme: 'dark' | 'light';
  backgroundImage?: string | null;
  steps: ProcessStep[];
}

export default function Process({ title, subtitle, theme, backgroundImage, steps }: ProcessProps) {
  if (steps.length === 0) return null;

  const isDark = theme === 'dark';
  const bgClass = isDark ? 'bg-[#0a1628]' : 'bg-white';
  const overlayClass = isDark ? 'bg-[#0a1628]/85' : 'bg-white/85';
  const titleClass = isDark ? 'text-white section-title-dark' : 'text-[#0a1628] section-title-light';
  const subClass = isDark ? 'text-gray-400' : 'text-gray-500';
  const cardBg = isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-gray-50 border-gray-100';
  const cardHover = isDark ? 'hover:bg-white/[0.06] hover:border-[#c49a2c]/30' : 'hover:bg-white hover:border-[#c49a2c]/20 hover:shadow-lg';
  const cardTitleClass = isDark ? 'text-white' : 'text-[#0a1628]';
  const cardDescClass = isDark ? 'text-gray-400' : 'text-gray-500';

  const sortedSteps = [...steps].sort((a, b) => a.stepNumber - b.stepNumber);

  return (
    <section className={`relative py-16 md:py-24 overflow-hidden ${bgClass}`} aria-labelledby="process-heading">
      {backgroundImage && (
        <>
          <div className="absolute inset-0">
            <img src={backgroundImage} alt="" className="w-full h-full object-cover" />
          </div>
          <div className={`absolute inset-0 ${overlayClass} backdrop-blur-sm`} />
        </>
      )}

      <div className="relative z-10 w-full px-4 md:px-8 lg:px-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 md:mb-14"
        >
          <span className="text-[#c49a2c] text-xs md:text-sm font-bold uppercase tracking-widest">
            فرآیند ساخت
          </span>
          <h2 id="process-heading" className={`section-title text-3xl md:text-5xl lg:text-6xl mt-3 md:mt-4 mb-4 md:mb-6 ${titleClass}`}>
            {title}
          </h2>
          {subtitle && (
            <p className={`max-w-2xl mx-auto text-sm md:text-lg ${subClass}`}>
              {subtitle}
            </p>
          )}
        </motion.div>

        {/* Horizontal Steps - Left to Right (1→5) */}
        <div className="relative mx-auto">
          {/* Connection line - desktop only */}
          <div className="hidden lg:block absolute top-12 left-[8%] right-[8%] h-0.5 bg-gradient-to-l from-[#c49a2c]/20 via-[#c49a2c] to-[#c49a2c]/20" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
            {sortedSteps.map((step, index) => {
              const IconComponent = ICON_MAP[step.icon] || ClipboardList;

              return (
                <motion.div
                  key={step.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  className="group"
                >
                  <div className={`relative h-full ${cardBg} rounded-2xl p-4 md:p-6 transition-all duration-300 ${cardHover} hover:-translate-y-1`}>
                    {/* Step Number */}
                    <div className="absolute -top-2 -left-2 w-6 h-6 md:w-7 md:h-7 bg-[#c49a2c] rounded-full flex items-center justify-center text-black text-xs font-bold shadow-md shadow-[#c49a2c]/20">
                      {step.stepNumber}
                    </div>

                    {/* Icon */}
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-[#c49a2c]/20 to-transparent rounded-xl flex items-center justify-center mb-3 md:mb-4 group-hover:from-[#c49a2c] group-hover:scale-110 transition-all duration-500 mx-auto">
                      <IconComponent className="w-5 h-5 md:w-6 md:h-6 text-[#c49a2c] group-hover:text-white transition-colors" />
                    </div>

                    {/* Title */}
                    <h3 className={`card-title text-sm md:text-base text-center mb-1.5 md:mb-2 group-hover:text-[#c49a2c] transition-colors ${cardTitleClass}`}>
                      {step.title}
                    </h3>

                    {/* Duration */}
                    {step.duration && (
                      <div className="text-center mb-2">
                        <span className="inline-block text-[10px] md:text-xs text-[#c49a2c] bg-[#c49a2c]/10 px-2 py-0.5 md:px-3 md:py-1 rounded-full">
                          {step.duration}
                        </span>
                      </div>
                    )}

                    {/* Description */}
                    <p className={`text-[10px] md:text-xs text-center leading-relaxed ${cardDescClass}`}>
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}