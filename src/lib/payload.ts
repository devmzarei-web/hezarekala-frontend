import type { Settings, Product, ProductCategory, Page, HomeSection, Certificate, Album } from "@/payload-types";
import { PAYLOAD_API_URL } from "@/lib/env";
import { DEFAULT_PRODUCTS, DEFAULT_ALBUMS } from "@/lib/constants";

/* ── Types ── */
export interface ProjectItem {
  id: string;
  title: string;
  slug: string;
  client?: string;
  location?: string;
  completionDate?: string;
  description?: string;
  featuredImage?:
    | {
        url?: string;
        alt?: string;
        filename?: string;
        filesize?: number;
        width?: number;
        height?: number;
      }
    | string;
  isFeatured?: boolean;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface GalleryItem {
  id: string;
  title?: string;
  image:
    | {
        url?: string;
        alt?: string;
        filename?: string;
        filesize?: number;
        width?: number;
        height?: number;
      }
    | string;
  category?: string;
  isFeatured?: boolean;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  position: string;
  photo?:
    | {
        url?: string;
        alt?: string;
        filename?: string;
      }
    | string;
  bio?: string;
  linkedin?: string;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface WhyUsCard {
  id?: string;
  title: string;
  description: string;
  icon:
    | "engineering"
    | "quality"
    | "speed"
    | "support"
    | "experience"
    | "innovation";
  counter?: number;
  counterSuffix?: string;
}

export interface CapabilityItem {
  id?: string;
  title: string;
  description: string;
  icon:
    | "design"
    | "manufacturing"
    | "testing"
    | "quality-ctrl"
    | "installation"
    | "service";
  size: "normal" | "large" | "tall";
  image?: { url?: string; alt?: string } | string;
}

export interface AchievementItem {
  id?: string;
  label: string;
  value: number;
  suffix?: string;
  icon: "projects" | "clients" | "experience" | "certificates";
}

export interface ProcessStep {
  id?: string;
  title: string;
  description: string;
  stepNumber: number;
  icon: "analysis" | "design" | "build" | "test" | "deliver";
  duration?: string;
}

/* ── Fetcher ── */
async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T | null> {
  const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${PAYLOAD_API_URL}${normalizedEndpoint}`;

  try {
    const res = await fetch(url, {
      signal: options?.signal || AbortSignal.timeout(3000),
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
      next: { revalidate: 60 },
      ...options,
    });

    if (!res.ok) {
      console.error(`Payload API error: ${res.status} ${res.statusText} - ${url}`);
      return null;
    }

    return (await res.json()) as T;
  } catch (error) {
    console.error(`Payload API fetch failed: ${url}`, error);
    return null;
  }
}

/* ── Settings ── */
export async function getSettings(): Promise<Settings | null> {
  const data = await fetchAPI<{ docs: Settings[] }>("/settings?limit=1");
  return data?.docs?.[0] ?? null;
}

/* ── Product Categories ── */
export async function getProductCategories(): Promise<ProductCategory[]> {
  const data = await fetchAPI<{ docs: ProductCategory[] }>(
    "/product-categories?where[isActive][equals]=true&sort=order&limit=50"
  );

  return data?.docs ?? [];
}

/* ── Products ── */
export async function getFeaturedProducts(): Promise<Product[]> {
  const data = await fetchAPI<{ docs: Product[] }>(
    "/products?where[isFeatured][equals]=true&where[isActive][equals]=true&sort=order&limit=6&depth=2"
  );

  return data?.docs && data.docs.length > 0
    ? data.docs
    : DEFAULT_PRODUCTS.filter((p) => p.isFeatured);
}

export async function getProducts(categorySlug?: string): Promise<Product[]> {
  const data = await fetchAPI<{ docs: Product[] }>(
    "/products?where[isActive][equals]=true&sort=order&limit=50&depth=2"
  );

  const products = data?.docs && data.docs.length > 0 ? data.docs : DEFAULT_PRODUCTS;

  if (!categorySlug || categorySlug === "all") {
    return products;
  }

  return products.filter((product) => {
    if (!product.category) return false;
    if (typeof product.category === "string") {
      return product.category === categorySlug;
    }
    return product.category.slug === categorySlug;
  });
}

/* ── Pages ── */
export async function getPage(slug: string): Promise<Page | null> {
  const encodedSlug = encodeURIComponent(slug);

  const data = await fetchAPI<{ docs: Page[] }>(
    `/pages?where[slug][equals]=${encodedSlug}&limit=1`
  );

  return data?.docs?.[0] ?? null;
}

export async function getHomePage(): Promise<Page | null> {
  return getPage("home");
}

export async function getCapabilitiesPage(): Promise<Page | null> {
  return getPage("capabilities");
}

/* ── Projects ── */
export async function getFeaturedProjects(): Promise<ProjectItem[]> {
  const data = await fetchAPI<{ docs: ProjectItem[] }>(
    "/projects?where[isFeatured][equals]=true&sort=-order&limit=6"
  );

  return data?.docs ?? [];
}

/* ── Gallery ── */
export async function getFeaturedGallery(): Promise<GalleryItem[]> {
  const data = await fetchAPI<{ docs: GalleryItem[] }>(
    "/gallery?where[isFeatured][equals]=true&sort=-order&limit=12"
  );

  return data?.docs ?? [];
}

/* ── Team ── */
export async function getTeamMembers(): Promise<TeamMember[]> {
  const data = await fetchAPI<{ docs: TeamMember[] }>("/team?sort=order&limit=20");

  return data?.docs ?? [];
}

/* ── Home Sections ── */
export async function getHomeSections(): Promise<HomeSection[]> {
  const data = await fetchAPI<{ docs: HomeSection[] }>(
    "/home-sections?where[isActive][equals]=true&sort=order&limit=10"
  );

  return data?.docs ?? [];
}

/* ── Certificates ── */
export async function getCertificates(onlyFeaturedHome = false): Promise<Certificate[]> {
  const query = onlyFeaturedHome
    ? "/certificates?where[isActive][equals]=true&where[isFeaturedHome][equals]=true&sort=order&limit=50&depth=2"
    : "/certificates?where[isActive][equals]=true&sort=order&limit=50&depth=2";
  const data = await fetchAPI<{ docs: Certificate[] }>(query);

  return data?.docs ?? [];
}

/* ── Albums & Events ── */
export async function getAlbums(category?: string): Promise<Album[]> {
  try {
    let query = "/albums?where[isActive][equals]=true&sort=-order,-eventDate&limit=50&depth=2";
    if (category && category !== "all") {
      query += `&where[category][equals]=${encodeURIComponent(category)}`;
    }
    const data = await fetchAPI<{ docs: Album[] }>(query);
    if (data?.docs && data.docs.length > 0) {
      return data.docs;
    }
  } catch (error) {
    console.warn("Failed to fetch albums from CMS, using fallback:", error);
  }

  if (category && category !== "all") {
    return DEFAULT_ALBUMS.filter((a) => a.category === category);
  }
  return DEFAULT_ALBUMS;
}

export async function getAlbumBySlug(slug: string): Promise<Album | null> {
  try {
    const encodedSlug = encodeURIComponent(slug);
    const data = await fetchAPI<{ docs: Album[] }>(
      `/albums?where[slug][equals]=${encodedSlug}&where[isActive][equals]=true&limit=1&depth=2`
    );
    if (data?.docs?.[0]) {
      return data.docs[0];
    }
  } catch (error) {
    console.warn(`Failed to fetch album '${slug}' from CMS, using fallback:`, error);
  }

  return DEFAULT_ALBUMS.find((a) => a.slug === slug) ?? null;
}

export async function getFeaturedAlbum(): Promise<Album | null> {
  try {
    const data = await fetchAPI<{ docs: Album[] }>(
      "/albums?where[isActive][equals]=true&where[isFeaturedOnHome][equals]=true&sort=-order,-eventDate&limit=1&depth=2"
    );
    if (data?.docs?.[0]) {
      return data.docs[0];
    }
  } catch (error) {
    console.warn("Failed to fetch featured album from CMS, using fallback:", error);
  }

  return DEFAULT_ALBUMS.find((a) => a.isFeaturedOnHome) ?? DEFAULT_ALBUMS[0] ?? null;
}

/* ── Generic export for pages that still need direct Payload calls ── */
export { fetchAPI };