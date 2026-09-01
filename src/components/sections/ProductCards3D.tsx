"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import type { Product } from "@/payload-types";
import { getMediaUrl } from "@/lib/media";
import { getProductCategoryLabel } from "@/lib/product-category";

interface ProductCards3DProps {
  products: Product[];
}

const CATEGORY_LABELS: Record<string, string> = {
  centrifugal: "سانتریفیوژ", piston: "پیستونی", gear: "دنده‌ای", multistage: "طبقاتی", other: "سایر",
};

function ProductCard({ product }: { product: Product }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || window.innerWidth < 768) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    setRotateX((e.clientY - centerY) / (rect.height / 2) * -3);
    setRotateY((e.clientX - centerX) / (rect.width / 2) * 3);
  };

  const handleMouseLeave = () => { setRotateX(0); setRotateY(0); };

  const imageAlt = product.featuredImage && typeof product.featuredImage === "object" && "alt" in product.featuredImage
    ? (product.featuredImage.alt as string) : product.title;
  const categoryLabel = product.category ? getProductCategoryLabel(product.category) : "";

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <Link href={`/products/${product.slug}`}>
        <div ref={cardRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} className="group relative h-full">
          <div
            className="relative h-full bg-[#0d1f33] border border-white/[0.04] rounded-2xl overflow-hidden hover:border-[#c49a2c]/20 hover:shadow-xl hover:shadow-[#c49a2c]/5 transition-all duration-300"
            style={{ transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`, transition: "transform 0.15s ease-out" }}
          >
            {/* Image */}
            <div className="relative aspect-[16/9] bg-gray-800 overflow-hidden">
              <img src={getMediaUrl(product.featuredImage)} alt={imageAlt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
                onError={(e) => { (e.target as HTMLImageElement).src = "/images/placeholder.jpg"; }} />
              {categoryLabel && (
                <span className="absolute top-3 right-3 bg-[#c49a2c] text-black text-xs font-bold px-2.5 py-1 rounded-full shadow-lg z-10">
                  {categoryLabel}
                </span>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Content */}
            <div className="relative z-10 p-4 md:p-6">
              <h3 className="card-title text-base md:text-lg text-white mb-1.5 md:mb-2 group-hover:text-[#c49a2c] transition-colors line-clamp-1">
                {product.title}
              </h3>
              {product.shortDescription && (
                <p className="text-gray-400 text-xs md:text-sm leading-relaxed mb-3 md:mb-4 line-clamp-2">
                  {product.shortDescription}
                </p>
              )}
              <div className="flex items-center justify-between pt-3 md:pt-4 border-t border-white/[0.06]">
                <span className="text-[#c49a2c] font-bold text-xs md:text-sm flex items-center gap-1">
                  <span>مشاهده جزئیات</span>
                  <ArrowLeft size={12} className="md:size-14 group-hover:-translate-x-1 transition-transform" />
                </span>
                <div className="w-6 h-1 md:w-8 md:h-1 rounded-full bg-[#c49a2c]/20 group-hover:bg-[#c49a2c] group-hover:w-10 md:group-hover:w-12 transition-all duration-300" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

export default function ProductCards3D({ products }: ProductCards3DProps) {
  return (
    <section className="relative py-16 md:py-24 bg-[#0a1628] overflow-hidden" aria-labelledby="products-heading">
      {/* Dot pattern background */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle, rgba(196,154,44,0.3) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }} />
      </div>

      <div className="relative z-10 w-full px-4 md:px-8 lg:px-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 md:mb-14"
        >
          <span className="text-[#c49a2c] text-xs md:text-sm font-bold uppercase tracking-widest">
            محصولات ما
          </span>
          <h2 id="products-heading" className="section-title section-title-dark text-3xl md:text-5xl lg:text-6xl text-white mt-3 md:mt-4 mb-4 md:mb-6">
            پمپ‌های صنعتی هزاره کالا
          </h2>
          <p className="text-gray-400 mx-auto text-sm md:text-lg">
            طراحی و ساخت پمپ‌های سانتریفیوژ، پیستونی و دنده‌ای برای صنایع نفت، گاز، پتروشیمی و نیروگاهی
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12 md:py-20">
            <p className="text-gray-500 text-base md:text-lg">محصولی برای نمایش وجود ندارد</p>
          </div>
        )}

        {products.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mt-10 md:mt-12"
          >
            <Link
              href="/products"
              className="group inline-flex items-center gap-2 bg-[#c49a2c] hover:bg-[#d4a82c] text-black px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold text-sm md:text-base transition-all hover:shadow-xl hover:shadow-[#c49a2c]/20 hover:-translate-y-0.5 active:scale-95"
            >
              <span>مشاهده همه محصولات</span>
              <ArrowLeft size={16} className="md:size-18 group-hover:-translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}