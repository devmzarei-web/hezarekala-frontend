"use client";

import { useState } from "react";
import { Maximize2, ZoomIn } from "lucide-react";
import { getMediaUrl } from "@/lib/media";
import ImageLightbox, { type LightboxImage } from "@/components/ui/ImageLightbox";

type GalleryItemType = {
  image?: Parameters<typeof getMediaUrl>[0];
  id?: string;
};

interface ProductGalleryProps {
  gallery?: GalleryItemType[];
  featuredImage?: Parameters<typeof getMediaUrl>[0];
  productTitle: string;
}

export default function ProductGallery({
  gallery = [],
  featuredImage,
  productTitle,
}: ProductGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Prepare images list for lightbox
  const rawItems: { url: string; alt: string; title: string }[] = [];

  gallery.forEach((item, i) => {
    if (!item?.image) return;
    const url = getMediaUrl(item.image);
    const alt =
      typeof item.image === "object" && item.image && "alt" in item.image && item.image.alt
        ? (item.image.alt as string)
        : `${productTitle} - تصویر ${i + 1}`;

    rawItems.push({
      url,
      alt,
      title: `${productTitle} (${i + 1} از ${gallery.length})`,
    });
  });

  const lightboxImages: LightboxImage[] = rawItems.map((item) => ({
    url: item.url,
    alt: item.alt,
    title: item.title,
    thumbnailUrl: item.url,
  }));

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
    setLightboxOpen(true);
  };

  if (gallery.length === 0) return null;

  return (
    <div className="mt-16">
      <div className="flex items-center justify-between mb-6 pb-3 border-b-2 border-[#c49a2c]/20">
        <h2 className="text-2xl font-extrabold text-[#0a1628]">گالری تصاویر</h2>
        <span className="text-xs text-gray-500 font-medium">
          برای بزرگ‌نمایی روی تصاویر کلیک کنید
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {gallery.map((item, i) => {
          const url = getMediaUrl(item.image);
          const alt =
            typeof item.image === "object" && item.image && "alt" in item.image && item.image.alt
              ? (item.image.alt as string)
              : `${productTitle} - تصویر ${i + 1}`;

          return (
            <button
              key={item.id || i}
              type="button"
              onClick={() => openLightbox(i)}
              className="group relative aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-200/80 shadow-sm hover:shadow-xl hover:border-[#c49a2c]/40 transition-all duration-300 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[#c49a2c] cursor-pointer text-right"
              aria-label={`مشاهده تصویر ${i + 1} از ${productTitle}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={alt}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
              />

              {/* Hover overlay with zoom icon */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3.5">
                <div className="self-end">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#060f1c]/80 text-[#c49a2c] backdrop-blur-md shadow-md">
                    <ZoomIn size={16} />
                  </span>
                </div>
                <div className="flex items-center justify-between text-white text-xs">
                  <span className="truncate max-w-[80%] font-medium">تصویر {i + 1}</span>
                  <Maximize2 size={13} className="text-[#c49a2c]" />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      <ImageLightbox
        images={lightboxImages}
        initialIndex={selectedIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  );
}
