import type { Metadata } from "next";
import { getSettings, getPage, getProducts } from "@/lib/payload";
import { SITE_URL, PAYLOAD_API_URL } from "@/lib/env";
import { getMediaUrl } from "@/lib/media";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import BreadcrumbSchema from "@/components/ui/BreadcrumbSchema";
import GalleryView, { type UnifiedGalleryItem } from "./GalleryView";

export const revalidate = 60;

async function getGalleryItems(): Promise<any[]> {
  try {
    const res = await fetch(`${PAYLOAD_API_URL}/gallery?sort=-order&limit=150`, {
      signal: AbortSignal.timeout(3000),
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.docs ?? [];
  } catch {
    return [];
  }
}

async function getProjectsItems(): Promise<any[]> {
  try {
    const res = await fetch(`${PAYLOAD_API_URL}/projects?sort=-order&limit=100`, {
      signal: AbortSignal.timeout(3000),
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.docs ?? [];
  } catch {
    return [];
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("gallery");
  return {
    title: page?.metaTitle || page?.title || "آرشیو تصاویر و گالری | هزاره کالا",
    description:
      page?.metaDescription ||
      page?.excerpt ||
      "آرشیو کامل و بدون تکرار تصاویر محصولات، خط تولید، کارگاه ساخت، پروژه‌های صنعتی و فعالیت‌های شرکت هزاره کالا دانش اروند در آبادان.",
    alternates: { canonical: `${SITE_URL}/gallery` },
    openGraph: {
      title: page?.metaTitle || page?.title || "آرشیو تصاویر و گالری | هزاره کالا",
      description: page?.metaDescription || page?.excerpt || "",
      images: page?.heroImage ? [{ url: getMediaUrl(page.heroImage) }] : [],
    },
  };
}

/**
 * Generates a normalized unique key for any media reference to guarantee zero duplicate images.
 */
function getMediaAssetKey(media: any): string {
  if (!media) return "";
  if (typeof media === "string") {
    const cleaned = media.split("?")[0].replace(/^https?:\/\/[^\/]+/, "").trim().toLowerCase();
    const basename = cleaned.split("/").pop() || cleaned;
    return basename;
  }
  if (typeof media === "object") {
    if (media.id) return `id-${media.id}`;
    if (media.filename) return `file-${media.filename.trim().toLowerCase()}`;
    if (media.url) {
      const cleaned = media.url.split("?")[0].replace(/^https?:\/\/[^\/]+/, "").trim().toLowerCase();
      const basename = cleaned.split("/").pop() || cleaned;
      return basename;
    }
  }
  return "";
}

const CATEGORY_NAMES: Record<string, string> = {
  products: "محصولات و تجهیزات",
  centrifugal: "پمپ سانتریفیوژ",
  piston: "پمپ پیستونی",
  gear: "پمپ دنده‌ای",
  multistage: "پمپ طبقاتی",
  workshop: "کارگاه و خط تولید",
  projects: "پروژه‌ها و اجرا",
  company: "معرفی شرکت و تیم",
  team: "تیم و سازمان",
  other: "عمومی و کارخانه",
};

export default async function GalleryPage() {
  const [settings, page, galleryDocs, productDocs, projectDocs] = await Promise.all([
    getSettings(),
    getPage("gallery"),
    getGalleryItems(),
    getProducts(),
    getProjectsItems(),
  ]);

  // Use a map to guarantee deduplication
  const itemsMap = new Map<string, UnifiedGalleryItem>();

  // 1. Process Product Images (High priority with direct product links)
  productDocs.forEach((prod: any) => {
    // Featured Image
    if (prod.featuredImage) {
      const key = getMediaAssetKey(prod.featuredImage);
      if (key && !itemsMap.has(key)) {
        const featUrl = getMediaUrl(prod.featuredImage);
        itemsMap.set(key, {
          id: `prod-${prod.id}-feat`,
          title: prod.title,
          imageUrl: featUrl,
          thumbnailUrl: featUrl,
          category: prod.category && CATEGORY_NAMES[prod.category] ? prod.category : "products",
          categoryLabel: prod.category && CATEGORY_NAMES[prod.category] ? CATEGORY_NAMES[prod.category] : "محصولات",
          sourceTitle: prod.title,
          sourceLink: `/products/${prod.slug}`,
          sourceType: "product",
          alt:
            typeof prod.featuredImage === "object" && prod.featuredImage?.alt
              ? prod.featuredImage.alt
              : prod.title,
        });
      }
    }

    // Product Gallery Images
    if (Array.isArray(prod.gallery)) {
      prod.gallery.forEach((gItem: any, gIdx: number) => {
        if (!gItem?.image) return;
        const key = getMediaAssetKey(gItem.image);
        if (key && !itemsMap.has(key)) {
          const gUrl = getMediaUrl(gItem.image);
          itemsMap.set(key, {
            id: `prod-${prod.id}-g-${gIdx}`,
            title: `${prod.title} (نمای ${gIdx + 1})`,
            imageUrl: gUrl,
            thumbnailUrl: gUrl,
            category: prod.category && CATEGORY_NAMES[prod.category] ? prod.category : "products",
            categoryLabel: prod.category && CATEGORY_NAMES[prod.category] ? CATEGORY_NAMES[prod.category] : "محصولات",
            sourceTitle: prod.title,
            sourceLink: `/products/${prod.slug}`,
            sourceType: "product",
            alt:
              typeof gItem.image === "object" && gItem.image?.alt
                ? gItem.image.alt
                : `${prod.title} - تصویر ${gIdx + 1}`,
          });
        }
      });
    }
  });

  // 2. Process Project Images
  projectDocs.forEach((proj: any) => {
    if (proj.featuredImage) {
      const key = getMediaAssetKey(proj.featuredImage);
      if (key && !itemsMap.has(key)) {
        const projUrl = getMediaUrl(proj.featuredImage);
        itemsMap.set(key, {
          id: `proj-${proj.id}`,
          title: proj.title,
          imageUrl: projUrl,
          thumbnailUrl: projUrl,
          category: "projects",
          categoryLabel: "پروژه‌ها و اجرا",
          sourceTitle: proj.title,
          sourceLink: `/projects`,
          sourceType: "project",
          alt:
            typeof proj.featuredImage === "object" && proj.featuredImage?.alt
              ? proj.featuredImage.alt
              : proj.title,
        });
      }
    }
  });

  // 3. Process General Gallery Items
  galleryDocs.forEach((item: any, i: number) => {
    if (!item?.image) return;
    const key = getMediaAssetKey(item.image);
    const url = getMediaUrl(item.image);

    const rawCategory = item.category || "workshop";
    let categoryKey = rawCategory;
    let categoryLabel = CATEGORY_NAMES[rawCategory] || "کارگاه و خط تولید";

    if (rawCategory === "workshop") {
      categoryKey = "workshop";
      categoryLabel = "کارگاه و خط تولید";
    } else if (rawCategory === "products") {
      categoryKey = "products";
      categoryLabel = "محصولات و تجهیزات";
    } else if (rawCategory === "projects") {
      categoryKey = "projects";
      categoryLabel = "پروژه‌ها و اجرا";
    } else if (rawCategory === "team") {
      categoryKey = "company";
      categoryLabel = "معرفی شرکت و تیم";
    } else if (rawCategory === "other") {
      categoryKey = "other";
      categoryLabel = "عمومی و کارخانه";
    }

    if (key && itemsMap.has(key)) {
      // If item already exists but has no source link, and this one has title, enrich title if needed
      const existing = itemsMap.get(key)!;
      if (!existing.sourceLink && item.title) {
        existing.title = item.title;
      }
    } else if (key) {
      itemsMap.set(key, {
        id: `gal-${item.id || i}`,
        title: item.title || "تصویر کارگاه و فرآیند ساخت",
        imageUrl: url,
        thumbnailUrl: url,
        category: categoryKey,
        categoryLabel: categoryLabel,
        sourceTitle: item.title || "کارخانه هزارکالا",
        sourceLink: "",
        sourceType: "gallery",
        alt:
          typeof item.image === "object" && item.image?.alt
            ? item.image.alt
            : item.title || "تصویر کارخانه",
      });
    }
  });

  const deduplicatedItems = Array.from(itemsMap.values());

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "خانه", url: SITE_URL },
          { name: page?.title || "آرشیو تصاویر و گالری", url: `${SITE_URL}/gallery` },
        ]}
      />

      <main className="min-h-screen bg-white" dir="rtl">
        <Header settings={settings} />

        <PageHero
          title={page?.title || "آرشیو تصاویر و گالری"}
          subtitle={page?.subtitle || "بانک تصاویر محصولات، خط تولید و پروژه‌ها"}
          excerpt={
            page?.excerpt ||
            "آرشیو جامع و یکپارچه کلیه تصاویر صنعتی، فرآیند ساخت، خطوط تولید و پروژه‌های اجرا شده شرکت هزاره کالا"
          }
          image={page?.heroImage}
          breadcrumb={[{ label: "خانه", href: "/" }, { label: page?.title || "گالری" }]}
        />

        <GalleryView items={deduplicatedItems} />

        <Footer settings={settings} />
      </main>
    </>
  );
}