"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Sparkles, Video } from "lucide-react";
import type { Album } from "@/payload-types";
import { getMediaUrl } from "@/lib/media";

export interface EventSpotlightCapsuleProps {
  album?: Album | null;
  className?: string;
}

export default function EventSpotlightCapsule({
  album,
  className = "",
}: EventSpotlightCapsuleProps) {
  if (!album) return null;

  const coverUrl = getMediaUrl(album.coverImage);
  const href = `/gallery?album=${encodeURIComponent(album.slug)}`;

  return (
    <div className={`w-full max-w-3xl mx-auto px-2 ${className}`}>
      <Link
        href={href}
        className="group relative flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 p-2.5 sm:p-2 sm:pr-4 sm:pl-3 rounded-2xl sm:rounded-full bg-[#060f1c]/90 hover:bg-[#091528]/95 border border-[#c49a2c]/30 hover:border-[#c49a2c]/70 backdrop-blur-xl shadow-2xl shadow-black/60 hover:shadow-[#c49a2c]/15 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] text-right"
        style={{ fontFamily: "'IRANSansX', 'Vazirmatn', sans-serif" }}
      >
        {/* Right Section: Pulsing Tag + Thumbnail + Headline */}
        <div className="flex items-center gap-3 w-full sm:w-auto overflow-hidden">
          {/* Pulsing Tag */}
          <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#c49a2c]/15 border border-[#c49a2c]/30 shrink-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c49a2c] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#c49a2c]" />
            </span>
            <span className="text-[11px] font-bold text-[#e0b74c] whitespace-nowrap">
              پوشش رسانه‌ای ویژه
            </span>
          </div>

          {/* Thumbnail */}
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-full overflow-hidden border border-[#c49a2c]/40 shrink-0 bg-black/40">
            <Image
              src={coverUrl}
              alt={album.title}
              fill
              sizes="48px"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>

          {/* Headline and Mobile Tag */}
          <div className="flex flex-col min-w-0">
            <div className="flex sm:hidden items-center gap-1.5 mb-0.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c49a2c] opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#c49a2c]" />
              </span>
              <span className="text-[10px] font-bold text-[#e0b74c]">
                پوشش رسانه‌ای ویژه
              </span>
              {album.videoUrl && (
                <span className="inline-flex items-center gap-0.5 text-[9px] text-red-300 bg-red-950/60 px-1.5 py-0.2 rounded">
                  <Video size={10} className="text-red-400" />
                  ویدیو
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm font-bold text-white group-hover:text-[#e0b74c] transition-colors truncate">
              {album.title}
            </p>
          </div>
        </div>

        {/* Left Section: Action Button */}
        <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10 shrink-0">
          <span className="text-[11px] sm:text-xs font-bold text-[#c49a2c] group-hover:text-white transition-colors whitespace-nowrap">
            مشاهده گزارش و تصاویر
          </span>
          <div className="w-7 h-7 rounded-full bg-[#c49a2c] text-[#060f1c] flex items-center justify-center transform transition-transform group-hover:-translate-x-1 duration-300 shadow-md">
            <ArrowLeft size={14} />
          </div>
        </div>
      </Link>
    </div>
  );
}
