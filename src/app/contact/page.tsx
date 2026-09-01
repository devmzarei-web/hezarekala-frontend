import type { Metadata } from "next";
import { getSettings, getPage } from "@/lib/payload";
import { SITE_URL } from "@/lib/env";
import { getMediaUrl } from "@/lib/media";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ContactForm from "@/components/sections/ContactForm";
import PageHero from "@/components/ui/PageHero";
import BreadcrumbSchema from "@/components/ui/BreadcrumbSchema";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("contact");

  return {
    title: page?.metaTitle || page?.title || "تماس با ما",
    description:
      page?.metaDescription ||
      page?.excerpt ||
      "راه‌های ارتباط با هزاره کالا دانش اروند: آدرس کارخانه در شهرک صنعتی آبادان، شماره تماس، ایمیل و فرم ارسال پیام. پاسخگویی شنبه تا پنجشنبه.",
    alternates: {
      canonical: `${SITE_URL}/contact`,
    },
    openGraph: {
      title: page?.metaTitle || page?.title || "تماس با ما | هزاره کالا",
      description: page?.metaDescription || page?.excerpt || "",
      images: page?.heroImage ? [{ url: getMediaUrl(page.heroImage) }] : [],
    },
  };
}

export default async function ContactPage() {
  const [settings, page] = await Promise.all([getSettings(), getPage("contact")]);

  const phone = settings?.phone || "۰۹۱۶۶۳۱۰۶۳۱";
  const email = settings?.email || "info@hezarehkala.com";
  const address = settings?.address || "استان خوزستان، شهرک صنعتی آبادان، خیابان اروند ۱";

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: settings?.siteName || "هزاره کالا دانش اروند",
    description: "طراحی و ساخت پمپ‌های صنعتی بزرگ",
    image: settings?.logo ? getMediaUrl(settings.logo) : "",
    telephone: phone.replace(/[^\d+]/g, ""),
    email,
    address: {
      "@type": "PostalAddress",
      streetAddress: address,
      addressLocality: "آبادان",
      addressRegion: "خوزستان",
      addressCountry: "IR",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
        opens: "08:00",
        closes: "17:00",
      },
    ],
    url: SITE_URL,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />

      <BreadcrumbSchema
        items={[
          { name: "خانه", url: SITE_URL },
          { name: page?.title || "تماس با ما", url: `${SITE_URL}/contact` },
        ]}
      />

      <main className="min-h-screen w-full max-w-full overflow-x-hidden bg-white" dir="rtl">
        <Header settings={settings} />

        <PageHero
          title={page?.title || "تماس با ما"}
          subtitle={page?.subtitle || "با ما در ارتباط باشید"}
          excerpt={page?.excerpt || ""}
          image={page?.heroImage}
          breadcrumb={[{ label: "خانه", href: "/" }, { label: page?.title || "تماس با ما" }]}
        />

        <section className="w-full max-w-full overflow-x-hidden py-12 md:py-16 bg-white" aria-label="اطلاعات تماس">
          <div className="w-full max-w-full px-4 sm:px-6 md:px-12 lg:px-16">
            <div className="grid w-full min-w-0 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <div className="group min-w-0 text-center p-5 sm:p-6 md:p-8 bg-gray-50 hover:bg-white border border-gray-100 hover:border-[#c49a2c]/20 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-14 h-14 bg-[#c49a2c]/10 group-hover:bg-[#c49a2c]/20 rounded-xl flex items-center justify-center mx-auto mb-4 transition-colors">
                  <Phone className="w-7 h-7 text-[#c49a2c]" aria-hidden="true" />
                </div>
                <h3 className="font-bold text-[#0a1628] mb-2">تلفن</h3>
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="block max-w-full text-gray-600 text-sm hover:text-[#c49a2c] transition-colors break-words"
                  dir="ltr"
                >
                  {phone}
                </a>
              </div>

              <div className="group min-w-0 text-center p-5 sm:p-6 md:p-8 bg-gray-50 hover:bg-white border border-gray-100 hover:border-[#c49a2c]/20 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-14 h-14 bg-[#c49a2c]/10 group-hover:bg-[#c49a2c]/20 rounded-xl flex items-center justify-center mx-auto mb-4 transition-colors">
                  <Mail className="w-7 h-7 text-[#c49a2c]" aria-hidden="true" />
                </div>
                <h3 className="font-bold text-[#0a1628] mb-2">ایمیل</h3>
                <a
                  href={`mailto:${email}`}
                  className="block max-w-full text-gray-600 text-sm hover:text-[#c49a2c] transition-colors break-all"
                  dir="ltr"
                >
                  {email}
                </a>
              </div>

              <div className="group min-w-0 text-center p-5 sm:p-6 md:p-8 bg-gray-50 hover:bg-white border border-gray-100 hover:border-[#c49a2c]/20 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-14 h-14 bg-[#c49a2c]/10 group-hover:bg-[#c49a2c]/20 rounded-xl flex items-center justify-center mx-auto mb-4 transition-colors">
                  <MapPin className="w-7 h-7 text-[#c49a2c]" aria-hidden="true" />
                </div>
                <h3 className="font-bold text-[#0a1628] mb-2">آدرس</h3>
                <address className="max-w-full text-gray-600 text-xs leading-relaxed not-italic break-words">
                  {address}
                </address>
              </div>

              <div className="group min-w-0 text-center p-5 sm:p-6 md:p-8 bg-gray-50 hover:bg-white border border-gray-100 hover:border-[#c49a2c]/20 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-14 h-14 bg-[#c49a2c]/10 group-hover:bg-[#c49a2c]/20 rounded-xl flex items-center justify-center mx-auto mb-4 transition-colors">
                  <Clock className="w-7 h-7 text-[#c49a2c]" aria-hidden="true" />
                </div>
                <h3 className="font-bold text-[#0a1628] mb-2">ساعات کاری</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  شنبه تا پنجشنبه
                  <br />
                  <span dir="ltr" className="text-xs">
                    ۸:۰۰ - ۱۷:۰۰
                  </span>
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="w-full max-w-full overflow-x-hidden">
          <ContactForm />
        </div>

        <Footer settings={settings} />
      </main>
    </>
  );
}