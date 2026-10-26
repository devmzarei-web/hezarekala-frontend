import { Suspense } from "react";
import type { Metadata } from "next";
import { getSettings, getPage } from "@/lib/payload";
import { SITE_URL } from "@/lib/env";
import { getMediaUrl } from "@/lib/media";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ContactDirectory from "@/components/sections/ContactDirectory";
import ContactForm from "@/components/sections/ContactForm";
import PageHero from "@/components/ui/PageHero";
import BreadcrumbSchema from "@/components/ui/BreadcrumbSchema";
import { COMPANY } from "@/lib/constants";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("contact");

  return {
    title: page?.metaTitle || page?.title || "تماس با کارخانه و واحدهای بازرگانی و فنی | هزاره کالا",
    description:
      page?.metaDescription ||
      page?.excerpt ||
      "راه‌های ارتباط رسمی با شرکت هزاره کالا دانش اروند: ایمیل فروش، پشتیبانی فنی، مکاتبات اداری، تلفکس و خطوط مستقیم کارخانه در شهرک صنعتی شماره یک آبادان.",
    alternates: {
      canonical: `${SITE_URL}/contact`,
    },
    openGraph: {
      title: page?.metaTitle || page?.title || "ارتباط با ما و کارخانه | هزاره کالا دانش اروند",
      description: page?.metaDescription || page?.excerpt || "",
      images: page?.heroImage ? [{ url: getMediaUrl(page.heroImage) }] : [],
    },
  };
}

export default async function ContactPage() {
  const [settings, page] = await Promise.all([getSettings(), getPage("contact")]);

  const phone = settings?.phone || COMPANY.phone;
  const telefax = (settings as any)?.telefax || COMPANY.telefax;
  const phone2 = (settings as any)?.phone2 || COMPANY.phoneLines[1]?.number;
  const phone3 = (settings as any)?.phone3 || COMPANY.phoneLines[2]?.number;
  const email = settings?.email || COMPANY.emails.info.address;
  const salesEmail = (settings as any)?.salesEmail || COMPANY.emails.sales.address;
  const supportEmail = (settings as any)?.supportEmail || COMPANY.emails.support.address;
  const address = settings?.address || COMPANY.address;
  const postalCode = (settings as any)?.postalCode || COMPANY.postalCode;
  const ceoName = (settings as any)?.ceoName || COMPANY.ceo;
  const ceoMobile = (settings as any)?.ceoMobile || COMPANY.ceoMobile;

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: settings?.siteName || COMPANY.nameFa,
    legalName: COMPANY.nameFa,
    description: COMPANY.slogan,
    image: settings?.logo ? getMediaUrl(settings.logo) : "",
    telephone: [phone.replace(/[^\d+]/g, ""), phone2.replace(/[^\d+]/g, ""), phone3.replace(/[^\d+]/g, "")],
    faxNumber: telefax.replace(/[^\d+]/g, ""),
    email: [email, salesEmail, supportEmail],
    address: {
      "@type": "PostalAddress",
      streetAddress: address,
      postalCode: COMPANY.postalCodeEn,
      addressLocality: "آبادان",
      addressRegion: "خوزستان",
      addressCountry: "IR",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: phone.replace(/[^\d+]/g, ""),
        contactType: "sales",
        email: salesEmail,
        areaServed: "IR",
        availableLanguage: ["Persian", "English"],
      },
      {
        "@type": "ContactPoint",
        telephone: phone2.replace(/[^\d+]/g, ""),
        contactType: "technical support",
        email: supportEmail,
        areaServed: "IR",
        availableLanguage: ["Persian", "English"],
      },
      {
        "@type": "ContactPoint",
        telephone: phone.replace(/[^\d+]/g, ""),
        contactType: "customer service",
        email: email,
        areaServed: "IR",
        availableLanguage: ["Persian", "English"],
      },
    ],
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
          title={page?.title || "ارتباط با کارخانه و دپارتمان‌های تخصصی"}
          subtitle={page?.subtitle || "راه‌های ارتباطی مستقیم با واحدهای فروش، مهندسی و مدیریت"}
          excerpt={
            page?.excerpt ||
            "جهت استعلام مشخصات فنی، مناقصات، درخواست پیش‌فاکتور، مشاوره مهندسی یا هماهنگی بازدید حضوری از کارخانه در شهرک صنعتی آبادان."
          }
          image={page?.heroImage}
          breadcrumb={[{ label: "خانه", href: "/" }, { label: page?.title || "تماس با ما" }]}
        />

        {/* ── Corporate Directory: Channels, Telefax, Phones & Plant Hub ── */}
        <section className="w-full max-w-full overflow-x-hidden py-10 md:py-14 bg-white" aria-label="راهنمای جامع تماس">
          <div className="w-full max-w-full px-4 sm:px-6 md:px-12 lg:px-16">
            <ContactDirectory
              phone={phone}
              telefax={telefax}
              phone2={phone2}
              phone3={phone3}
              email={email}
              salesEmail={salesEmail}
              supportEmail={supportEmail}
              address={address}
              postalCode={postalCode}
              ceoName={ceoName}
              ceoMobile={ceoMobile}
            />
          </div>
        </section>

        {/* ── Interactive Message & Quotation Form (Single Clean Heading from ContactForm) ── */}
        <div className="w-full max-w-full overflow-x-hidden bg-gray-50/50 py-12 border-t border-gray-100">
          <Suspense fallback={<div className="text-center py-16 text-gray-400">در حال بارگذاری فرم تماس...</div>}>
            <ContactForm />
          </Suspense>
        </div>

        <Footer settings={settings} />
      </main>
    </>
  );
}
