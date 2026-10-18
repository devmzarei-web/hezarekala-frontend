"use client";

import { useState } from "react";
import { Award, ShieldCheck, ZoomIn, Building, Calendar, Hash, ChevronLeft } from "lucide-react";
import { getMediaUrl } from "@/lib/media";
import type { Certificate } from "@/payload-types";
import CertificateLightbox from "@/components/certificates/CertificateLightbox";

interface CertificatesGridProps {
  certificates: Certificate[];
}

export default function CertificatesGrid({ certificates }: CertificatesGridProps) {
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  if (!certificates || certificates.length === 0) {
    return null;
  }

  const handleOpenCert = (cert: Certificate) => {
    setSelectedCert(cert);
    setIsLightboxOpen(true);
  };

  return (
    <>
      <section
        className="py-16 md:py-24 bg-[#060f1c] text-white border-y border-white/5 relative overflow-hidden"
        aria-labelledby="certificates-grid-heading"
      >
        {/* Subtle Ambient Industrial Backlight */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#c49a2c]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full px-4 sm:px-6 md:px-12 lg:px-16 max-w-7xl mx-auto relative z-10">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#c49a2c]/10 border border-[#c49a2c]/30 text-[#e5b53d] text-xs sm:text-sm font-bold mb-3 md:mb-4">
              <Award className="w-4 h-4" />
              <span>سیستم‌های مدیریت یکپارچه و کیفیت بین‌المللی</span>
            </div>

            <h2
              id="certificates-grid-heading"
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight"
            >
              گواهینامه‌ها و استانداردهای سازمانی
            </h2>

            <p className="text-gray-400 text-xs sm:text-sm md:text-base mt-3 md:mt-4 leading-relaxed max-w-2xl mx-auto">
              تعهد خدشه‌ناپذیر شرکت هزاره کالا دانش اروند به رعایت دقیق‌ترین موازین مهندسی، ایمنی شغلی، بهداشت و حفاظت محیط زیست
            </p>
          </div>

          {/* Static Responsive Grid (1 col mobile, 2 col tablet, 3 col desktop) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {certificates.map((cert) => {
              const imageUrl = getMediaUrl(cert.image);
              return (
                <article
                  key={cert.id}
                  onClick={() => handleOpenCert(cert)}
                  className="group bg-[#0a1628] rounded-2xl md:rounded-3xl border border-white/10 hover:border-[#c49a2c]/60 shadow-xl hover:shadow-2xl hover:shadow-[#c49a2c]/10 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden cursor-pointer"
                >
                  {/* Card Header with Standard Code Badge & Registration Number */}
                  <div className="p-5 pb-3 flex items-center justify-between border-b border-white/5 bg-[#091424]">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#c49a2c]/15 text-[#e5b53d] border border-[#c49a2c]/35">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {cert.standard}
                    </span>
                    <span className="text-xs text-gray-400 font-mono tracking-wider dir-ltr">
                      {cert.registrationNumber}
                    </span>
                  </div>

                  {/* Document Preview Thumbnail */}
                  <div className="relative aspect-[4/3] sm:aspect-[16/11] bg-white mx-5 mt-4 rounded-xl overflow-hidden border border-white/15 flex items-center justify-center p-3 shadow-inner group-hover:border-[#c49a2c]/40 transition-colors">
                    <img
                      src={imageUrl}
                      alt={cert.title}
                      className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Hover Zoom Overlay */}
                    <div className="absolute inset-0 bg-[#060c18]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 backdrop-blur-[2px]">
                      <div className="w-11 h-11 rounded-full bg-[#c49a2c] text-[#0a1628] flex items-center justify-center shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        <ZoomIn className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-white bg-black/60 px-3 py-1 rounded-full border border-white/10">
                        مشاهده اندازه کامل سند
                      </span>
                    </div>
                  </div>

                  {/* Information & Technical Scope */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-[#e5b53d] transition-colors line-clamp-1">
                        {cert.title}
                      </h3>
                      {cert.subtitle && (
                        <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                          {cert.subtitle}
                        </p>
                      )}

                      {/* Metadata Details */}
                      <div className="mt-4 pt-3 border-t border-white/5 space-y-2 text-xs text-gray-300">
                        {cert.issuingAuthority && (
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400 flex items-center gap-1.5">
                              <Building className="w-3.5 h-3.5 text-[#c49a2c]" />
                              <span>مرجع صدور:</span>
                            </span>
                            <span className="font-medium text-white">{cert.issuingAuthority}</span>
                          </div>
                        )}

                        {cert.issueDate && (
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400 flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-[#c49a2c]" />
                              <span>دوره اعتبار:</span>
                            </span>
                            <span className="font-medium text-white">{cert.issueDate}</span>
                          </div>
                        )}
                      </div>

                      {/* Brief Scope */}
                      {cert.description && (
                        <p className="text-xs text-gray-400 mt-3 line-clamp-2 leading-relaxed bg-white/[0.02] p-2.5 rounded-lg border border-white/5">
                          {cert.description}
                        </p>
                      )}
                    </div>

                    {/* Action Trigger */}
                    <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold text-[#c49a2c] group-hover:text-[#e5b53d]">
                      <span>مشاهده جزئیات و دانلود</span>
                      <span className="flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                        <ChevronLeft className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
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
