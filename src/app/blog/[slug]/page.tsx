import type { Metadata } from "next";
import { getSettings } from "@/lib/payload";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import RichTextRenderer from "@/components/ui/RichTextRenderer";
import BreadcrumbSchema from "@/components/ui/BreadcrumbSchema";
import { getMediaUrl } from "@/lib/media";
import Link from "next/link";
import { ArrowRight, Calendar, User, Tag } from "lucide-react";
import { SITE_URL, PAYLOAD_API_URL } from "@/lib/env";



async function getPost(slug: string) {
  try {
    const res = await fetch(`${PAYLOAD_API_URL}/posts?where[slug][equals]=${encodeURIComponent(slug)}&limit=1`, {
      signal: AbortSignal.timeout(3000),
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.docs?.[0] || null;
  } catch {
    return null;
  }
}

const CATEGORY_LABELS: Record<string, string> = {
  centrifugal: "پمپ سانتریفیوژ",
  piston: "پمپ پیستونی",
  gear: "پمپ دنده‌ای",
  maintenance: "نگهداری و تعمیرات",
  news: "اخبار شرکت",
  technical: "مقالات فنی",
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  const imageUrl = post?.featuredImage ? getMediaUrl(post.featuredImage) : "";

  return {
    title: post?.metaTitle || post?.title || "مقاله",
    description: post?.metaDescription || post?.excerpt || "مقاله تخصصی از هزاره کالا در زمینه پمپ‌های صنعتی",
    alternates: {
      canonical: `${SITE_URL}/blog/${post?.slug || slug}`,
    },
    openGraph: {
      type: "article",
      title: post?.metaTitle || post?.title || "مقاله",
      description: post?.metaDescription || post?.excerpt || "",
      images: imageUrl ? [{ url: imageUrl }] : [],
      publishedTime: post?.publishedAt || post?.createdAt,
      authors: post?.author ? [post.author] : ["هزاره کالا"],
    },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [settings, post] = await Promise.all([getSettings(), getPost(slug)]);

  if (!post) {
    return (
      <main className="min-h-screen bg-white" dir="rtl">
        <Header settings={settings} />
        <div className="text-center py-32">
          <h1 className="text-3xl font-black text-[#0a1628] mb-4">مقاله یافت نشد</h1>
          <Link href="/blog" className="text-[#c49a2c] font-bold hover:underline">بازگشت به وبلاگ</Link>
        </div>
        <Footer settings={settings} />
      </main>
    );
  }

  const imageAlt =
    post.featuredImage && typeof post.featuredImage === "object" && "alt" in post.featuredImage
      ? (post.featuredImage.alt as string)
      : post.title;

  const publishDate = post.publishedAt || post.createdAt;

  // Article Schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt || "",
    image: post.featuredImage
      ? typeof post.featuredImage === "object" && "url" in post.featuredImage
        ? post.featuredImage.url
        : ""
      : "",
    datePublished: publishDate,
    dateModified: post.updatedAt || publishDate,
    author: {
      "@type": "Person",
      name: post.author || "هزاره کالا",
    },
    publisher: {
      "@type": "Organization",
      name: settings?.siteName || "هزاره کالا دانش اروند",
    },
  };

  return (
    <>
      {/* Article Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* Breadcrumb Schema */}
      <BreadcrumbSchema
        items={[
          { name: "خانه", url: SITE_URL },
          { name: "وبلاگ", url: `${SITE_URL}/blog` },
          { name: post.title, url: `${SITE_URL}/blog/${post.slug}` },
        ]}
      />

      <main className="min-h-screen bg-white" dir="rtl">
        <Header settings={settings} />

        {/* Hero */}
        <section className="relative bg-[#0a1628] pt-24 pb-16 md:pt-32 md:pb-20">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-l from-[#c49a2c] via-[#c49a2c]/50 to-transparent" />
          <div className="w-full px-6 md:px-12 lg:px-16 max-w-4xl mx-auto">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
            >
              <ArrowRight size={16} />
              <span>بازگشت به وبلاگ</span>
            </Link>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-4">
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                {publishDate
                  ? new Date(publishDate).toLocaleDateString("fa-IR")
                  : ""}
              </span>
              {post.author && (
                <span className="flex items-center gap-1">
                  <User size={14} />
                  {post.author}
                </span>
              )}
              {post.category && (
                <span className="flex items-center gap-1 text-[#c49a2c]">
                  <Tag size={14} />
                  {CATEGORY_LABELS[post.category] || post.category}
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-4xl lg:text-5xl font-black text-white leading-tight mb-4">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="text-gray-400 text-lg leading-relaxed">{post.excerpt}</p>
            )}
          </div>
        </section>

        {/* تصویر شاخص */}
        {post.featuredImage && (
          <section className="w-full px-6 md:px-12 lg:px-16 max-w-5xl mx-auto -mt-10 relative z-10">
            <img
              src={getMediaUrl(post.featuredImage)}
              alt={imageAlt}
              className="w-full h-64 md:h-96 object-cover rounded-2xl shadow-2xl"
            />
          </section>
        )}

        {/* محتوا */}
        <section className="py-12 md:py-16">
          <div className="w-full px-6 md:px-12 lg:px-16">
            <RichTextRenderer content={post.content} />
          </div>
        </section>

        <Footer settings={settings} />
      </main>
    </>
  );
}