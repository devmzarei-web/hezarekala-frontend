import type { Metadata } from "next";
import { getSettings, getPage } from "@/lib/payload";
import { SITE_URL } from "@/lib/env";
import { getMediaUrl } from "@/lib/media";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import RichTextRenderer from "@/components/ui/RichTextRenderer";
import PageHero from "@/components/ui/PageHero";
import BreadcrumbSchema from "@/components/ui/BreadcrumbSchema";
import MachineShopExplorer from "@/components/sections/MachineShopExplorer";
import Link from "next/link";
import {
  Layers,
  Wrench,
  CheckCircle2,
  Phone,
  Flame,
  Droplets,
  Building2,
  Anchor,
  Activity,
  ArrowLeft,
} from "lucide-react";

export const revalidate = 60;

/* ── SEO Metadata ── */
export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("capabilities");
  return {
    title: page?.metaTitle || page?.title || "توانمندی‌ها و ماشین‌شاپ",
    description:
      page?.metaDescription ||
      page?.excerpt ||
      "توانمندی‌های مهندسی، ماشین‌کاری سنگین CNC، نورد ورق تا ۶۰ میلی‌متر، جوشکاری و تست هیدرواستاتیک شرکت هزاره کالا دانش اروند در شهرک صنعتی آبادان.",
    alternates: {
      canonical: `${SITE_URL}/capabilities`,
    },
    openGraph: {
      title: page?.metaTitle || page?.title || "توانمندی‌های هزاره کالا دانش اروند",
      description: page?.metaDescription || page?.excerpt || "",
      images: page?.heroImage ? [{ url: getMediaUrl(page.heroImage) }] : [],
    },
  };
}

/* ── Engineering Pillars ── */
const ENGINEERING_PILLARS = [
  {
    icon: Layers,
    title: "طراحی و شبیه‌سازی پیشرفته (CAD/CAM & CFD)",
    desc: "طراحی سه‌بعدی هیدرولیکی و مکانیکی، تحلیل تنش اجزای محدود (FEA) و شبیه‌سازی دینامیک سیالات محاسباتی جهت دستیابی به بالاترین راندمان و جلوگیری از کاویتاسیون.",
  },
  {
    icon: Wrench,
    title: "ساخت و ماشین‌کاری فوق‌سنگین در محل کارخانه",
    desc: "ماشین‌کاری پوسته‌ها و شفت‌ها با تراش ۶ متری، فرز CNC سه متری KF3000 اسپانیا، وایرکات و سوراخ‌کاری رادیال ۴ متری بدون نیاز به برون‌سپاری.",
  },
  {
    icon: Activity,
    title: "آزمون‌های عملکردی و تست هیدرواستاتیک",
    desc: "تست فشار بدنه، اندازه‌گیری دبی و هد، کنترل ارتعاش، آزمون خودمکش و استخراج منحنی عملکرد اختصاصی طبق استانداردهای بین‌المللی API و ISO.",
  },
];

/* ── Industrial Applications ── */
const INDUSTRIAL_SECTORS = [
  {
    icon: Flame,
    title: "نفت، گاز و پتروشیمی",
    desc: "انتقال نفت خام، فرآورده‌های نفتی سنگین، سوخت، لجن هیدروکربنی و جابه‌جایی سیالات بین مخازن و تانک‌فارم‌ها.",
  },
  {
    icon: Droplets,
    title: "مدیریت بحران و مهار آلودگی",
    desc: "جمع‌آوری سریع آلودگی‌های نفتی، تخلیه حوضچه‌های آلوده، مهار نشت و امداد اضطراری در نقاط فاقد زیرساخت برق.",
  },
  {
    icon: Anchor,
    title: "صنایع دریایی و ساحلی",
    desc: "آب‌کشی مخازن بارج‌ها و شناورها، وت‌بلاست و زنگ‌زدایی اسکله‌ها و سازه‌های دریایی بدون ایجاد غبار معلق.",
  },
  {
    icon: Building2,
    title: "آب، فاضلاب و پروژه‌های عمرانی",
    desc: "آبگیری گودها، کانال‌ها، انتقال پساب‌های حاوی شن، ماسه، لجن و جامدات تا قطر ۱۰۰ میلی‌متر با پمپ‌های خودمکش.",
  },
];

export default async function CapabilitiesPage() {
  const [settings, page] = await Promise.all([getSettings(), getPage("capabilities")]);

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
          title={page?.title || "توانمندی‌ها و تجهیزات کارخانه"}
          subtitle={page?.subtitle || "از مهندسی و شبیه‌سازی تا ساخت و تست عملیاتی"}
          excerpt={
            page?.excerpt ||
            "هزاره کالا دانش اروند، مجتمع مهندسی و ساخت تجهیزات صنعتی در آبادان با ۲۱ دستگاه سنگین ماشین‌کاری، برش لیزر، نورد ۶۰ میلی‌متر و ایستگاه آزمون هیدرواستاتیک پمپ‌های صنعتی."
          }
          image={page?.heroImage}
          breadcrumb={[{ label: "خانه", href: "/" }, { label: page?.title || "توانمندی‌ها" }]}
        />

        {/* ── Engineering Pillars Section ── */}
        <section className="py-16 bg-white border-b border-gray-100">
          <div className="w-full px-4 md:px-8 lg:px-12">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold text-[#c49a2c] bg-[#c49a2c]/10 px-3 py-1 rounded-full border border-[#c49a2c]/20">
                رویکرد مهندسی یکپارچه
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#0a1628] mt-3">
                چرخه کامل طراحی تا تحویل در کارخانه آبادان
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {ENGINEERING_PILLARS.map((pillar, i) => {
                const Icon = pillar.icon;
                return (
                  <div
                    key={i}
                    className="bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:border-[#c49a2c]/40 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-12 h-12 rounded-xl bg-[#c49a2c] text-black flex items-center justify-center mb-6 shadow-md shadow-[#c49a2c]/20">
                        <Icon size={24} />
                      </div>
                      <h3 className="text-lg font-bold text-[#0a1628] mb-3">{pillar.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{pillar.desc}</p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-gray-200/60 flex items-center text-xs font-semibold text-[#c49a2c] gap-1">
                      <CheckCircle2 size={14} />
                      <span>استانداردسازی و نظارت کامل کیفی</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Dynamic Machine Shop Explorer (21 Machines & Workshop Facilities) ── */}
        <MachineShopExplorer />

        {/* ── CMS RichText Content (If Authored in Payload CMS) ── */}
        {page?.content && (
          <section className="py-16 bg-white">
            <div className="w-full px-4 md:px-8 lg:px-12 max-w-5xl mx-auto">
              <RichTextRenderer content={page.content} />
            </div>
          </section>
        )}

        {/* ── Industrial Applications Matrix ── */}
        <section className="py-16 md:py-20 bg-gray-50 border-t border-gray-100">
          <div className="w-full px-4 md:px-8 lg:px-12">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold text-[#c49a2c] bg-[#c49a2c]/10 px-3 py-1 rounded-full border border-[#c49a2c]/20">
                گستره کاربردها
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#0a1628] mt-3">
                صنایع هدف و حوزه‌های عملیاتی
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {INDUSTRIAL_SECTORS.map((sec, i) => {
                const Icon = sec.icon;
                return (
                  <div
                    key={i}
                    className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-10 h-10 rounded-lg bg-[#0a1628] text-[#c49a2c] flex items-center justify-center mb-4">
                        <Icon size={20} />
                      </div>
                      <h3 className="font-bold text-base text-[#0a1628] mb-2">{sec.title}</h3>
                      <p className="text-gray-600 text-xs leading-relaxed">{sec.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Call To Action Banner ── */}
        <section className="py-16 bg-gradient-to-r from-[#0a1628] via-[#0f2038] to-[#0a1628] text-white">
          <div className="w-full px-4 md:px-8 lg:px-12 text-center max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-4">
              نیاز به ساخت سفارشی پمپ یا خدمات ماشین‌کاری سنگین دارید؟
            </h2>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-8">
              مهندسان شرکت هزاره کالا دانش اروند آماده بررسی نقشه‌های فنی، تحلیل شرایط کاری سیال و طراحی اختصاصی پکیج‌های پمپاژ متناسب با نیاز پروژه شما هستند.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/contact"
                className="bg-[#c49a2c] hover:bg-[#b08824] text-black font-bold px-8 py-3.5 rounded-xl transition-colors shadow-lg shadow-[#c49a2c]/20 flex items-center gap-2"
              >
                <Phone size={18} />
                <span>درخواست مشاوره فنی و استعلام</span>
              </Link>
              <Link
                href="/compare"
                className="bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3.5 rounded-xl transition-colors border border-white/20 flex items-center gap-2"
              >
                <span>مقایسه مشخصات پمپ‌ها</span>
                <ArrowLeft size={16} />
              </Link>
            </div>
          </div>
        </section>

        <Footer settings={settings} />
      </main>
    </>
  );
}