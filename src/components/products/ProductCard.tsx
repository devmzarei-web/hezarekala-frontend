import React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowLeftRight, PhoneCall, MessageCircle, ShoppingBag } from "lucide-react";
import { getMediaUrl } from "@/lib/media";
import { getProductCategoryLabel } from "@/lib/product-category";
import { getSpecLabel, SpecValueDisplay } from "@/lib/specs";
import { formatPriceWithUnit, isPriceAvailable } from "@/lib/price";
import type { Product } from "@/payload-types";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product }: ProductCardProps) {
  const imageUrl = getMediaUrl(product.featuredImage);
  const imageAlt =
    product.featuredImage && typeof product.featuredImage === "object" && "alt" in product.featuredImage
      ? (product.featuredImage.alt as string) || product.title
      : product.title;

  const categoryLabel = getProductCategoryLabel(product.category);

  // Filter top 2 key specifications for dense preview
  const keySpecs = (product.specifications || [])
    .filter((s) => s && s.value)
    .slice(0, 2);

  const priceAvailable = isPriceAvailable(product);
  const formattedPrice = priceAvailable ? formatPriceWithUnit(product.price, product.priceUnit) : "";

  const inquiryUrl = `/contact?product=${encodeURIComponent(product.slug)}`;
  const whatsappMessage = priceAvailable
    ? `سلام، درخواست خرید و صدور پیش‌فاکتور برای محصول «${product.title}» ${product.productCode ? `(کد: ${product.productCode})` : ""} با قیمت ${formattedPrice} دارم.`
    : `سلام، درخواست استعلام قیمت و مشاوره فنی برای محصول «${product.title}» دارم.`;
  const whatsappUrl = `https://wa.me/989163337968?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <article className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#c49a2c]/30 transition-all duration-300 flex flex-col h-full">
      {/* ── Image & Badges ── */}
      <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden shrink-0">
        <Link href={`/products/${product.slug}`} className="block w-full h-full">
          <img
            src={imageUrl || "/images/placeholder-product.jpg"}
            alt={imageAlt}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            decoding="async"
          />
        </Link>

        {categoryLabel && (
          <span className="absolute top-2.5 right-2.5 bg-[#0a1628]/85 backdrop-blur-md text-[#c49a2c] text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
            {categoryLabel}
          </span>
        )}

        {product.isFeatured && (
          <span className="absolute top-2.5 left-2.5 bg-[#c49a2c] text-black text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-sm">
            ویژه
          </span>
        )}
      </div>

      {/* ── Content ── */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <Link href={`/products/${product.slug}`} className="block">
            <h3 className="text-sm sm:text-base font-bold text-[#0a1628] group-hover:text-[#c49a2c] transition-colors line-clamp-1 mb-1.5">
              {product.title}
            </h3>
          </Link>

          {product.shortDescription && (
            <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-3 min-h-[2rem]">
              {product.shortDescription}
            </p>
          )}

          {/* ── Specs Chips ── */}
          {keySpecs.length > 0 && (
            <div className="grid grid-cols-1 gap-1.5 mb-3 text-[11px]">
              {keySpecs.map((spec, idx) => (
                <div
                  key={idx}
                  className="bg-gray-50 border border-gray-100 rounded-lg px-2 py-1 flex items-center justify-between"
                >
                  <span className="text-gray-500 truncate">{getSpecLabel(spec)}:</span>
                  <span className="font-bold text-gray-800 shrink-0 mr-1">
                    <SpecValueDisplay value={spec.value} unit={spec.unit} />
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* ── Pricing and Product Code Row ── */}
          <div className="pt-2.5 pb-2 border-t border-gray-100 flex items-center justify-between gap-2">
            {priceAvailable ? (
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 font-medium">قیمت با ارزش افزوده:</span>
                <span className="text-sm font-black text-[#0a1628]">
                  {formattedPrice}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/60">
                <span>استعلام قیمت و مشاوره</span>
              </div>
            )}

            {product.productCode && (
              <span className="text-[11px] font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 shrink-0" dir="ltr">
                کد: {product.productCode}
              </span>
            )}
          </div>
        </div>

        {/* ── B2B Action Bar ── */}
        <div className="pt-3 border-t border-gray-100 flex items-center gap-1.5">
          <Link
            href={inquiryUrl}
            className="flex-1 bg-[#c49a2c] hover:bg-[#d4a82c] text-black font-bold text-xs py-2 px-2.5 rounded-xl flex items-center justify-center gap-1 transition-all shadow-sm hover:shadow-md hover:shadow-[#c49a2c]/20"
            title={priceAvailable ? "درخواست خرید و صدور پیش‌فاکتور" : "استعلام قیمت و مشاوره فنی"}
          >
            {priceAvailable ? (
              <ShoppingBag size={13} className="shrink-0" />
            ) : (
              <PhoneCall size={13} className="shrink-0" />
            )}
            <span className="truncate">{priceAvailable ? "سفارش و پیش‌فاکتور" : "استعلام قیمت"}</span>
          </Link>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-emerald-600 hover:text-white hover:bg-emerald-600 rounded-xl border border-emerald-200 hover:border-emerald-600 transition-all shrink-0"
            title={priceAvailable ? "سفارش مستقیم در واتساپ" : "استعلام قیمت در واتساپ"}
            aria-label="استعلام یا سفارش در واتساپ"
          >
            <MessageCircle size={15} />
          </a>

          <Link
            href={`/compare?p1=${product.slug}`}
            className="p-2 text-gray-400 hover:text-[#c49a2c] hover:bg-amber-50 rounded-xl border border-gray-200 hover:border-[#c49a2c]/40 transition-colors shrink-0"
            title="مقایسه فنی"
            aria-label="افزودن به مقایسه"
          >
            <ArrowLeftRight size={15} />
          </Link>

          <Link
            href={`/products/${product.slug}`}
            className="p-2 text-gray-400 hover:text-[#0a1628] hover:bg-gray-100 rounded-xl border border-gray-200 transition-colors shrink-0"
            title="مشاهده جزئیات کامل"
            aria-label="مشاهده جزئیات"
          >
            <ArrowLeft size={15} />
          </Link>
        </div>
      </div>
    </article>
  );
}