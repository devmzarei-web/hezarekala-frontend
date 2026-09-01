import Link from "next/link";
import type { Metadata } from "next";
import { Home, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "صفحه یافت نشد | هزاره کالا",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#0a1628] flex items-center justify-center" dir="rtl">
      <div className="text-center px-6">
        {/* Decorative */}
        <div className="w-24 h-24 bg-[#c49a2c]/10 rounded-full flex items-center justify-center mx-auto mb-8">
          <span className="text-6xl font-black text-[#c49a2c]">۴۰۴</span>
        </div>
        
        <h1 className="text-3xl md:text-5xl font-black text-white mb-4">
          صفحه مورد نظر یافت نشد
        </h1>
        <p className="text-gray-400 text-lg mb-4 max-w-md mx-auto leading-relaxed">
          متأسفانه صفحه‌ای که به دنبال آن هستید وجود ندارد یا منتقل شده است.
        </p>
        <p className="text-gray-500 text-sm mb-10">
          کد خطا: ۴۰۴ — Not Found
        </p>
        
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-[#c49a2c] hover:bg-[#d4a82c] text-black px-6 py-3 rounded-xl font-bold transition-all hover:shadow-lg hover:shadow-[#c49a2c]/20"
          >
            <Home size={18} />
            <span>بازگشت به خانه</span>
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 border border-white/20 hover:border-white/50 text-white px-6 py-3 rounded-xl font-bold transition-all hover:bg-white/5"
          >
            <span>مشاهده محصولات</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </main>
  );
}