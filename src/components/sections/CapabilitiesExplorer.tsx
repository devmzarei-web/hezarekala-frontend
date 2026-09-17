"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Layers,
  Cog,
  Flame,
  Droplets,
  ShieldCheck,
  Zap,
  Paintbrush,
  CheckCircle2,
  Phone,
  ArrowLeft,
  FileCheck,
  Scale,
  Maximize2,
  Cpu,
} from "lucide-react";
import {
  CAPABILITY_DIVISIONS,
  CapabilityDivision,
} from "@/lib/capabilities-data";

interface CapabilitiesExplorerProps {
  initialDivisionId?: string;
  divisions?: CapabilityDivision[];
}

const ICON_MAP = {
  Layers,
  Cog,
  Flame,
  Droplets,
  ShieldCheck,
  Zap,
  Paintbrush,
};

export default function CapabilitiesExplorer({
  initialDivisionId,
  divisions = CAPABILITY_DIVISIONS,
}: CapabilitiesExplorerProps) {
  const [activeDivisionId, setActiveDivisionId] = useState<string>(
    initialDivisionId || divisions[0]?.id || "div-heat-exchangers"
  );

  const activeDivision =
    divisions.find((d) => d.id === activeDivisionId) || divisions[0];

  const ActiveIcon =
    activeDivision?.iconName && ICON_MAP[activeDivision.iconName]
      ? ICON_MAP[activeDivision.iconName]
      : Cog;

  return (
    <section className="py-16 md:py-24 bg-gray-50/70 border-b border-gray-200/80" id="facilities">
      {/* ── 1920 Full Width Screen Container ── */}
      <div className="w-full px-4 md:px-8 lg:px-16 xl:px-20">
        {/* ── Section Header ── */}
        <div className="text-center max-w-4xl mx-auto mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#c49a2c]/10 border border-[#c49a2c]/30 text-[#c49a2c] text-xs font-bold mb-4">
            <Cpu size={14} />
            <span>واحدهای عملیاتی و ماشین‌شاپ تخصصی کارخانه آبادان</span>
          </div>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-[#0a1628] leading-tight mb-4">
            ۷ واحد تخصصی مهندسی و ماشین‌شاپ صنعتی
          </h2>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            مجموعه کامل ماشین‌آلات سنگین، نورد ضخیم تا ۶۰ میلی‌متر، تراش ۶ متری تا ۲۰ تن، فرز دروازه‌ای CNC اسپانیا و ایستگاه‌های آزمون هیدرولیک و هیدرواستاتیک در محل کارخانه شرکت هزاره کالا دانش اروند.
          </p>
        </div>

        {/* ── 7 Divisions Tab Navigation (Responsive Grid on Desktop / Smooth Scroll on Mobile) ── */}
        <div className="mb-10 md:mb-12">
          {/* Desktop & Tablet: Full 7-column grid with zero scrollbar needed */}
          <div className="hidden md:grid md:grid-cols-4 lg:grid-cols-7 gap-2.5">
            {divisions.map((div) => {
              const isActive = div.id === activeDivisionId;
              const TabIcon = ICON_MAP[div.iconName] || Cog;

              return (
                <button
                  key={div.id}
                  onClick={() => setActiveDivisionId(div.id)}
                  type="button"
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-200 border text-center cursor-pointer relative overflow-hidden group ${
                    isActive
                      ? "bg-[#0a1628] text-white border-[#c49a2c] shadow-lg shadow-[#0a1628]/25 scale-[1.02]"
                      : "bg-white text-gray-700 border-gray-200/90 hover:border-[#c49a2c]/50 hover:bg-gray-50/80 shadow-sm"
                  }`}
                >
                  {/* Top Number Indicator */}
                  <div className="flex items-center justify-between w-full mb-2 px-1">
                    <span
                      className={`text-[11px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center ${
                        isActive
                          ? "bg-[#c49a2c] text-[#0a1628]"
                          : "bg-gray-100 text-gray-500 group-hover:bg-[#c49a2c]/20 group-hover:text-[#c49a2c]"
                      }`}
                    >
                      {div.number}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                        isActive
                          ? "bg-white/15 text-[#c49a2c]"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {div.machines.length} دستگاه
                    </span>
                  </div>

                  {/* Icon */}
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2 transition-transform duration-300 group-hover:scale-110 ${
                      isActive
                        ? "bg-[#c49a2c]/20 text-[#c49a2c]"
                        : "bg-gray-100 text-gray-600 group-hover:text-[#c49a2c] group-hover:bg-[#c49a2c]/10"
                    }`}
                  >
                    <TabIcon size={18} />
                  </div>

                  {/* Title */}
                  <span
                    className={`text-xs font-bold leading-tight line-clamp-1 ${
                      isActive ? "text-white" : "text-[#0a1628] group-hover:text-[#c49a2c]"
                    }`}
                  >
                    {div.shortTitle || div.title}
                  </span>

                  {/* Active Bottom Glow */}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#c49a2c]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Mobile View: Clean horizontal swipe with NO ugly scrollbars */}
          <div className="md:hidden flex items-center gap-2 overflow-x-auto pb-3 pt-1 px-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden select-none">
            {divisions.map((div) => {
              const isActive = div.id === activeDivisionId;
              const TabIcon = ICON_MAP[div.iconName] || Cog;

              return (
                <button
                  key={div.id}
                  onClick={() => setActiveDivisionId(div.id)}
                  type="button"
                  className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all duration-200 border cursor-pointer shrink-0 ${
                    isActive
                      ? "bg-[#0a1628] text-white border-[#0a1628] shadow-md shadow-[#0a1628]/20"
                      : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-md flex items-center justify-center text-[11px] font-bold ${
                      isActive ? "bg-[#c49a2c] text-[#0a1628]" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <TabIcon size={12} />
                  </span>
                  <span>{div.shortTitle || div.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Active Division Showcase Card ── */}
        {activeDivision && (
          <div className="space-y-8 animate-fadeIn">
            {/* Division Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-[#0a1628] text-white p-6 md:p-10 lg:p-12 border border-[#c49a2c]/25 shadow-xl">
              <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#c49a2c]/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="max-w-4xl">
                  <div className="flex flex-wrap items-center gap-2.5 mb-3">
                    <span className="text-xs font-bold text-[#c49a2c] bg-[#c49a2c]/15 px-3 py-1 rounded-full border border-[#c49a2c]/30">
                      واحد شماره {activeDivision.number}: {activeDivision.badge}
                    </span>
                    <span className="text-xs text-gray-400 font-medium tracking-wider">
                      {activeDivision.englishTitle}
                    </span>
                  </div>
                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white mb-3">
                    {activeDivision.title}
                  </h3>
                  <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-4">
                    {activeDivision.description}
                  </p>

                  {/* Applicable Standards Badges */}
                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    <span className="text-xs font-semibold text-gray-400 flex items-center gap-1">
                      <FileCheck size={14} className="text-[#c49a2c]" />
                      <span>استانداردهای مرجع:</span>
                    </span>
                    {activeDivision.standards.map((std, idx) => (
                      <span
                        key={idx}
                        className="text-xs font-bold bg-white/10 text-white px-3 py-1 rounded-lg border border-white/15"
                      >
                        {std}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Division RFQ Action */}
                <div className="shrink-0 w-full lg:w-auto flex flex-col sm:flex-row lg:flex-col gap-3">
                  <Link
                    href={activeDivision.ctaLink}
                    className="inline-flex items-center justify-center gap-2 bg-[#c49a2c] hover:bg-[#b08824] text-[#0a1628] font-bold text-sm px-7 py-3.5 rounded-xl transition-colors shadow-lg shadow-[#c49a2c]/20"
                  >
                    <span>{activeDivision.ctaText}</span>
                    <ArrowLeft size={16} />
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-5 py-3 rounded-xl transition-colors border border-white/15"
                  >
                    <Phone size={14} />
                    <span>مشاوره تلفنی با مهندس بخش</span>
                  </Link>
                </div>
              </div>

              {/* Numerical Metrics Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10">
                {activeDivision.stats.map((stat, idx) => (
                  <div key={idx} className="bg-white/5 rounded-2xl p-4 border border-white/5">
                    <div className="text-xs text-gray-400 mb-1.5">{stat.label}</div>
                    <div className="text-sm md:text-lg font-extrabold text-[#c49a2c]">
                      {stat.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Machinery Technical Spec Grid */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-lg md:text-2xl font-extrabold text-[#0a1628] flex items-center gap-2">
                  <Cog className="text-[#c49a2c]" size={22} />
                  <span>تجهیزات تخصصی و ماشین‌آلات مستقر در این واحد ({activeDivision.machines.length} دستگاه)</span>
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {activeDivision.machines.map((machine) => (
                  <div
                    key={machine.id}
                    className="bg-white rounded-2xl p-6 border border-gray-200/90 hover:border-[#c49a2c]/60 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      {/* Top Header */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <h5 className="text-base font-bold text-[#0a1628] group-hover:text-[#c49a2c] transition-colors leading-snug">
                          {machine.name}
                        </h5>
                        {/* Capacity Badge with native Persian font (NO font-mono) */}
                        <span className="shrink-0 text-xs font-bold px-2.5 py-1 rounded-lg bg-[#c49a2c]/10 text-[#0a1628] border border-[#c49a2c]/30">
                          {machine.capacityHighlight}
                        </span>
                      </div>

                      {/* Specs */}
                      <p className="text-gray-600 text-xs md:text-sm leading-relaxed mb-4">
                        {machine.specs}
                      </p>

                      {/* Key Numerical Limits If Available */}
                      {machine.keyLimits && (
                        <div className="flex flex-wrap gap-2 mb-4 bg-gray-50 rounded-xl p-3 border border-gray-100">
                          {machine.keyLimits.maxWeight && (
                            <div className="text-[11px] text-gray-700 flex items-center gap-1 font-semibold">
                              <Scale size={13} className="text-[#c49a2c]" />
                              <span>حداکثر وزن:</span>
                              <span className="font-bold text-[#0a1628]">{machine.keyLimits.maxWeight}</span>
                            </div>
                          )}
                          {machine.keyLimits.maxLength && (
                            <div className="text-[11px] text-gray-700 flex items-center gap-1 font-semibold">
                              <Maximize2 size={13} className="text-[#c49a2c]" />
                              <span>حداکثر طول:</span>
                              <span className="font-bold text-[#0a1628]">{machine.keyLimits.maxLength}</span>
                            </div>
                          )}
                          {machine.keyLimits.maxDiameter && (
                            <div className="text-[11px] text-gray-700 flex items-center gap-1 font-semibold">
                              <Maximize2 size={13} className="text-[#c49a2c]" />
                              <span>قطر کارگیر:</span>
                              <span className="font-bold text-[#0a1628]">{machine.keyLimits.maxDiameter}</span>
                            </div>
                          )}
                          {machine.keyLimits.maxThickness && (
                            <div className="text-[11px] text-gray-700 flex items-center gap-1 font-semibold">
                              <Maximize2 size={13} className="text-[#c49a2c]" />
                              <span>ضخامت نورد:</span>
                              <span className="font-bold text-[#0a1628]">{machine.keyLimits.maxThickness}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Applications Tags */}
                      <div className="mb-4">
                        <div className="text-[11px] text-gray-400 font-semibold mb-1.5">کاربردهای تخصصی:</div>
                        <div className="flex flex-wrap gap-1.5">
                          {machine.applications.map((app, i) => (
                            <span
                              key={i}
                              className="text-[11px] font-medium bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-md"
                            >
                              {app}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                        <CheckCircle2 size={14} />
                        <span>مستقر در کارخانه آبادان</span>
                      </span>
                      <Link
                        href={`/contact?service=${activeDivision.slug}&machine=${encodeURIComponent(machine.name)}`}
                        className="text-[#0a1628] hover:text-[#c49a2c] font-bold flex items-center gap-1 transition-colors"
                      >
                        <span>ثبت استعلام</span>
                        <ArrowLeft size={13} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
