"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeftRight, X } from "lucide-react";

interface CompareFloatingDockProps {
  productSlugs?: string[];
  onClear?: () => void;
}

export default function CompareFloatingDock({
  productSlugs = [],
  onClear,
}: CompareFloatingDockProps) {
  if (productSlugs.length === 0) return null;

  const compareUrl = `/compare?${productSlugs.map((s, i) => `p${i + 1}=${s}`).join("&")}`;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#0a1628] text-white px-5 py-3 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center gap-2">
        <ArrowLeftRight size={18} className="text-[#c49a2c]" />
        <span className="text-sm font-bold">
          {productSlugs.length} محصول برای مقایسه انتخاب شده
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Link
          href={compareUrl}
          className="bg-[#c49a2c] hover:bg-[#d4a82c] text-black text-xs font-extrabold px-4 py-2 rounded-xl transition-all shadow-sm"
        >
          مشاهده صفحه مقایسه
        </Link>

        {onClear && (
          <button
            type="button"
            onClick={onClear}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            title="پاک کردن انتخاب‌ها"
            aria-label="پاک کردن"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
}