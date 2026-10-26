"use client";

import Link from "next/link";
import { Phone, Mail, MapPin, ChevronLeft, Printer, User, ShieldCheck } from "lucide-react";
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
  { href: "/contact", label: "تماس با ما" },
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
    <footer className="relative bg-[#060f1c] text-white overflow-hidden border-t border-[#c49a2c]/20 font-sans" dir="rtl">
      {/* Top accent hairline */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-l from-transparent via-[#c49a2c] to-transparent opacity-80" />

      {/* Watermark logo background */}
      {watermarkLogoUrl && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none opacity-[0.02]">
          <img src={watermarkLogoUrl} alt="" className="w-[360px] h-auto" />
        </div>
      )}

      <div className="relative z-10 w-full px-4 sm:px-6 md:px-10 lg:px-12 pt-8 pb-5">
        {/* Main 4-Column Directory Grid - Compact and Unified */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-8 mb-6">
          {/* Col 1: Brand & Slogan (Span 4) */}
          <div className="lg:col-span-4 space-y-2.5">
            <div className="flex items-center gap-3">
              {logoUrl && (
                <img
                  src={logoUrl}
                  alt={settings?.siteName || COMPANY.nameFa}
                  className="h-11 w-auto object-contain filter brightness-110"
                />
              )}
              <div>
                <h3 className="text-base font-black text-white leading-tight">
                  {settings?.siteName || COMPANY.nameFa}
                </h3>
                <p className="text-[11px] font-bold text-[#c49a2c] mt-0.5">
                  {COMPANY.slogan}
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-400 text-justify leading-relaxed line-clamp-3">
              {settings?.aboutText ||
                "طراحی، مهندسی و ساخت تخصصی پمپ‌های صنعتی سنگین، پکیج‌های خودمکش دیزلی و پمپ‌های دنده‌ای فرآیندی با تکیه بر استانداردهای جهانی API و ISO در منطقه آزاد اروند."}
            </p>

            {/* Compact credentials pill */}
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] text-gray-400 pt-1.5 border-t border-white/5">
              <span className="flex items-center gap-1 text-gray-300">
                <User size={12} className="text-[#c49a2c]" />
                مدیرعامل: <strong className="text-white font-medium">{ceoName}</strong>
              </span>
              <span>•</span>
              <span>ثبت اروند: {COMPANY.registrationNumber}</span>
              <span>•</span>
              <span>شناسه ملی: {COMPANY.nationalId}</span>
            </div>
          </div>

          {/* Col 2: Quick Links (Span 2) */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2.5 pb-1 border-b border-white/10 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c49a2c]" />
              دسترسی سریع
            </h4>
            <ul className="space-y-1.5">
              {quickLinks.map((link, idx) => (
                <li key={link.label || idx}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-1 text-xs text-gray-400 hover:text-[#c49a2c] transition-colors"
                  >
                    <ChevronLeft
                      size={11}
                      className="text-gray-600 group-hover:text-[#c49a2c] group-hover:-translate-x-0.5 transition-all"
                    />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Products (Span 2) */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2.5 pb-1 border-b border-white/10 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c49a2c]" />
              تجهیزات و تولیدات
            </h4>
            <ul className="space-y-1.5">
              {productLinks.map((link, idx) => (
                <li key={link.label || idx}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-1 text-xs text-gray-400 hover:text-[#c49a2c] transition-colors"
                  >
                    <ChevronLeft
                      size={11}
                      className="text-gray-600 group-hover:text-[#c49a2c] group-hover:-translate-x-0.5 transition-all"
                    />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Factory Contact & Inquiries (Span 4) */}
          <div className="lg:col-span-4 space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2.5 pb-1 border-b border-white/10 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c49a2c]" />
              ارتباط با کارخانه و دپارتمان‌ها
            </h4>

            {/* Telephony Line */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs bg-white/[0.03] px-2.5 py-1.5 rounded-lg border border-white/5">
              <span className="text-gray-400 flex items-center gap-1.5 text-[11px]">
                <Printer size={12} className="text-[#c49a2c]" />
                تلفکس مرکزی:
              </span>
              <a
                href={`tel:${telefax.replace(/[^\d+]/g, "")}`}
                className="text-white hover:text-[#c49a2c] font-bold"
                dir="ltr"
              >
                <PhoneNumber number={telefax} />
              </a>
            </div>

            {/* Direct Factory Lines */}
            <div className="flex items-center justify-between gap-2 text-xs bg-white/[0.03] px-2.5 py-1.5 rounded-lg border border-white/5">
              <span className="text-gray-400 flex items-center gap-1.5 text-[11px]">
                <Phone size={12} className="text-[#c49a2c]" />
                خطوط کارگاه:
              </span>
              <div className="flex items-center gap-2" dir="ltr">
                <a
                  href={`tel:${phone2.replace(/[^\d+]/g, "")}`}
                  className="text-gray-300 hover:text-[#c49a2c]"
                >
                  <PhoneNumber number={phone2} />
                </a>
                <span className="text-gray-600">•</span>
                <a
                  href={`tel:${phone3.replace(/[^\d+]/g, "")}`}
                  className="text-gray-300 hover:text-[#c49a2c]"
                >
                  <PhoneNumber number={phone3} />
                </a>
              </div>
            </div>

            {/* Corporate Emails List - Compact */}
            <div className="text-xs bg-white/[0.03] px-2.5 py-1.5 rounded-lg border border-white/5 space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-gray-400">فروش و بازرگانی:</span>
                <a
                  href={`mailto:${salesEmail}`}
                  className="text-gray-300 hover:text-[#c49a2c] font-sans"
                  dir="ltr"
                >
                  {salesEmail}
                </a>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-gray-400">پشتیبانی فنی:</span>
                <a
                  href={`mailto:${supportEmail}`}
                  className="text-gray-300 hover:text-[#c49a2c] font-sans"
                  dir="ltr"
                >
                  {supportEmail}
                </a>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-gray-400">مکاتبات عمومی:</span>
                <a
                  href={`mailto:${infoEmail}`}
                  className="text-gray-300 hover:text-[#c49a2c] font-sans"
                  dir="ltr"
                >
                  {infoEmail}
                </a>
              </div>
            </div>

            {/* Address & Postal Code */}
            <div className="text-[11px] text-gray-400 flex items-start gap-1.5 pt-0.5">
              <MapPin size={12} className="text-[#c49a2c] shrink-0 mt-0.5" />
              <address className="not-italic leading-relaxed">
                {address}
                <span className="block mt-0.5 text-gray-400">
                  کد پستی: <span className="font-sans font-bold text-[#c49a2c]">{postalCode}</span>
                </span>
              </address>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright, Standards, and Developer Credit */}
        <div className="border-t border-white/10 pt-3.5 flex flex-col md:flex-row justify-between items-center gap-2.5 text-xs text-gray-400">
          {/* Right: Copyright */}
          <div>
            © {new Date().getFullYear()} {settings?.siteName || COMPANY.nameFa} — کلیه حقوق محفوظ است.
          </div>

          {/* Center: Standards */}
          <div className="flex items-center gap-2 text-[11px] text-gray-500">
            <ShieldCheck size={12} className="text-[#c49a2c]" />
            <span>استانداردهای API 610 و ISO 5199</span>
            <span>•</span>
            <span>منطقه آزاد تجاری صنعتی اروند</span>
          </div>

          {/* Left: Developer Credit (devzarei.ir) */}
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <span>طراحی و توسعه:</span>
            <a
              href="https://devzarei.ir"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#c49a2c] hover:text-[#e5c158] font-bold transition-colors inline-flex items-center gap-1"
            >
              محمدعلی زارعی
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
