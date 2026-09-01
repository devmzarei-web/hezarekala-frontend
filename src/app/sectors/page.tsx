import type { Metadata } from "next";
import { getSettings, getPage } from "@/lib/payload";
import { SITE_URL } from "@/lib/env";
import { getMediaUrl } from "@/lib/media";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import RichTextRenderer from "@/components/ui/RichTextRenderer";
import PageHero from "@/components/ui/PageHero";
import BreadcrumbSchema from "@/components/ui/BreadcrumbSchema";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("sectors");
  return {
    title: page?.metaTitle || page?.title || "صنایع",
    description:
      page?.metaDescription ||
      page?.excerpt ||
      "پمپ‌های صنعتی هزاره کالا برای صنایع نفت، گاز، پتروشیمی، نیروگاهی، آب و فاضلاب و معادن. راه‌حل‌های پمپاژ برای حیاتی‌ترین صنایع ایران.",
    alternates: {
      canonical: `${SITE_URL}/sectors`,
    },
    openGraph: {
      type: "website",
      title: page?.metaTitle || page?.title || "صنایع | هزاره کالا",
      description: page?.metaDescription || page?.excerpt || "",
      images: page?.heroImage ? [{ url: getMediaUrl(page.heroImage) }] : [],
    },
  };
}

export default async function SectorsPage() {
  const [settings, page] = await Promise.all([getSettings(), getPage("sectors")]);

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "خانه", url: SITE_URL },
          { name: page?.title || "صنایع", url: `${SITE_URL}/sectors` },
        ]}
      />

      <main className="min-h-screen bg-white" dir="rtl">
        <Header settings={settings} />

        <PageHero
          title={page?.title || "صنایع"}
          subtitle={page?.subtitle || "صنایع هدف"}
          excerpt={page?.excerpt || ""}
          image={page?.heroImage}
          breadcrumb={[{ label: "خانه", href: "/" }, { label: page?.title || "صنایع" }]}
        />

        <section className="py-16 md:py-20">
          <div className="w-full px-6 md:px-12 lg:px-16">
            <RichTextRenderer content={page?.content} />
          </div>
        </section>

        <Footer settings={settings} />
      </main>
    </>
  );
}