import type { Metadata } from "next";
import { getSettings } from "@/lib/payload";
import { SITE_URL, PAYLOAD_API_URL } from "@/lib/env";
import { getMediaUrl } from "@/lib/media";
import { getProductCategoryLabel } from "@/lib/product-category";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import RichTextRenderer from "@/components/ui/RichTextRenderer";
import BreadcrumbSchema from "@/components/ui/BreadcrumbSchema";
import ProductGallery from "@/components/sections/ProductGallery";
import Link from "next/link";
import {
  ArrowRight,
  Phone,
  ArrowLeftRight,
  MessageCircle,
  FileDown,
  ShoppingBag,
  ShieldCheck,
  Truck,
  Wrench,
  CheckCircle2,
  Info,
  Tag,
} from "lucide-react";
import { getSpecLabel, SpecValueDisplay } from "@/lib/specs";
import { formatPriceWithUnit, isPriceAvailable } from "@/lib/price";

import { DEFAULT_PRODUCTS, COMPANY } from "@/lib/constants";

async function getProduct(slug: string) {
  try {
    const res = await fetch(`${PAYLOAD_API_URL}/products?where[slug][equals]=${encodeURIComponent(slug)}&depth=2&limit=1`, {
      signal: AbortSignal.timeout(3000),
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 60 },
    });
    if (!res.ok) return DEFAULT_PRODUCTS.find((p) => p.slug === slug) || null;
    const data = await res.json();
    return data?.docs?.[0] || DEFAULT_PRODUCTS.find((p) => p.slug === slug) || null;
  } catch {
    return DEFAULT_PRODUCTS.find((p) => p.slug === slug) || null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  const imageUrl = product?.featuredImage ? getMediaUrl(product.featuredImage) : "";

  return {
    title: product?.metaTitle || product?.title || "محصول",
    description:
      product?.metaDescription ||
      product?.shortDescription ||
      `تجهیزات صنعتی و پمپ ${product?.title || ""} - هزاره کالا دانش اروند | تولید ایران - شهرک صنعتی آبادان`,
    keywords: product?.keywords || "",
    alternates: {
      canonical: product?.canonicalUrl || `${SITE_URL}/products/${product?.slug || slug}`,
    },
    openGraph: {
      type: "website",
      title: product?.metaTitle || product?.title || "محصول",
      description: product?.metaDescription || product?.shortDescription || "",
      images: imageUrl ? [{ url: imageUrl }] : [],
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [product, settings] = await Promise.all([getProduct(slug), getSettings()]);

  if (!product) {
    return (
      <main className="min-h-screen bg-white" dir="rtl">
        <Header settings={settings} />
        <div className="text-center py-32">
          <h1 className="text-3xl font-black text-[#0a1628] mb-4">محصول یافت نشد</h1>
          <Link href="/products" className="text-[#c49a2c] font-bold hover:underline">بازگشت به محصولات</Link>
        </div>
        <Footer settings={settings} />
      </main>
    );
  }

  const galleryImages = product.gallery || [];
  const specs = product.specifications || [];
  const documents = (product as any).documents || [];
  const heroImage = getMediaUrl(product.featuredImage);
  const imageAlt =
    product.featuredImage && typeof product.featuredImage === "object" && "alt" in product.featuredImage
      ? (product.featuredImage.alt as string) || product.title
      : product.title;
  const productUrl = `${SITE_URL}/products/${product.slug}`;
  const categoryLabel = getProductCategoryLabel(product.category) || "تجهیزات صنعتی";
  const inquiryUrl = `/contact?product=${encodeURIComponent(product.slug)}`;

  const priceAvailable = isPriceAvailable(product);
  const formattedPrice = priceAvailable ? formatPriceWithUnit(product.price, product.priceUnit) : "";

  const whatsappMessage = priceAvailable
    ? `سلام، درخواست خرید و صدور پیش‌فاکتور برای محصول «${product.title}» ${product.productCode ? `(کد: ${product.productCode})` : ""} با قیمت ${formattedPrice} دارم.`
    : `سلام، درخواست استعلام قیمت و مشاوره فنی برای محصول «${product.title}» دارم.`;
  const whatsappUrl = `https://wa.me/989166317609?text=${encodeURIComponent(whatsappMessage)}`;

  // Product Schema
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.metaDescription || product.shortDescription || "",
    image: imageUrl(product.featuredImage),
    category: categoryLabel,
    url: productUrl,
    ...(product.productCode ? { mpn: product.productCode, sku: product.productCode } : {}),
    brand: {
      "@type": "Brand",
      name: settings?.siteName || "هزاره کالا دانش اروند",
    },
    manufacturer: {
      "@type": "Organization",
      name: "هزاره کالا دانش اروند / تراکتورسازی و موتورسازان تبریز",
    },
    offers: priceAvailable
      ? {
          "@type": "Offer",
          url: productUrl,
          priceCurrency: "IRR",
          price: ((product.price || 0) * 10).toString(),
          priceSpecification: {
            "@type": "PriceSpecification",
            valueAddedTaxIncluded: true,
          },
          availability: "https://schema.org/InStock",
          itemCondition: "https://schema.org/NewCondition",
          seller: {
            "@type": "Organization",
            name: "هزاره کالا دانش اروند",
          },
        }
      : {
          "@type": "AggregateOffer",
          url: productUrl,
          priceCurrency: "IRR",
          price: "Call for Price",
          availability: "https://schema.org/InStock",
          itemCondition: "https://schema.org/NewCondition",
          seller: {
            "@type": "Organization",
            name: "هزاره کالا دانش اروند",
          },
        },
  };

  function imageUrl(media: any) {
    return media ? getMediaUrl(media) : "";
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      <BreadcrumbSchema
        items={[
          { name: "خانه", url: SITE_URL },
          { name: "محصولات", url: `${SITE_URL}/products` },
          { name: product.title, url: productUrl },
        ]}
      />

      <main className="min-h-screen bg-white" dir="rtl">
        <Header settings={settings} />

        {/* Hidden image for SEO */}
        {heroImage && (
          <img src={heroImage} alt={imageAlt} className="hidden" aria-hidden="true" />
        )}

        {/* Hero */}
        <section
          className="relative min-h-[70vh] flex items-end pb-16 md:pb-20 bg-cover bg-center"
          style={
            heroImage
              ? {
                  backgroundImage: `linear-gradient(
                    to top,
                    rgba(6, 15, 28, 0.95) 0%,
                    rgba(6, 15, 28, 0.75) 35%,
                    rgba(6, 15, 28, 0.4) 70%,
                    rgba(6, 15, 28, 0.2) 100%
                  ), url('${heroImage}')`,
                }
              : { background: "linear-gradient(180deg, #0a1628 0%, #162033 100%)" }
          }
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-l from-[#c49a2c] via-[#c49a2c]/50 to-transparent" />
          <div className="relative w-full px-6 md:px-12 lg:px-16">
            <Link href="/products" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-5 transition-colors text-sm">
              <ArrowRight size={14} />
              <span>بازگشت به کاتالوگ محصولات</span>
            </Link>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              {categoryLabel && (
                <span className="text-xs font-bold text-[#c49a2c] bg-[#c49a2c]/10 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-[#c49a2c]/20">
                  {categoryLabel}
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-4xl lg:text-5xl font-black text-white leading-tight max-w-3xl mb-4">
              {product.title}
            </h1>

            {product.shortDescription && (
              <p className="text-gray-300 text-base md:text-lg max-w-2xl leading-relaxed mb-6">
                {product.shortDescription}
              </p>
            )}

            {/* Price & Commercial Capsule in Hero */}
            {priceAvailable && (
              <div className="bg-[#0a1628]/80 backdrop-blur-md border border-[#c49a2c]/30 rounded-2xl p-4 md:p-5 max-w-2xl mb-6 shadow-2xl">
                <div className="flex flex-wrap items-baseline justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#c49a2c] font-bold">قیمت قطعی کارخانه:</span>
                    <span className="text-2xl md:text-3xl font-black text-white">
                      {formattedPrice}
                    </span>
                  </div>
                  {product.productCode && (
                    <span className="text-xs bg-white/10 text-gray-200 font-mono px-3 py-1 rounded-full border border-white/20" dir="ltr">
                      کد محصول: {product.productCode}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-lg border border-emerald-500/30 font-medium">
                    <CheckCircle2 size={13} className="shrink-0" />
                    <span>با احتساب مالیات بر ارزش افزوده</span>
                  </span>
                  {product.freeSetupCities && (
                    <span className="inline-flex items-center gap-1 bg-[#c49a2c]/20 text-[#e6b83b] px-2.5 py-1 rounded-lg border border-[#c49a2c]/40 font-medium">
                      🎁 تست و راه‌اندازی رایگان در {product.freeSetupCities} (اشانتیون)
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={inquiryUrl}
                className="inline-flex items-center gap-2 bg-[#c49a2c] hover:bg-[#d4a82c] text-black px-6 py-3 rounded-xl font-bold text-sm transition-all hover:shadow-lg hover:shadow-[#c49a2c]/20"
              >
                {priceAvailable ? <ShoppingBag size={16} /> : <Phone size={16} />}
                <span>{priceAvailable ? "سفارش و صدور پیش‌فاکتور" : "استعلام قیمت و مشاوره فنی"}</span>
              </Link>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl font-bold text-sm transition-all shadow-md"
              >
                <MessageCircle size={16} />
                <span>{priceAvailable ? "سفارش در واتساپ" : "استعلام در واتساپ"}</span>
              </a>
              <Link
                href={`/compare?p1=${product.slug}`}
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-5 py-3 rounded-xl font-bold text-sm transition-all backdrop-blur-md"
              >
                <ArrowLeftRight size={16} />
                <span>مقایسه مشخصات فنی</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ── محتوا ── */}
        <section className="py-12 md:py-16">
          <div className="w-full px-6 md:px-12 lg:px-16">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2 space-y-10">
                <div>
                  <h2 className="text-2xl font-extrabold text-[#0a1628] mb-6 pb-3 border-b-2 border-[#c49a2c]/20">
                    معرفی و مشخصات محصول
                  </h2>
                  {product.fullDescription ? (
                    <RichTextRenderer content={product.fullDescription} />
                  ) : product.shortDescription ? (
                    <p className="text-gray-600 leading-[1.9] text-justify">{product.shortDescription}</p>
                  ) : (
                    <p className="text-gray-400">توضیحاتی ثبت نشده است.</p>
                  )}
                </div>

                {/* شرایط فروش، گارانتی و خدمات ویژه */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
                  <h3 className="font-black text-[#0a1628] mb-5 text-xl flex items-center gap-2.5">
                    <Info size={22} className="text-[#c49a2c]" />
                    <span>شرایط فروش، گارانتی و خدمات ویژه</span>
                  </h3>

                  {product.commercialTerms ? (
                    <div className="text-gray-700 leading-relaxed text-sm whitespace-pre-line text-justify bg-gray-50 p-4 rounded-xl border border-gray-100">
                      {product.commercialTerms}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-start gap-3">
                        <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center shrink-0 text-xs">۱</div>
                        <div>
                          <h4 className="font-bold text-[#0a1628] text-sm mb-1">مالیات بر ارزش افزوده</h4>
                          <p className="text-gray-600 text-xs leading-relaxed">کلیه قیمت‌های اعلام‌شده با احتساب مالیات و عوارض ارزش افزوده بوده و مبلغ آن در قیمت نهایی لحاظ شده است.</p>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-start gap-3">
                        <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-xs">۲</div>
                        <div>
                          <h4 className="font-bold text-[#0a1628] text-sm mb-1">گارانتی و خدمات پس از فروش</h4>
                          <p className="text-gray-600 text-xs leading-relaxed">{product.warranty || "کلیه دستگاه‌های فوق دارای گارانتی و خدمات پس از فروش شرکت ماشین‌سازی تبریز می‌باشند. خدمات گارانتی و پشتیبانی فنی مطابق شرایط ضمانت‌نامه رسمی شرکت ارائه می‌گردد."}</p>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/60 flex items-start gap-3">
                        <div className="w-7 h-7 rounded-full bg-amber-200 text-amber-800 font-bold flex items-center justify-center shrink-0 text-xs">۳</div>
                        <div>
                          <h4 className="font-bold text-[#0a1628] text-sm mb-1">تست و راه‌اندازی رایگان (اشانتیون)</h4>
                          <p className="text-gray-600 text-xs leading-relaxed">خدمات تست، روشن‌کردن اولیه و راه‌اندازی دستگاه‌ها در محل خریدار، برای شهرهای {product.freeSetupCities || "آبادان و خرمشهر"} به‌صورت کاملاً رایگان (اشانتیون) توسط فروشنده ارائه می‌گردد.</p>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-start gap-3">
                        <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center shrink-0 text-xs">۴</div>
                        <div>
                          <h4 className="font-bold text-[#0a1628] text-sm mb-1">شرایط نصب و زیرساخت</h4>
                          <p className="text-gray-600 text-xs leading-relaxed">کلیه اقدامات اجرایی و زیرساختی مربوط به نصب دستگاه، شامل آماده‌سازی محل، اجرای فونداسیون، جانمایی، کابل‌کشی و اتصالات برقی و مکانیکی (و زیرساخت گاز برای مدل گازسوز) بر عهده خریدار می‌باشد.</p>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-start gap-3">
                        <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center shrink-0 text-xs">۵</div>
                        <div>
                          <h4 className="font-bold text-[#0a1628] text-sm mb-1">باتری و مواد مصرفی</h4>
                          <p className="text-gray-600 text-xs leading-relaxed">تأمین و خرید باتری، روغن موتور، مایع خنک‌کننده، سوخت و سایر مواد مصرفی موردنیاز جهت تست و راه‌اندازی، بر عهده خریدار بوده و هزینه آن‌ها در قیمت اعلام‌شده محاسبه نشده است.</p>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-start gap-3">
                        <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center shrink-0 text-xs">۶</div>
                        <div>
                          <h4 className="font-bold text-[#0a1628] text-sm mb-1">شرایط انجام راه‌اندازی رایگان</h4>
                          <p className="text-gray-600 text-xs leading-relaxed">انجام تست و راه‌اندازی رایگان منوط به تکمیل عملیات نصب و آماده‌سازی فیزیکی دستگاه و تأمین کلیه ملزومات و مواد مصرفی توسط خریدار می‌باشد.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* پیوست‌ها و کاتالوگ PDF */}
                {documents && documents.length > 0 && (
                  <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
                    <h3 className="font-extrabold text-[#0a1628] mb-4 text-lg flex items-center gap-2">
                      <FileDown size={20} className="text-[#c49a2c]" />
                      <span>کاتالوگ‌ها و اسناد فنی پیوست (PDF)</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {documents.map((doc: any, i: number) => {
                        const fileUrl = getMediaUrl(doc.file);
                        return (
                          <a
                            key={i}
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                            className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-gray-200 hover:border-[#c49a2c] hover:shadow-md transition-all group"
                          >
                            <span className="text-xs font-bold text-gray-800 group-hover:text-[#c49a2c] line-clamp-1">
                              {doc.title || "دانلود کاتالوگ فنی (PDF)"}
                            </span>
                            <FileDown size={18} className="text-gray-400 group-hover:text-[#c49a2c] shrink-0 mr-2" />
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {/* کارت قیمت و شرایط رسمی خرید در ستون کناری */}
                <div className="bg-gradient-to-b from-white to-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <h3 className="font-extrabold text-[#0a1628] text-base flex items-center gap-2">
                      <Tag size={18} className="text-[#c49a2c]" />
                      <span>شرایط فروش و استعلام قیمت</span>
                    </h3>
                    {product.productCode && (
                      <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200" dir="ltr">
                        کد: {product.productCode}
                      </span>
                    )}
                  </div>

                  {priceAvailable ? (
                    <div className="bg-amber-500/10 border border-[#c49a2c]/30 rounded-xl p-4">
                      <div className="text-xs text-gray-500 mb-1">قیمت نهایی محصول:</div>
                      <div className="text-2xl font-black text-[#0a1628] mb-1">
                        {formattedPrice}
                      </div>
                      <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                        <CheckCircle2 size={13} />
                        <span>قیمت قطعی با احتساب مالیات و عوارض ارزش افزوده</span>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-100 border border-slate-200 rounded-xl p-4">
                      <div className="text-sm font-bold text-[#0a1628]">استعلام قیمت فوری و سفارش</div>
                      <div className="text-xs text-gray-500 mt-1">جهت دریافت پیش‌فاکتور رسمی و مشاوره مهندسی با ما در تماس باشید.</div>
                    </div>
                  )}

                  {/* گارانتی و خدمات */}
                  <div className="space-y-2.5 text-xs text-gray-700 pt-1">
                    <div className="flex items-start gap-2">
                      <ShieldCheck size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-gray-900">گارانتی و خدمات: </span>
                        <span>{product.warranty || "دارای گارانتی و خدمات پس از فروش شرکت ماشین‌سازی تبریز"}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Wrench size={16} className="text-[#c49a2c] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-gray-900">تست و راه‌اندازی رایگان: </span>
                        <span>تست، استارت اولیه و راه‌اندازی در محل خریدار برای شهرهای {product.freeSetupCities || "آبادان و خرمشهر"} رایگان (اشانتیون) است.</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Truck size={16} className="text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-gray-900">تحویل کالا: </span>
                        <span>آماده تحویل از انبار مرکزی شرکت هزاره کالا دانش اروند</span>
                      </div>
                    </div>
                  </div>

                  {/* دکمه‌های اقدام سریع */}
                  <div className="pt-2 space-y-2">
                    <Link
                      href={inquiryUrl}
                      className="flex items-center justify-center gap-2 w-full text-center bg-[#c49a2c] hover:bg-[#d4a82c] text-black py-3 rounded-xl font-bold transition-all hover:shadow-lg hover:shadow-[#c49a2c]/20 text-xs sm:text-sm"
                    >
                      {priceAvailable ? <ShoppingBag size={16} /> : <Phone size={16} />}
                      <span>{priceAvailable ? "درخواست خرید و صدور پیش‌فاکتور" : "استعلام قیمت و صدور پیش‌فاکتور"}</span>
                    </Link>

                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full text-center bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-bold transition-all text-xs"
                    >
                      <MessageCircle size={15} />
                      <span>{priceAvailable ? "سفارش مستقیم در واتساپ" : "استعلام سریع در واتساپ"}</span>
                    </a>

                    <a
                      href={`tel:${COMPANY.phone.replace(/[^\d+]/g, "")}`}
                      className="flex items-center justify-center gap-2 w-full text-center bg-gray-900 hover:bg-black text-white py-2.5 rounded-xl font-bold transition-all text-xs"
                    >
                      <Phone size={14} />
                      <span>تماس مستقیم با واحد فنی</span>
                    </a>
                  </div>
                </div>

                {specs.length > 0 && (
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6">
                    <h2 className="font-extrabold text-[#0a1628] mb-5 text-lg">مشخصات فنی</h2>
                    <dl className="space-y-3">
                      {specs.map((spec: any, i: number) => (
                        <div key={i} className="flex justify-between items-center py-2.5 border-b border-gray-200 last:border-b-0 gap-4">
                          <dt className="text-gray-500 text-xs sm:text-sm font-medium shrink-0">
                            <span>{getSpecLabel(spec)}:</span>
                            {spec.unit && !spec.standardFeature && (
                              <span dir="ltr" className="inline-block text-[11px] text-gray-400 font-normal mr-1">
                                ({spec.unit})
                              </span>
                            )}
                          </dt>
                          <dd className="font-bold text-[#0a1628] text-xs sm:text-sm text-left">
                            <SpecValueDisplay value={spec.value} unit={spec.unit} />
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                )}

                <div className="bg-[#c49a2c]/5 border border-[#c49a2c]/20 rounded-2xl p-6 space-y-3">
                  <h3 className="font-extrabold text-[#0a1628] mb-1">نیاز به مقایسه دارید؟</h3>
                  <p className="text-gray-600 text-xs sm:text-sm mb-4">می‌توانید مشخصات فنی این دستگاه را در کنار سایر مدل‌ها به صورت جدولی مقایسه نمایید.</p>

                  <Link
                    href={`/compare?p1=${product.slug}`}
                    className="block w-full text-center bg-white hover:bg-gray-50 text-[#0a1628] border border-gray-200 py-2.5 rounded-xl font-bold transition-all text-xs"
                  >
                    مقایسه این مدل با سایر محصولات
                  </Link>
                </div>
              </div>
            </div>

            {/* گالری تصاویر با لایت‌باکس */}
            <ProductGallery
              gallery={galleryImages}
              featuredImage={product.featuredImage}
              productTitle={product.title}
            />
          </div>
        </section>

        <Footer settings={settings} />
      </main>
    </>
  );
}