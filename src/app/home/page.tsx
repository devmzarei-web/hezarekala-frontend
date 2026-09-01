import type { Metadata } from "next";
import { getSettings, getFeaturedProducts, getHomePage, getFeaturedProjects, getHomeSections } from "@/lib/payload";
import { SITE_URL, CMS_URL } from "@/lib/env";
import type { Page, HomeSection } from "@/payload-types";
import { getMediaUrl } from "@/lib/media";
import Header from "@/components/layout/Header";
import Hero from "@/components/sections/Hero";
import WhyUs from "@/components/sections/WhyUs";
import ProductCards3D from "@/components/sections/ProductCards3D";
import CapabilitiesBento from "@/components/sections/CapabilitiesBento";
import Process from "@/components/sections/Process";
import Projects from "@/components/sections/Projects";
import CTABanner from "@/components/sections/CTABanner";
import Footer from "@/components/layout/Footer";
import OrganizationSchema from "@/components/ui/OrganizationSchema";
import BreadcrumbSchema from "@/components/ui/BreadcrumbSchema";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "هزاره کالا | طراحی و ساخت پمپ‌های صنعتی بزرگ",
  description: "شرکت هزاره کالا دانش اروند - طراح و تولیدکننده پمپ‌های سانتریفیوژ، پیستونی و دنده‌ای برای صنایع نفت، گاز، پتروشیمی و نیروگاهی.",
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website", url: SITE_URL, siteName: "هزاره کالا دانش اروند",
    title: "هزاره کالا | طراحی و ساخت پمپ‌های صنعتی بزرگ",
    description: "طراحی، ساخت و تولید پمپ‌های سانتریفیوژ، پیستونی و دنده‌ای برای صنایع نفت، گاز، پتروشیمی و نیروگاهی.",
    images: [{ url: "/images/og-image.jpg", width: 1200, height: 630, alt: "هزاره کالا - پمپ‌های صنعتی" }],
    locale: "fa_IR",
  },
  twitter: {
    card: "summary_large_image",
    title: "هزاره کالا | طراحی و ساخت پمپ‌های صنعتی بزرگ",
    description: "طراحی، ساخت و تولید پمپ‌های سانتریفیوژ، پیستونی و دنده‌ای.",
    images: ["/images/og-image.jpg"],
  },
};

export default async function Home() {
  const [settings, products, homePage, projects, homeSections] = await Promise.all([
    getSettings(), getFeaturedProducts(), getHomePage(), getFeaturedProjects(), getHomeSections(),
  ]);

  const heroSlides = homePage?.heroSlides?.map((slide: NonNullable<Page["heroSlides"]>[number]) => ({
    image: slide.image ? getMediaUrl(slide.image) : "",
    video: slide.video ? getMediaUrl(slide.video) : null,
    title: slide.title || "",
  })) ?? [];

  let heroVideoUrl: string | null = null;
  if (homePage?.heroVideo) {
    if (typeof homePage.heroVideo === "string") heroVideoUrl = homePage.heroVideo.startsWith("http") ? homePage.heroVideo : `${CMS_URL}${homePage.heroVideo}`;
    else if (homePage.heroVideo && typeof homePage.heroVideo === "object" && "url" in homePage.heroVideo) {
      const url = (homePage.heroVideo as { url: string }).url;
      heroVideoUrl = url?.startsWith("http") ? url : `${CMS_URL}${url}`;
    }
  }

  const sectionsMap = new Map<string, HomeSection>();
  homeSections.forEach(s => sectionsMap.set(s.sectionKey, s));

  const whyUs = sectionsMap.get("why-us");
  const capabilities = sectionsMap.get("capabilities");
  const process = sectionsMap.get("process");

  const bg = (s: HomeSection | undefined) => s?.backgroundImage ? getMediaUrl(s.backgroundImage) : null;

  return (
    <>
      <OrganizationSchema />
      <BreadcrumbSchema items={[{ name: "خانه", url: SITE_URL }]} />
      <main className="min-h-screen bg-white">
        <Header settings={settings} />
        
        {/* 1. Hero - Dark */}
        <Hero slides={heroSlides} heroVideoUrl={heroVideoUrl} settings={settings} />

        {/* 2. Why Us - Light (White) */}
        {whyUs?.whyUsCards?.length ? <WhyUs title={whyUs.title} subtitle={whyUs.subtitle} theme="light" backgroundImage={bg(whyUs)} cards={whyUs.whyUsCards} /> : null}

        {/* 3. Products - Dark */}
        <ProductCards3D products={products || []} />

        {/* 4. Capabilities - Light (White) */}
        {capabilities?.capabilityItems?.length ? <CapabilitiesBento title={capabilities.title} subtitle={capabilities.subtitle} theme="light" backgroundImage={bg(capabilities)} items={capabilities.capabilityItems} /> : null}

        {/* 5. Process - Dark */}
        {process?.processSteps?.length ? <Process title={process.title} subtitle={process.subtitle} theme="dark" backgroundImage={bg(process)} steps={process.processSteps} /> : null}

        {/* 6. Projects - Light (White) */}
        <Projects projects={projects || []} />

        {/* 7. CTA - Gold */}
        <CTABanner settings={settings} />

        {/* 8. Footer - Dark */}
        <Footer settings={settings} />
      </main>
    </>
  );
}