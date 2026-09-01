"use client";

import Link from "next/link";
import { Phone, Mail, MapPin, ChevronLeft } from "lucide-react";
import type { Settings } from "@/payload-types";
import { getMediaUrl } from "@/lib/media";
import { COMPANY } from "@/lib/constants";

const QUICK_LINKS = [
  { href: "/products", label: "محصولات" },
  { href: "/capabilities", label: "توانمندی‌ها" },
  { href: "/projects", label: "پروژه‌ها" },
  { href: "/about", label: "درباره ما" },
  { href: "/blog", label: "وبلاگ" },
  { href: "/contact", label: "تماس با ما" },
];

const PRODUCT_LINKS = [
  { href: "/products", label: "پمپ سانتریفیوژ" },
  { href: "/products", label: "پمپ پیستونی" },
  { href: "/products", label: "پمپ دنده‌ای" },
  { href: "/products", label: "پمپ طبقاتی" },
];

interface FooterProps {
  settings: Settings | null;
}

export default function Footer({ settings }: FooterProps) {
  const logoUrl = getMediaUrl(settings?.logo);
  const watermarkLogoUrl = getMediaUrl(settings?.logoDark || settings?.logo);
  const phone = settings?.phone || COMPANY.phone;
  const email = settings?.email || COMPANY.email;
  const address = settings?.address || COMPANY.address;

  return (
    <footer className="relative bg-[#060f1c] text-white overflow-hidden" dir="rtl">
      {/* Top accent */}
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-l from-[#c49a2c] via-[#c49a2c]/60 to-transparent" />

      {/* Watermark logo */}
      {watermarkLogoUrl && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none opacity-[0.04]">
          <img src={watermarkLogoUrl} alt="" className="w-[500px] h-auto" />
        </div>
      )}

      <div className="relative z-10 w-full px-6 md:px-12 lg:px-16 pt-14 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 mb-10">
          {/* Brand */}
          <div>
            {logoUrl && (
              <div className="mb-3">
                <img src={logoUrl} alt={settings?.siteName || "هزاره کالا"} className="h-20 w-auto" />
              </div>
            )}
            <h3 className="text-2xl font-extrabold text-white mb-2">
              {settings?.siteName || "هزاره کالا"}
            </h3>
            <p className="text-sm text-gray-400 text-justify leading-[1.8]">
              طراحی و ساخت پمپ‌های صنعتی بزرگ. با بیش از هفت سال تجربه در خدمت صنایع نفت، گاز و پتروشیمی ایران.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base font-bold text-gray-300 mb-4">دسترسی سریع</h4>
            <ul className="space-y-2">
              {QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="group flex items-center gap-2 text-sm text-gray-400 hover:text-[#c49a2c] transition-colors">
                    <ChevronLeft size={10} className="text-gray-600 group-hover:text-[#c49a2c] group-hover:-translate-x-1 transition-all" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-base font-bold text-gray-300 mb-4">محصولات</h4>
            <ul className="space-y-2">
              {PRODUCT_LINKS.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="group flex items-center gap-2 text-sm text-gray-400 hover:text-[#c49a2c] transition-colors">
                    <ChevronLeft size={10} className="text-gray-600 group-hover:text-[#c49a2c] group-hover:-translate-x-1 transition-all" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-base font-bold text-gray-300 mb-4">تماس با ما</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-gray-400">
                <div className="w-7 h-7 rounded-lg bg-[#c49a2c]/10 flex items-center justify-center shrink-0">
                  <MapPin size={12} className="text-[#c49a2c]" />
                </div>
                <address className="leading-relaxed not-italic">{address}</address>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-gray-400">
                <div className="w-7 h-7 rounded-lg bg-[#c49a2c]/10 flex items-center justify-center shrink-0">
                  <Phone size={12} className="text-[#c49a2c]" />
                </div>
                <a href={`tel:${phone.replace(/\s/g, "")}`} className="hover:text-[#c49a2c] transition-colors" dir="ltr">
                  {phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-gray-400">
                <div className="w-7 h-7 rounded-lg bg-[#c49a2c]/10 flex items-center justify-center shrink-0">
                  <Mail size={12} className="text-[#c49a2c]" />
                </div>
                <a href={`mailto:${email}`} className="hover:text-[#c49a2c] transition-colors break-all">
                  {email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar - Clean, no certificates */}
        <div className="border-t border-white/[0.05] pt-5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} {settings?.siteName || "هزاره کالا دانش اروند"} — کلیه حقوق محفوظ است.
          </p>
          <p className="text-xs text-gray-600">
            طراحی و ساخت پمپ‌های صنعتی بزرگ
          </p>
        </div>
      </div>
    </footer>
  );
}