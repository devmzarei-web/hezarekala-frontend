import type { MetadataRoute } from "next";
import { SITE_URL, PAYLOAD_API_URL } from "@/lib/env";

function timeoutSignal(ms: number): AbortSignal {
  try {
    return AbortSignal.timeout(ms);
  } catch {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), ms);
    return controller.signal;
  }
}

function safeDate(date: unknown): Date {
  if (!date) return new Date();
  const d = new Date(date as string);
  return isNaN(d.getTime()) ? new Date() : d;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/products`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/compare`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/capabilities`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/projects`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/gallery`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];

  try {
    const [productsRes, postsRes] = await Promise.all([
      fetch(`${PAYLOAD_API_URL}/products?where[isActive][equals]=true&limit=100`, {
        headers: { "Content-Type": "application/json" },
        signal: timeoutSignal(5000),
      }),
      fetch(`${PAYLOAD_API_URL}/posts?where[isPublished][equals]=true&limit=100`, {
        headers: { "Content-Type": "application/json" },
        signal: timeoutSignal(5000),
      }),
    ]);

    const [productsData, postsData] = await Promise.all([
      productsRes.ok ? productsRes.json() : { docs: [] },
      postsRes.ok ? postsRes.json() : { docs: [] },
    ]);

    const productPages: MetadataRoute.Sitemap = (productsData.docs || []).map(
      (product: { slug: string; updatedAt?: string; createdAt?: string }) => ({
        url: `${SITE_URL}/products/${product.slug}`,
        lastModified: safeDate(product.updatedAt || product.createdAt),
        changeFrequency: "monthly" as const,
        priority: 0.85,
      })
    );

    const blogPages: MetadataRoute.Sitemap = (postsData.docs || []).map(
      (post: { slug: string; updatedAt?: string; publishedAt?: string; createdAt?: string }) => ({
        url: `${SITE_URL}/blog/${post.slug}`,
        lastModified: safeDate(post.updatedAt || post.publishedAt || post.createdAt),
        changeFrequency: "monthly" as const,
        priority: 0.75,
      })
    );

    return [...staticPages, ...productPages, ...blogPages];
  } catch {
    return staticPages;
  }
}