"use client";

import { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Printer,
  User,
  Copy,
  Check,
  Building2,
  ShieldCheck,
  FileText,
  Wrench,
  Send,
  Navigation,
  ArrowUpRight,
} from "lucide-react";
import { COMPANY } from "@/lib/constants";
import PhoneNumber from "@/components/ui/PhoneNumber";

interface ContactDirectoryProps {
  phone?: string | null;
  telefax?: string | null;
  phone2?: string | null;
  phone3?: string | null;
  email?: string | null;
  salesEmail?: string | null;
  supportEmail?: string | null;
  address?: string | null;
  postalCode?: string | null;
  ceoName?: string | null;
  ceoMobile?: string | null;
}

export default function ContactDirectory(props: ContactDirectoryProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey((prev) => (prev === key ? null : prev));
    }, 2000);
  };

  const primaryPhone = props.phone || COMPANY.phone;
  const telefax = props.telefax || COMPANY.telefax;
  const phone2 = props.phone2 || COMPANY.phoneLines[1]?.number;
  const phone3 = props.phone3 || COMPANY.phoneLines[2]?.number;
  const address = props.address || COMPANY.address;
  const postalCode = props.postalCode || COMPANY.postalCode;
  const postalCodeRaw = COMPANY.postalCodeEn;
  const ceoName = props.ceoName || COMPANY.ceo;
  const ceoMobile = props.ceoMobile || COMPANY.ceoMobile;

  const salesEmail = props.salesEmail || COMPANY.emails.sales.address;
  const supportEmail = props.supportEmail || COMPANY.emails.support.address;
  const infoEmail = props.email || COMPANY.emails.info.address;

  const emailChannels = [
    {
      key: "sales",
      title: "واحد فروش و بازرگانی",
      roleBadge: "استعلام قیمت و مناقصات",
      badgeColor: "bg-amber-500/10 text-amber-700 border-amber-500/20",
      email: salesEmail,
      icon: FileText,
      description:
        "دریافت پیش‌فاکتور رسمی، مشخصات فنی، هماهنگی مناقصات و قراردادهای تأمین پمپ و پکیج‌های صنعتی.",
      audience: "مناسب کارفرمایان، پیمانکاران EPC، پالایشگاه‌ها و پتروشیمی‌ها",
      cta: "ارسال درخواست استعلام",
    },
    {
      key: "support",
      title: "پشتیبانی فنی و مهندسی",
      roleBadge: "مشاوره فنی و خدمات",
      badgeColor: "bg-sky-500/10 text-sky-700 border-sky-500/20",
      email: supportEmail,
      icon: Wrench,
      description:
        "مشاوره متالورژی و انتخاب متریال، محاسبات هیدرولیک، گارانتی، سرویس‌های دوره‌ای و قطعات یدکی.",
      audience: "مناسب مهندسین مشاور، مدیران فنی تأسیسات و بهره‌برداران خطوط پمپاژ",
      cta: "مکاتبه با واحد مهندسی",
    },
    {
      key: "info",
      title: "اطلاعات و مکاتبات عمومی",
      roleBadge: "دبیرخانه و امور اداری",
      badgeColor: "bg-slate-500/10 text-slate-700 border-slate-500/20",
      email: infoEmail,
      icon: Building2,
      description:
        "مکاتبات رسمی، ارسال نامه‌های اداری، امور اداری و اسناد، ثبت‌نام تأمین‌کنندگان و امور سازمانی.",
      audience: "مناسب سازمان‌ها، ادارات دولتی، دانشگاه‌ها و تأمین‌کنندگان مواد اولیه",
      cta: "ارسال نامه به دبیرخانه",
    },
  ];

  return (
    <div className="w-full space-y-12" dir="rtl">
      {/* ── Section 1: Departmental Communication Matrix ── */}
      <div>
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#c49a2c] uppercase tracking-wider mb-1">
              <span className="w-2 h-2 rounded-full bg-[#c49a2c]" />
              درگاه‌های تخصصی مکاتبه
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#0a1628]">
              سه کانال رسمی ارتباط الکترونیکی شرکت
            </h2>
          </div>
          <p className="text-xs text-gray-500 max-w-md leading-relaxed">
            جهت تسریع در پاسخگویی، لطفاً درخواست خود را مستقیماً به دپارتمان تخصصی مربوطه ارسال فرمایید.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {emailChannels.map((item) => {
            const Icon = item.icon;
            const isCopied = copiedKey === item.key;

            return (
              <div
                key={item.key}
                className="group relative bg-white border border-gray-200/90 hover:border-[#c49a2c]/60 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gray-50 group-hover:bg-[#c49a2c]/10 text-gray-700 group-hover:text-[#c49a2c] flex items-center justify-center transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${item.badgeColor}`}
                    >
                      {item.roleBadge}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-[#0a1628] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed mb-4">
                    {item.description}
                  </p>

                  <div className="text-[11px] text-gray-400 bg-gray-50 p-2.5 rounded-lg mb-5 border border-gray-100">
                    <span className="font-semibold text-gray-600">جامعه هدف: </span>
                    {item.audience}
                  </div>
                </div>

                {/* Email Address & Actions */}
                <div className="pt-4 border-t border-gray-100 space-y-2.5">
                  <div className="flex items-center justify-between gap-2 p-2 bg-gray-50 rounded-lg">
                    <a
                      href={`mailto:${item.email}`}
                      className="text-xs font-mono font-bold text-[#0a1628] hover:text-[#c49a2c] transition-colors truncate"
                      dir="ltr"
                    >
                      {item.email}
                    </a>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(item.email, item.key)}
                      className="p-1.5 rounded-md hover:bg-white text-gray-400 hover:text-[#c49a2c] transition-colors shrink-0"
                      title="کپی آدرس ایمیل"
                      aria-label="کپی آدرس ایمیل"
                    >
                      {isCopied ? (
                        <Check size={14} className="text-emerald-600" />
                      ) : (
                        <Copy size={14} />
                      )}
                    </button>
                  </div>

                  <a
                    href={`mailto:${item.email}`}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#060f1c] hover:bg-[#c49a2c] text-white hover:text-black font-bold text-xs transition-colors shadow-sm"
                  >
                    <span>{item.cta}</span>
                    <ArrowUpRight size={13} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Section 2: Industrial Telephony Bank & Executive Office ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Factory Landlines & Telefax (Span 7) */}
        <div className="lg:col-span-7 bg-[#060f1c] text-white rounded-2xl p-6 sm:p-8 border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#c49a2c]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
              <div>
                <span className="text-[11px] font-bold text-[#c49a2c] uppercase tracking-wider block mb-1">
                  سامانه ارتباط تلفنی کارخانه
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-white">
                  خطوط مستقیم و مرکز تلفکس کارخانه
                </h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-white/[0.05] flex items-center justify-center text-[#c49a2c]">
                <Printer size={20} />
              </div>
            </div>

            <div className="space-y-4">
              {/* Telefax Official */}
              <div className="p-4 rounded-xl bg-white/[0.04] border border-[#c49a2c]/30 hover:border-[#c49a2c] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">
                      تلفکس و خط سانترال کارخانه
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#c49a2c] text-black">
                      دورنگار رسمی
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400">
                    ارسال مکاتبات رسمی، نامه‌های اداری و اسناد تضمینی از طریق فکس
                  </p>
                </div>
                <div className="flex items-center gap-2" dir="ltr">
                  <a
                    href={`tel:${telefax.replace(/[^\d+]/g, "")}`}
                    className="font-mono text-sm font-black text-white hover:text-[#c49a2c] transition-colors bg-white/[0.06] px-3 py-1.5 rounded-lg inline-flex items-center"
                    dir="ltr"
                  >
                    <PhoneNumber number={telefax} />
                  </a>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(telefax, "telefax")}
                    className="p-2 rounded-lg bg-white/[0.06] hover:bg-[#c49a2c] hover:text-black text-gray-300 transition-colors"
                    title="کپی شماره تلفکس"
                    aria-label="کپی شماره تلفکس"
                  >
                    {copiedKey === "telefax" ? (
                      <Check size={14} className="text-emerald-400" />
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>
                </div>
              </div>

              {/* Line 1 */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-200">
                      خط کارخانه و هماهنگی سالن‌های تولید ۱
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-gray-300">
                      خط مستقیم ۱
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400">
                    ارتباط با واحد هماهنگی ساخت، مونتاژ پکیج‌ها و انبار کارخانه
                  </p>
                </div>
                <div className="flex items-center gap-2" dir="ltr">
                  <a
                    href={`tel:${phone2.replace(/[^\d+]/g, "")}`}
                    className="font-mono text-xs font-bold text-gray-200 hover:text-[#c49a2c] transition-colors bg-white/[0.04] px-3 py-1.5 rounded-lg inline-flex items-center"
                    dir="ltr"
                  >
                    <PhoneNumber number={phone2} />
                  </a>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(phone2, "phone2")}
                    className="p-2 rounded-lg bg-white/[0.04] hover:bg-[#c49a2c] hover:text-black text-gray-300 transition-colors"
                    title="کپی شماره"
                    aria-label="کپی شماره"
                  >
                    {copiedKey === "phone2" ? (
                      <Check size={14} className="text-emerald-400" />
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>
                </div>
              </div>

              {/* Line 2 */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-200">
                      خط کارخانه و امور مهندسی و بازرسی ۲
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-gray-300">
                      خط مستقیم ۲
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400">
                    ارتباط با سالن ماشین‌کاری سنگین و ایستگاه تست هیدرواستاتیک
                  </p>
                </div>
                <div className="flex items-center gap-2" dir="ltr">
                  <a
                    href={`tel:${phone3.replace(/[^\d+]/g, "")}`}
                    className="font-mono text-xs font-bold text-gray-200 hover:text-[#c49a2c] transition-colors bg-white/[0.04] px-3 py-1.5 rounded-lg inline-flex items-center"
                    dir="ltr"
                  >
                    <PhoneNumber number={phone3} />
                  </a>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(phone3, "phone3")}
                    className="p-2 rounded-lg bg-white/[0.04] hover:bg-[#c49a2c] hover:text-black text-gray-300 transition-colors"
                    title="کپی شماره"
                    aria-label="کپی شماره"
                  >
                    {copiedKey === "phone3" ? (
                      <Check size={14} className="text-emerald-400" />
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Executive Office & Working Hours (Span 5) */}
        <div className="lg:col-span-5 bg-gray-50 border border-gray-200 rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <span className="text-[11px] font-bold text-[#c49a2c] uppercase tracking-wider block mb-1">
                دفتر مدیریت ارشد
              </span>
              <h3 className="text-lg font-extrabold text-[#0a1628]">
                مدیریت عامل و هماهنگی کلان
              </h3>
            </div>

            {/* CEO Box */}
            <div className="p-4 bg-white rounded-xl border border-gray-200/80 shadow-sm space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-[#060f1c] text-[#c49a2c] flex items-center justify-center font-bold">
                  <User size={20} />
                </div>
                <div>
                  <span className="text-[11px] text-gray-400 block">مدیر عامل:</span>
                  <span className="text-sm font-extrabold text-[#0a1628] block">
                    {ceoName}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-500">شماره همراه مدیریت:</span>
                <div className="flex items-center gap-2" dir="ltr">
                  <a
                    href={`tel:${ceoMobile.replace(/[^\d+]/g, "")}`}
                    className="font-mono text-sm font-extrabold text-[#0a1628] hover:text-[#c49a2c] transition-colors inline-flex items-center"
                    dir="ltr"
                  >
                    <PhoneNumber number={ceoMobile} />
                  </a>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(ceoMobile, "ceoMobile")}
                    className="p-1 rounded text-gray-400 hover:text-[#c49a2c] transition-colors"
                    title="کپی شماره همراه مدیریت"
                    aria-label="کپی شماره همراه مدیریت"
                  >
                    {copiedKey === "ceoMobile" ? (
                      <Check size={13} className="text-emerald-600" />
                    ) : (
                      <Copy size={13} />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Operating Hours */}
            <div className="p-4 bg-white rounded-xl border border-gray-200/80 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0a1628]">
                <Clock size={15} className="text-[#c49a2c]" />
                ساعات کاری و پذیرش رسمی کارخانه:
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                شنبه تا پنجشنبه: از ساعت ۸:۰۰ صبح الی ۱۷:۰۰ بعدازظهر
              </p>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                * بازدید حضوری از سالن‌های ماشین‌کاری سنگین و خطوط تست هیدرولیکی نیازمند هماهنگی قبلی جهت صدور برگه تردد شهرک صنعتی می‌باشد.
              </p>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-gray-200 flex items-center gap-2 text-xs text-gray-500">
            <ShieldCheck size={15} className="text-[#c49a2c] shrink-0" />
            <span>پاسخگویی رسمی و صدور پیش‌فاکتور با شناسه ملی ۱۴۰۰۸۲۶۱۰۵۰</span>
          </div>
        </div>
      </div>

      {/* ── Section 3: Factory Physical Address & Postal Hub ── */}
      <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 border border-gray-200 rounded-2xl p-6 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#c49a2c]">
              <MapPin size={16} />
              موقعیت کارگاهی و جغرافیایی کارخانه
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-[#0a1628]">
              آدرس ثبتی و سایت کارخانه در شهرک صنعتی آبادان
            </h3>
            <address className="text-sm text-gray-700 not-italic leading-relaxed">
              {address}
            </address>
            <p className="text-xs text-gray-500 leading-relaxed">
              واقع در محدوده منطقه آزاد تجاری-صنعتی اروند با دسترسی ترانزیتی به بنادر آبادان، خرمشهر، ماهشهر و شاهراه‌های مواصلاتی جنوب کشور.
            </p>
          </div>

          <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-r border-gray-200 pt-4 lg:pt-0 lg:pr-6 flex flex-col justify-center space-y-3">
            <span className="text-xs text-gray-500 block">کد پستی ۱۰ رقمی کارخانه:</span>
            <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-xl shadow-sm">
              <span className="font-mono text-base font-black text-[#0a1628] tracking-widest" dir="ltr">
                {postalCode}
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(postalCodeRaw || postalCode, "postalCode")}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gray-100 hover:bg-[#c49a2c] hover:text-black text-gray-700 text-xs font-bold transition-colors"
              >
                {copiedKey === "postalCode" ? (
                  <>
                    <Check size={13} className="text-emerald-600" />
                    <span>کپی شد</span>
                  </>
                ) : (
                  <>
                    <Copy size={13} />
                    <span>کپی کد پستی</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] text-gray-400">
              جهت درج دقیق در سامانه مودیان، ثبت قراردادها و اسناد بانکی
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
