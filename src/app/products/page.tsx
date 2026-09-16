import { Suspense } from "react";
import type { Metadata } from "next";
import { getProducts, getProductCategories, getSettings, getPage } from "@/lib/payload";
import { SITE_URL } from "@/lib/env";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import BreadcrumbSchema from "@/components/ui/BreadcrumbSchema";
import { getMediaUrl } from "@/lib/media";
import ProductsCatalogView from "./ProductsCatalogView";
import type { Product, ProductCategory } from "@/payload-types";

export const revalidate = 60;

const FALLBACK_CATEGORIES = [
  { slug: "generators", title: "دیزل ژنراتور و موتور دیزلی" },
  { slug: "sludge-pumps", title: "پمپ لجن‌کش و خودمکش" },
  { slug: "gear-pumps", title: "پمپ دنده‌ای پرتابل" },
  { slug: "centrifugal", title: "پمپ سانتریفیوژ" },
  { slug: "piston", title: "پمپ پیستونی" },
  { slug: "gear", title: "پمپ دنده‌ای" },
  { slug: "multistage", title: "پمپ طبقاتی" },
  { slug: "wet-blast", title: "وت بلاست و آماده‌سازی سطح" },
  { slug: "machining", title: "خدمات ماشین‌کاری سنگین" },
];

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("products");
  return {
    title: page?.metaTitle || page?.title || "کاتالوگ محصولات و تجهیزات صنعتی",
    description:
      page?.metaDescription ||
      page?.excerpt ||
      "تجهیزات صنعتی و پمپ‌های سنگین هزاره کالا دانش اروند: دیزل ژنراتور، پمپ خودمکش لجن‌کش، پمپ دنده‌ای پرتابل، وت بلاست و قطعات صنعتی با استعلام مستقیم قیمت.",
    alternates: {
      canonical: `${SITE_URL}/products`,
    },
    openGraph: {
      type: "website",
      title: page?.metaTitle || page?.title || "کاتالوگ محصولات | هزاره کالا دانش اروند",
      description: page?.metaDescription || page?.excerpt || "",
      images: page?.heroImage ? [{ url: getMediaUrl(page.heroImage) }] : [],
    },
  };
}

export default async function ProductsPage() {
  const [products, cmsCategories, settings, page] = await Promise.all([
    getProducts(),
    getProductCategories(),
    getSettings(),
    getPage("products"),
  ]);

  // Combine CMS categories with fallbacks
  const categoriesMap = new Map<string, { id?: string; title: string; slug: string }>();

  if (cmsCategories && cmsCategories.length > 0) {
    for (const cat of cmsCategories) {
      if (cat && cat.slug) {
        categoriesMap.set(cat.slug, {
          id: cat.id,
          title: cat.title,
          slug: cat.slug,
        });
      }
    }
  }

  // Ensure default/new categories exist in filter bar
  for (const fb of FALLBACK_CATEGORIES) {
    if (!categoriesMap.has(fb.slug)) {
      categoriesMap.set(fb.slug, fb);
    }
  }

  const categoryList = Array.from(categoriesMap.values());

  // Schema.org ItemList for zero prices B2B
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement:
      products?.map((product: Product, index: number) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Product",
          name: product.title,
          description: product.shortDescription || "",
          image: product.featuredImage ? getMediaUrl(product.featuredImage) : "",
          url: `${SITE_URL}/products/${product.slug}`,
          offers: {
            "@type": "AggregateOffer",
            priceCurrency: "IRR",
            price: "Call for Price",
            availability: "https://schema.org/InStock",
            seller: {
              "@type": "Organization",
              name: "هزاره کالا دانش اروند",
            },
          },
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
          title={page?.title || "محصولات و تجهیزات صنعتی"}
          subtitle={page?.subtitle || "تولیدات مهندسی و ماشین‌آلات صنعتی"}
          excerpt={page?.excerpt || "تولید انواع پمپ‌های صنعتی، دیزل ژنراتورها، تجهیزات پرتابل و خدمات ماشین‌کاری فوق سنگین"}
          image={page?.heroImage}
          breadcrumb={[{ label: "خانه", href: "/" }, { label: page?.title || "محصولات" }]}
        />

        <div className="w-full px-4 md:px-6 lg:px-8 py-10 md:py-14">
          <Suspense
            fallback={
              <div className="text-center py-20 text-gray-400">
                در حال بارگذاری کاتالوگ محصولات...
              </div>
            }
          >
            <ProductsCatalogView
              products={products || []}
              categories={categoryList}
            />
          </Suspense>
        </div>

        <Footer settings={settings} />
      </main>
    </>
  );
}