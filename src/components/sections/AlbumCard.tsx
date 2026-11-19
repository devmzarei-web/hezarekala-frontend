"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar, Camera, Video, ArrowLeft } from "lucide-react";
import type { Album } from "@/payload-types";
import { getMediaUrl } from "@/lib/media";

interface AlbumCardProps {
  album: Album;
  onSelect?: (album: Album) => void;
  href?: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  "media-coverage": "پوشش رسانه‌ای و خبری",
  workshop: "کارگاه و خط تولید",
  exhibition: "نمایشگاه‌های صنعتی",
  milestone: "افتخارات و دستاوردها",
  other: "رویداد سازمانی",
};

export default function AlbumCard({ album, onSelect, href }: AlbumCardProps) {
  const coverUrl = getMediaUrl(album.coverImage);
  const photoCount = album.photos?.length || 0;

  // Format Persian date
  const formattedDate = (() => {
    try {
      if (!album.eventDate) return "";
      const d = new Date(album.eventDate);
      return d.toLocaleDateString("fa-IR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return album.eventDate;
    }
  })();

  const cardContent = (
    <article className="group relative flex flex-col h-full rounded-2xl overflow-hidden bg-gradient-to-b from-[#0e1c31] via-[#091424] to-[#060e1a] border border-[#c49a2c]/20 hover:border-[#c49a2c]/60 transition-all duration-300 hover:shadow-2xl hover:shadow-[#c49a2c]/10 text-right cursor-pointer">
      {/* Cover Image Container */}
      <div className="relative w-full aspect-[16/10] overflow-hidden bg-black/40">
        <Image
          src={coverUrl}
          alt={album.title}
          fill
          unoptimized
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#091424] via-transparent to-black/30" />

        {/* Top Badges */}
        <div className="absolute top-3 right-3 left-3 flex items-center justify-between gap-2 z-10">
          {/* Category Tag */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#060f1c]/80 backdrop-blur-md text-[#e0b74c] border border-[#c49a2c]/30 shadow-lg">
            {CATEGORY_LABELS[album.category] || "رویداد"}
          </span>

          {/* Media Count Pills */}
          <div className="flex items-center gap-1.5">
            {album.videoUrl && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-950/80 backdrop-blur-md text-red-200 border border-red-500/30">
                <Video size={13} className="text-red-400" />
                <span className="text-[11px]">ویدیو</span>
              </span>
            )}
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[#060f1c]/80 backdrop-blur-md text-gray-200 border border-white/10">
              <Camera size={13} className="text-[#c49a2c]" />
              <span className="tabular-nums">{photoCount.toLocaleString("fa-IR")} تصویر</span>
            </span>
          </div>
        </div>

        {/* Date at bottom of cover */}
        {formattedDate && (
          <div className="absolute bottom-3 right-3 z-10 inline-flex items-center gap-1.5 text-xs text-gray-300 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10">
            <Calendar size={13} className="text-[#c49a2c]" />
            <span>{formattedDate}</span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-1 p-5 sm:p-6 justify-between gap-4">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-[#c49a2c] transition-colors line-clamp-2 leading-relaxed">
            {album.title}
          </h3>
          <p className="mt-2.5 text-xs sm:text-sm text-gray-300/90 leading-relaxed line-clamp-3">
            {album.summary}
          </p>
        </div>

        {/* Bottom CTA Action */}
        <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs sm:text-sm font-semibold text-[#c49a2c] group-hover:text-[#e0b74c]">
          <span>مشاهده گزارش و تصاویر</span>
          <ArrowLeft
            size={16}
            className="transform transition-transform group-hover:-translate-x-1 duration-300"
          />
        </div>
      </div>
    </article>
  );

  if (href) {
    return (
      <Link href={href} className="block h-full">
        {cardContent}
      </Link>
    );
  }

  return (
    <div
      onClick={() => onSelect?.(album)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect?.(album);
        }
      }}
      className="h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c49a2c] rounded-2xl"
    >
      {cardContent}
    </div>
  );
}
