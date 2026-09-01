"use client";

import { motion } from "framer-motion";
import type { WhyUsCard } from "@/payload-types";
import { Cog, Shield, Zap, Headphones, type LucideIcon } from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  engineering: Cog, quality: Shield, speed: Zap, support: Headphones,
};

interface WhyUsProps {
  title: string;
  subtitle?: string;
  theme: 'dark' | 'light';
  backgroundImage?: string | null;
  cards: WhyUsCard[];
}

export default function WhyUs({ title, subtitle, theme, backgroundImage, cards }: WhyUsProps) {
  if (cards.length === 0) return null;

  const isDark = theme === 'dark';
  const bgClass = isDark ? 'bg-[#0a1628]' : 'bg-white';
  const titleClass = isDark ? 'text-white section-title-dark' : 'text-[#0a1628] section-title-light';
  const subClass = isDark ? 'text-gray-400' : 'text-gray-500';
  // Cards are always dark navy with gold accents
  const cardBg = 'bg-[#0d1f33] border-white/[0.04]';
  const cardHover = 'hover:border-[#c49a2c]/20 hover:bg-[#10243d]';

  return (
    <section className={`relative py-16 md:py-24 overflow-hidden ${bgClass}`} aria-labelledby="why-us-heading">
      {backgroundImage && (
        <div className="absolute inset-0 opacity-5">
          <img src={backgroundImage} alt="" className="w-full h-full object-cover" />
        </div>
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
            چرا هزاره کالا؟
          </span>
          <h2 className={`section-title text-3xl md:text-5xl lg:text-6xl mt-3 md:mt-4 mb-4 md:mb-6 ${titleClass}`}>
            {title}
          </h2>
          {subtitle && (
            <p className={`max-w-2xl mx-auto text-sm md:text-lg ${subClass}`}>
              {subtitle}
            </p>
          )}
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {cards.map((card, index) => {
            const IconComponent = ICON_MAP[card.icon] || Cog;
            return (
              <motion.div
                key={card.id || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className="group"
              >
                <div className={`relative h-full ${cardBg} rounded-2xl p-5 md:p-8 transition-all duration-300 ${cardHover} hover:-translate-y-1 shadow-lg`}>
                  {/* Gold glow on hover */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#c49a2c]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  
                  <div className="relative z-10">
                    {/* Icon */}
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-[#c49a2c]/20 to-[#c49a2c]/5 rounded-xl flex items-center justify-center mb-4 md:mb-5 group-hover:from-[#c49a2c] group-hover:to-[#d4a82c] group-hover:scale-110 transition-all duration-500">
                      <IconComponent className="w-6 h-6 md:w-7 md:h-7 text-[#c49a2c] group-hover:text-white transition-colors" />
                    </div>
                    
                    {/* Title */}
                    <h3 className="card-title text-lg md:text-xl text-white mb-2 md:mb-3 group-hover:text-[#c49a2c] transition-colors">
                      {card.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}