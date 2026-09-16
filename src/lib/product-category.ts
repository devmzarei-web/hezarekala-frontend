export type ProductCategoryValue =
  | string
  | {
      id?: string;
      title?: string;
      slug?: string;
      name?: string;
    }
  | null
  | undefined;

const CATEGORY_LABELS: Record<string, string> = {
  centrifugal: "سانتریفیوژ",
  piston: "پیستونی",
  gear: "دنده‌ای",
  multistage: "طبقاتی",
  generators: "دیزل ژنراتور و موتور دیزلی",
  "sludge-pumps": "پمپ لجن‌کش و خودمکش",
  "gear-pumps": "پمپ دنده‌ای پرتابل",
  "wet-blast": "وت بلاست و آماده‌سازی سطح",
  machining: "خدمات ماشین‌کاری و تراشکاری",
  other: "سایر",
};

export function getProductCategoryLabel(category: ProductCategoryValue): string {
  if (!category) return "";

  if (typeof category === "string") {
    return CATEGORY_LABELS[category] || category;
  }

  if (category.title) return category.title;
  if (category.name) return category.name;
  if (category.slug) return CATEGORY_LABELS[category.slug] || category.slug;

  return "";
}

export function getProductCategorySlug(category: ProductCategoryValue): string {
  if (!category) return "";

  if (typeof category === "string") return category;

  return category.slug || category.id || "";
}

export function getProductCategoryInfo(category: ProductCategoryValue): { title: string; slug: string } {
  return {
    title: getProductCategoryLabel(category),
    slug: getProductCategorySlug(category),
  };
}
