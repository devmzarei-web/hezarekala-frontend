import type { Metadata } from "next";
import { getSettings, getPage } from "@/lib/payload";
import { SITE_URL, PAYLOAD_API_URL } from "@/lib/env";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import BreadcrumbSchema from "@/components/ui/BreadcrumbSchema";
import { getMediaUrl } from "@/lib/media";
import Link from "next/link";
import { ArrowLeft, Calendar, User, Folder } from "lucide-react";

export const revalidate = 60;

const CATEGORY_LABELS: Record<string, string> = {
  centrifugal: "پمپ سانتریفیوژ",
  piston: "پمپ پیستونی",
  gear: "پمپ دنده‌ای",
  maintenance: "نگهداری و تعمیرات",
  news: "اخبار شرکت",
  technical: "مقالات فنی",
};

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  author?: string;
  category?: string;
  publishedAt?: string;
  createdAt?: string;
  featuredImage?:
    | string
    | {
        url?: string;
        alt?: string;
        filename?: string;
      };
};

async function getPosts(): Promise<BlogPost[]> {
  try {
    const res = await fetch(
      `${PAYLOAD_API_URL}/posts?where[isPublished][equals]=true&sort=-publishedAt&limit=20`,
      {
        signal: AbortSignal.timeout(3000),
        headers: { "Content-Type": "application/json" },
        next: { revalidate: 60 },
      }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.docs || [];
  } catch {
    return [];
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("blog");
  return {
    title: page?.metaTitle || page?.title || "وبلاگ",
    description:
      page?.metaDescription ||
      page?.excerpt ||
      "مقالات تخصصی و آخرین اخبار صنعت پمپ‌های صنعتی، پروژه‌ها و دستاوردهای هزاره کالا - دانش فنی و نوآوری در پمپ‌سازی",
    alternates: {
      canonical: `${SITE_URL}/blog`,
    },
    openGraph: {
      title: page?.metaTitle || page?.title || "وبلاگ هزاره کالا",
      description: page?.metaDescription || page?.excerpt || "",
      images: page?.heroImage ? [{ url: getMediaUrl(page.heroImage) }] : [],
    },
  };
}

export default async function BlogPage() {
  const [settings, page, posts] = await Promise.all([
    getSettings(),
    getPage("blog"),
    getPosts(),
  ]);

  // CollectionPage Schema
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: page?.title || "وبلاگ هزاره کالا",
    description: page?.excerpt || "مقالات تخصصی پمپ‌های صنعتی",
    url: `${SITE_URL}/blog`,
    mainEntity: posts.map((post: BlogPost) => ({
      "@type": "Article",
      headline: post.title,
      description: post.excerpt || "",
      url: `${SITE_URL}/blog/${post.slug}`,
      datePublished: post.publishedAt || post.createdAt,
      author: {
        "@type": "Person",
        name: post.author || "هزاره کالا",
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      <BreadcrumbSchema
        items={[
          { name: "خانه", url: SITE_URL },
          { name: page?.title || "وبلاگ", url: `${SITE_URL}/blog` },
        ]}
      />

      <main className="min-h-screen bg-white" dir="rtl">
        <Header settings={settings} />

        <PageHero
          title={page?.title || "وبلاگ"}
          subtitle={page?.subtitle || "مقالات و اخبار"}
          excerpt={page?.excerpt || ""}
          image={page?.heroImage}
          breadcrumb={[{ label: "خانه", href: "/" }, { label: page?.title || "وبلاگ" }]}
        />

        <section className="py-16 md:py-20">
          <div className="w-full px-6 md:px-12 lg:px-16 max-w-7xl mx-auto">
            {posts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post: BlogPost) => {
                  const altText =
                    post.featuredImage && typeof post.featuredImage === "object" && "alt" in post.featuredImage
                      ? post.featuredImage.alt || post.title
                      : post.title;

                  return (
                    <article key={post.id}>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-[#c49a2c]/20 transition-all duration-300 block"
                      >
                        <div className="relative h-56 bg-gray-100 overflow-hidden">
                          {post.featuredImage ? (
                            <img
                              src={getMediaUrl(post.featuredImage)}
                              alt={altText}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              loading="lazy"
                              decoding="async"
                            />
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628]/80 to-[#c49a2c]/40 flex items-center justify-center">
                              <span className="text-white/60 text-lg">
                                {post.category ? CATEGORY_LABELS[post.category] || post.category : "مقاله"}
                              </span>
                            </div>
                          )}
                          {post.category && (
                            <span className="absolute top-4 right-4 bg-[#c49a2c] text-black text-xs font-bold px-3 py-1 rounded-full">
                              {CATEGORY_LABELS[post.category] || post.category}
                            </span>
                          )}
                        </div>
                        <div className="p-6">
                          <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                            <time
                              dateTime={post.publishedAt || post.createdAt || undefined}
                              className="flex items-center gap-1"
                            >
                              <Calendar size={12} aria-hidden="true" />
                              {post.publishedAt
                                ? new Date(post.publishedAt).toLocaleDateString("fa-IR")
                                : post.createdAt
                                ? new Date(post.createdAt).toLocaleDateString("fa-IR")
                                : ""}
                            </time>
                            {post.author && (
                              <span className="flex items-center gap-1">
                                <User size={12} />
                                {post.author}
                              </span>
                            )}
                          </div>
                          <h2 className="text-xl font-bold text-[#0a1628] mb-2 group-hover:text-[#c49a2c] transition-colors line-clamp-2">
                            {post.title}
                          </h2>
                          {post.excerpt && (
                            <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">{post.excerpt}</p>
                          )}
                          <div className="flex items-center gap-1 text-[#c49a2c] font-bold text-sm">
                            <span>ادامه مطلب</span>
                            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
                          </div>
                        </div>
                      </Link>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Folder size={32} className="text-gray-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-700 mb-2">هنوز مقاله‌ای منتشر نشده</h2>
                <p className="text-gray-500">به زودی مقالات تخصصی در این بخش قرار می‌گیرند.</p>
              </div>
            )}
          </div>
        </section>

        <Footer settings={settings} />
      </main>
    </>
  );
}