"use client";

import React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Layers } from "lucide-react";

export interface FilterCategory {
  id?: string;
  title: string;
  slug: string;
}

interface ProductFilterBarProps {
  categories: FilterCategory[];
  activeCategory: string;
  onSelectCategory?: (slug: string) => void;
  totalCount?: number;
  categoryCounts?: Record<string, number>;
}

export default function ProductFilterBar({
  categories,
  activeCategory,
  onSelectCategory,
  totalCount,
  categoryCounts = {},
}: ProductFilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSelect = (slug: string) => {
    if (onSelectCategory) {
      onSelectCategory(slug);
    }
    const params = new URLSearchParams(searchParams.toString());
    if (slug === "all") {
      params.delete("category");
    } else {
      params.set("category", slug);
    }
    const query = params.toString();
    router.replace(pathname + (query ? "?" + query : ""), { scroll: false });
  };

  return (
    <nav
      className="w-full mb-8"
      aria-label="فیلتر دسته‌بندی محصولات"
      dir="rtl"
    >
      <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth">
        <button
          type="button"
          onClick={() => handleSelect("all")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
            activeCategory === "all" || !activeCategory
              ? "bg-[#0a1628] text-white shadow-md shadow-[#0a1628]/15 border border-[#0a1628]"
              : "bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-gray-200"
          }`}
        >
          <Layers size={14} className={activeCategory === "all" || !activeCategory ? "text-[#c49a2c]" : "text-gray-400"} />
          <span>همه محصولات</span>
          {typeof totalCount === "number" && (
            <span
              className={`px-1.5 py-0.5 rounded-md text-[11px] font-semibold ${
                activeCategory === "all" || !activeCategory
                  ? "bg-white/20 text-white"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {totalCount}
            </span>
          )}
        </button>

        {categories.map((cat) => {
          const isActive = activeCategory === cat.slug;
          const count = categoryCounts[cat.slug];

          return (
            <button
              key={cat.slug}
              type="button"
              onClick={() => handleSelect(cat.slug)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
                isActive
                  ? "bg-[#0a1628] text-white shadow-md shadow-[#0a1628]/15 border border-[#0a1628]"
                  : "bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-gray-200"
              }`}
            >
              <span>{cat.title}</span>
              {typeof count === "number" && (
                <span
                  className={`px-1.5 py-0.5 rounded-md text-[11px] font-semibold ${
                    isActive ? "bg-[#c49a2c] text-black" : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}