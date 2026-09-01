"use client";

import { useState } from "react";
import {
  Cog,
  Flame,
  Paintbrush,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
  Gauge,
  Workflow,
  Cpu,
} from "lucide-react";

/* ── Types ── */
export interface MachineItem {
  id: string;
  name: string;
  category: "machining" | "forming" | "welding" | "testing";
  specs: string;
  status: "available" | "installing";
  highlight?: string;
  iconName?: string;
}

/* ── Data ── */
const CATEGORIES = [
  {
    id: "machining",
    title: "ماشین‌کاری سنگین و CNC",
    subtitle: "تراشکاری، فرزکاری ۳ متری، وایرکات و سوراخ‌کاری رادیال",
    icon: Cog,
    count: 9,
  },
  {
    id: "forming",
    title: "آهنگری، برش و فرم‌دهی",
    subtitle: "لیزر ۶kW، نورد ورق تا ۶۰mm، پرس‌برک و پانچ ۶۰ تن",
    icon: Flame,
    count: 9,
  },
  {
    id: "welding",
    title: "جوشکاری، آماده‌سازی و رنگ",
    subtitle: "جوش لیزری، سندبلاست لیزری، وت‌بلاست، ایرلس و اتاق رنگ",
    icon: Paintbrush,
    count: 7,
  },
  {
    id: "testing",
    title: "مونتاژ، تست و لجستیک",
    subtitle: "تست هیدرواستاتیک، جرثقیل ۲۰ تن و ژنراتور ۴۰۰kVA",
    icon: ShieldCheck,
    count: 5,
  },
] as const;

const MACHINES: MachineItem[] = [
  /* ── 1. Machining & CNC ── */
  {
    id: "m-lathe-6m",
    name: "دستگاه تراش سنگین ۶ متری",
    category: "machining",
    specs: "طول کارگیر ۶ متر — دهانه کارگیر ۱.۸ متر — مناسب تراش شفت‌ها و پوسته‌های فوق‌سنگین",
    status: "available",
    highlight: "کارگیر ۱.۸ متر",
  },
  {
    id: "m-cnc-kf3000",
    name: "دستگاه فرز سنگین CNC مدل KF3000 (اسپانیا)",
    category: "machining",
    specs: "طول میز ۳ متر — کنترلر دقیق CNC — ماشین‌کاری قطعات پیچیده صنعتی و هوزینگ پمپ",
    status: "available",
    highlight: "میز ۳ متری",
  },
  {
    id: "m-lathes-tabriz",
    name: "۳ دستگاه تراش صنعتی (ماشین‌سازی تبریز)",
    category: "machining",
    specs: "ماشین‌کاری دقیق شفت‌ها، بوش‌ها، فلنج‌ها و آب‌بندهای پمپ‌های صنعتی",
    status: "available",
  },
  {
    id: "m-milling-tabriz",
    name: "دستگاه فرز منوال (ماشین‌سازی تبریز)",
    category: "machining",
    specs: "فرزکاری قطعات پایه، جای‌خار شفت‌ها و نشیمنگاه‌های یاتاقان",
    status: "available",
  },
  {
    id: "m-wirecut-large",
    name: "دستگاه وایرکات مولتی‌کات سایز بزرگ",
    category: "machining",
    specs: "برش فوق‌دقیق وایرکات با قابلیت پرداخت چندمرحله‌ای برای پروانه‌ها و قطعات حساس",
    status: "available",
    highlight: "مولتی‌کات دقیق",
  },
  {
    id: "m-spark",
    name: "دستگاه اسپارک الکترواروژن",
    category: "machining",
    specs: "تخلیه الکتریکی جهت قالب‌سازی، فرم‌دهی مقاطع سخت و رزوه‌زنی فلزات سخت‌کاری‌شده",
    status: "available",
  },
  {
    id: "m-radial-mez-4m",
    name: "دستگاه رادیال سنگین ۴ متری MEZ",
    category: "machining",
    specs: "شعاع کارگیر ۴ متر — سوراخ‌کاری و قلاویزکاری فلنج‌ها و قطعات بزرگ بدنه پمپ",
    status: "available",
    highlight: "شعاع ۴ متر",
  },
  {
    id: "m-radial-zj",
    name: "دستگاه رادیال صنعتی ZJ",
    category: "machining",
    specs: "سوراخ‌کاری دقیق و سریع قطعات شاسی و فریم‌های فلزی پکیج‌ها",
    status: "available",
  },
  {
    id: "m-column-drill",
    name: "دریل ستونی ماشین‌سازی تبریز",
    category: "machining",
    specs: "سوراخ‌کاری، برقوزنی و قلاویزکاری قطعات کمکی و اتصالات",
    status: "available",
  },

  /* ── 2. Forming & Laser ── */
  {
    id: "m-laser-6kw",
    name: "دستگاه برش لیزری ۶ کیلووات CNC",
    category: "forming",
    specs: "منبع لیزر فایبر ۶kW — میز ۶ متری — برش دقیق انواع ورق‌های آهن، استنلس‌استیل و آلومینیوم",
    status: "available",
    highlight: "میز ۶ متری / ۶kW",
  },
  {
    id: "m-rolling-60mm",
    name: "دستگاه نورد چهار غلطک سنگین ۳ متری (۶۰mm)",
    category: "forming",
    specs: "قابلیت نورد و رولینگ ورق‌های ضخیم تا ضخامت ۶۰ میلی‌متر (۶ سانتی‌متر) و عرض ۳ متر",
    status: "installing",
    highlight: "ضخامت ۶۰ میلی‌متر",
  },
  {
    id: "m-press-brake-3m",
    name: "دستگاه پرس‌برک هیدرولیک ۳ متری (۶ میل)",
    category: "forming",
    specs: "خم‌کاری دقیق ورق‌های فولادی و استیل جهت ساخت شاسی، کاور سایلنت و بدنه پکیج‌ها",
    status: "available",
    highlight: "طول ۳ متر",
  },
  {
    id: "m-press-punch-60t",
    name: "۲ دستگاه پرس ضربه‌ای و پانچ ۶۰ تن",
    category: "forming",
    specs: "پرس‌کاری سنگین و پانچ قطعات صنعتی، سینی‌های تاورهای پتروشیمی و خط تولید قطعات",
    status: "available",
    highlight: "ظرفیت ۶۰ تن",
  },
  {
    id: "m-guillotine-3m",
    name: "دستگاه گیوتین ۳.۲ متری (۶ میل استیل‌بر)",
    category: "forming",
    specs: "برش سریع و تمیز ورق‌های طویل با لبه‌های دقیق بدون اعوجاج",
    status: "available",
  },
  {
    id: "m-rolling-3rolls",
    name: "دستگاه نورد ۳ غلطک",
    category: "forming",
    specs: "رول‌کردن لوله‌ها، مخازن فشار و پوسته‌های استوانه‌ای پمپ‌ها",
    status: "available",
  },
  {
    id: "m-pipe-rolling",
    name: "دستگاه نورد لوله اتوماتیک",
    category: "forming",
    specs: "نورد دقیق لوله‌های انتقال سیال و انحناهای استاندارد پایپینگ",
    status: "available",
  },
  {
    id: "m-pipe-bending-auto",
    name: "دستگاه اتوماتیک خم‌کاری لوله",
    category: "forming",
    specs: "خم‌کاری لوله‌های هیدرولیک و خطوط رانش و مکش بدون افت مقطع",
    status: "installing",
  },
  {
    id: "m-bandsaw-large",
    name: "دستگاه اره نواری بزرگ ۳ متری و اره کارگاهی",
    category: "forming",
    specs: "برشکاری زاویه‌دار و دقیق پروفیل‌ها، شفت‌های قطور و شمش‌های فولادی",
    status: "available",
  },

  /* ── 3. Welding & Coating ── */
  {
    id: "m-welding-laser",
    name: "سامانه جوشکاری لیزری پیوسته",
    category: "welding",
    specs: "جوشکاری فوق‌العاده ظریف، بدون تغییر شکل حرارتی، با نفوذ عمیق در استنلس‌استیل و آلیاژها",
    status: "available",
    highlight: "فناوری لیزری",
  },
  {
    id: "m-welding-argon",
    name: "تجهیزات جوشکاری آرگون (TIG)",
    category: "welding",
    specs: "جوشکاری دقیق پروانه‌ها، مسیرهای استیل عبور سیال و اتصالات ضدخوردگی",
    status: "available",
  },
  {
    id: "m-welding-mig-smaw",
    name: "تجهیزات جوشکاری CO2 (MIG/MAG) و الکترود دستی",
    category: "welding",
    specs: "ساخت شاسی‌های مقاوم سنگین، مخازن سوخت و سازه‌های فولادی کارخانه",
    status: "available",
  },
  {
    id: "m-laser-sandblast",
    name: "دستگاه سندبلاست لیزری پیوسته",
    category: "welding",
    specs: "زنگ‌زدایی و آماده‌سازی سطح بدون سایش متریال با اشعه لیزر پرتوان",
    status: "available",
    highlight: "بدون آلودگی",
  },
  {
    id: "m-sandblast-cabin",
    name: "کابین و سالن سندبلاست صنعتی",
    category: "welding",
    specs: "تمیزکاری سطح و ایجاد پروفایل زبری استاندارد Sa 2.5 قبل از پوشش‌دهی",
    status: "available",
  },
  {
    id: "m-wetblast-unit",
    name: "دستگاه وت‌بلاست (Wet Blast)",
    category: "welding",
    specs: "شست‌وشوی ساینده مرطوب بدون غبار جهت رسوب‌زدایی قطعات نفتی و دریایی",
    status: "available",
  },
  {
    id: "m-paint-booth",
    name: "اتاق رنگ مدرن و سامانه پاشش ایرلس (Airless)",
    category: "welding",
    specs: "اعمال رنگ‌های صنعتی چندلایه (زینک ریچ، اپوکسی و پلی‌اورتان مقاوم به اشعه UV و شرجی)",
    status: "available",
    highlight: "پوشش چندلایه دریایی",
  },

  /* ── 4. Assembly, Testing & Logistics ── */
  {
    id: "m-hydrostatic-test",
    name: "ایستگاه آزمون هیدرواستاتیک و تست عملکرد پمپ",
    category: "testing",
    specs: "سنجش دبی، فشار، هد، عمق مکش، ارتعاش، کاویتاسیون و استخراج منحنی عملکرد واقعی",
    status: "available",
    highlight: "آزمون استاندارد API",
  },
  {
    id: "m-assembly-line",
    name: "سالن مونتاژ و کوپلینگ پکیج‌های پمپ",
    category: "testing",
    specs: "مونتاژ صفر تا صد موتورهای دیزل، پمپ‌های دنده‌ای، خودمکش، پولی و تسمه و کاور سایلنت",
    status: "available",
  },
  {
    id: "m-cranes",
    name: "جرثقیل‌های سقفی ۵ تن، ۱۰ تن و ۲۰ تن",
    category: "testing",
    specs: "جابه‌جایی ایمن و دقیق قالب‌ها، سازه‌های عظیم و پکیج‌های پمپ در سراسر سالن‌های تولید",
    status: "available",
    highlight: "ظرفیت تا ۲۰ تن",
  },
  {
    id: "m-forklift-7t",
    name: "لیفتراک سنگین ۷ تن",
    category: "testing",
    specs: "لجستیک کارگاهی، بارگیری پکیج‌ها روی تریلرها و جابه‌جایی در محوطه کارخانه",
    status: "available",
  },
  {
    id: "m-generator-400kva",
    name: "دیزل ژنراتور مستقل کارخانه ۴۰۰ کاوا",
    category: "testing",
    specs: "تأمین پیوسته برق اضطراری کارخانه بدون توقف خط تولید در شرایط قطع شبکه برق",
    status: "available",
    highlight: "برق مستقل ۴۰۰kVA",
  },
];

export default function MachineShopExplorer() {
  const [activeTab, setActiveTab] = useState<string>("machining");

  const filteredMachines = MACHINES.filter((m) => m.category === activeTab);

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 via-white to-gray-50 text-[#0a1628]" dir="rtl">
      <div className="w-full px-4 md:px-8 lg:px-12">
        {/* ── Section Header ── */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 bg-[#c49a2c]/10 text-[#c49a2c] font-bold text-xs px-4 py-1.5 rounded-full mb-3 border border-[#c49a2c]/20">
            <Cpu size={14} />
            <span>ماشین‌شاپ و خطوط تولید مستقل در آبادان</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0a1628] mb-4">
            تجهیزات و ظرفیت‌های ماشین‌کاری کارخانه
          </h2>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            مجموعه هزاره کالا دانش اروند با بهره‌گیری از ۲۱ دستگاه صنعتی سنگین و پیشرفته، صفر تا صد طراحی، ماشین‌کاری، فرم‌دهی، جوشکاری، رنگ‌آمیزی و آزمون عملکرد را در کارخانه اختصاصی خود در شهرک صنعتی آبادان اجرا می‌کند.
          </p>
        </div>

        {/* ── Category Tabs ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`p-5 rounded-2xl text-right transition-all duration-300 border flex flex-col justify-between ${
                  isActive
                    ? "bg-[#0a1628] text-white border-[#c49a2c] shadow-lg shadow-[#0a1628]/15 -translate-y-1"
                    : "bg-white text-gray-700 border-gray-200 hover:border-[#c49a2c]/40 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isActive ? "bg-[#c49a2c] text-black" : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    <Icon size={20} />
                  </div>
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      isActive ? "bg-white/15 text-[#c49a2c]" : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {cat.count} دستگاه
                  </span>
                </div>
                <div>
                  <h3 className={`font-bold text-base mb-1 ${isActive ? "text-white" : "text-[#0a1628]"}`}>
                    {cat.title}
                  </h3>
                  <p className={`text-xs line-clamp-2 ${isActive ? "text-gray-300" : "text-gray-500"}`}>
                    {cat.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* ── Machine Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMachines.map((machine) => (
            <div
              key={machine.id}
              className="bg-white rounded-2xl p-6 border border-gray-200/90 shadow-sm hover:shadow-xl hover:border-[#c49a2c]/40 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  {machine.status === "available" ? (
                    <span className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 text-[11px] font-bold px-2.5 py-1 rounded-md border border-emerald-200/60">
                      <CheckCircle2 size={12} />
                      موجود در کارخانه
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-amber-700 bg-amber-50 text-[11px] font-bold px-2.5 py-1 rounded-md border border-amber-200/60">
                      <Clock size={12} />
                      خریداری‌شده / در حال نصب
                    </span>
                  )}

                  {machine.highlight && (
                    <span className="text-[11px] font-bold text-[#c49a2c] bg-[#c49a2c]/10 px-2 py-0.5 rounded border border-[#c49a2c]/20">
                      {machine.highlight}
                    </span>
                  )}
                </div>

                <h4 className="text-lg font-bold text-[#0a1628] mb-2 group-hover:text-[#c49a2c] transition-colors">
                  {machine.name}
                </h4>

                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {machine.specs}
                </p>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Workflow size={13} className="text-[#c49a2c]" />
                  کارخانه شهرک صنعتی آبادان
                </span>
                <span className="text-[11px] text-gray-400 font-medium">آماده پذیرش سفارش</span>
              </div>
            </div>
          ))}
        </div>

        {/* ── Key Plant Capabilities Strip ── */}
        <div className="mt-14 bg-[#0a1628] rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-96 h-96 bg-[#c49a2c]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-white/10">
            <div className="pt-4 md:pt-0">
              <div className="w-12 h-12 rounded-2xl bg-[#c49a2c]/20 flex items-center justify-center text-[#c49a2c] mb-4">
                <Gauge size={24} />
              </div>
              <h4 className="text-xl font-bold mb-2">تست هیدرواستاتیک</h4>
              <p className="text-gray-300 text-xs leading-relaxed">
                آزمون فشار، اندازه‌گیری دبی و ارتعاش طبق استانداردهای بین‌المللی API 610 و ارائه منحنی عملکرد نهایی به کارفرما.
              </p>
            </div>

            <div className="pt-4 md:pt-0 md:pr-8">
              <div className="w-12 h-12 rounded-2xl bg-[#c49a2c]/20 flex items-center justify-center text-[#c49a2c] mb-4">
                <Flame size={24} />
              </div>
              <h4 className="text-xl font-bold mb-2">نورد تا ۶۰ میلی‌متر</h4>
              <p className="text-gray-300 text-xs leading-relaxed">
                نورد سنگین ۴ غلطک ۳ متری با توانایی رول‌کردن ورق‌های فوق‌ضخیم تا ۶ سانتی‌متر برای صنایع نفت و پتروشیمی.
              </p>
            </div>

            <div className="pt-4 md:pt-0 md:pr-8">
              <div className="w-12 h-12 rounded-2xl bg-[#c49a2c]/20 flex items-center justify-center text-[#c49a2c] mb-4">
                <Workflow size={24} />
              </div>
              <h4 className="text-xl font-bold mb-2">جرثقیل ۲۰ تن</h4>
              <p className="text-gray-300 text-xs leading-relaxed">
                مجموعه جرثقیل‌های سقفی ۵، ۱۰ و ۲۰ تن به همراه لیفتراک سنگین ۷ تن جهت بارگیری و مونتاژ تجهیزات سنگین.
              </p>
            </div>

            <div className="pt-4 md:pt-0 md:pr-8">
              <div className="w-12 h-12 rounded-2xl bg-[#c49a2c]/20 flex items-center justify-center text-[#c49a2c] mb-4">
                <Zap size={24} />
              </div>
              <h4 className="text-xl font-bold mb-2">دیزل ژنراتور ۴۰۰kVA</h4>
              <p className="text-gray-300 text-xs leading-relaxed">
                پشتیبانی برق مستقل اختصاصی کارخانه جهت تضمین تحویل به‌موقع پروژه‌ها حتی در شرایط قطعی شبکه برق.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
