"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Phone, Menu, X } from "lucide-react";
import type { Settings } from "@/payload-types";
import { getMediaUrl } from "@/lib/media";

const NAV_ITEMS = [
  { href: "/", label: "خانه" },
  { href: "/products", label: "محصولات" },
  { href: "/capabilities", label: "توانمندی‌ها" },
  { href: "/sectors", label: "صنایع هدف" },
  { href: "/projects", label: "پروژه‌ها" },
  { href: "/gallery", label: "گالری" },
  { href: "/about", label: "درباره ما" },
  { href: "/blog", label: "وبلاگ" },
  { href: "/contact", label: "تماس با ما" },
];

interface HeaderProps {
  settings: Settings | null;
}

export default function Header({ settings }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const logoUrl = getMediaUrl(settings?.logo);
  const siteName = settings?.siteName || "هزاره کالا";

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-[#060f1c]/95 backdrop-blur-md border-b border-white/5 shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}
      dir="rtl"
    >
      <div className="w-full flex items-center justify-between px-4 md:px-8 py-2.5 md:py-3">
        {/* Right: Logo + Name + Menu */}
        <div className="flex items-center gap-4 md:gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 md:gap-4 shrink-0 group">
            <div className="relative">
              <img
                src={logoUrl}
                alt={siteName}
                className="h-12 md:h-16 w-auto relative z-10 transition-transform duration-300 group-hover:scale-110"
                onError={(e) => { e.currentTarget.style.display = "none"; }}
              />
              <div className="absolute inset-0 bg-[#c49a2c]/20 blur-xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            
            {/* Site Name - Desktop only */}
            <div className="flex-col leading-tight hidden sm:flex">
              <span className="text-lg md:text-xl font-extrabold text-white tracking-tight">
                {siteName}
              </span>
              <span className="text-[10px] text-gray-400 tracking-[0.15em] uppercase">
                طراحی و ساخت پمپ‌های صنعتی
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative px-3 py-2 text-sm text-gray-300 hover:text-white rounded-lg transition-all overflow-hidden group/nav"
              >
                <span className="absolute inset-0 bg-white/0 group-hover/nav:bg-white/5 rounded-lg transition-colors" />
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#c49a2c] group-hover/nav:w-3/4 transition-all duration-300 rounded-full" />
                <span className="relative z-10">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Left: Phone + CTA + Hamburger */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Phone - Desktop */}
          <a
            href={`tel:${settings?.phone || "09166310631"}`}
            className="hidden lg:flex items-center gap-1.5 text-sm text-gray-400 hover:text-[#c49a2c] transition-colors px-2 py-1"
            dir="ltr"
          >
            <Phone size={14} className="text-[#c49a2c]" />
            <span>{settings?.phone || "۰۹۱۶۶۳۱۰۶۳۱"}</span>
          </a>

          {/* CTA Button */}
          <Link
            href="/contact"
            className="hidden sm:inline-flex items-center gap-1.5 bg-gradient-to-r from-[#c49a2c] to-[#d4a82c] hover:from-[#d4a82c] hover:to-[#c49a2c] text-black px-4 md:px-5 py-2 md:py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all duration-300 hover:shadow-xl hover:shadow-[#c49a2c]/20 hover:-translate-y-0.5 active:scale-95"
          >
            <Phone size={14} />
            <span>درخواست مشاوره</span>
          </Link>

          {/* Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
            aria-label="منو"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#0a1628]/98 backdrop-blur-md border-t border-white/5 px-4 py-3 space-y-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="block py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg px-3 transition-all"
            >
              {item.label}
            </Link>
          ))}
          <div className="flex items-center gap-2 pt-2 mt-2 border-t border-white/5 text-gray-400 text-sm">
            <Phone size={14} className="text-[#c49a2c]" />
            <span dir="ltr">{settings?.phone || "۰۹۱۶۶۳۱۰۶۳۱"}</span>
          </div>
          <Link
            href="/contact"
            onClick={() => setMobileOpen(false)}
            className="mt-2 flex items-center justify-center gap-2 bg-gradient-to-r from-[#c49a2c] to-[#d4a82c] text-black py-3 rounded-xl font-bold text-sm"
          >
            <Phone size={16} />
            درخواست مشاوره
          </Link>
        </div>
      )}
    </header>
  );
}