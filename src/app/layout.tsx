import type { Metadata, Viewport } from "next";
import { SITE_URL } from "@/lib/env";
import "./globals.css";
import ScrollToTop from "@/components/ui/ScrollToTop";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "هزاره کالا | طراحی و ساخت پمپ‌های صنعتی بزرگ",
    template: "%s | هزاره کالا",
  },
  description:
    "شرکت هزاره کالا دانش اروند - طراح و تولیدکننده پمپ‌های سانتریفیوژ، پیستونی و دنده‌ای برای صنایع نفت، گاز، پتروشیمی و نیروگاهی. واقع در شهرک صنعتی آبادان.",
  keywords: [
    "پمپ صنعتی", "پمپ سانتریفیوژ", "پمپ پیستونی", "پمپ دنده‌ای", "پمپ طبقاتی",
    "هزاره کالا", "شهرک صنعتی آبادان", "پمپ فشار قوی", "پمپ نفت و گاز",
    "پمپ پتروشیمی", "تولیدکننده پمپ", "پمپ آبادان", "پمپ خوزستان",
  ],
  authors: [{ name: "هزاره کالا دانش اروند", url: SITE_URL }],
  creator: "هزاره کالا دانش اروند",
  publisher: "هزاره کالا دانش اروند",
  robots: {
    index: true, follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
  },
  alternates: { canonical: SITE_URL },
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png", sizes: "32x32" }],
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    type: "website", locale: "fa_IR", url: SITE_URL, siteName: "هزاره کالا",
    title: "هزاره کالا | طراحی و ساخت پمپ‌های صنعتی بزرگ",
    description: "طراحی، ساخت و تولید پمپ‌های سانتریفیوژ، پیستونی و دنده‌ای برای صنایع نفت، گاز، پتروشیمی و نیروگاهی.",
    images: [{ url: "/images/og-image.jpg", width: 1200, height: 630, alt: "هزاره کالا - پمپ‌های صنعتی" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "هزاره کالا | پمپ‌های صنعتی بزرگ",
    description: "طراحی و ساخت پمپ‌های سانتریفیوژ، پیستونی و دنده‌ای",
    images: [`${SITE_URL}/images/og-image.jpg`],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body className="antialiased bg-white text-gray-900">
        {children}
        <ScrollToTop />
      </body>
    </html>
  );
}