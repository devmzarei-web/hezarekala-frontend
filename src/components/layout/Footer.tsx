"use client";

import Link from "next/link";
import { Phone, Mail, MapPin, ChevronLeft, Printer, Clock, User, ShieldCheck } from "lucide-react";
import type { Settings } from "@/payload-types";
import { getMediaUrl } from "@/lib/media";
import { COMPANY } from "@/lib/constants";
import PhoneNumber from "@/components/ui/PhoneNumber";

const DEFAULT_QUICK_LINKS = [
  { href: "/products", label: "محصولات و تجهیزات" },
  { href: "/capabilities", label: "توانمندی‌های تولید" },
  { href: "/projects", label: "پروژه‌ها و سوابق" },
  { href: "/about", label: "درباره ما و کارخانه" },
  { href: "/blog", label: "مستندات و مقالات" },
  { href: "/contact", label: "ارتباط با کارخانه" },
];

const DEFAULT_PRODUCT_LINKS = [
  { href: "/products?category=generators", label: "دیزل ژنراتور و موتور دیزلی" },
  { href: "/products?category=sludge-pumps", label: "پمپ لجن‌کش و خودمکش" },
  { href: "/products?category=gear-pumps", label: "پمپ دنده‌ای پرتابل" },
  { href: "/products?category=wet-blast", label: "سامانه وت‌بلاست صنعتی" },
  { href: "/products?category=machining", label: "خدمات ماشین‌کاری سنگین" },
];

interface FooterProps {
  settings: Settings | null;
}

export default function Footer({ settings }: FooterProps) {
  const logoUrl = getMediaUrl(settings?.logo);
  const watermarkLogoUrl = getMediaUrl(settings?.logoDark || settings?.logo);

  // Fallback chain for primary corporate fields
  const primaryPhone = settings?.phone || COMPANY.phone;
  const telefax = (settings as any)?.telefax || COMPANY.telefax;
  const phone2 = (settings as any)?.phone2 || COMPANY.phoneLines[1]?.number;
  const phone3 = (settings as any)?.phone3 || COMPANY.phoneLines[2]?.number;
  const address = settings?.address || COMPANY.address;
  const postalCode = (settings as any)?.postalCode || COMPANY.postalCode;
  const ceoName = (settings as any)?.ceoName || COMPANY.ceo;

  // Department Emails
  const salesEmail = (settings as any)?.salesEmail || COMPANY.emails.sales.address;
  const supportEmail = (settings as any)?.supportEmail || COMPANY.emails.support.address;
  const infoEmail = settings?.email || COMPANY.emails.info.address;

  // Dynamic quick links and product links from CMS Settings
  const quickLinks =
    settings?.footerQuickLinks && settings.footerQuickLinks.length > 0
      ? settings.footerQuickLinks
      : DEFAULT_QUICK_LINKS;

  const productLinks =
    settings?.footerProductLinks && settings.footerProductLinks.length > 0
      ? settings.footerProductLinks
      : DEFAULT_PRODUCT_LINKS;

  return (
    <footer className="relative bg-[#060f1c] text-white overflow-hidden border-t border-[#c49a2c]/20" dir="rtl">
      {/* Top accent metallic hairline */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-l from-transparent via-[#c49a2c] to-transparent opacity-80" />

      {/* Watermark logo background */}
      {watermarkLogoUrl && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none opacity-[0.03]">
          <img src={watermarkLogoUrl} alt="" className="w-[520px] h-auto" />
        </div>
      )}

      <div className="relative z-10 w-full px-4 sm:px-6 md:px-12 lg:px-16 pt-14 pb-8">
        {/* Main 4-Column Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8 mb-12">
          {/* Col 1: Brand & Industrial Identity (Span 4) */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div>
              {logoUrl && (
                <div className="mb-4">
                  <img
                    src={logoUrl}
                    alt={settings?.siteName || COMPANY.nameFa}
                    className="h-16 w-auto object-contain filter brightness-110"
                  />
                </div>
              )}
              <h3 className="text-xl font-black text-white tracking-tight mb-2">
                {settings?.siteName || COMPANY.nameFa}
              </h3>
              <p className="text-xs font-semibold text-[#c49a2c] mb-3">
                {COMPANY.slogan}
              </p>
              <p className="text-xs text-gray-400 text-justify leading-relaxed mb-5">
                {settings?.aboutText ||
                  "طراحی، مهندسی و ساخت تخصصی پمپ‌های صنعتی سنگین، پکیج‌های خودمکش دیزلی و پمپ‌های دنده‌ای فرآیندی با تکیه بر استانداردهای جهانی API و ISO در منطقه آزاد اروند."}
              </p>
            </div>

            {/* Management & Legal Credential Badge */}
            <div className="p-3 bg-white/[0.03] border border-white/10 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between text-xs text-gray-300">
                <span className="flex items-center gap-1.5 text-gray-400">
                  <User size={13} className="text-[#c49a2c]" />
                  مدیریت عامل:
                </span>
                <span className="font-bold text-white">{ceoName}</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1 border-t border-white/[0.06]">
                <span>ثبت اروند: {COMPANY.registrationNumber}</span>
                <span>شناسه ملی: {COMPANY.nationalId}</span>
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links (Span 2) */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 pb-2 border-b border-white/10 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c49a2c]" />
              دسترسی سریع
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link, idx) => (
                <li key={link.label || idx}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 text-xs text-gray-400 hover:text-[#c49a2c] transition-colors"
                  >
                    <ChevronLeft
                      size={12}
                      className="text-gray-600 group-hover:text-[#c49a2c] group-hover:-translate-x-1 transition-all"
                    />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Products & Equipment (Span 3) */}
          <div className="lg:col-span-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 pb-2 border-b border-white/10 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c49a2c]" />
              تجهیزات و محصولات
            </h4>
            <ul className="space-y-2.5">
              {productLinks.map((link, idx) => (
                <li key={link.label || idx}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 text-xs text-gray-400 hover:text-[#c49a2c] transition-colors"
                  >
                    <ChevronLeft
                      size={12}
                      className="text-gray-600 group-hover:text-[#c49a2c] group-hover:-translate-x-1 transition-all"
                    />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Factory Telephony & Working Hours (Span 3) */}
          <div className="lg:col-span-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 pb-2 border-b border-white/10 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c49a2c]" />
              تماس با کارخانه
            </h4>

            <div className="space-y-3">
              {/* Telefax & Central Line */}
              <div className="p-3 bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 rounded-xl transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-[#c49a2c] flex items-center gap-1.5">
                    <Printer size={13} />
                    تلفکس و خط مرکزی
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#c49a2c]/20 text-[#e5c158]">
                    نمابر رسمی
                  </span>
                </div>
                <a
                  href={`tel:${telefax.replace(/[^\d+]/g, "")}`}
                  className="inline-flex items-center text-sm font-bold text-white hover:text-[#c49a2c] transition-colors tracking-wide font-mono"
                  dir="ltr"
                >
                  <PhoneNumber number={telefax} />
                </a>
              </div>

              {/* Direct Factory Lines */}
              <div className="p-3 bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 rounded-xl transition-colors space-y-2">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-300">
                  <Phone size={13} className="text-[#c49a2c]" />
                  خطوط مستقیم کارخانه و کارگاه
                </div>
                <div className="grid grid-cols-2 gap-2" dir="ltr">
                  <a
                    href={`tel:${phone2.replace(/[^\d+]/g, "")}`}
                    className="text-xs font-semibold text-gray-300 hover:text-[#c49a2c] transition-colors bg-white/[0.04] p-1.5 rounded text-center font-mono inline-flex items-center justify-center"
                    dir="ltr"
                  >
                    <PhoneNumber number={phone2} />
                  </a>
                  <a
                    href={`tel:${phone3.replace(/[^\d+]/g, "")}`}
                    className="text-xs font-semibold text-gray-300 hover:text-[#c49a2c] transition-colors bg-white/[0.04] p-1.5 rounded text-center font-mono inline-flex items-center justify-center"
                    dir="ltr"
                  >
                    <PhoneNumber number={phone3} />
                  </a>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-center gap-2 text-xs text-gray-400 pt-1">
                <Clock size={13} className="text-[#c49a2c] shrink-0" />
                <span>{COMPANY.workingHours}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Specialized Departmental Channels & Plant Address Strip ── */}
        <div className="border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent rounded-2xl p-4 sm:p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* 3 Dedicated Corporate Emails */}
            <div className="lg:col-span-8">
              <div className="text-xs font-bold text-gray-400 mb-3 flex items-center gap-2">
                <Mail size={14} className="text-[#c49a2c]" />
                درگاه‌های رسمی مکاتبات و استعلام مهندسی:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Sales */}
                <a
                  href={`mailto:${salesEmail}`}
                  className="group p-3 rounded-xl bg-[#060f1c] border border-white/10 hover:border-[#c49a2c] transition-all flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold text-white group-hover:text-[#c49a2c] transition-colors">
                      فروش و بازرگانی
                    </span>
                    <span className="text-[10px] bg-[#c49a2c]/20 text-[#e5c158] px-1.5 py-0.5 rounded">
                      پیش‌فاکتور
                    </span>
                  </div>
                  <span className="text-xs text-gray-300 group-hover:text-white font-mono break-all" dir="ltr">
                    {salesEmail}
                  </span>
                </a>

                {/* Support */}
                <a
                  href={`mailto:${supportEmail}`}
                  className="group p-3 rounded-xl bg-[#060f1c] border border-white/10 hover:border-[#c49a2c] transition-all flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold text-white group-hover:text-[#c49a2c] transition-colors">
                      پشتیبانی فنی
                    </span>
                    <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded">
                      مهندسی
                    </span>
                  </div>
                  <span className="text-xs text-gray-300 group-hover:text-white font-mono break-all" dir="ltr">
                    {supportEmail}
                  </span>
                </a>

                {/* Info */}
                <a
                  href={`mailto:${infoEmail}`}
                  className="group p-3 rounded-xl bg-[#060f1c] border border-white/10 hover:border-[#c49a2c] transition-all flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold text-white group-hover:text-[#c49a2c] transition-colors">
                      مکاتبات عمومی
                    </span>
                    <span className="text-[10px] bg-gray-700/60 text-gray-300 px-1.5 py-0.5 rounded">
                      دبیرخانه
                    </span>
                  </div>
                  <span className="text-xs text-gray-300 group-hover:text-white font-mono break-all" dir="ltr">
                    {infoEmail}
                  </span>
                </a>
              </div>
            </div>

            {/* Plant Physical Address & Postal Code */}
            <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-r border-white/10 pt-4 lg:pt-0 lg:pr-6">
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#c49a2c]/10 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin size={16} className="text-[#c49a2c]" />
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-gray-300 block">نشانی رسمی کارخانه:</span>
                  <address className="text-xs text-gray-400 not-italic leading-relaxed">
                    {address}
                  </address>
                  <div className="pt-1 flex items-center gap-2 text-xs text-[#c49a2c]">
                    <span className="text-gray-400">کد پستی:</span>
                    <span className="font-mono font-bold tracking-wider" dir="ltr">
                      {postalCode}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Industrial Quality Assurance */}
        <div className="border-t border-white/[0.08] pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-400">
          <p>
            © {new Date().getFullYear()} {settings?.siteName || COMPANY.nameFa} — کلیه حقوق قانونی محفوظ است.
          </p>
          <div className="flex items-center gap-4 text-[11px] text-gray-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-[#c49a2c]" />
              تولید منطبق بر استانداردهای API 610 و ISO 5199
            </span>
            <span>•</span>
            <span>منطقه آزاد تجاری صنعتی اروند</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
