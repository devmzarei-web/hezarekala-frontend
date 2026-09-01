import type { Metadata } from "next";
import { getSettings, getPage } from "@/lib/payload";
import { SITE_URL } from "@/lib/env";
import { getMediaUrl } from "@/lib/media";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import RichTextRenderer from "@/components/ui/RichTextRenderer";
import PageHero from "@/components/ui/PageHero";
import BreadcrumbSchema from "@/components/ui/BreadcrumbSchema";
import { Check } from "lucide-react";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("capabilities");
  return {
    title: page?.metaTitle || page?.title || "توانمندی‌ها",
    description:
      page?.metaDescription ||
      page?.excerpt ||
      "توانمندی‌های مهندسی و تولیدی هزاره کالا: از طراحی و مهندسی پیشرفته تا ساخت، تست، نصب و راه‌اندازی پمپ‌های صنعتی بزرگ با استانداردهای API و ISO.",
    alternates: {
      canonical: `${SITE_URL}/capabilities`,
    },
    openGraph: {
      title: page?.metaTitle || page?.title || "توانمندی‌های هزاره کالا",
      description: page?.metaDescription || page?.excerpt || "",
      images: page?.heroImage ? [{ url: getMediaUrl(page.heroImage) }] : [],
    },
  };
}

const FEATURES = [
  { title: "استانداردهای بین‌المللی", desc: "مطابق با API 610 و ISO 5199" },
  { title: "تجهیزات پیشرفته", desc: "ماشین‌آلات CNC و تست دقیق" },
  { title: "تیم مهندسی متخصص", desc: "طراحی تا راه‌اندازی با نظارت کامل" },
];

export default async function CapabilitiesPage() {
  const [settings, page] = await Promise.all([getSettings(), getPage("capabilities")]);

  // ✅ h1 در PageHero است
  // ✅ RichText فقط h2 به بعد دارد
  // ✅ FEATURES با h2 شروع می‌شود

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "خانه", url: SITE_URL },
          { name: page?.title || "توانمندی‌ها", url: `${SITE_URL}/capabilities` },
        ]}
      />

      <main className="min-h-screen bg-white" dir="rtl">
        <Header settings={settings} />

        <PageHero
          title={page?.title || "توانمندی‌ها"}
          subtitle={page?.subtitle || "چه کاری انجام می‌دهیم"}
          excerpt={page?.excerpt || ""}
          image={page?.heroImage}
          breadcrumb={[{ label: "خانه", href: "/" }, { label: page?.title || "توانمندی‌ها" }]}
        />

        <section className="py-16 md:py-20" aria-labelledby="capabilities-content-heading">
          <div className="w-full">
            {page?.content ? (
              <div className="space-y-12 px-6 md:px-12 lg:px-16">
                <RichTextRenderer content={page.content} />
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">محتوایی برای این بخش ثبت نشده است.</p>
              </div>
            )}

            <div className="mt-20">
              <h2 id="capabilities-content-heading" className="sr-only">
                ویژگی‌های کلیدی
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t border-gray-100">
                {FEATURES.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4 p-8 md:p-10 border-b border-l border-gray-100 last:border-l-0"
                  >
                    <div className="w-10 h-10 rounded-lg bg-[#c49a2c] flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={18} className="text-white" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#0a1628] mb-1">{item.title}</h3>
                      <p className="text-gray-600 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <Footer settings={settings} />
      </main>
    </>
  );
}