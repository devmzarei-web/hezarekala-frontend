"use client";

import Image from "next/image";
import { ArrowRight, Calendar, Camera, Video, Maximize2 } from "lucide-react";
import type { Album } from "@/payload-types";
import { getMediaUrl } from "@/lib/media";

interface AlbumDetailProps {
  album: Album;
  onBack: () => void;
  onPhotoClick: (photoIndex: number) => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  "media-coverage": "پوشش رسانه‌ای و خبری",
  workshop: "کارگاه و خط تولید",
  exhibition: "نمایشگاه‌های صنعتی",
  milestone: "افتخارات و دستاوردها",
  other: "رویداد سازمانی",
};

export default function AlbumDetail({
  album,
  onBack,
  onPhotoClick,
}: AlbumDetailProps) {
  const coverUrl = getMediaUrl(album.coverImage);
  const photos = album.photos || [];

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

  const resolvedVideoUrl = (() => {
    if (!album.videoUrl) return "";
    if (album.videoUrl.startsWith("http")) return album.videoUrl;
    if (album.videoUrl.startsWith("/media/")) {
      return `https://cms.hezarehkala.ir${album.videoUrl}`;
    }
    return album.videoUrl;
  })();

  return (
    <div className="w-full text-right animate-fadeIn">
      {/* Top Back Navigation Bar */}
      <div className="mb-6 sm:mb-8 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-[#c49a2c]/10 text-gray-200 hover:text-[#c49a2c] border border-white/10 hover:border-[#c49a2c]/40 transition-all cursor-pointer font-medium text-sm group"
        >
          <ArrowRight
            size={18}
            className="transform transition-transform group-hover:translate-x-1"
          />
          <span>بازگشت به فهرست آلبوم‌ها و رویدادها</span>
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400">
          <span className="inline-flex items-center gap-1">
            <Camera size={14} className="text-[#c49a2c]" />
            <span>{photos.length.toLocaleString("fa-IR")} تصویر</span>
          </span>
          {album.videoUrl && (
            <>
              <span className="text-white/20">•</span>
              <span className="inline-flex items-center gap-1 text-red-300">
                <Video size={14} className="text-red-400" />
                <span>شامل ویدیو</span>
              </span>
            </>
          )}
        </div>
      </div>

      {/* Album Header & Story Section */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-[#0d1b2f] via-[#091424] to-[#060e1b] border border-[#c49a2c]/30 shadow-2xl p-6 sm:p-10 md:p-14 mb-12">
        <div className="flex flex-wrap items-center gap-2.5 mb-5">
          <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#c49a2c]/15 text-[#e0b74c] border border-[#c49a2c]/30">
            {CATEGORY_LABELS[album.category] || "رویداد"}
          </span>
          {formattedDate && (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium bg-white/5 text-gray-300 border border-white/10">
              <Calendar size={13} className="text-[#c49a2c]" />
              <span>{formattedDate}</span>
            </span>
          )}
        </div>

        <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight sm:leading-snug mb-6">
          {album.title}
        </h1>

        <div className="p-4 sm:p-6 rounded-2xl bg-black/30 border border-[#c49a2c]/20 mb-8">
          <p className="text-sm sm:text-base text-[#e0b74c] font-medium leading-loose text-justify [text-align-last:right]">
            {album.summary}
          </p>
        </div>

        {album.description && (
          <div className="pt-6 border-t border-white/10">
            <h3 className="text-sm font-bold text-gray-400 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#c49a2c]" />
              <span>شرح و گزارش تفصیلی رویداد</span>
            </h3>
            <div className="p-5 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/10 text-xs sm:text-sm md:text-base text-gray-200 leading-loose text-justify [text-align-last:right] space-y-4">
              <p>{album.description}</p>
            </div>
          </div>
        )}
      </div>

      {/* Video Player Section (if available) */}
      {resolvedVideoUrl && (
        <div className="mb-12 rounded-3xl overflow-hidden bg-[#07111e] border border-red-500/20 shadow-2xl p-4 sm:p-8">
          <div className="flex items-center gap-2 mb-4 text-[#e0b74c]">
            <Video size={20} className="text-red-400" />
            <h2 className="text-base sm:text-lg font-bold text-white">
              ویدیو و گزارش تصویری رویداد
            </h2>
          </div>

          <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-inner">
            <video
              controls
              playsInline
              poster={coverUrl}
              className="w-full h-full object-cover"
            >
              <source src={resolvedVideoUrl} type="video/mp4" />
              مرورگر شما از پخش ویدیو پشتیبانی نمی‌کند.
            </video>
          </div>
        </div>
      )}

      {/* Photos Grid Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Camera size={20} className="text-[#c49a2c]" />
            <h2 className="text-lg sm:text-xl font-bold text-white">
              تصاویر و مستندات رویداد
            </h2>
            <span className="text-xs bg-[#c49a2c]/20 text-[#e0b74c] px-2.5 py-0.5 rounded-full font-bold">
              {photos.length.toLocaleString("fa-IR")} عکس
            </span>
          </div>
          <p className="text-xs text-gray-400 hidden sm:block">
            برای بزرگ‌نمایی و مشاهده با جزئیات کامل روی هر عکس کلیک کنید
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {photos.map((photo, index) => {
            const photoUrl = getMediaUrl(photo.image);
            const caption = photo.caption || `تصویر ${index + 1} از رویداد ${album.title}`;

            return (
              <div
                key={photo.id || index}
                onClick={() => onPhotoClick(index)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onPhotoClick(index);
                  }
                }}
                className="group relative flex flex-col rounded-2xl overflow-hidden bg-gradient-to-b from-[#0e1c31] to-[#07111e] border border-white/10 hover:border-[#c49a2c]/60 transition-all duration-300 hover:shadow-xl hover:shadow-[#c49a2c]/10 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c49a2c]"
              >
                {/* Photo Container */}
                <div className="relative w-full aspect-[4/3] overflow-hidden bg-black/40">
                  <Image
                    src={photoUrl}
                    alt={caption}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                  {/* Photo Index Badge */}
                  <span className="absolute top-3 right-3 z-10 px-2 py-0.5 rounded-md text-[11px] font-bold bg-black/70 backdrop-blur-md text-[#e0b74c] border border-white/10">
                    {(index + 1).toLocaleString("fa-IR")} / {photos.length.toLocaleString("fa-IR")}
                  </span>

                  {/* Hover Zoom Icon */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30 backdrop-blur-[2px]">
                    <div className="w-11 h-11 rounded-full bg-[#c49a2c] text-[#060f1c] flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110">
                      <Maximize2 size={20} />
                    </div>
                  </div>
                </div>

                {/* Caption Bar */}
                {photo.caption && (
                  <div className="p-4 flex-1 flex flex-col justify-center">
                    <p className="text-xs sm:text-sm text-gray-300 group-hover:text-white transition-colors leading-relaxed line-clamp-2">
                      {photo.caption}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
