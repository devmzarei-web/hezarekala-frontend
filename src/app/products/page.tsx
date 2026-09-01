import type { Metadata } from "next";
import { getProducts, getSettings, getPage } from "@/lib/payload";
import { SITE_URL } from "@/lib/env";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import BreadcrumbSchema from "@/components/ui/BreadcrumbSchema";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getMediaUrl } from "@/lib/media";
import { getProductCategoryLabel } from "@/lib/product-category";

export const revalidate = 60;

const CATEGORY_LABELS: Record<string, string> = {
  centrifugal: "سانتریفیوژ",
  piston: "پیستونی",
  gear: "دنده‌ای",
  multistage: "طبقاتی",
  other: "سایر",
};

type ProductItem = {
  id: string;
  title: string;
  slug: string;
  shortDescription?: string;
  category?: string;
  featuredImage?:
    | string
    | {
        url?: string;
        alt?: string;
        filename?: string;
      };
};

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("products");
  return {
    title: page?.metaTitle || page?.title || "محصولات",
    description:
      page?.metaDescription ||
      page?.excerpt ||
      "پمپ‌های صنعتی هزاره کالا: سانتریفیوژ، پیستونی، دنده‌ای و طبقاتی برای صنایع نفت، گاز، پتروشیمی و نیروگاهی. تولید ایران - شهرک صنعتی آبادان.",
    alternates: {
      canonical: `${SITE_URL}/products`,
    },
    openGraph: {
      type: "website",
      title: page?.metaTitle || page?.title || "محصولات هزاره کالا",
      description: page?.metaDescription || page?.excerpt || "",
      images: page?.heroImage ? [{ url: getMediaUrl(page.heroImage) }] : [],
    },
  };
}

export default async function ProductsPage() {
  const [products, settings, page] = await Promise.all([
    getProducts(),
    getSettings(),
    getPage("products"),
  ]);

  // ItemList Schema
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products?.map((product: ProductItem, index: number) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: product.title,
        description: product.shortDescription || "",
        image: product.featuredImage ? getMediaUrl(product.featuredImage) : "",
        url: `${SITE_URL}/products/${product.slug}`,
      },
    })) || [],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      <BreadcrumbSchema
        items={[
          { name: "خانه", url: SITE_URL },
          { name: page?.title || "محصولات", url: `${SITE_URL}/products` },
        ]}
      />

      <main className="min-h-screen bg-gray-50" dir="rtl">
        <Header settings={settings} />

        <PageHero
          title={page?.title || "محصولات"}
          subtitle={page?.subtitle || "محصولات ما"}
          excerpt={page?.excerpt || ""}
          image={page?.heroImage}
          breadcrumb={[{ label: "خانه", href: "/" }, { label: page?.title || "محصولات" }]}
        />

        <div className="w-full px-4 md:px-6 lg:px-8 py-16">
          {products && products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product: ProductItem) => {
                const imageAlt =
                  product.featuredImage && typeof product.featuredImage === "object" && "alt" in product.featuredImage
                    ? product.featuredImage.alt || product.title
                    : product.title;
                return (
                  <article key={product.id}>
                    <Link
                      href={`/products/${product.slug}`}
                      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#c49a2c]/20 transition-all duration-300 flex flex-col"
                    >
                      <div className="relative aspect-[16/9] bg-gray-100 overflow-hidden">
                        <img
                          src={getMediaUrl(product.featuredImage)}
                          alt={imageAlt}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                          decoding="async"
                        />
                        {product.category && (
                          <span className="absolute top-3 right-3 bg-[#c49a2c] text-black text-xs font-bold px-3 py-1 rounded-full">
                            {getProductCategoryLabel(product.category)}
                          </span>
                        )}
                      </div>
                      <div className="p-5 flex flex-col flex-1">
                        <h3 className="text-lg font-bold text-[#0a1628] mb-2 group-hover:text-[#c49a2c] transition-colors line-clamp-1">
                          {product.title}
                        </h3>
                        {product.shortDescription && (
                          <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2 flex-1">
                            {product.shortDescription}
                          </p>
                        )}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <span className="text-[#c49a2c] font-bold text-xs flex items-center gap-1">
                            مشاهده جزئیات
                            <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20">
              <h2 className="text-xl font-bold text-gray-700 mb-2">محصولی یافت نشد</h2>
              <p className="text-gray-500">در حال حاضر محصولی برای نمایش وجود ندارد.</p>
            </div>
          )}
        </div>

        <Footer settings={settings} />
      </main>
    </>
  );
}