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

  // Filter categories to ONLY those that have existing products
  const populatedCategories = useMemo(() => {
    return categories.filter((c) => (categoryCounts[c.slug] || 0) > 0);
  }, [categories, categoryCounts]);

  // Filter products by activeCategory
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
      {/* Category Filter Bar */}
      <ProductFilterBar
        categories={populatedCategories}
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
        totalCount={products.length}
        categoryCounts={categoryCounts}
      />

      {/* Catalog Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id || product.slug} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200/80 p-8">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
            <PackageOpen size={32} />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            محصولی در این دسته‌بندی یافت نشد
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            می‌توانید سایر دسته‌بندی‌ها را بررسی کنید یا کل کاتالوگ را مشاهده فرمایید.
          </p>
          <button
            onClick={() => handleSelectCategory("all")}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0a1628] text-white text-sm font-semibold hover:bg-[#c49a2c] hover:text-black transition-colors"
          >
            <RotateCcw size={16} />
            <span>مشاهده همه محصولات</span>
          </button>
        </div>
      )}
    </div>
  );
}
