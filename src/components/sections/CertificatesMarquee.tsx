"use client";

import { useState, useRef } from "react";
import { Award, ZoomIn, ShieldCheck, ChevronLeft } from "lucide-react";
import { getMediaUrl } from "@/lib/media";
import type { Certificate } from "@/payload-types";
import CertificateLightbox from "@/components/certificates/CertificateLightbox";

interface CertificatesMarqueeProps {
  certificates: Certificate[];
}

export default function CertificatesMarquee({ certificates }: CertificatesMarqueeProps) {
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isPausedByUser, setIsPausedByUser] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  if (!certificates || certificates.length === 0) {
    return null;
  }

  // Duplicate the array 3 times to guarantee a seamless, infinite loop without any empty gap.
  // Translating from 0% to -33.333% loops seamlessly because set 2 and 3 look identical to set 1.
  const marqueeItems = [...certificates, ...certificates, ...certificates];

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
        {/* Subtle Industrial Background Lighting Gradients */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#c49a2c]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
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

        {/* Continuous Horizontal Marquee Container */}
        <div
          className="relative w-full overflow-hidden cursor-grab active:cursor-grabbing"
          onMouseEnter={() => setIsPausedByUser(true)}
          onMouseLeave={() => setIsPausedByUser(false)}
          onTouchStart={() => setIsPausedByUser(true)}
          onTouchEnd={() => setIsPausedByUser(false)}
        >
          {/* Edge Blur / Fade Masks */}
          <div className="absolute top-0 bottom-0 right-0 w-16 md:w-32 z-20 bg-gradient-to-l from-[#060f1c] to-transparent pointer-events-none" />
          <div className="absolute top-0 bottom-0 left-0 w-16 md:w-32 z-20 bg-gradient-to-r from-[#060f1c] to-transparent pointer-events-none" />

          {/* Scrolling Track */}
          <div
            ref={trackRef}
            className={`flex items-center gap-5 md:gap-7 py-4 ${
              isPausedByUser ? "marquee-paused" : "marquee-active"
            }`}
            style={{
              width: "max-content",
              willChange: "transform",
            }}
          >
            {marqueeItems.map((cert, index) => {
              const imageUrl = getMediaUrl(cert.image);
              return (
                <div
                  key={`${cert.id}-${index}`}
                  onClick={() => handleOpenCert(cert)}
                  className="group relative flex-shrink-0 w-[240px] sm:w-[270px] md:w-[300px] h-[360px] sm:h-[400px] md:h-[430px] bg-[#0a1628] rounded-2xl border border-white/10 hover:border-[#c49a2c]/60 shadow-xl hover:shadow-2xl hover:shadow-[#c49a2c]/10 transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between overflow-hidden"
                >
                  {/* Four Metallic Gold Corner Accents */}
                  <div className="absolute top-2.5 right-2.5 w-4 h-4 border-t-2 border-r-2 border-[#c49a2c] z-10 transition-transform group-hover:scale-110" />
                  <div className="absolute top-2.5 left-2.5 w-4 h-4 border-t-2 border-l-2 border-[#c49a2c] z-10 transition-transform group-hover:scale-110" />
                  <div className="absolute bottom-2.5 right-2.5 w-4 h-4 border-b-2 border-r-2 border-[#c49a2c] z-10 transition-transform group-hover:scale-110" />
                  <div className="absolute bottom-2.5 left-2.5 w-4 h-4 border-b-2 border-l-2 border-[#c49a2c] z-10 transition-transform group-hover:scale-110" />

                  {/* Standard Pill Badge - Floating Top */}
                  <div className="relative z-10 pt-4 px-4 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#c49a2c]/20 text-[#e5b53d] border border-[#c49a2c]/40 shadow-sm">
                      <ShieldCheck className="w-3 h-3" />
                      {cert.standard}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono tracking-tight dir-ltr">
                      {cert.registrationNumber.split("-").slice(-2).join("-")}
                    </span>
                  </div>

                  {/* Document Preview Frame */}
                  <div className="relative flex-1 mx-4 my-2.5 bg-white rounded-lg overflow-hidden border border-white/15 flex items-center justify-center p-2 shadow-inner group-hover:border-[#c49a2c]/40 transition-colors">
                    <img
                      src={imageUrl}
                      alt={cert.title}
                      className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Hover Overlay with Zoom Icon */}
                    <div className="absolute inset-0 bg-[#060c18]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 backdrop-blur-[2px]">
                      <div className="w-10 h-10 rounded-full bg-[#c49a2c] text-[#0a1628] flex items-center justify-center shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        <ZoomIn className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-white bg-black/60 px-2.5 py-1 rounded-full border border-white/10">
                        مشاهده و بررسی سند
                      </span>
                    </div>
                  </div>

                  {/* Bottom Plaque Information */}
                  <div className="relative z-10 px-4 pb-4 pt-1 border-t border-white/5 bg-[#091322]">
                    <h3 className="text-xs sm:text-sm font-bold text-white truncate group-hover:text-[#e5b53d] transition-colors">
                      {cert.title}
                    </h3>
                    <div className="flex items-center justify-between mt-1 text-[11px] text-gray-400">
                      <span className="truncate max-w-[170px]">{cert.issuingAuthority || "Quay Audit Limited (QAL)"}</span>
                      <span className="flex items-center gap-0.5 text-[#c49a2c] font-medium group-hover:translate-x-1 transition-transform">
                        <span>جزییات</span>
                        <ChevronLeft className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CSS Keyframes for Infinite Smooth Marquee */}
        <style jsx>{`
          @keyframes infinite-scroll {
            0% {
              transform: translate3d(0, 0, 0);
            }
            100% {
              transform: translate3d(-33.333333%, 0, 0);
            }
          }
          .marquee-active {
            animation: infinite-scroll 35s linear infinite;
          }
          .marquee-paused {
            animation: infinite-scroll 35s linear infinite;
            animation-play-state: paused;
          }
        `}</style>
      </section>

      {/* Universal Lightbox Modal */}
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
