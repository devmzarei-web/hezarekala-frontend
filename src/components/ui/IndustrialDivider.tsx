import React from "react";

export interface IndustrialDividerProps {
  variant?: "ruler" | "accent" | "subtle";
  coordinates?: string;
  plantLabel?: string;
  className?: string;
}

export default function IndustrialDivider({
  variant = "ruler",
  coordinates = "30°20\'N 48°17\'E",
  plantLabel = "ABADAN PLANT · EST. 2018",
  className = "",
}: IndustrialDividerProps) {
  if (variant === "subtle") {
    return (
      <div className={`relative w-full my-8 md:my-12 flex items-center justify-center ${className}`} dir="ltr">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-[#c49a2c]/40 to-transparent" />
        </div>
        <div className="relative px-4 bg-slate-50 flex items-center gap-2 text-[#c49a2c]">
          <div className="w-1.5 h-1.5 rotate-45 border border-[#c49a2c] bg-[#060f1c]" />
          <span className="text-[10px] tracking-[0.2em] font-semibold text-slate-500 uppercase">
            {coordinates}
          </span>
          <div className="w-1.5 h-1.5 rotate-45 border border-[#c49a2c] bg-[#060f1c]" />
        </div>
      </div>
    );
  }

  if (variant === "accent") {
    return (
      <div className={`relative w-full my-10 md:my-14 overflow-hidden ${className}`} dir="ltr">
        {/* Top hairline */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#c49a2c]/60 to-transparent" />
        
        {/* Steel accent strip */}
        <div className="relative bg-[#060f1c] py-2 px-6 flex items-center justify-between border-y border-white/5">
          <span className="text-[10px] font-mono tracking-widest text-slate-400">
            SEC. SPEC // HK-2018
          </span>
          <div className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-[#c49a2c]" />
            <span className="text-[11px] font-semibold text-amber-100/90 tracking-wider uppercase">
              {plantLabel}
            </span>
            <span className="w-1 h-1 rounded-full bg-[#c49a2c]" />
          </div>
          <span className="text-[10px] font-mono tracking-widest text-[#c49a2c]">
            {coordinates}
          </span>
        </div>

        {/* Bottom hairline */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#c49a2c]/60 to-transparent" />
      </div>
    );
  }

  // Primary variant: Technical Ruler & Blueprint Precision Bar
  return (
    <div className={`relative w-full my-10 md:my-14 select-none ${className}`} dir="ltr">
      {/* Top Gold Hairline Border with Glow */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-[#c49a2c] to-transparent shadow-[0_0_8px_rgba(196,154,44,0.4)]" />

      {/* Main Steel Navy Precision Bar */}
      <div className="relative bg-gradient-to-b from-[#0a1628] via-[#060f1c] to-[#040a14] border-y border-white/[0.07] px-4 md:px-10 py-3 overflow-hidden shadow-inner">
        {/* SVG Millimeter Ruler Background Pattern */}
        <div className="absolute inset-0 opacity-25 pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="ruler-ticks" width="40" height="24" patternUnits="userSpaceOnUse">
                {/* 0mm Major Tick */}
                <line x1="0" y1="0" x2="0" y2="16" stroke="#c49a2c" strokeWidth="1.5" />
                {/* Minor Ticks */}
                <line x1="8" y1="0" x2="8" y2="6" stroke="#94a3b8" strokeWidth="0.8" />
                <line x1="16" y1="0" x2="16" y2="6" stroke="#94a3b8" strokeWidth="0.8" />
                {/* 5mm Medium Tick */}
                <line x1="20" y1="0" x2="20" y2="11" stroke="#c49a2c" strokeWidth="1" />
                <line x1="24" y1="0" x2="24" y2="6" stroke="#94a3b8" strokeWidth="0.8" />
                <line x1="32" y1="0" x2="32" y2="6" stroke="#94a3b8" strokeWidth="0.8" />
                {/* Bottom mirrored ticks */}
                <line x1="0" y1="24" x2="0" y2="16" stroke="#c49a2c" strokeWidth="1" />
                <line x1="20" y1="24" x2="20" y2="18" stroke="#c49a2c" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#ruler-ticks)" />
          </svg>
        </div>

        {/* Content Bar: Technical Coordinates & Insignia */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Left: Engineering Crosshair & Precision Tag */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-6 h-6 rounded border border-[#c49a2c]/50 bg-black/40 text-[#c49a2c]">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="8" cy="8" r="6" strokeOpacity="0.8" />
                <line x1="8" y1="1" x2="8" y2="15" strokeDasharray="2 1" />
                <line x1="1" y1="8" x2="15" y2="8" strokeDasharray="2 1" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] tracking-[0.25em] text-slate-400 uppercase font-semibold">
                PRECISION ENGINEERING
              </span>
              <span className="text-[11px] font-bold text-white tracking-wider">
                HEZAREKALA SYSTEM
              </span>
            </div>
          </div>

          {/* Center: Diamond Badge with Plant Specification */}
          <div className="hidden sm:flex items-center gap-3 px-4 py-1 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rotate-45 bg-[#c49a2c]" />
            <span className="text-[11px] font-medium text-amber-200/90 tracking-widest uppercase">
              {plantLabel}
            </span>
            <span className="w-1.5 h-1.5 rotate-45 bg-[#c49a2c]" />
          </div>

          {/* Right: Technical Coordinates Stamp */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-500 tracking-widest hidden md:inline">
              COORD //
            </span>
            <span className="px-2.5 py-1 rounded bg-[#c49a2c]/10 border border-[#c49a2c]/30 text-[#c49a2c] text-[11px] font-bold tracking-wider">
              {coordinates}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Gold Hairline Border with Glow */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-[#c49a2c] to-transparent shadow-[0_0_8px_rgba(196,154,44,0.4)]" />
    </div>
  );
}
