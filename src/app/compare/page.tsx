import type { Metadata } from "next";
import { getSettings, getProducts, getPage } from "@/lib/payload";
import { SITE_URL } from "@/lib/env";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import BreadcrumbSchema from "@/components/ui/BreadcrumbSchema";
import CompareView from "./CompareView";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  try {
    const page = await getPage("compare");
    return {
      title: page?.metaTitle || page?.title || "مقایسه مشخصات فنی پمپ‌های صنعتی | هزاره کالا",
      description:
        page?.metaDescription ||
        page?.excerpt ||
        "ابزار مقایسه تخصصی مشخصات فنی، دبی، هد، متریال، توان و استانداردهای انواع پمپ‌های صنعتی شرکت هزاره کالا.",
      alternates: { canonical: `${SITE_URL}/compare` },
    };
  } catch {
    return {
      title: "مقایسه مشخصات فنی پمپ‌های صنعتی | هزاره کالا",
      description: "ابزار مقایسه تخصصی مشخصات فنی انواع پمپ‌های صنعتی شرکت هزاره کالا.",
      alternates: { canonical: `${SITE_URL}/compare` },
    };
  }
}

interface ComparePageProps {
  searchParams: Promise<{ p1?: string; p2?: string }>;
}

export default async function ComparePage({ searchParams }: ComparePageProps) {
  const params = await searchParams;
  let settings = null;
  let allProducts: any[] = [];
  let page = null;

  try {
    const res = await Promise.all([
      getSettings(),
      getProducts(),
      getPage("compare"),
    ]);
    settings = res[0];
    allProducts = res[1];
    page = res[2];
  } catch {
    settings = null;
    allProducts = [];
    page = null;
  }

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "خانه", url: SITE_URL },
          { name: "محصولات", url: `${SITE_URL}/products` },
          { name: page?.title || "مقایسه محصولات", url: `${SITE_URL}/compare` },
        ]}
      />

      <main className="min-h-screen bg-white" dir="rtl">
        <Header settings={settings} />

        <PageHero
          title={page?.title || "مقایسه مشخصات فنی پمپ‌ها"}
          subtitle={page?.subtitle || "بررسی تطبیقی مشخصات و تفاوت‌های عملیاتی"}
          excerpt={
            page?.excerpt ||
            "مقایسه مشخصات هیدرولیکی، دبی، هد، توان الکتروموتور، متریال پروانه و استانداردهای ساخت انواع پمپ‌های صنعتی هزاره کالا"
          }
          image={page?.heroImage}
          breadcrumb={[
            { label: "خانه", href: "/" },
            { label: "محصولات", href: "/products" },
            { label: page?.title || "مقایسه" },
          ]}
        />

        <CompareView
          allProducts={allProducts}
          initialSlug1={params?.p1}
          initialSlug2={params?.p2}
        />

        <Footer settings={settings} />
      </main>
    </>
  );
}
