"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeftRight,
  TrendingUp,
  TrendingDown,
  ExternalLink,
  Phone,
  ChevronDown,
  Layers,
  Sparkles,
  SlidersHorizontal,
  CheckCircle2,
} from "lucide-react";
import type { Product } from "@/payload-types";
import { getMediaUrl } from "@/lib/media";
import {
  getSpecLabel,
  parseNumericValue,
  formatNumberPersian,
  SpecValueDisplay,
} from "@/lib/specs";

/* ── Types ── */
interface CompareViewProps {
  allProducts: Product[];
  initialSlug1?: string;
  initialSlug2?: string;
}

interface SpecRow {
  key: string;
  label: string;
  unit?: string;
  val1?: string;
  val2?: string;
  num1: number | null;
  num2: number | null;
  isNumeric: boolean;
  isDifferent: boolean;
  delta: number | null;
}

export default function CompareView({
  allProducts = [],
  initialSlug1,
  initialSlug2,
}: CompareViewProps) {
  const [slug1, setSlug1] = useState<string>(
    initialSlug1 || allProducts[0]?.slug || ""
  );
  const [slug2, setSlug2] = useState<string>(
    initialSlug2 || allProducts[1]?.slug || allProducts[0]?.slug || ""
  );
  const [onlyDiffs, setOnlyDiffs] = useState<boolean>(false);

  const product1 = useMemo(
    () => allProducts.find((p) => p.slug === slug1) || allProducts[0],
    [allProducts, slug1]
  );

  const product2 = useMemo(
    () => allProducts.find((p) => p.slug === slug2) || allProducts[1] || allProducts[0],
    [allProducts, slug2]
  );

  /* ── Comparison Rows Aggregation ── */
  const { sharedRows, prod1OnlyRows, prod2OnlyRows } = useMemo(() => {
    if (!product1 || !product2) {
      return { sharedRows: [], prod1OnlyRows: [], prod2OnlyRows: [] };
    }

    const specs1 = product1.specifications || [];
    const specs2 = product2.specifications || [];

    const rowsMap = new Map<string, SpecRow>();

    const getRowKey = (spec: (typeof specs1)[0]) => {
      if (spec.standardFeature && spec.standardFeature !== "custom") {
        return `std-${spec.standardFeature}`;
      }
      return `custom-${getSpecLabel(spec).trim().toLowerCase()}`;
    };

    specs1.forEach((s) => {
      const key = getRowKey(s);
      const label = getSpecLabel(s);
      const val1 = s.value;
      const num1 = s.isNumeric !== false ? parseNumericValue(val1) : null;

      rowsMap.set(key, {
        key,
        label,
        unit: s.unit || undefined,
        val1,
        num1,
        val2: undefined,
        num2: null,
        isNumeric: num1 !== null,
        isDifferent: true,
        delta: null,
      });
    });

    specs2.forEach((s) => {
      const key = getRowKey(s);
      const val2 = s.value;
      const num2 = s.isNumeric !== false ? parseNumericValue(val2) : null;

      if (rowsMap.has(key)) {
        const existing = rowsMap.get(key)!;
        existing.val2 = val2;
        existing.num2 = num2;
        if (!existing.unit && s.unit) existing.unit = s.unit;
        if (existing.num1 !== null && num2 !== null) {
          existing.isNumeric = true;
          existing.isDifferent = existing.num1 !== num2;
          existing.delta = Math.abs(existing.num1 - num2);
        } else {
          existing.isDifferent = (existing.val1 || "").trim() !== (val2 || "").trim();
        }
      } else {
        const label = getSpecLabel(s);
        rowsMap.set(key, {
          key,
          label,
          unit: s.unit || undefined,
          val1: undefined,
          num1: null,
          val2,
          num2,
          isNumeric: num2 !== null,
          isDifferent: true,
          delta: null,
        });
      }
    });

    const all = Array.from(rowsMap.values());
    const shared = all.filter((r) => r.val1 !== undefined && r.val2 !== undefined);
    const p1Only = all.filter((r) => r.val1 !== undefined && r.val2 === undefined);
    const p2Only = all.filter((r) => r.val1 === undefined && r.val2 !== undefined);

    if (onlyDiffs) {
      return {
        sharedRows: shared.filter((r) => r.isDifferent),
        prod1OnlyRows: p1Only,
        prod2OnlyRows: p2Only,
      };
    }

    return {
      sharedRows: shared,
      prod1OnlyRows: p1Only,
      prod2OnlyRows: p2Only,
    };
  }, [product1, product2, onlyDiffs]);

  const swapProducts = () => {
    const temp = slug1;
    setSlug1(slug2);
    setSlug2(temp);
  };

  const totalDifferencesCount = useMemo(() => {
    return sharedRows.filter((r) => r.isDifferent).length;
  }, [sharedRows]);

  return (
    <div className="w-full bg-gray-50/60 py-10 md:py-16" dir="rtl">
      <div className="w-full px-4 sm:px-6 md:px-12 lg:px-16 max-w-7xl mx-auto space-y-8">
        {/* ── Top Controls ── */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-100">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#0a1628] flex items-center gap-2.5">
                <Layers className="text-[#c49a2c]" size={24} />
                <span>جدول مقایسه پارامترهای فنی محصولات</span>
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                تفاوت‌ها به همراه مقادیر بالاتر (سبز) و پایین‌تر (قرمز) و تفاضل عددی نمایش داده می‌شوند.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setOnlyDiffs(!onlyDiffs)}
                className={`inline-flex items-center gap-2 text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl border transition-all cursor-pointer ${
                  onlyDiffs
                    ? "bg-[#c49a2c] text-black border-[#c49a2c] shadow-md shadow-[#c49a2c]/20"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200"
                }`}
              >
                <SlidersHorizontal size={15} />
                <span>فقط موارد دارای تفاوت</span>
                {onlyDiffs && (
                  <span className="bg-black/15 text-black px-1.5 py-0.5 rounded-md text-[10px]">
                    {totalDifferencesCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={swapProducts}
                className="p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-600 hover:text-black transition-colors cursor-pointer"
                title="جابجایی دو ستون"
                aria-label="جابجایی دو ستون"
              >
                <ArrowLeftRight size={18} />
              </button>
            </div>
          </div>

          {/* Selectors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-500">
                انتخاب محصول اول (ستون راست):
              </label>
              <div className="relative">
                <select
                  value={slug1}
                  onChange={(e) => setSlug1(e.target.value)}
                  className="w-full pl-4 pr-10 py-3 bg-gray-50 focus:bg-white border border-gray-200 rounded-xl text-xs sm:text-sm font-bold text-[#0a1628] focus:outline-none focus:border-[#c49a2c] focus:ring-2 focus:ring-[#c49a2c]/20 appearance-none cursor-pointer"
                >
                  {allProducts.map((p) => (
                    <option key={p.id} value={p.slug}>
                      {p.title}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-500">
                انتخاب محصول دوم (ستون چپ):
              </label>
              <div className="relative">
                <select
                  value={slug2}
                  onChange={(e) => setSlug2(e.target.value)}
                  className="w-full pl-4 pr-10 py-3 bg-gray-50 focus:bg-white border border-gray-200 rounded-xl text-xs sm:text-sm font-bold text-[#0a1628] focus:outline-none focus:border-[#c49a2c] focus:ring-2 focus:ring-[#c49a2c]/20 appearance-none cursor-pointer"
                >
                  {allProducts.map((p) => (
                    <option key={p.id} value={p.slug}>
                      {p.title}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Product Header Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[product1, product2].map((prod, idx) => {
            if (!prod) return null;
            return (
              <div
                key={prod.id || idx}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-sm flex flex-col justify-between"
              >
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gray-100 overflow-hidden shrink-0 border border-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getMediaUrl(prod.featuredImage)}
                      alt={prod.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[11px] font-bold bg-[#c49a2c]/10 text-[#c49a2c] px-2.5 py-0.5 rounded-full inline-block mb-1.5">
                      محصول شماره {idx + 1}
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-[#0a1628] truncate mb-1">
                      {prod.title}
                    </h3>
                    {prod.shortDescription && (
                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                        {prod.shortDescription}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-5 mt-5 border-t border-gray-100">
                  <Link
                    href={`/products/${prod.slug}`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-[#0a1628] py-2.5 rounded-xl font-bold text-xs transition-colors"
                  >
                    <span>مشاهده مشخصات</span>
                    <ExternalLink size={13} />
                  </Link>
                  <Link
                    href={`/contact?product=${encodeURIComponent(prod.slug)}`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#c49a2c] hover:bg-[#d4a82c] text-black py-2.5 rounded-xl font-bold text-xs transition-colors shadow-sm"
                  >
                    <Phone size={13} />
                    <span>استعلام قیمت</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Comparison Table with Sticky Header Dock ── */}
        <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs sm:text-sm min-w-[620px]">
              {/* Sticky Table Header Dock */}
              <thead className="sticky top-0 z-20 bg-[#060f1c] text-white shadow-md">
                <tr className="border-b border-gray-800">
                  <th className="py-4 px-6 font-bold w-1/3 text-xs sm:text-sm">
                    پارامتر / مشخصه فنی
                  </th>
                  <th className="py-4 px-6 font-bold w-1/3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <span className="truncate max-w-[180px]">{product1?.title}</span>
                      <Link
                        href={`/contact?product=${encodeURIComponent(product1?.slug || "")}`}
                        className="bg-[#c49a2c] hover:bg-[#d4a82c] text-black px-2 py-1 rounded-lg text-[10px] font-extrabold shrink-0"
                        title="استعلام"
                      >
                        استعلام
                      </Link>
                    </div>
                  </th>
                  <th className="py-4 px-6 font-bold w-1/3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <span className="truncate max-w-[180px]">{product2?.title}</span>
                      <Link
                        href={`/contact?product=${encodeURIComponent(product2?.slug || "")}`}
                        className="bg-[#c49a2c] hover:bg-[#d4a82c] text-black px-2 py-1 rounded-lg text-[10px] font-extrabold shrink-0"
                        title="استعلام"
                      >
                        استعلام
                      </Link>
                    </div>
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {/* ── Group 1: Shared Specifications ── */}
                {sharedRows.length > 0 && (
                  <>
                    <tr className="bg-amber-50/60 border-y border-amber-200/50">
                      <td colSpan={3} className="py-2.5 px-6 font-extrabold text-[#0a1628] text-xs flex items-center gap-2">
                        <Sparkles size={14} className="text-[#c49a2c]" />
                        <span>مشخصات فنی مشترک و قابل مقایسه</span>
                        <span className="text-[11px] font-semibold text-gray-500 bg-white px-2 py-0.5 rounded-full border border-gray-200">
                          {sharedRows.length} مورد
                        </span>
                      </td>
                    </tr>
                    {sharedRows.map((row, idx) => {
                      const hasBothNums = row.num1 !== null && row.num2 !== null;
                      const num1Higher = hasBothNums && row.num1! > row.num2!;
                      const num2Higher = hasBothNums && row.num2! > row.num1!;
                      const numEqual = hasBothNums && row.num1 === row.num2;

                      return (
                        <tr
                          key={row.key || idx}
                          className={`transition-colors hover:bg-gray-50/80 ${
                            idx % 2 === 0 ? "bg-white" : "bg-gray-50/40"
                          }`}
                        >
                          {/* Spec Title & Unit */}
                          <td className="py-4 px-6 font-bold text-[#0a1628]">
                            <span>{row.label}</span>
                            {row.unit && (
                              <span
                                dir="ltr"
                                className="inline-block text-[11px] text-gray-400 font-normal mr-1.5"
                              >
                                ({row.unit})
                              </span>
                            )}
                          </td>

                          {/* Product 1 Value */}
                          <td className="py-4 px-6 text-center">
                            <div className="inline-flex flex-col items-center gap-1.5">
                              <span
                                className={`px-3 py-1 rounded-xl text-xs sm:text-sm border transition-all ${
                                  num1Higher
                                    ? "bg-emerald-50 text-emerald-800 border-emerald-300 font-bold shadow-xs"
                                    : num2Higher
                                    ? "bg-rose-50 text-rose-800 border-rose-300 font-bold"
                                    : numEqual
                                    ? "bg-gray-100 text-gray-800 border-gray-200"
                                    : row.isDifferent
                                    ? "bg-amber-50/70 text-amber-900 border-amber-200 font-bold"
                                    : "text-gray-800"
                                }`}
                              >
                                <SpecValueDisplay value={row.val1} unit={row.unit} />
                              </span>

                              {num1Higher && row.delta !== null && (
                                <span
                                  className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50/60 px-2 py-0.5 rounded-md border border-emerald-200"
                                  dir="rtl"
                                >
                                  <TrendingUp size={12} className="text-emerald-600" />
                                  <span dir="ltr" className="font-bold">
                                    +{formatNumberPersian(row.delta)} {row.unit || ""}
                                  </span>
                                  <span className="text-[10px]">بالاتر</span>
                                </span>
                              )}
                              {num2Higher && row.delta !== null && (
                                <span
                                  className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50/60 px-2 py-0.5 rounded-md border border-rose-200"
                                  dir="rtl"
                                >
                                  <TrendingDown size={12} className="text-rose-600" />
                                  <span dir="ltr" className="font-bold">
                                    -{formatNumberPersian(row.delta)} {row.unit || ""}
                                  </span>
                                  <span className="text-[10px]">پایین‌تر</span>
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Product 2 Value */}
                          <td className="py-4 px-6 text-center">
                            <div className="inline-flex flex-col items-center gap-1.5">
                              <span
                                className={`px-3 py-1 rounded-xl text-xs sm:text-sm border transition-all ${
                                  num2Higher
                                    ? "bg-emerald-50 text-emerald-800 border-emerald-300 font-bold shadow-xs"
                                    : num1Higher
                                    ? "bg-rose-50 text-rose-800 border-rose-300 font-bold"
                                    : numEqual
                                    ? "bg-gray-100 text-gray-800 border-gray-200"
                                    : row.isDifferent
                                    ? "bg-amber-50/70 text-amber-900 border-amber-200 font-bold"
                                    : "text-gray-800"
                                }`}
                              >
                                <SpecValueDisplay value={row.val2} unit={row.unit} />
                              </span>

                              {num2Higher && row.delta !== null && (
                                <span
                                  className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50/60 px-2 py-0.5 rounded-md border border-emerald-200"
                                  dir="rtl"
                                >
                                  <TrendingUp size={12} className="text-emerald-600" />
                                  <span dir="ltr" className="font-bold">
                                    +{formatNumberPersian(row.delta)} {row.unit || ""}
                                  </span>
                                  <span className="text-[10px]">بالاتر</span>
                                </span>
                              )}
                              {num1Higher && row.delta !== null && (
                                <span
                                  className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50/60 px-2 py-0.5 rounded-md border border-rose-200"
                                  dir="rtl"
                                >
                                  <TrendingDown size={12} className="text-rose-600" />
                                  <span dir="ltr" className="font-bold">
                                    -{formatNumberPersian(row.delta)} {row.unit || ""}
                                  </span>
                                  <span className="text-[10px]">پایین‌تر</span>
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </>
                )}

                {/* ── Group 2: Product 1 Exclusive Specs ── */}
                {prod1OnlyRows.length > 0 && !onlyDiffs && (
                  <>
                    <tr className="bg-gray-100/80 border-y border-gray-200">
                      <td colSpan={3} className="py-2.5 px-6 font-extrabold text-[#0a1628] text-xs flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-gray-500" />
                        <span>مشخصات اختصاصی {product1?.title}</span>
                        <span className="text-[11px] font-semibold text-gray-500 bg-white px-2 py-0.5 rounded-full border border-gray-200">
                          {prod1OnlyRows.length} مورد
                        </span>
                      </td>
                    </tr>
                    {prod1OnlyRows.map((row, idx) => (
                      <tr key={row.key || idx} className="bg-white hover:bg-gray-50/80">
                        <td className="py-4 px-6 font-bold text-[#0a1628]">
                          <span>{row.label}</span>
                          {row.unit && (
                            <span dir="ltr" className="inline-block text-[11px] text-gray-400 font-normal mr-1.5">
                              ({row.unit})
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-center">
                          <SpecValueDisplay value={row.val1} unit={row.unit} />
                        </td>
                        <td className="py-4 px-6 text-center text-gray-300 font-bold">—</td>
                      </tr>
                    ))}
                  </>
                )}

                {/* ── Group 3: Product 2 Exclusive Specs ── */}
                {prod2OnlyRows.length > 0 && !onlyDiffs && (
                  <>
                    <tr className="bg-gray-100/80 border-y border-gray-200">
                      <td colSpan={3} className="py-2.5 px-6 font-extrabold text-[#0a1628] text-xs flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-gray-500" />
                        <span>مشخصات اختصاصی {product2?.title}</span>
                        <span className="text-[11px] font-semibold text-gray-500 bg-white px-2 py-0.5 rounded-full border border-gray-200">
                          {prod2OnlyRows.length} مورد
                        </span>
                      </td>
                    </tr>
                    {prod2OnlyRows.map((row, idx) => (
                      <tr key={row.key || idx} className="bg-white hover:bg-gray-50/80">
                        <td className="py-4 px-6 font-bold text-[#0a1628]">
                          <span>{row.label}</span>
                          {row.unit && (
                            <span dir="ltr" className="inline-block text-[11px] text-gray-400 font-normal mr-1.5">
                              ({row.unit})
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-center text-gray-300 font-bold">—</td>
                        <td className="py-4 px-6 text-center">
                          <SpecValueDisplay value={row.val2} unit={row.unit} />
                        </td>
                      </tr>
                    ))}
                  </>
                )}

                {sharedRows.length === 0 && prod1OnlyRows.length === 0 && prod2OnlyRows.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-12 text-center text-gray-500 font-medium">
                      مشخصه‌ای برای نمایش یا مقایسه یافت نشد.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}