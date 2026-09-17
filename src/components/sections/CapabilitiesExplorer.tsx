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
  ChevronLeft,
  ChevronRight,
  Shield,
  Activity,
  FileCheck,
  Scale,
  Maximize2,
  Cpu,
} from "lucide-react";
import {
  CAPABILITY_DIVISIONS,
  CapabilityDivision,
  MachineItem,
  FACTORY_INFRASTRUCTURE,
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
      <div className="w-full px-4 md:px-8 lg:px-12 max-w-7xl mx-auto">
        {/* ── Section Header ── */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#c49a2c]/10 border border-[#c49a2c]/30 text-[#c49a2c] text-xs font-bold mb-4">
            <Cpu size={14} />
            <span>واحدهای عملیاتی و تجهیزات سنگین کارخانه آبادان</span>
          </div>
          <h2 className="text-2xl md:text-4xl font-extrabold text-[#0a1628] leading-tight mb-4">
            ۷ واحد تخصصی مهندسی و ماشین‌شاپ صنعتی
          </h2>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            مجموعه کامل ماشین‌آلات سنگین، نورد ضخیم تا ۶۰ میلی‌متر، تراش ۶ متری تا ۲۰ تن، فرز دروازه‌ای CNC و ایستگاه‌های آزمون هیدرولیک و هیدرواستاتیک در محل کارخانه شرکت هزاره کالا دانش اروند.
          </p>
        </div>

        {/* ── Horizontal Scrollable Division Tabs ── */}
        <div className="relative mb-10">
          <div className="flex items-center gap-2 overflow-x-auto pb-4 pt-1 px-1 scrollbar-thin scrollbar-thumb-gray-300 no-scrollbar select-none">
            {divisions.map((div) => {
              const isActive = div.id === activeDivisionId;
              const TabIcon = ICON_MAP[div.iconName] || Cog;

              return (
                <button
                  key={div.id}
                  onClick={() => setActiveDivisionId(div.id)}
                  type="button"
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-xl font-bold text-xs md:text-sm whitespace-nowrap transition-all duration-200 border cursor-pointer shrink-0 ${
                    isActive
                      ? "bg-[#0a1628] text-white border-[#0a1628] shadow-md shadow-[#0a1628]/20 scale-[1.02]"
                      : "bg-white text-gray-700 border-gray-200 hover:border-[#c49a2c]/50 hover:bg-gray-50"
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs transition-colors ${
                      isActive
                        ? "bg-[#c49a2c] text-[#0a1628]"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <TabIcon size={14} />
                  </span>
                  <span>{div.title}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      isActive
                        ? "bg-white/20 text-[#c49a2c]"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {div.machines.length}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Active Division Showcase Card ── */}
        {activeDivision && (
          <div className="space-y-8 animate-fadeIn">
            {/* Division Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-[#0a1628] text-white p-6 md:p-10 border border-[#c49a2c]/20 shadow-xl">
              <div className="absolute -top-24 -left-24 w-80 h-80 bg-[#c49a2c]/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="max-w-3xl">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="text-xs font-bold text-[#c49a2c] bg-[#c49a2c]/15 px-3 py-1 rounded-full border border-[#c49a2c]/30">
                      واحد شماره {activeDivision.number}: {activeDivision.badge}
                    </span>
                    <span className="text-xs text-gray-400 font-mono tracking-wider">
                      {activeDivision.englishTitle}
                    </span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
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
                        className="text-[11px] font-mono font-medium bg-white/10 text-white px-2.5 py-0.5 rounded-md border border-white/15"
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
                    className="inline-flex items-center justify-center gap-2 bg-[#c49a2c] hover:bg-[#b08824] text-[#0a1628] font-bold text-sm px-6 py-3.5 rounded-xl transition-colors shadow-lg shadow-[#c49a2c]/20"
                  >
                    <span>{activeDivision.ctaText}</span>
                    <ArrowLeft size={16} />
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-3 rounded-xl transition-colors border border-white/15"
                  >
                    <Phone size={14} />
                    <span>مشاوره تلفنی با مهندس بخش</span>
                  </Link>
                </div>
              </div>

              {/* Numerical Metrics Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10">
                {activeDivision.stats.map((stat, idx) => (
                  <div key={idx} className="bg-white/5 rounded-xl p-3.5 border border-white/5">
                    <div className="text-xs text-gray-400 mb-1">{stat.label}</div>
                    <div className="text-sm md:text-base font-extrabold text-[#c49a2c]">
                      {stat.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Machinery Technical Spec Grid */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-lg md:text-xl font-extrabold text-[#0a1628] flex items-center gap-2">
                  <Cog className="text-[#c49a2c]" size={20} />
                  <span>تجهیزات تخصصی و ماشین‌آلات مستقر در این واحد ({activeDivision.machines.length} دستگاه)</span>
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                        <span className="shrink-0 text-xs font-bold px-2.5 py-1 rounded-lg bg-[#c49a2c]/10 text-[#0a1628] border border-[#c49a2c]/30 font-mono">
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
                              <span className="font-mono text-[#0a1628]">{machine.keyLimits.maxWeight}</span>
                            </div>
                          )}
                          {machine.keyLimits.maxLength && (
                            <div className="text-[11px] text-gray-700 flex items-center gap-1 font-semibold">
                              <Maximize2 size={13} className="text-[#c49a2c]" />
                              <span>حداکثر طول:</span>
                              <span className="font-mono text-[#0a1628]">{machine.keyLimits.maxLength}</span>
                            </div>
                          )}
                          {machine.keyLimits.maxDiameter && (
                            <div className="text-[11px] text-gray-700 flex items-center gap-1 font-semibold">
                              <Maximize2 size={13} className="text-[#c49a2c]" />
                              <span>قطر کارگیر:</span>
                              <span className="font-mono text-[#0a1628]">{machine.keyLimits.maxDiameter}</span>
                            </div>
                          )}
                          {machine.keyLimits.maxThickness && (
                            <div className="text-[11px] text-gray-700 flex items-center gap-1 font-semibold">
                              <Maximize2 size={13} className="text-[#c49a2c]" />
                              <span>ضخامت نورد:</span>
                              <span className="font-mono text-[#0a1628]">{machine.keyLimits.maxThickness}</span>
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
                              className="text-[11px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md"
                            >
                              {app}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1 text-emerald-600 font-medium">
                        <CheckCircle2 size={14} />
                        <span>مستقر در کارخانه آبادان</span>
                      </span>
                      <Link
                        href={`/contact?service=${activeDivision.slug}&machine=${encodeURIComponent(machine.name)}`}
                        className="text-[#0a1628] hover:text-[#c49a2c] font-bold flex items-center gap-1 transition-colors"
                      >
                        <span>ثبت سفارش</span>
                        <ArrowLeft size={13} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Factory Master Infrastructure Footprint ── */}
        <div className="mt-16 bg-white rounded-2xl p-6 md:p-8 border border-gray-200/90 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-gray-100">
            <div>
              <span className="text-xs font-bold text-[#c49a2c] uppercase tracking-wider">
                زیرساخت‌های متمرکز کارخانه
              </span>
              <h4 className="text-lg md:text-xl font-extrabold text-[#0a1628] mt-1">
                مشخصات سایت تولیدی و لجستیک کارخانه آبادان
              </h4>
            </div>
            <div className="text-xs text-gray-500 max-w-md">
              {FACTORY_INFRASTRUCTURE.location}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
              <div className="text-xs text-gray-500 mb-1">مساحت عرصه و اعیان</div>
              <div className="text-sm font-bold text-[#0a1628]">{FACTORY_INFRASTRUCTURE.landArea}</div>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
              <div className="text-xs text-gray-500 mb-1">توان جابجایی سالن ساخت</div>
              <div className="text-sm font-bold text-[#0a1628]">{FACTORY_INFRASTRUCTURE.liftingCapacity}</div>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
              <div className="text-xs text-gray-500 mb-1">برق اضطراری بدون وقفه</div>
              <div className="text-sm font-bold text-[#0a1628]">{FACTORY_INFRASTRUCTURE.powerBackup}</div>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
              <div className="text-xs text-gray-500 mb-1">ایستگاه کنترل کیفی</div>
              <div className="text-sm font-bold text-[#0a1628]">{FACTORY_INFRASTRUCTURE.testingFacility}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
