"use client";

import { useState } from "react";
import { Award, ZoomIn, ShieldCheck, ChevronLeft } from "lucide-react";
import { getMediaUrl } from "@/lib/media";
import type { Certificate } from "@/payload-types";
import CertificateLightbox from "@/components/certificates/CertificateLightbox";

// Types
interface CertificatesMarqueeProps {
  certificates: Certificate[];
}

interface CertificateCardProps {
  cert: Certificate;
  onOpen: (cert: Certificate) => void;
  isAriaHidden?: boolean;
}

// UI Components
function CertificateCard({ cert, onOpen, isAriaHidden }: CertificateCardProps) {
  const imageUrl = getMediaUrl(cert.image);

  return (
    <div
      dir="rtl"
      tabIndex={isAriaHidden ? -1 : 0}
      onClick={() => onOpen(cert)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(cert);
        }
      }}
      role="button"
      aria-label={cert.title}
      className="group/card relative flex-shrink-0 w-[240px] sm:w-[270px] md:w-[300px] h-[360px] sm:h-[400px] md:h-[430px] bg-[#0a1628] rounded-2xl border border-white/10 hover:border-[#c49a2c]/60 shadow-xl hover:shadow-2xl hover:shadow-[#c49a2c]/10 transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between overflow-hidden text-right select-none"
    >
      <div className="absolute top-2.5 right-2.5 w-4 h-4 border-t-2 border-r-2 border-[#c49a2c] z-10 transition-transform group-hover/card:scale-110 pointer-events-none" />
      <div className="absolute top-2.5 left-2.5 w-4 h-4 border-t-2 border-l-2 border-[#c49a2c] z-10 transition-transform group-hover/card:scale-110 pointer-events-none" />
      <div className="absolute bottom-2.5 right-2.5 w-4 h-4 border-b-2 border-r-2 border-[#c49a2c] z-10 transition-transform group-hover/card:scale-110 pointer-events-none" />
      <div className="absolute bottom-2.5 left-2.5 w-4 h-4 border-b-2 border-l-2 border-[#c49a2c] z-10 transition-transform group-hover/card:scale-110 pointer-events-none" />

      <div className="relative z-10 pt-4 px-4 flex items-center justify-between">
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#c49a2c]/20 text-[#e5b53d] border border-[#c49a2c]/40 shadow-sm">
          <ShieldCheck className="w-3 h-3" />
          {cert.standard}
        </span>
        <span className="text-[10px] text-gray-400 font-mono tracking-tight dir-ltr">
          {cert.registrationNumber.split("-").slice(-2).join("-")}
        </span>
      </div>

      <div className="relative flex-1 mx-4 my-2.5 bg-white rounded-lg overflow-hidden border border-white/15 flex items-center justify-center p-2 shadow-inner group-hover/card:border-[#c49a2c]/40 transition-colors">
        <img
          src={imageUrl}
          alt={cert.title}
          className="w-full h-full object-contain transition-transform duration-500 group-hover/card:scale-105 pointer-events-none"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-[#060c18]/60 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 backdrop-blur-[2px]">
          <div className="w-10 h-10 rounded-full bg-[#c49a2c] text-[#0a1628] flex items-center justify-center shadow-lg transform translate-y-2 group-hover/card:translate-y-0 transition-transform duration-300">
            <ZoomIn className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-white bg-black/60 px-2.5 py-1 rounded-full border border-white/10">
            مشاهده و بررسی سند
          </span>
        </div>
      </div>

      <div className="relative z-10 px-4 pb-4 pt-1 border-t border-white/5 bg-[#091322]">
        <h3 className="text-xs sm:text-sm font-bold text-white truncate group-hover/card:text-[#e5b53d] transition-colors">
          {cert.title}
        </h3>
        <div className="flex items-center justify-between mt-1 text-[11px] text-gray-400">
          <span className="truncate max-w-[170px]">
            {cert.issuingAuthority || "Quay Audit Limited (QAL)"}
          </span>
          <span className="flex items-center gap-0.5 text-[#c49a2c] font-medium group-hover/card:translate-x-1 transition-transform">
            <span>جزییات</span>
            <ChevronLeft className="w-3 h-3" />
          </span>
        </div>
      </div>
    </div>
  );
}

export default function CertificatesMarquee({ certificates }: CertificatesMarqueeProps) {
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  if (!certificates || certificates.length === 0) {
    return null;
  }

  const repeatCount = Math.max(1, Math.ceil(5 / certificates.length));
  const baseItems = Array.from({ length: repeatCount }, () => certificates).flat();

  const handleOpenCert = (cert: Certificate) => {
    setSelectedCert(cert);
    setIsLightboxOpen(true);
  };

  return (
    <>
      <section
        className="relative py-16 md:py-24 bg-[#060f1c] text-white overflow-hidden border-t border-b border-white/5"
        aria-labelledby="certificates-marquee-heading"
      >
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#c49a2c]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#c49a2c]/10 border border-[#c49a2c]/30 text-[#e5b53d] text-xs md:text-sm font-bold mb-3 md:mb-4">
            <Award className="w-4 h-4" />
            <span>استانداردها و تاییده‌های معتبر بین‌المللی</span>
          </div>

          <h2
            id="certificates-marquee-heading"
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight"
          >
            گواهینامه‌های رسمی مهندسی و کیفیت
          </h2>

          <p className="mt-3 md:mt-4 text-sm md:text-base text-gray-400 max-w-2xl mx-auto leading-relaxed">
            استقرار موازین استاندارد جهانی، تضمین‌کننده ایمنی، کیفیت و دوام تجهیزات دوار در پیچیده‌ترین پروژه‌های نفت و گاز کشور
          </p>
        </div>

        <div
          dir="ltr"
          className="group relative w-full overflow-hidden"
        >
          <div className="absolute top-0 bottom-0 right-0 w-16 md:w-32 z-20 bg-gradient-to-l from-[#060f1c] to-transparent pointer-events-none" />
          <div className="absolute top-0 bottom-0 left-0 w-16 md:w-32 z-20 bg-gradient-to-r from-[#060f1c] to-transparent pointer-events-none" />

          <div className="flex w-max">
            <div className="flex shrink-0 items-center animate-marquee group-hover:[animation-play-state:paused] group-active:[animation-play-state:paused]">
              {baseItems.map((cert, index) => (
                <div key={`track-a-${cert.id}-${index}`} className="pr-5 md:pr-7 shrink-0">
                  <CertificateCard cert={cert} onOpen={handleOpenCert} />
                </div>
              ))}
            </div>

            <div
              aria-hidden="true"
              className="flex shrink-0 items-center animate-marquee group-hover:[animation-play-state:paused] group-active:[animation-play-state:paused]"
            >
              {baseItems.map((cert, index) => (
                <div key={`track-b-${cert.id}-${index}`} className="pr-5 md:pr-7 shrink-0">
                  <CertificateCard cert={cert} onOpen={handleOpenCert} isAriaHidden />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CertificateLightbox
        certificate={selectedCert}
        allCertificates={certificates}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        onSelectCertificate={(c) => setSelectedCert(c)}
      />
    </>
  );
}
