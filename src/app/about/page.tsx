import type { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck,
  Award,
  Factory,
  Wrench,
  Cog,
  Gauge,
  CheckCircle2,
  Users,
  Building,
  FileText,
  MapPin,
  Phone,
  Mail,
  ArrowLeft,
  Calendar,
  Sparkles,
  ExternalLink,
  User,
  Compass,
  Target,
  HeartHandshake,
  Layers,
} from "lucide-react";
import { getSettings, getPage, getTeamMembers } from "@/lib/payload";
import { SITE_URL, PAYLOAD_API_URL } from "@/lib/env";
import { getMediaUrl } from "@/lib/media";
import { COMPANY } from "@/lib/constants";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import BreadcrumbSchema from "@/components/ui/BreadcrumbSchema";
import RichTextRenderer from "@/components/ui/RichTextRenderer";
import WorkstationsExplorer, { type WorkstationData } from "@/components/sections/WorkstationsExplorer";

export const revalidate = 60;

async function getWorkshopImages(): Promise<any[]> {
  try {
    const res = await fetch(
      `${PAYLOAD_API_URL}/gallery?where[category][equals]=workshop&limit=6&sort=-order`,
      {
        headers: { "Content-Type": "application/json" },
        next: { revalidate: 60 },
      }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.docs ?? [];
  } catch {
    return [];
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("about");
  return {
    title: page?.metaTitle || page?.title || "درباره ما | شرکت هزاره کالا دانش اروند",
    description:
      page?.metaDescription ||
      page?.excerpt ||
      "آشنایی با شرکت هزاره کالا دانش اروند: طراح و تولیدکننده پمپ‌های صنعتی بزرگ، خطوط تولید و ایستگاه‌های کاری کارخانه، استانداردها، هیئت مدیره و مأموریت سازمانی در شهرک صنعتی آبادان.",
    alternates: { canonical: `${SITE_URL}/about` },
    openGraph: {
      title: page?.metaTitle || page?.title || "درباره ما | شرکت هزاره کالا دانش اروند",
      description: page?.metaDescription || page?.excerpt || "",
      images: page?.heroImage ? [{ url: getMediaUrl(page.heroImage) }] : [],
    },
  };
}

const DEFAULT_STATS = [
  {
    number: "۷+",
    label: "سال سابقه تخصصی",
    desc: "تأسیس ۱۳۹۸ در منطقه آزاد اروند",
    icon: Calendar,
  },
  {
    number: "API 610",
    label: "انطباق با استانداردهای بین‌المللی",
    desc: "طراحی مطابق ISO 5199 و API 610",
    icon: ShieldCheck,
  },
  {
    number: "۱۰۰٪",
    label: "تست هیدرولیک و بالانس",
    desc: "تست عملکردی پیش از تحویل به کارفرما",
    icon: Gauge,
  },
  {
    number: "آبادان",
    label: "پایگاه صنعتی استراتژیک",
    desc: "شهرک صنعتی آبادان، مجاورت صنایع نفت و گاز",
    icon: Factory,
  },
];

const DEFAULT_STRATEGIC_GOALS = [
  {
    icon: Target,
    title: "چشم‌انداز سازمانی",
    desc: "دستیابی به بالاترین سطح خودکفایی ملی در تولید پمپ‌های فوق‌سنگین و تجهیزات دوار حیاتی صنایع نفت، گاز، پتروشیمی و نیروگاهی کشور با برترین کیفیت مهندسی.",
  },
  {
    icon: Compass,
    title: "مأموریت ما",
    desc: "طراحی دقیق، ساخت مهندسی‌شده و تأمین سریع پمپ‌های فرآیندی با طول عمر بالا، همراه با ارائه خدمات پس از فروش و تأمین مطمئن قطعات یدکی در کمترین زمان ممکن.",
  },
  {
    icon: HeartHandshake,
    title: "تعهد به کیفیت و کارفرما",
    desc: "رعایت بی‌قیدوشرط ضوابط کنترل کیفی، متالورژی دقیق آلیاژها، آزمون‌های غیرمخرب (NDT) و تست‌های جامع هیدرولیکی برای تضمین آرامش خاطر کامل بهره‌برداران.",
  },
];

const DEFAULT_WORKSTATIONS: WorkstationData[] = [
  {
    title: "سالن ماشین‌کاری و تراشکاری سنگین CNC",
    description:
      "تجهیز شده با دستگاه‌های تراش سنگین بورینگ و تراش‌های افقی و عمودی CNC برای ماشین‌کاری دقیق محفظه‌های پمپ، پروانه‌ها، شفت‌ها و کیسینگ‌های با ابعاد بزرگ.",
    equipment: "دستگاه‌های تراش سنگین، فرز و بورینگ ۴ محوره CNC",
    capacity: "ماشین‌کاری قطعات تا قطر ۲۵۰۰ میلی‌متر با تلرانس میکرومتری",
    icon: "machining",
  },
  {
    title: "ایستگاه تست هیدرولیک و عملکرد بسته (Test Loop)",
    description:
      "لوپ مدار بسته اندازه‌گیری مشخصات هیدرولیکی پمپ‌ها شامل ثبت آنلاین منحنی دبی-هد (Q-H)، اندازه‌گیری فشار، توان مصرفی و تست NPSH بر پایه استاندارد ISO 9906.",
    equipment: "سنسورهای فشار پیزوالکتریک، دبی‌سنج‌های التراسونیک و مانیتورینگ دیجیتال",
    capacity: "آزمون هیدرولیکی پمپ‌های دبی بالا تا ۵۰۰۰ مترمکعب در ساعت",
    icon: "testing",
  },
  {
    title: "واحد بالانس دینامیکی الکترونیکی",
    description:
      "تنظیم و بالانس دینامیکی دور بالای پروانه‌ها و محورهای دوار بر اساس استاندارد ISO 1940 گرید G2.5 به منظور به حداقل رساندن ارتعاش و افزایش عمر بیرینگ‌ها و مکانیکال سیل‌ها.",
    equipment: "دستگاه بالانس دینامیکی هوشمند با سنسورهای زاویه‌سنج لیزری",
    capacity: "بالانس روتورها و ایمپلرها با دورهای عملیاتی تا ۳۰۰۰ RPM",
    icon: "balancing",
  },
  {
    title: "آزمایشگاه کنترل کیفیت (QC) و متالورژی",
    description:
      "بازرسی ضخامت، سختی‌سنجی، آزمون ذرات مغناطیسی (MT)، مایع نافذ (PT) و آنالیز متالورژیکی آلیاژهای ضدخوردگی نظیر داپلکس، استنلس استیل ۳۱۶ و برنز.",
    equipment: "دستگاه‌های ضخامت‌سنج التراسونیک، سختی‌سنج پرتابل و گیج‌های کالیبره",
    capacity: "صدور سرتیفیکیت کیفی (MTC) و کتابچه نهایی بازرسی (Final Book)",
    icon: "qc",
  },
  {
    title: "واحد مونتاژ و آب‌بندی مکانیکی",
    description:
      "خط تخصصی مونتاژ قطعات، تنظیم لقی‌های مجاز هیدرولیکی، نصب مکانیکال سیل‌های کارتریجی دوبل و سیستم‌های فلاشینگ پلن مطابق با API 682.",
    equipment: "تجهیزات هیدرولیکی جا زدن برینگ‌ها و هیترهای القایی",
    capacity: "مونتاژ پمپ‌های چند طبقه فشار قوی و فرآیندی سنگین",
    icon: "assembly",
  },
];

export default async function AboutPage() {
  const [settings, page, teamMembers, workshopImages] = await Promise.all([
    getSettings(),
    getPage("about"),
    getTeamMembers(),
    getWorkshopImages(),
  ]);

  const certificates = settings?.certificates || [];

  // Resolve dynamic or fallback fields
  const displayStats =
    page?.stats && page.stats.length > 0
      ? page.stats.map((s, idx) => ({
          number: s.number,
          label: s.label,
          desc: s.description || "",
          icon: DEFAULT_STATS[idx % DEFAULT_STATS.length].icon,
        }))
      : DEFAULT_STATS;

  const displayGoals =
    page?.strategicGoals && page.strategicGoals.length > 0
      ? page.strategicGoals.map((g, idx) => ({
          title: g.title,
          desc: g.description,
          icon:
            g.icon === "mission"
              ? Compass
              : g.icon === "values"
              ? HeartHandshake
              : g.icon === "quality"
              ? ShieldCheck
              : Target,
        }))
      : DEFAULT_STRATEGIC_GOALS;

  const displayWorkstations: WorkstationData[] =
    page?.workstations && page.workstations.length > 0
      ? page.workstations
      : DEFAULT_WORKSTATIONS;

  const companyGrounds = page?.companyGrounds || [];

  // Resolve dynamic Introduction & Credentials
  const introBadge = page?.introSection?.badge || "معرفی و تاریخچه";
  const introTitle = page?.introSection?.title || "تعهد به خودکفایی، دانش مهندسی و نوآوری صنعتی";
  const introStory = page?.introSection?.story;
  const introHighlights =
    page?.introSection?.highlights && page.introSection.highlights.length > 0
      ? page.introSection.highlights.map((h) => h.text)
      : [
          "تأمین متریال آلیاژی ضدخوردگی و استنلس استیل",
          "پشتیبانی فنی ۲۴/۷ و اعزام تیم کارشناسی به سایت",
        ];

  const credentialsBoxTitle = page?.credentials?.boxTitle || "شناسنامه شرکت";
  const credentialsCompanyType = page?.credentials?.companyType || "سهامی خاص";
  const credentialsRegisteredName = page?.credentials?.registeredName || COMPANY.nameFa;
  const credentialsRegNumber =
    page?.credentials?.registrationNumber || `${COMPANY.registrationNumber} (منطقه آزاد اروند)`;
  const credentialsNationalId = page?.credentials?.nationalId || COMPANY.nationalId;
  const credentialsEconomicCode = page?.credentials?.economicCode || COMPANY.economicCode;
  const credentialsCeo = page?.credentials?.ceo || COMPANY.ceo;
  const credentialsLocation = page?.credentials?.location || "شهرک صنعتی آبادان";
  const credentialsCtaText = page?.credentials?.ctaText || "درخواست مشاوره و بازدید از کارخانه";
  const credentialsCtaLink = page?.credentials?.ctaLink || "/contact";

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "خانه", url: SITE_URL },
          { name: page?.title || "درباره ما", url: `${SITE_URL}/about` },
        ]}
      />

      <main className="min-h-screen bg-white" dir="rtl">
        <Header settings={settings} />

        {/* 1. Hero Header */}
        <PageHero
          title={page?.title || "درباره شرکت هزاره کالا"}
          subtitle="پیشگام در مهندسی و ساخت پمپ‌های صنعتی سنگین"
          excerpt={
            page?.excerpt ||
            "شرکت هزاره کالا دانش اروند؛ طراح و سازنده انواع پمپ‌های سانتریفیوژ، پیستونی و دنده‌ای فشار قوی برای صنایع نفت، گاز، پتروشیمی و نیروگاهی کشور در شهرک صنعتی آبادان."
          }
          image={page?.heroImage}
          breadcrumb={[{ label: "خانه", href: "/" }, { label: "درباره ما" }]}
        />

        {/* 2. Key Metrics & Industrial Highlights */}
        <section className="py-8 bg-gray-50 border-b border-gray-100" aria-label="شاخص‌های کلیدی شرکت">
          <div className="w-full px-4 sm:px-6 md:px-12 lg:px-16 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {displayStats.map((stat, i) => {
                const IconComponent = stat.icon;
                return (
                  <div
                    key={i}
                    className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-[#c49a2c]/30 transition-all flex items-center gap-4"
                  >
                    <div className="w-13 h-13 rounded-xl bg-[#060f1c] text-[#c49a2c] flex items-center justify-center shrink-0 shadow-sm">
                      <IconComponent size={24} />
                    </div>
                    <div>
                      <span className="block text-2xl font-black text-[#0a1628] leading-tight">
                        {stat.number}
                      </span>
                      <h3 className="text-sm font-bold text-gray-800 mt-0.5">{stat.label}</h3>
                      {stat.desc && <p className="text-xs text-gray-500 mt-0.5">{stat.desc}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 3. Company Story & Introduction */}
        <section className="py-16 md:py-24 bg-white" aria-labelledby="about-story-heading">
          <div className="w-full px-4 sm:px-6 md:px-12 lg:px-16 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              {/* Text narrative */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <span className="text-[#c49a2c] text-xs sm:text-sm font-bold uppercase tracking-wider block mb-2">
                    {introBadge}
                  </span>
                  <h2 id="about-story-heading" className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0a1628] leading-tight">
                    {introTitle}
                  </h2>
                </div>

                {introStory ? (
                  <div className="text-gray-700 text-sm sm:text-base leading-relaxed space-y-4 text-justify">
                    <RichTextRenderer content={introStory} />
                  </div>
                ) : (
                  <div className="text-gray-700 text-sm sm:text-base leading-relaxed space-y-4 text-justify">
                    <p>
                      <strong className="text-[#0a1628] font-bold">شرکت هزاره کالا دانش اروند</strong> در فروردین‌ماه سال ۱۳۹۸ با هدف پاسخگویی به نیازهای حیاتی صنایع نفت، گاز، پالایش، پتروشیمی، نیروگاهی و صنایع سنگین در زمینه طراحی، مهندسی معکوس و ساخت پمپ‌های صنعتی تأسیس گردید.
                    </p>
                    <p>
                      استقرار کارخانه در <strong className="text-[#0a1628] font-bold">شهرک صنعتی آبادان</strong> در جوار بزرگ‌ترین قطب‌های انرژی و پالایشی کشور، این امکان را فراهم آورده تا زنجیره طراحی تا ساخت، تست و پشتیبانی فنی بدون واسطه و با حداکثر سرعت در اختیار کارفرمایان قرار گیرد.
                    </p>
                    <p>
                      ما با تکیه بر نیروهای متخصص بومی، بهره‌گیری از دانش روز متالورژی و ماشین‌کاری دقیق، پمپ‌های صنعتی با کاربری فشار قوی، سیالات خورنده و ویسکوز را منطبق بر استانداردهای معتبر جهانی نظیر <span className="font-bold text-[#0a1628]">API 610</span>، <span className="font-bold text-[#0a1628]">ISO 5199</span> و <span className="font-bold text-[#0a1628]">DIN 24256</span> به تولید می‌رسانیم.
                    </p>
                  </div>
                )}

                {/* Quick key badges */}
                {introHighlights.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {introHighlights.map((hl, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 p-3 rounded-xl bg-gray-50 border border-gray-100">
                        <CheckCircle2 size={18} className="text-[#c49a2c] shrink-0" />
                        <span className="text-xs sm:text-sm font-bold text-gray-800">
                          {hl}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Visual Card / Factory Info Box */}
              <div className="lg:col-span-5">
                <div className="relative bg-[#060f1c] text-white rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl overflow-hidden">
                  <div className="absolute -right-20 -top-20 w-60 h-60 bg-[#c49a2c]/20 rounded-full blur-3xl pointer-events-none" />

                  <div className="relative z-10 space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-white/10">
                      <div className="flex items-center gap-3">
                        <Building size={24} className="text-[#c49a2c]" />
                        <h3 className="font-bold text-lg text-white">{credentialsBoxTitle}</h3>
                      </div>
                      <span className="text-[11px] font-bold bg-[#c49a2c] text-black px-2.5 py-1 rounded-full">
                        {credentialsCompanyType}
                      </span>
                    </div>

                    <dl className="space-y-3.5 text-xs sm:text-sm">
                      <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                        <dt className="text-gray-400">نام کامل ثبتی:</dt>
                        <dd className="font-bold text-gray-100 text-left">{credentialsRegisteredName}</dd>
                      </div>
                      <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                        <dt className="text-gray-400">شماره ثبت:</dt>
                        <dd className="font-bold text-[#e5c158]">{credentialsRegNumber}</dd>
                      </div>
                      <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                        <dt className="text-gray-400">شناسه ملی:</dt>
                        <dd className="font-bold text-gray-100">{credentialsNationalId}</dd>
                      </div>
                      <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                        <dt className="text-gray-400">کد اقتصادی:</dt>
                        <dd className="font-bold text-gray-100">{credentialsEconomicCode}</dd>
                      </div>
                      <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                        <dt className="text-gray-400">مدیرعامل:</dt>
                        <dd className="font-bold text-gray-100">{credentialsCeo}</dd>
                      </div>
                      <div className="flex justify-between items-start py-1.5">
                        <dt className="text-gray-400 shrink-0">محل استقرار:</dt>
                        <dd className="font-bold text-gray-200 text-left leading-relaxed">
                          {credentialsLocation}
                        </dd>
                      </div>
                    </dl>

                    <div className="pt-2">
                      <Link
                        href={credentialsCtaLink}
                        className="w-full flex items-center justify-center gap-2 bg-[#c49a2c] hover:bg-[#d4a82c] text-black py-3 rounded-xl font-bold text-xs sm:text-sm transition-colors shadow-md hover:shadow-lg"
                      >
                        <Phone size={15} />
                        <span>{credentialsCtaText}</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Strategic Mission, Vision & Values */}
        <section className="py-16 md:py-20 bg-gray-50 border-y border-gray-100" aria-labelledby="strategic-heading">
          <div className="w-full px-4 sm:px-6 md:px-12 lg:px-16 max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-[#c49a2c] text-xs sm:text-sm font-bold uppercase tracking-wider block mb-2">
                اصول و خط‌مشی
              </span>
              <h2 id="strategic-heading" className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0a1628]">
                اهداف راهبردی و منشور کیفیت
              </h2>
              <p className="text-gray-500 text-sm mt-3 leading-relaxed">
                ارزش‌های بنیادین ما در ارائه خدمات مهندسی و ساخت تجهیزات با حداکثر قابلیت اطمینان
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {displayGoals.map((val, i) => {
                const IconComponent = val.icon;
                return (
                  <div
                    key={i}
                    className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#c49a2c]/30 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-[#c49a2c]/10 text-[#c49a2c] flex items-center justify-center mb-6">
                        <IconComponent size={24} />
                      </div>
                      <h3 className="text-lg font-bold text-[#0a1628] mb-3">{val.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed text-justify">{val.desc}</p>
                    </div>
                    <div className="pt-6 mt-6 border-t border-gray-100 flex items-center gap-2 text-xs font-bold text-[#c49a2c]">
                      <span>استاندارد تضمین کیفیت</span>
                      <ShieldCheck size={14} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 5. Interactive Workstations & Facility Showcase */}
        <WorkstationsExplorer workstations={displayWorkstations} />

        {/* 6. Company Grounds & Facility Gallery */}
        {companyGrounds.length > 0 ? (
          <section className="py-16 md:py-20 bg-white" aria-labelledby="grounds-heading">
            <div className="w-full px-4 sm:px-6 md:px-12 lg:px-16 max-w-7xl mx-auto">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <span className="text-[#c49a2c] text-xs sm:text-sm font-bold uppercase tracking-wider block mb-2">
                  محیط و امکانات کارخانه
                </span>
                <h2 id="grounds-heading" className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0a1628]">
                  تصاویر ساختمان و محوطه کارخانه
                </h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {companyGrounds.map((ground, idx) => (
                  <div
                    key={ground.id || idx}
                    className="group bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all"
                  >
                    <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={getMediaUrl(ground.image)}
                        alt={ground.title || `محوطه ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                    {ground.title && (
                      <div className="p-3">
                        <h4 className="text-xs sm:text-sm font-bold text-[#0a1628] truncate">
                          {ground.title}
                        </h4>
                        {ground.description && (
                          <p className="text-xs text-gray-500 truncate mt-0.5">{ground.description}</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : workshopImages.length > 0 ? (
          <section className="py-12 bg-white" aria-label="گالری کارگاه">
            <div className="w-full px-4 sm:px-6 md:px-12 lg:px-16 max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-base sm:text-lg font-bold text-[#0a1628] flex items-center gap-2">
                  <Factory size={18} className="text-[#c49a2c]" />
                  <span>نگاهی به فضای کارگاه و خط تولید در آبادان</span>
                </h3>
                <Link
                  href="/gallery"
                  className="text-xs font-bold text-[#c49a2c] hover:underline flex items-center gap-1"
                >
                  <span>مشاهده همه تصاویر در گالری</span>
                  <ArrowLeft size={13} />
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                {workshopImages.map((imgItem, idx) => (
                  <Link
                    key={imgItem.id || idx}
                    href="/gallery"
                    className="group relative aspect-square bg-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md border border-gray-100 block"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getMediaUrl(imgItem.image)}
                      alt={imgItem.title || `تصویر کارگاه ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[11px] font-bold">
                      <span>مشاهده</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {/* 7. Payload Dynamic Content (if custom content added via CMS) */}
        {page?.content && (
          <section className="py-12 bg-gray-50 border-t border-gray-100">
            <div className="w-full px-4 sm:px-6 md:px-12 lg:px-16 max-w-7xl mx-auto">
              <RichTextRenderer content={page.content} />
            </div>
          </section>
        )}

        {/* 8. Board of Directors & Leadership Team */}
        {teamMembers.length > 0 && (
          <section className="py-16 md:py-24 bg-white border-t border-gray-100" aria-labelledby="team-heading">
            <div className="w-full px-4 sm:px-6 md:px-12 lg:px-16 max-w-7xl mx-auto">
              <div className="text-center max-w-2xl mx-auto mb-14">
                <span className="text-[#c49a2c] text-xs sm:text-sm font-bold uppercase tracking-wider block mb-2">
                  سرمایه انسانی
                </span>
                <h2 id="team-heading" className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0a1628]">
                  اعضای هیئت مدیره و مدیریت ارشد
                </h2>
                <p className="text-gray-500 text-sm mt-3 leading-relaxed">
                  تیم راهبری متخصص با سال‌ها سابقه فعالیت در صنایع نفت، پالایش و تأسیسات دوار
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="group bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-[#c49a2c]/30 transition-all duration-300 flex flex-col items-center text-center"
                  >
                    <div className="relative w-28 h-28 mx-auto mb-5">
                      {member.photo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={getMediaUrl(member.photo)}
                          alt={member.name}
                          className="w-full h-full rounded-2xl object-cover border-2 border-gray-100 group-hover:border-[#c49a2c] transition-colors shadow-sm"
                        />
                      ) : (
                        <div className="w-full h-full rounded-2xl bg-[#060f1c] text-[#c49a2c] flex items-center justify-center shadow-sm">
                          <User size={36} />
                        </div>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-[#0a1628] mb-1">{member.name}</h3>
                    <p className="text-[#c49a2c] text-xs font-bold mb-3">{member.position}</p>

                    {member.bio && (
                      <p className="text-gray-500 text-xs leading-relaxed line-clamp-3 mb-4">
                        {member.bio}
                      </p>
                    )}

                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-auto inline-flex items-center gap-1 text-xs text-gray-400 hover:text-[#c49a2c] transition-colors font-medium"
                      >
                        <span>پروفایل لینکدین</span>
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 9. Certificates, Standards & Accreditations */}
        {certificates.length > 0 && (
          <section className="py-16 md:py-20 bg-gray-50 border-t border-gray-100" aria-labelledby="certs-heading">
            <div className="w-full px-4 sm:px-6 md:px-12 lg:px-16 max-w-7xl mx-auto">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <span className="text-[#c49a2c] text-xs sm:text-sm font-bold uppercase tracking-wider block mb-2">
                  اعتبارسنجی و استانداردها
                </span>
                <h2 id="certs-heading" className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0a1628]">
                  گواهینامه‌ها و مجوزهای رسمی
                </h2>
                <p className="text-gray-500 text-sm mt-3 leading-relaxed">
                  دارنده مجوزهای رسمی از مراجع قانونی، سازمان منطقه آزاد اروند و تأییدیه‌های کیفیت
                </p>
              </div>

              <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10 max-w-4xl mx-auto">
                {certificates.map((cert, i) => (
                  <div
                    key={cert.id || i}
                    className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-lg hover:border-[#c49a2c]/40 transition-all flex flex-col items-center gap-3 w-36 sm:w-44 text-center group"
                  >
                    <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={getMediaUrl(cert.image)}
                        alt={cert.title || `گواهینامه ${i + 1}`}
                        className="max-w-full max-h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    {cert.title && (
                      <span className="text-xs font-bold text-gray-700 group-hover:text-[#c49a2c] transition-colors line-clamp-2">
                        {cert.title}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 10. Direct Call to Action & Factory Visit */}
        <section className="py-16 md:py-20 bg-[#060f1c] text-white relative overflow-hidden" aria-label="تماس و ارتباط با کارخانه">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#c49a2c]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="w-full px-4 sm:px-6 md:px-12 lg:px-16 max-w-5xl mx-auto text-center relative z-10 space-y-6">
            <span className="inline-block bg-[#c49a2c]/20 text-[#e5c158] border border-[#c49a2c]/40 px-4 py-1.5 rounded-full text-xs font-bold">
              همکاری تجاری و تأمین تجهیزات
            </span>

            <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-white leading-tight">
              آماده مشاوره فنی و اجرای پروژه‌های پمپاژ صنعتی شما هستیم
            </h2>

            <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              برای استعلام مشخصات فنی، بازدید حضوری از خطوط تولید در شهرک صنعتی آبادان یا دریافت پیش‌فاکتور با مهندسین ما تماس حاصل فرمایید.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#c49a2c] hover:bg-[#d4a82c] text-black px-8 py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg hover:shadow-[#c49a2c]/30 hover:-translate-y-0.5"
              >
                <Phone size={16} />
                <span>تماس و ارسال درخواست استعلام</span>
              </Link>

              <Link
                href="/products"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-3.5 rounded-xl font-bold text-sm transition-all"
              >
                <span>مشاهده کاتالوگ محصولات</span>
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