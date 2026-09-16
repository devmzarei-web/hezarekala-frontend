"use client";

import React, { useState, useMemo, useEffect, useTransition } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import ProductFilterBar, { FilterCategory } from "./ProductFilterBar";
import ProductCard from "@/components/products/ProductCard";
import { getProductCategorySlug } from "@/lib/product-category";
import type { Product } from "@/payload-types";
import { PackageOpen, RotateCcw } from "lucide-react";

interface ProductsCatalogViewProps {
  products: Product[];
  categories: FilterCategory[];
}

export default function ProductsCatalogView({
  products,
  categories,
}: ProductsCatalogViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const urlCategory = searchParams.get("category") || "all";
  const [activeCategory, setActiveCategory] = useState<string>(urlCategory);

  useEffect(() => {
    const cat = searchParams.get("category") || "all";
    setActiveCategory(cat);
  }, [searchParams]);

  // Compute category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of products) {
      const slug = getProductCategorySlug(p.category);
      if (slug) {
        counts[slug] = (counts[slug] || 0) + 1;
      }
    }
    return counts;
  }, [products]);

  // Filter products
  const filteredProducts = useMemo(() => {
    if (activeCategory === "all" || !activeCategory) {
      return products;
    }
    return products.filter((p) => {
      const slug = getProductCategorySlug(p.category);
      return slug === activeCategory;
    });
  }, [products, activeCategory]);

  const handleSelectCategory = (slug: string) => {
    setActiveCategory(slug);
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (slug === "all") {
        params.delete("category");
      } else {
        params.set("category", slug);
      }
      const q = params.toString();
      router.replace(pathname + (q ? "?" + q : ""), { scroll: false });
    });
  };

  return (
    <div className="w-full">
      <ProductFilterBar
        categories={categories}
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
        totalCount={products.length}
        categoryCounts={categoryCounts}
      />

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-white rounded-2xl border border-dashed border-gray-200">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
            <PackageOpen size={32} />
          </div>
          <h3 className="text-lg font-bold text-[#0a1628] mb-2">
            محصولی در این دسته‌بندی یافت نشد
          </h3>
          <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
            در حال حاضر برای این دسته‌بندی محصولی تعریف نشده است. جهت ثبت سفارش اختصاصی یا استعلام فنی با ما تماس بگیرید.
          </p>
          <button
            type="button"
            onClick={() => handleSelectCategory("all")}
            className="inline-flex items-center gap-2 bg-[#0a1628] hover:bg-[#162033] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all cursor-pointer"
          >
            <RotateCcw size={14} />
            <span>مشاهده همه محصولات</span>
          </button>
        </div>
      )}
    </div>
  );
}