"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Grid,
  Layers,
  ExternalLink,
  ZoomIn,
  Package,
  Wrench,
  Building2,
  Users,
  Image as ImageIcon,
  Sparkles,
  X,
  Tag,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ImageLightbox, { type LightboxImage } from "@/components/ui/ImageLightbox";

export interface UnifiedGalleryItem {
  id: string;
  title: string;
  imageUrl: string;
  thumbnailUrl?: string;
  category: string;
  categoryLabel: string;
  sourceTitle?: string;
  sourceLink?: string;
  sourceType?: "product" | "project" | "gallery" | "general";
  alt?: string;
}

interface GalleryViewProps {
  items: UnifiedGalleryItem[];
}

const CATEGORY_ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  all: ImageIcon,
  products: Package,
  centrifugal: Package,
  piston: Package,
  gear: Package,
  multistage: Package,
  workshop: Wrench,
  projects: Building2,
  company: Users,
  team: Users,
  other: Sparkles,
};

export default function GalleryView({ items = [] }: GalleryViewProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "sections">("grid");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Dynamically compute category tabs from the actual incoming dataset
  const dynamicCategories = useMemo(() => {
    const map = new Map<string, { key: string; label: string; count: number }>();

    items.forEach((item) => {
      const key = item.category || "other";
      const label = item.categoryLabel || "سایر";

      if (!map.has(key)) {
        map.set(key, { key, label, count: 1 });
      } else {
        map.get(key)!.count++;
      }
    });

    const categoriesList = Array.from(map.values()).sort((a, b) => b.count - a.count);

    return [
      { key: "all", label: "همه تصاویر", count: items.length },
      ...categoriesList,
    ];
  }, [items]);

  // Filtered items based on active category and search
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchCategory = activeCategory === "all" || item.category === activeCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        (item.sourceTitle && item.sourceTitle.toLowerCase().includes(q)) ||
        (item.categoryLabel && item.categoryLabel.toLowerCase().includes(q)) ||
        (item.alt && item.alt.toLowerCase().includes(q));

      return matchCategory && matchSearch;
    });
  }, [items, activeCategory, searchQuery]);

  // Lightbox images list
  const lightboxImages: LightboxImage[] = useMemo(() => {
    return filteredItems.map((item) => ({
      url: item.imageUrl,
      thumbnailUrl: item.thumbnailUrl || item.imageUrl,
      title: item.title,
      alt: item.alt || item.title,
      sourceLink: item.sourceLink,
      sourceTitle: item.sourceTitle,
      categoryLabel: item.categoryLabel,
    }));
  }, [filteredItems]);

  // Grouped items for Sectioned view (dynamically generated from actual categories)
  const sectionedGroups = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const groupsMap = new Map<
      string,
      {
        key: string;
        label: string;
        items: UnifiedGalleryItem[];
      }
    >();

    items.forEach((item) => {
      const key = item.category || "other";
      const label = item.categoryLabel || "سایر";

      const matchSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        (item.sourceTitle && item.sourceTitle.toLowerCase().includes(q)) ||
        (item.alt && item.alt.toLowerCase().includes(q));

      if (matchSearch) {
        if (!groupsMap.has(key)) {
          groupsMap.set(key, { key, label, items: [item] });
        } else {
          groupsMap.get(key)!.items.push(item);
        }
      }
    });

    return Array.from(groupsMap.values()).filter((g) => g.items.length > 0);
  }, [items, searchQuery]);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case "products":
      case "centrifugal":
      case "piston":
      case "gear":
      case "multistage":
        return "bg-amber-500/15 text-amber-800 border-amber-500/30";
      case "workshop":
        return "bg-blue-500/15 text-blue-800 border-blue-500/30";
      case "projects":
        return "bg-emerald-500/15 text-emerald-800 border-emerald-500/30";
      case "company":
      case "team":
        return "bg-purple-500/15 text-purple-800 border-purple-500/30";
      default:
        return "bg-gray-500/15 text-gray-800 border-gray-500/30";
    }
  };

  return (
    <div className="w-full bg-gray-50/50 py-12 md:py-16" dir="rtl">
      <div className="w-full px-4 sm:px-6 md:px-12 lg:px-16 max-w-7xl mx-auto">
        {/* Top Control Bar: Search & Dynamic Categories */}
        <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 mb-8 space-y-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search
                size={18}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجو در تصاویر، محصولات و پروژه‌ها..."
                className="w-full pl-9 pr-10 py-2.5 bg-gray-50 hover:bg-gray-100/80 focus:bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#c49a2c] focus:ring-2 focus:ring-[#c49a2c]/20 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
                  aria-label="پاک کردن جستجو"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* View Mode Toggle & Total Counter */}
            <div className="flex items-center justify-between w-full md:w-auto gap-4">
              <span className="text-xs sm:text-sm text-gray-500 font-medium">
                نمایش <span className="font-bold text-[#0a1628]">{filteredItems.length}</span> تصویر یکتا
              </span>

              <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200/80">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    viewMode === "grid"
                      ? "bg-white text-[#0a1628] shadow-sm"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                  title="نمایش یکپارچه"
                >
                  <Grid size={14} />
                  <span>آرشیو فشرده</span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode("sections")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    viewMode === "sections"
                      ? "bg-white text-[#0a1628] shadow-sm"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                  title="نمایش بخش‌بندی شده"
                >
                  <Layers size={14} />
                  <span>بخش‌بندی</span>
                </button>
              </div>
            </div>
          </div>

          {/* Dynamic Category Filter Tabs */}
          {viewMode === "grid" && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none border-t border-gray-100">
              {dynamicCategories.map((tab) => {
                const IconComponent = CATEGORY_ICON_MAP[tab.key] || Tag;
                const isActive = activeCategory === tab.key;

                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveCategory(tab.key)}
                    className={`shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                      isActive
                        ? "bg-[#060f1c] text-[#e5c158] shadow-md shadow-black/10 scale-[1.02]"
                        : "bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-200/60"
                    }`}
                  >
                    <IconComponent size={15} className={isActive ? "text-[#c49a2c]" : "text-gray-400"} />
                    <span>{tab.label}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        isActive
                          ? "bg-[#c49a2c] text-black"
                          : "bg-gray-200/80 text-gray-600"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Content Area */}
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm max-w-lg mx-auto">
            <div className="w-16 h-16 bg-amber-50 text-[#c49a2c] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search size={28} />
            </div>
            <h3 className="text-lg font-bold text-[#0a1628] mb-2">تصویری یافت نشد</h3>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              با معیارهای فیلتر یا جستجوی وارد شده تصویری در آرشیو پیدا نشد.
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveCategory("all");
                setSearchQuery("");
              }}
              className="bg-[#c49a2c] hover:bg-[#d4a82c] text-black font-bold px-5 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
            >
              نمایش همه تصاویر
            </button>
          </div>
        ) : viewMode === "grid" ? (
          /* High-Density Compact Grid View */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3.5 sm:gap-4.5">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: Math.min(index * 0.02, 0.3) }}
                className="group relative bg-white rounded-2xl overflow-hidden border border-gray-200/80 shadow-sm hover:shadow-xl hover:border-[#c49a2c]/40 transition-all duration-300 flex flex-col cursor-pointer"
                onClick={() => openLightbox(index)}
              >
                {/* Image Container with Aspect Ratio */}
                <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.thumbnailUrl || item.imageUrl}
                    alt={item.alt || item.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  />

                  {/* Category Pill on top-right */}
                  <div className="absolute top-2.5 right-2.5 z-10">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shadow-sm backdrop-blur-md ${getCategoryBadgeColor(
                        item.category
                      )} bg-white/95`}
                    >
                      {item.categoryLabel}
                    </span>
                  </div>

                  {/* Zoom Badge on top-left (visible on hover) */}
                  <div className="absolute top-2.5 left-2.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <span className="w-7 h-7 rounded-full bg-black/60 backdrop-blur-md text-[#e5c158] flex items-center justify-center shadow-md">
                      <ZoomIn size={14} />
                    </span>
                  </div>

                  {/* Subtle Gradient Shadow */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>

                {/* Compact Card Details Footer */}
                <div className="p-3 sm:p-3.5 flex flex-col justify-between flex-1 bg-white">
                  <h4
                    className="text-xs sm:text-sm font-bold text-[#0a1628] group-hover:text-[#c49a2c] transition-colors truncate mb-1.5"
                    title={item.title}
                  >
                    {item.title}
                  </h4>

                  {/* Quick Access Link to Source if present */}
                  <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-gray-100/80">
                    {item.sourceLink ? (
                      <Link
                        href={item.sourceLink}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-[#c49a2c] hover:text-[#a07e1e] font-bold hover:underline truncate max-w-full"
                        title={item.sourceTitle ? `مشاهده ${item.sourceTitle}` : "مشاهده صفحه"}
                      >
                        <span className="truncate">{item.sourceTitle || "مشاهده منبع"}</span>
                        <ExternalLink size={11} className="shrink-0" />
                      </Link>
                    ) : (
                      <span className="text-gray-400 text-[10px] truncate">آرشیو کارخانه</span>
                    )}

                    <span className="text-gray-400 group-hover:text-[#c49a2c] transition-colors text-[10px] font-medium shrink-0">
                      بزرگ‌نمایی 🔍
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Sectioned / Grouped View */
          <div className="space-y-12">
            {sectionedGroups.map((group) => {
              const IconComp = CATEGORY_ICON_MAP[group.key] || Tag;

              return (
                <section
                  key={group.key}
                  className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm"
                  aria-labelledby={`heading-${group.key}`}
                >
                  {/* Section Header */}
                  <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#060f1c] text-[#c49a2c] flex items-center justify-center shadow-md">
                        <IconComp size={20} />
                      </div>
                      <div>
                        <h3 id={`heading-${group.key}`} className="text-lg sm:text-xl font-black text-[#0a1628]">
                          {group.label}
                        </h3>
                        <p className="text-xs text-gray-400">
                          شامل {group.items.length} تصویر منتخب در این دسته‌بندی
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveCategory(group.key);
                        setViewMode("grid");
                      }}
                      className="text-xs font-bold text-[#c49a2c] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      مشاهده در آرشیو فشرده
                    </button>
                  </div>

                  {/* Section Images Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3.5 sm:gap-4">
                    {group.items.map((item) => {
                      const globalIdx = filteredItems.findIndex((x) => x.id === item.id);

                      return (
                        <div
                          key={item.id}
                          className="group relative bg-gray-50 rounded-2xl overflow-hidden border border-gray-200/80 shadow-sm hover:shadow-lg hover:border-[#c49a2c]/40 transition-all duration-300 flex flex-col cursor-pointer"
                          onClick={() => openLightbox(globalIdx >= 0 ? globalIdx : 0)}
                        >
                          <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={item.thumbnailUrl || item.imageUrl}
                              alt={item.alt || item.title}
                              loading="lazy"
                              decoding="async"
                              className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                            />
                            <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="w-6 h-6 rounded-full bg-black/60 backdrop-blur-md text-[#e5c158] flex items-center justify-center">
                                <ZoomIn size={12} />
                              </span>
                            </div>
                          </div>

                          <div className="p-3 flex flex-col justify-between flex-1 bg-white">
                            <h4 className="text-xs font-bold text-[#0a1628] truncate mb-1" title={item.title}>
                              {item.title}
                            </h4>

                            {item.sourceLink && (
                              <Link
                                href={item.sourceLink}
                                onClick={(e) => e.stopPropagation()}
                                className="text-[11px] font-bold text-[#c49a2c] hover:underline inline-flex items-center gap-1 truncate"
                              >
                                <span className="truncate">{item.sourceTitle || "مشاهده منبع"}</span>
                                <ExternalLink size={10} className="shrink-0" />
                              </Link>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <ImageLightbox
        images={lightboxImages}
        initialIndex={lightboxIndex ?? 0}
        isOpen={lightboxIndex !== null}
        onClose={() => setLightboxIndex(null)}
      />
    </div>
  );
}