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
import { ArrowRight, Phone, ArrowLeftRight } from "lucide-react";
import { getSpecLabel, SpecValueDisplay } from "@/lib/specs";

import { DEFAULT_PRODUCTS } from "@/lib/constants";

async function getProduct(slug: string) {
  try {
    const res = await fetch(`${PAYLOAD_API_URL}/products?where[slug][equals]=${encodeURIComponent(slug)}&limit=1`, {
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

const CATEGORY_LABELS: Record<string, string> = {
  centrifugal: "سانتریفیوژ",
  piston: "پیستونی",
  gear: "دنده‌ای",
  multistage: "طبقاتی",
  other: "سایر",
};

type ProductSpec = {
  label?: string;
  value?: string;
};

type ProductGalleryItem = {
  image?: Parameters<typeof getMediaUrl>[0];
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  const imageUrl = product?.featuredImage ? getMediaUrl(product.featuredImage) : "";

  return {
    title: product?.metaTitle || product?.title || "محصول",
    description:
      product?.metaDescription ||
      product?.shortDescription ||
      `پمپ ${product?.title || "صنعتی"} - هزاره کالا دانش اروند | تولیدکننده پمپ‌های صنعتی در آبادان`,
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
  const heroImage = getMediaUrl(product.featuredImage);
  const imageAlt =
    product.featuredImage && typeof product.featuredImage === "object" && "alt" in product.featuredImage
      ? product.featuredImage.alt || product.title
      : product.title;
  const productUrl = `${SITE_URL}/products/${product.slug}`;

  // Product Schema
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.metaDescription || product.shortDescription || "",
    image: product.featuredImage ? getMediaUrl(product.featuredImage) : "",
    category: product.category
      ? getProductCategoryLabel(product.category)
      : "پمپ صنعتی",
    url: productUrl,
    brand: {
      "@type": "Brand",
      name: settings?.siteName || "هزاره کالا",
    },
    manufacturer: {
      "@type": "Organization",
      name: "هزاره کالا دانش اروند",
    },
    offers: {
      "@type": "Offer",
      url: productUrl,
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: "هزاره کالا دانش اروند",
      },
    },
  };

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

        {/* Hidden image for SEO (background-image ایندکس نمیشه) */}
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
              <span>محصولات</span>
            </Link>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              {product.category && (
                <span className="text-xs font-bold text-[#c49a2c] bg-[#c49a2c]/10 backdrop-blur-sm px-3 py-1 rounded-full">
                  {getProductCategoryLabel(product.category)}
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

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-[#c49a2c] hover:bg-[#d4a82c] text-black px-6 py-3 rounded-xl font-bold text-sm transition-all hover:shadow-lg hover:shadow-[#c49a2c]/20"
              >
                <Phone size={16} />
                <span>استعلام قیمت</span>
              </Link>
              <Link
                href={`/compare?p1=${product.slug}`}
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-5 py-3 rounded-xl font-bold text-sm transition-all backdrop-blur-md"
              >
                <ArrowLeftRight size={16} />
                <span>مقایسه با سایر پمپ‌ها</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ── محتوا ── */}
        <section className="py-12 md:py-16">
          <div className="w-full px-6 md:px-12 lg:px-16">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-extrabold text-[#0a1628] mb-6 pb-3 border-b-2 border-[#c49a2c]/20">
                  توضیحات محصول
                </h2>
                {product.fullDescription ? (
                  <RichTextRenderer content={product.fullDescription} />
                ) : product.shortDescription ? (
                  <p className="text-gray-600 leading-[1.9] text-justify">{product.shortDescription}</p>
                ) : (
                  <p className="text-gray-400">توضیحاتی ثبت نشده است.</p>
                )}
              </div>

              <div className="space-y-6">
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
                  <h3 className="font-extrabold text-[#0a1628] mb-1">نیاز به مشاوره دارید؟</h3>
                  <p className="text-gray-600 text-xs sm:text-sm mb-4">برای استعلام قیمت و مشاوره فنی با ما تماس بگیرید.</p>
                  <Link
                    href="/contact"
                    className="block w-full text-center bg-[#c49a2c] hover:bg-[#d4a82c] text-black py-3 rounded-xl font-bold transition-all hover:shadow-lg hover:shadow-[#c49a2c]/20 text-xs sm:text-sm"
                  >
                    استعلام قیمت
                  </Link>
                  <Link
                    href={`/compare?p1=${product.slug}`}
                    className="block w-full text-center bg-white hover:bg-gray-50 text-[#0a1628] border border-gray-200 py-2.5 rounded-xl font-bold transition-all text-xs"
                  >
                    مقایسه این مدل با سایر محصولات
                  </Link>
                </div>
              </div>
            </div>

            {/* گالری با لایت‌باکس */}
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