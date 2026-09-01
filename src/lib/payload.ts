import type { Settings, Product, Page, HomeSection } from "@/payload-types";
import { PAYLOAD_API_URL } from "@/lib/env";
import { DEFAULT_PRODUCTS } from "@/lib/constants";

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

/* ── Products ── */
export async function getFeaturedProducts(): Promise<Product[]> {
  const data = await fetchAPI<{ docs: Product[] }>(
    "/products?where[isFeatured][equals]=true&where[isActive][equals]=true&sort=-order&limit=6"
  );

  return data?.docs && data.docs.length > 0
    ? data.docs
    : DEFAULT_PRODUCTS.filter((p) => p.isFeatured);
}

export async function getProducts(): Promise<Product[]> {
  const data = await fetchAPI<{ docs: Product[] }>(
    "/products?where[isActive][equals]=true&sort=-order&limit=50"
  );

  return data?.docs && data.docs.length > 0 ? data.docs : DEFAULT_PRODUCTS;
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

/* ── Generic export for pages that still need direct Payload calls ── */
export { fetchAPI };