import type { Metadata } from "next";
import { getSettings, getPage } from "@/lib/payload";
import { SITE_URL } from "@/lib/env";
import { getMediaUrl } from "@/lib/media";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import RichTextRenderer from "@/components/ui/RichTextRenderer";
import PageHero from "@/components/ui/PageHero";
import BreadcrumbSchema from "@/components/ui/BreadcrumbSchema";
import CapabilitiesExplorer from "@/components/sections/CapabilitiesExplorer";
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
  ShieldCheck,
  Zap,
} from "lucide-react";

export const revalidate = 60;

/* ── SEO Metadata ── */
export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("capabilities");
  return {
    title: page?.metaTitle || page?.title || "توانمندی‌های مهندسی و ماشین‌شاپ صنعتی | هزاره کالا دانش اروند",
    description:
      page?.metaDescription ||
      page?.excerpt ||
      "مرکز ماشین‌کاری سنگین ۲۰ تن، نورد ورق تا ۶۰ میلی‌متر، ساخت مبدل حرارتی، پمپ شاپ، تعمیر و اورهال ولو، جوشکاری تخصصی و وت‌بلاست در کارخانه آبادان شرکت هزاره کالا دانش اروند.",
    alternates: {
      canonical: `${SITE_URL}/capabilities`,
    },
    openGraph: {
      title: page?.metaTitle || page?.title || "توانمندی‌های مهندسی کارخانه هزاره کالا دانش اروند",
      description:
        page?.metaDescription ||
        page?.excerpt ||
        "مرکز تخصصی ماشین‌کاری فوق‌سنگین، ساخت مبدل، پمپ و اورهال ولو در منطقه آزاد اروند.",
      images: page?.heroImage ? [{ url: getMediaUrl(page.heroImage) }] : [],
    },
  };
}

/* ── Engineering Pillars ── */
const ENGINEERING_PILLARS = [
  {
    icon: Layers,
    title: "طراحی، شبیه‌سازی و مهندسی معکوس",
    desc: "طراحی سه‌بعدی هیدرولیکی، تحلیل تنش اجزای محدود (FEA)، شبیه‌سازی CFD و تدوین مستندات ساخت و WPS طبق استانداردهای بین‌المللی ASME و API.",
  },
  {
    icon: Wrench,
    title: "ساخت و ماشین‌کاری فوق‌سنگین در کارخانه",
    desc: "عملیات ماشین‌کاری با تراش ۶ متری تا ۲۰ تن، فرز دروازه‌ای CNC اسپانیا، نورد ۴ غلطکه تا ضخامت ۶۰ میلی‌متر و برش لیزر ۶kW متمرکز در کارخانه آبادان.",
  },
  {
    icon: Activity,
    title: "تست‌های عملکردی و آزمون هیدرواستاتیک",
    desc: "بنچ تست هیدرولیک اندازه‌گیری دبی و هد، استخراج منحنی Q-H، تست هیدرواستاتیک شل و تیوب مبدل‌ها و آزمون نشتی شیرآلات طبق API 598.",
  },
];

/* ── Industrial Applications ── */
const INDUSTRIAL_SECTORS = [
  {
    icon: Flame,
    title: "پالایشگاه‌ها، گاز و پتروشیمی",
    desc: "ساخت و تعمیر مبدل‌های حرارتی فرآیندی، پمپ‌های اسلاری و هیدروکربنی سنگین، بازسازی و تست دوره‌ای ولوهای فرآیندی.",
  },
  {
    icon: Droplets,
    title: "مدیریت بحران و مهار آلودگی‌های نفتی",
    desc: "سامانه‌های پمپاژ خودمکش سیلاب و پساب‌های حاوی جامدات تا ۱۰۰ میلی‌متر، پکیج‌های پرتابل لجن‌کش و ایستگاه‌های تخلیه سریع.",
  },
  {
    icon: Anchor,
    title: "صنایع دریایی، کشتی‌سازی و بنادر",
    desc: "تراش شفت‌های عظیم پروانه و پروانه‌دار، آماده‌سازی سطح با وت‌بلاست بدون غبار در اسکله و پوشش‌های ضدخوردگی سه‌لایه دریایی.",
  },
  {
    icon: Building2,
    title: "صنایع فولاد، سیمان و نیروگاهی",
    desc: "تعمیرات اساسی قطعات سنگین خطوط نورد، ماشین‌کاری هوزینگ‌های حجیم، تأمین دیزل ژنراتورهای صنعتی و پمپ‌های تغذیه دیگ بخار.",
  },
];

export default async function CapabilitiesPage() {
  const [settings, page] = await Promise.all([getSettings(), getPage("capabilities")]);

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "خانه", url: SITE_URL },
          { name: page?.title || "توانمندی‌ها و ماشین‌شاپ", url: `${SITE_URL}/capabilities` },
        ]}
      />

      <main className="min-h-screen bg-white" dir="rtl">
        <Header settings={settings} />

        <PageHero
          title={page?.title || "توانمندی‌های ساخت و ماشین‌شاپ صنعتی"}
          subtitle={page?.subtitle || "از مهندسی دقیق و شبیه‌سازی تا ساخت قطعات فوق‌سنگین و تست نهایی"}
          excerpt={
            page?.excerpt ||
            "مجتمع صنعتی هزاره کالا دانش اروند در شهرک صنعتی شماره یک آبادان؛ مجهز به ۷ واحد تخصصی شامل ماشین‌کاری سنگین تا ۲۰ تن، نورد ورق تا ۶۰ میلی‌متر، مبدل شاپ، پمپ شاپ، تست ولو API و وت‌بلاست بدون غبار."
          }
          image={page?.heroImage}
          breadcrumb={[{ label: "خانه", href: "/" }, { label: page?.title || "توانمندی‌ها" }]}
        />

        {/* ── Engineering Pillars Section ── */}
        <section className="py-16 bg-white border-b border-gray-100">
          <div className="w-full px-4 md:px-8 lg:px-12 max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold text-[#c49a2c] bg-[#c49a2c]/10 px-3 py-1 rounded-full border border-[#c49a2c]/20">
                رویکرد مهندسی یکپارچه
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#0a1628] mt-3">
                چرخه کامل از تحلیل فنی تا تحویل در کارخانه آبادان
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
                      <div className="w-12 h-12 rounded-xl bg-[#c49a2c] text-[#0a1628] flex items-center justify-center mb-6 shadow-md shadow-[#c49a2c]/20">
                        <Icon size={24} />
                      </div>
                      <h3 className="text-lg font-bold text-[#0a1628] mb-3">{pillar.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{pillar.desc}</p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-gray-200/60 flex items-center text-xs font-semibold text-[#c49a2c] gap-1">
                      <CheckCircle2 size={14} />
                      <span>انطباق با کدهای ASME, API, TEMA</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Dynamic 7-Divisions Capabilities Explorer ── */}
        <CapabilitiesExplorer />

        {/* ── CMS RichText Content (If Authored in Payload CMS) ── */}
        {page?.content && (
          <section className="py-16 bg-white border-b border-gray-100">
            <div className="w-full px-4 md:px-8 lg:px-12 max-w-5xl mx-auto">
              <RichTextRenderer content={page.content} />
            </div>
          </section>
        )}

        {/* ── Industrial Applications Matrix ── */}
        <section className="py-16 md:py-20 bg-gray-50 border-t border-gray-100">
          <div className="w-full px-4 md:px-8 lg:px-12 max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold text-[#c49a2c] bg-[#c49a2c]/10 px-3 py-1 rounded-full border border-[#c49a2c]/20">
                گستره کاربردها و مشتریان
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#0a1628] mt-3">
                صنایع هدف و حوزه‌های اصلی همکاری
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c49a2c]/20 border border-[#c49a2c]/30 text-[#c49a2c] text-xs font-bold mb-4">
              <span>مشاوره و استعلام فنی مستقیم</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold mb-4">
              نیاز به ساخت قطعات سنگین، تعمیر پمپ یا اورهال تجهیزات دارید؟
            </h2>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-8">
              تیم مهندسی شرکت هزاره کالا دانش اروند در شهرک صنعتی آبادان آماده بررسی نقشه‌های فنی، شرایط کاری سیالات و ارائه طرح‌های بهینه ساخت و بازسازی تجهیزات شما می‌باشد.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/contact"
                className="bg-[#c49a2c] hover:bg-[#b08824] text-[#0a1628] font-bold px-8 py-3.5 rounded-xl transition-colors shadow-lg shadow-[#c49a2c]/20 flex items-center gap-2"
              >
                <Phone size={18} />
                <span>درخواست مشاوره و ثبت سفارش</span>
              </Link>
              <Link
                href="/products"
                className="bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3.5 rounded-xl transition-colors border border-white/20 flex items-center gap-2"
              >
                <span>مشاهده محصولات و تجهیزات کاتالوگ</span>
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