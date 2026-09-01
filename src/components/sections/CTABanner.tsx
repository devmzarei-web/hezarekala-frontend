"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Phone, MessageSquare } from "lucide-react";
import type { Settings } from "@/payload-types";

interface CTABannerProps {
  settings: Settings | null;
}

export default function CTABanner({ settings }: CTABannerProps) {
  return (
    <section className="relative py-14 md:py-20 bg-gradient-to-r from-[#c49a2c] via-[#d4a82c] to-[#c49a2c] overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-white/5 rounded-full blur-3xl" />
      <div className="absolute top-6 right-6 w-12 h-12 md:w-20 md:h-20 bg-white/10 rounded-full blur-xl" />
      <div className="absolute bottom-6 left-6 w-8 h-8 md:w-16 md:h-16 bg-black/10 rounded-full blur-xl" />

      <div className="relative z-10 w-full px-4 md:px-8 lg:px-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-[#0a1628] mb-3 md:mb-4 text-shadow-light">
            نیاز به مشاوره فنی دارید؟
          </h2>
          <p className="text-[#0a1628]/70 text-sm md:text-lg mb-6 md:mb-8 max-w-xl mx-auto">
            کارشناسان ما آماده پاسخگویی به سوالات شما هستند. همین امروز تماس بگیرید.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-3 md:gap-4 justify-center"
        >
          <a
            href={`tel:${settings?.phone || "09166310631"}`}
            className="group inline-flex items-center gap-2 md:gap-3 bg-[#0a1628] hover:bg-black text-white px-5 md:px-8 py-3 md:py-4 rounded-xl font-bold text-sm md:text-base transition-all hover:shadow-2xl hover:shadow-black/20 hover:-translate-y-0.5 active:scale-95"
          >
            <Phone size={16} className="md:size-18 group-hover:scale-110 transition-transform" />
            <span dir="ltr">{settings?.phone || "۰۹۱۶۶۳۱۰۶۳۱"}</span>
          </a>
          <Link
            href="/contact"
            className="group inline-flex items-center gap-2 md:gap-3 bg-white hover:bg-gray-50 text-[#0a1628] px-5 md:px-8 py-3 md:py-4 rounded-xl font-bold text-sm md:text-base transition-all hover:shadow-2xl hover:shadow-black/10 hover:-translate-y-0.5 active:scale-95"
          >
            <MessageSquare size={16} className="md:size-18 group-hover:scale-110 transition-transform" />
            <span>ارسال پیام</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}