"use client";

import { useState, useMemo, useEffect } from "react";
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
  BookOpen,
  Camera,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Album } from "@/payload-types";
import { getMediaUrl } from "@/lib/media";
import AlbumCard from "@/components/sections/AlbumCard";
import AlbumDetail from "@/components/sections/AlbumDetail";
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
  sourceType?: "product" | "project" | "gallery" | "album" | "general";
  alt?: string;
  caption?: string;
}

interface GalleryViewProps {
  albums?: Album[];
  items?: UnifiedGalleryItem[];
  initialAlbumSlug?: string | null;
}

const CATEGORY_ICON_MAP: Record<
  string,
  React.ComponentType<{ size?: number; className?: string }>
> = {
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
  "media-coverage": Camera,
  other: Sparkles,
};

const ALBUM_CATEGORY_FILTERS = [
  { key: "all", label: "همه آلبوم‌ها" },
  { key: "media-coverage", label: "پوشش رسانه‌ای و خبری" },
  { key: "workshop", label: "کارگاه و خط تولید" },
  { key: "exhibition", label: "نمایشگاه‌ها" },
  { key: "milestone", label: "افتخارات و دستاوردها" },
];

export default function GalleryView({
  albums = [],
  items = [],
  initialAlbumSlug = null,
}: GalleryViewProps) {
  // Main Dual-Mode Tab state: 'albums' vs 'all-photos'
  const [activeMainTab, setActiveMainTab] = useState<"albums" | "all-photos">(
    initialAlbumSlug ? "albums" : "albums"
  );

  // Selected Album for detail view
  const [selectedAlbumSlug, setSelectedAlbumSlug] = useState<string | null>(
    initialAlbumSlug
  );

  // Album category filter and search
  const [albumCategory, setAlbumCategory] = useState<string>("all");
  const [albumSearch, setAlbumSearch] = useState<string>("");

  // All-photos archive filter and view state
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "sections">("grid");

  // Lightbox state
  const [lightboxImages, setLightboxImages] = useState<LightboxImage[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Sync selected album from initialAlbumSlug or browser popstate
  useEffect(() => {
    if (initialAlbumSlug) {
      setSelectedAlbumSlug(initialAlbumSlug);
      setActiveMainTab("albums");
    }
  }, [initialAlbumSlug]);

  const selectedAlbum = useMemo(() => {
    if (!selectedAlbumSlug) return null;
    return albums.find((a) => a.slug === selectedAlbumSlug) ?? null;
  }, [albums, selectedAlbumSlug]);

  // Handle URL updates gracefully without reload
  const handleSelectAlbum = (album: Album) => {
    setSelectedAlbumSlug(album.slug);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("album", album.slug);
      url.searchParams.delete("tab");
      window.history.pushState({}, "", url.toString());
      window.scrollTo({ top: 300, behavior: "smooth" });
    }
  };

  const handleBackToAlbums = () => {
    setSelectedAlbumSlug(null);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.delete("album");
      window.history.pushState({}, "", url.toString());
    }
  };

  const handleSwitchTab = (tab: "albums" | "all-photos") => {
    setActiveMainTab(tab);
    if (tab === "all-photos") {
      setSelectedAlbumSlug(null);
    }
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.delete("album");
      url.searchParams.set("tab", tab);
      window.history.pushState({}, "", url.toString());
    }
  };

  // Filtered albums
  const filteredAlbums = useMemo(() => {
    return albums.filter((alb) => {
      const matchCat = albumCategory === "all" || alb.category === albumCategory;
      const q = albumSearch.trim().toLowerCase();
      const matchSearch =
        !q ||
        alb.title.toLowerCase().includes(q) ||
        alb.summary.toLowerCase().includes(q) ||
        (alb.description && alb.description.toLowerCase().includes(q));
      return matchCat && matchSearch;
    });
  }, [albums, albumCategory, albumSearch]);

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

  // Filtered individual items for "All Photos" mode
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

  // Grouped items for Sectioned view
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

  // Open Lightbox for an album photo
  const openAlbumPhotoLightbox = (photoIndex: number) => {
    if (!selectedAlbum || !selectedAlbum.photos) return;
    const images: LightboxImage[] = selectedAlbum.photos.map((p, idx) => ({
      url: getMediaUrl(p.image),
      thumbnailUrl: getMediaUrl(p.image),
      title: `${selectedAlbum.title} — عکس ${(idx + 1).toLocaleString("fa-IR")}`,
      caption: p.caption || undefined,
      alt: p.caption || selectedAlbum.title,
      categoryLabel: "گزارش اختصاصی",
    }));
    setLightboxImages(images);
    setLightboxIndex(photoIndex);
  };

  // Open Lightbox for archive items
  const openArchiveLightbox = (index: number) => {
    const images: LightboxImage[] = filteredItems.map((item) => ({
      url: item.imageUrl,
      thumbnailUrl: item.thumbnailUrl || item.imageUrl,
      title: item.title,
      caption: item.caption,
      alt: item.alt || item.title,
      sourceLink: item.sourceLink,
      sourceTitle: item.sourceTitle,
      categoryLabel: item.categoryLabel,
    }));
    setLightboxImages(images);
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
      case "media-coverage":
        return "bg-[#c49a2c]/20 text-[#c49a2c] border-[#c49a2c]/40";
      default:
        return "bg-gray-500/15 text-gray-800 border-gray-500/30";
    }
  };

  return (
    <div className="w-full bg-gradient-to-b from-[#060f1c] via-[#091526] to-[#040a14] py-10 md:py-16 text-white min-h-[600px]" dir="rtl">
      <div className="w-full px-4 sm:px-6 md:px-12 lg:px-16 max-w-7xl mx-auto">
        {/* If an album is selected, render AlbumDetail view directly */}
        {selectedAlbum ? (
          <AlbumDetail
            album={selectedAlbum}
            onBack={handleBackToAlbums}
            onPhotoClick={openAlbumPhotoLightbox}
          />
        ) : (
          <>
            {/* Main Dual-Mode View Switcher Tabs */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 sm:mb-10 pb-6 border-b border-white/10">
              <div className="flex items-center p-1.5 rounded-2xl bg-black/40 border border-[#c49a2c]/30 backdrop-blur-md w-full sm:w-auto shadow-xl">
                <button
                  type="button"
                  onClick={() => handleSwitchTab("albums")}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                    activeMainTab === "albums"
                      ? "bg-gradient-to-r from-[#c49a2c] to-[#e0b74c] text-[#060f1c] shadow-lg shadow-[#c49a2c]/20"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <BookOpen size={18} />
                  <span>رویدادها و گزارش‌ها (آلبوم‌ها)</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-extrabold ${
                      activeMainTab === "albums"
                        ? "bg-[#060f1c] text-[#e0b74c]"
                        : "bg-white/10 text-gray-300"
                    }`}
                  >
                    {albums.length.toLocaleString("fa-IR")}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSwitchTab("all-photos")}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                    activeMainTab === "all-photos"
                      ? "bg-gradient-to-r from-[#c49a2c] to-[#e0b74c] text-[#060f1c] shadow-lg shadow-[#c49a2c]/20"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <ImageIcon size={18} />
                  <span>آرشیو جامع تصاویر</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-extrabold ${
                      activeMainTab === "all-photos"
                        ? "bg-[#060f1c] text-[#e0b74c]"
                        : "bg-white/10 text-gray-300"
                    }`}
                  >
                    {items.length.toLocaleString("fa-IR")}
                  </span>
                </button>
              </div>

              {/* Mode Description Tag */}
              <div className="text-xs text-gray-400 text-center sm:text-left">
                {activeMainTab === "albums" ? (
                  <span>گزارش‌های خبری مصور، بازدیدها و رویدادهای رسمی کارخانه</span>
                ) : (
                  <span>آرشیو کامل کلیه قطعات، تجهیزات، کارگاه و پروژه‌ها</span>
                )}
              </div>
            </div>

            {/* TAB 1: ALBUMS MODE */}
            {activeMainTab === "albums" && (
              <div className="space-y-8 animate-fadeIn">
                {/* Album Filter Bar */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md">
                  {/* Category Pills */}
                  <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 scrollbar-none">
                    {ALBUM_CATEGORY_FILTERS.map((cat) => {
                      const isActive = albumCategory === cat.key;
                      return (
                        <button
                          key={cat.key}
                          type="button"
                          onClick={() => setAlbumCategory(cat.key)}
                          className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                            isActive
                              ? "bg-[#c49a2c] text-[#060f1c] shadow-md shadow-[#c49a2c]/20"
                              : "bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10"
                          }`}
                        >
                          {cat.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Album Search */}
                  <div className="relative w-full md:w-72">
                    <Search
                      size={16}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                    <input
                      type="text"
                      value={albumSearch}
                      onChange={(e) => setAlbumSearch(e.target.value)}
                      placeholder="جستجو در گزارش‌ها و رویدادها..."
                      className="w-full pl-9 pr-9 py-2 bg-black/40 hover:bg-black/60 focus:bg-black/80 border border-white/10 focus:border-[#c49a2c] rounded-xl text-xs text-white placeholder-gray-400 focus:outline-none transition-all"
                    />
                    {albumSearch && (
                      <button
                        type="button"
                        onClick={() => setAlbumSearch("")}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Albums Grid */}
                {filteredAlbums.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {filteredAlbums.map((album) => (
                      <AlbumCard
                        key={album.id}
                        album={album}
                        onSelect={handleSelectAlbum}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="py-20 text-center rounded-2xl bg-white/[0.02] border border-white/5">
                    <BookOpen size={40} className="mx-auto text-gray-500 mb-3 opacity-50" />
                    <p className="text-sm font-semibold text-gray-300">
                      هیچ آلبومی با مشخصات جستجو شده یافت نشد.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setAlbumCategory("all");
                        setAlbumSearch("");
                      }}
                      className="mt-3 text-xs text-[#c49a2c] hover:underline"
                    >
                      نمایش همه آلبوم‌ها
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: ALL PHOTOS ARCHIVE MODE */}
            {activeMainTab === "all-photos" && (
              <div className="space-y-8 animate-fadeIn">
                {/* Top Control Bar: Search & Dynamic Categories */}
                <div className="rounded-2xl p-4 md:p-6 bg-white/[0.03] border border-white/10 backdrop-blur-md space-y-5">
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
                        className="w-full pl-9 pr-10 py-2.5 bg-black/40 hover:bg-black/60 focus:bg-black/80 border border-white/10 rounded-xl text-sm text-white placeholder-gray-400 focus:outline-none focus:border-[#c49a2c] focus:ring-1 focus:ring-[#c49a2c]/30 transition-all"
                      />
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() => setSearchQuery("")}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1 cursor-pointer"
                          aria-label="پاک کردن جستجو"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>

                    {/* View Mode Toggle & Total Counter */}
                    <div className="flex items-center justify-between w-full md:w-auto gap-4">
                      <span className="text-xs sm:text-sm text-gray-300 font-medium">
                        نمایش <span className="font-bold text-[#e0b74c]">{filteredItems.length.toLocaleString("fa-IR")}</span> تصویر
                      </span>

                      <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/10">
                        <button
                          type="button"
                          onClick={() => setViewMode("grid")}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            viewMode === "grid"
                              ? "bg-[#c49a2c] text-[#060f1c] shadow-sm"
                              : "text-gray-400 hover:text-white"
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
                              ? "bg-[#c49a2c] text-[#060f1c] shadow-sm"
                              : "text-gray-400 hover:text-white"
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
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none border-t border-white/10">
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
                                ? "bg-[#c49a2c] text-[#060f1c] shadow-md shadow-[#c49a2c]/20 scale-[1.02]"
                                : "bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10"
                            }`}
                          >
                            <IconComponent
                              size={15}
                              className={isActive ? "text-[#060f1c]" : "text-[#c49a2c]"}
                            />
                            <span>{tab.label}</span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                                isActive
                                  ? "bg-[#060f1c] text-[#e0b74c]"
                                  : "bg-white/10 text-gray-300"
                              }`}
                            >
                              {tab.count.toLocaleString("fa-IR")}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* ARCHIVE CONTENT: GRID OR SECTIONS */}
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6">
                    {filteredItems.map((item, index) => (
                      <div
                        key={item.id}
                        onClick={() => openArchiveLightbox(index)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            openArchiveLightbox(index);
                          }
                        }}
                        className="group relative flex flex-col rounded-2xl overflow-hidden bg-gradient-to-b from-[#0e1c31] to-[#07111e] border border-white/10 hover:border-[#c49a2c]/60 transition-all duration-300 hover:shadow-xl hover:shadow-[#c49a2c]/10 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c49a2c]"
                      >
                        <div className="relative w-full aspect-square overflow-hidden bg-black/40">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.thumbnailUrl || item.imageUrl}
                            alt={item.alt || item.title}
                            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                          {/* Hover Overlay Zoom Icon */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30 backdrop-blur-[2px]">
                            <div className="w-10 h-10 rounded-full bg-[#c49a2c] text-[#060f1c] flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110">
                              <ZoomIn size={18} />
                            </div>
                          </div>

                          {/* Top Category Badge */}
                          <span className="absolute top-2.5 right-2.5 z-10 px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/70 backdrop-blur-md text-[#e0b74c] border border-white/10">
                            {item.categoryLabel}
                          </span>
                        </div>

                        {/* Caption Bar */}
                        <div className="p-3 flex-1 flex flex-col justify-between gap-2">
                          <p className="text-xs font-semibold text-gray-200 group-hover:text-[#c49a2c] transition-colors leading-relaxed line-clamp-2">
                            {item.title}
                          </p>
                          {item.sourceTitle && (
                            <p className="text-[11px] text-gray-400 truncate">
                              {item.sourceTitle}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Sectioned View */
                  <div className="space-y-12">
                    {sectionedGroups.map((group) => (
                      <div key={group.key} className="space-y-4">
                        <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                          <h3 className="text-lg font-bold text-white">
                            {group.label}
                          </h3>
                          <span className="text-xs bg-[#c49a2c]/20 text-[#e0b74c] px-2.5 py-0.5 rounded-full font-bold">
                            {group.items.length.toLocaleString("fa-IR")} تصویر
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6">
                          {group.items.map((item) => {
                            const globalIndex = filteredItems.findIndex((it) => it.id === item.id);
                            return (
                              <div
                                key={item.id}
                                onClick={() => openArchiveLightbox(globalIndex >= 0 ? globalIndex : 0)}
                                role="button"
                                tabIndex={0}
                                className="group relative flex flex-col rounded-2xl overflow-hidden bg-gradient-to-b from-[#0e1c31] to-[#07111e] border border-white/10 hover:border-[#c49a2c]/60 transition-all duration-300 hover:shadow-xl hover:shadow-[#c49a2c]/10 cursor-pointer"
                              >
                                <div className="relative w-full aspect-square overflow-hidden bg-black/40">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={item.thumbnailUrl || item.imageUrl}
                                    alt={item.alt || item.title}
                                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                                    loading="lazy"
                                  />
                                </div>
                                <div className="p-3">
                                  <p className="text-xs font-semibold text-gray-200 group-hover:text-[#c49a2c] transition-colors leading-relaxed line-clamp-2">
                                    {item.title}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Shared Lightbox Component */}
      <ImageLightbox
        images={lightboxImages}
        initialIndex={lightboxIndex ?? 0}
        isOpen={lightboxIndex !== null}
        onClose={() => setLightboxIndex(null)}
      />
    </div>
  );
}
