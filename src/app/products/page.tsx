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
import IndustrialDivider from "@/components/ui/IndustrialDivider";
import { getProductCategorySlug, getProductCategoryLabel } from "@/lib/product-category";
import type { Product, ProductCategory } from "@/payload-types";

export const revalidate = 60;

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

  // Filter active published products
  const activeProducts = products?.filter((p: Product) => p.isActive !== false) || [];

  // Compute live product counts per category slug
  const categoryCounts: Record<string, number> = {};
  for (const p of activeProducts) {
    const slug = getProductCategorySlug(p.category);
    if (slug) {
      categoryCounts[slug] = (categoryCounts[slug] || 0) + 1;
    }
  }

  // Only include categories that are active AND have at least 1 published product
  const categoriesMap = new Map<string, { id?: string; title: string; slug: string; count: number }>();

  if (cmsCategories && cmsCategories.length > 0) {
    for (const cat of cmsCategories) {
      if (cat && cat.slug && cat.isActive !== false) {
        const count = categoryCounts[cat.slug] || 0;
        if (count > 0) {
          categoriesMap.set(cat.slug, {
            id: cat.id,
            title: cat.title,
            slug: cat.slug,
            count,
          });
        }
      }
    }
  }

  // Also include any active categories derived from existing products
  for (const p of activeProducts) {
    const slug = getProductCategorySlug(p.category);
    if (slug && !categoriesMap.has(slug)) {
      const count = categoryCounts[slug] || 0;
      if (count > 0) {
        categoriesMap.set(slug, {
          title: getProductCategoryLabel(p.category) || slug,
          slug,
          count,
        });
      }
    }
  }

  // Order categories by product count descending (most popular first)
  const categoryList = Array.from(categoriesMap.values()).sort((a, b) => b.count - a.count);

  // Schema.org ItemList for zero prices B2B
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement:
      activeProducts.map((product: Product, index: number) => ({
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

      <main className="min-h-screen bg-slate-50/60" dir="rtl">
        <Header settings={settings} />

        <PageHero
          title={page?.title || "محصولات و تجهیزات صنعتی"}
          subtitle={page?.subtitle || "تولیدات مهندسی و ماشین‌آلات صنعتی"}
          excerpt={page?.excerpt || "تولید انواع پمپ‌های صنعتی، دیزل ژنراتورها، تجهیزات پرتابل و خدمات ماشین‌کاری فوق سنگین"}
          image={page?.heroImage}
          breadcrumb={[{ label: "خانه", href: "/" }, { label: page?.title || "محصولات" }]}
        />

        {/* Industrial Section Separator */}
        <div className="w-full px-4 md:px-6 lg:px-8">
          <IndustrialDivider
            variant="ruler"
            coordinates="30°20'N 48°17'E"
            plantLabel="CERTIFIED INDUSTRIAL EQUIPMENT · HK-2018"
            className="my-6 md:my-8"
          />
        </div>

        <div className="w-full px-4 md:px-6 lg:px-8 pb-10 md:pb-14">
          <Suspense
            fallback={
              <div className="text-center py-20 text-gray-400">
                در حال بارگذاری کاتالوگ محصولات...
              </div>
            }
          >
            <ProductsCatalogView
              products={activeProducts}
              categories={categoryList}
            />
          </Suspense>
        </div>

        <Footer settings={settings} />
      </main>
    </>
  );
}
