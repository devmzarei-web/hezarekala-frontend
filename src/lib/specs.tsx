import React from "react";

export const STANDARD_FEATURE_LABELS: Record<string, string> = {
  flowRate: "ظرفیت انتقال (دبی)",
  head: "حداکثر هد انتقال",
  power: "توان الکتروموتور / محرک",
  kva: "توان نامی دیزل ژنراتور (KVA)",
  engineModel: "مدل موتور دیزل",
  coolingType: "سیستم خنک‌کننده",
  suctionDepth: "حداکثر عمق مکش",
  solidsHandling: "حداکثر قطر عبور ذرات جامد",
  tableSize: "ابعاد میز کارگیر",
  speed: "محدوده سرعت کاری (RPM)",
  standard: "استاندارد ساخت و طراحی",
  impellerMaterial: "متریال پروانه",
  casingMaterial: "متریال محفظه و پوسته",
  shaftMaterial: "متریال شفت",
  sealType: "نوع سیستم آب‌بندی",
  maxTemp: "حداکثر دمای کاری",
  maxPressure: "حداکثر فشار کاری",
  flangeRating: "کلاس و استاندارد فلنج",
  weight: "وزن دستگاه",
};

/* ── Label Resolver ── */
export function getSpecLabel(spec: {
  standardFeature?: string | null;
  customLabel?: string | null;
  label?: string | null;
}): string {
  if (spec.label && spec.label.trim()) return spec.label.trim();
  if (spec.standardFeature === "custom" && spec.customLabel && spec.customLabel.trim()) {
    return spec.customLabel.trim();
  }
  if (spec.standardFeature && STANDARD_FEATURE_LABELS[spec.standardFeature]) {
    return STANDARD_FEATURE_LABELS[spec.standardFeature];
  }
  if (spec.customLabel && spec.customLabel.trim()) return spec.customLabel.trim();
  return spec.label || spec.standardFeature || "مشخصه فنی";
}

/* ── Number Parser ── */
export function parseNumericValue(val?: string | null): number | null {
  if (!val) return null;
  const western = String(val)
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)))
    .replace(/,/g, "");

  const match = western.match(/[-+]?[0-9]*\.?[0-9]+/);
  if (match) {
    const num = parseFloat(match[0]);
    return isNaN(num) ? null : num;
  }
  return null;
}

export function formatNumberPersian(num: number): string {
  const parts = num.toLocaleString("fa-IR").split(".");
  return parts.join("٫");
}

/* ── Formatted Spec Display Component ── */
export function SpecValueDisplay({
  value,
  unit,
  className = "",
}: {
  value?: string | number | null;
  unit?: string | null;
  className?: string;
}) {
  if (value === undefined || value === null || value === "") {
    return <span className="text-gray-300 font-bold">—</span>;
  }

  const strVal = String(value).trim();
  const strUnit = unit?.trim();
  const hasPersian = /[\u0600-\u06FF]/.test(strVal);

  if (hasPersian) {
    return (
      <span className={`inline-block text-right leading-relaxed ${className}`} dir="rtl">
        {strVal}
        {strUnit && !strVal.includes(strUnit) && (
          <span className="inline-block text-[11px] text-gray-500 font-normal mr-1.5" dir="ltr">
            ({strUnit})
          </span>
        )}
      </span>
    );
  }

  const parsedNum = parseNumericValue(strVal);
  const displayVal =
    parsedNum !== null && !isNaN(Number(strVal.replace(/,/g, "")))
      ? formatNumberPersian(parsedNum)
      : strVal;

  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`} dir="rtl">
      <span className="font-bold">{displayVal}</span>
      {strUnit && !strVal.toLowerCase().includes(strUnit.toLowerCase()) && (
        <span className="text-[11px] opacity-80 font-semibold" dir="ltr">
          {strUnit}
        </span>
      )}
    </span>
  );
}
