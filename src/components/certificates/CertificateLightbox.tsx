"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ZoomIn,
  ZoomOut,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Award,
  Calendar,
  Building,
  Hash,
  Copy,
  Check,
} from "lucide-react";
import { getMediaUrl } from "@/lib/media";
import type { Certificate } from "@/payload-types";

interface CertificateLightboxProps {
  certificate: Certificate | null;
  allCertificates?: Certificate[];
  isOpen: boolean;
  onClose: () => void;
  onSelectCertificate?: (cert: Certificate) => void;
}

export default function CertificateLightbox({
  certificate,
  allCertificates = [],
  isOpen,
  onClose,
  onSelectCertificate,
}: CertificateLightboxProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [copied, setCopied] = useState(false);

  // Reset zoom on certificate change
  useEffect(() => {
    setIsZoomed(false);
    setCopied(false);
  }, [certificate]);

  // Handle current index and cycling
  const currentIndex = certificate && allCertificates.length > 0
    ? allCertificates.findIndex((c) => c.id === certificate.id)
    : -1;

  const handleNext = useCallback(() => {
    if (!onSelectCertificate || allCertificates.length === 0 || currentIndex === -1) return;
    const nextIndex = (currentIndex + 1) % allCertificates.length;
    onSelectCertificate(allCertificates[nextIndex]);
  }, [allCertificates, currentIndex, onSelectCertificate]);

  const handlePrev = useCallback(() => {
    if (!onSelectCertificate || allCertificates.length === 0 || currentIndex === -1) return;
    const prevIndex = (currentIndex - 1 + allCertificates.length) % allCertificates.length;
    onSelectCertificate(allCertificates[prevIndex]);
  }, [allCertificates, currentIndex, onSelectCertificate]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight") {
        // In RTL, right arrow often means previous or next depending on reading direction
        handlePrev();
      } else if (e.key === "ArrowLeft") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, handleNext, handlePrev]);

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  const handleCopyRegNumber = (regNo: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(regNo);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isOpen || !certificate) return null;

  const imageUrl = getMediaUrl(certificate.image);

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cert-lightbox-title"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#040810]/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-5xl max-h-[92vh] bg-[#0a1628] border border-white/10 rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
        >
          {/* Close Button Top-Left */}
          <button
            onClick={onClose}
            className="absolute top-3 left-3 z-30 p-2 text-white/70 hover:text-white bg-black/40 hover:bg-black/70 rounded-full border border-white/10 transition-colors backdrop-blur-sm"
            aria-label="بستن پنجره"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left / Center: High-Resolution Certificate Document Preview */}
          <div className="relative flex-1 bg-[#060c18] flex items-center justify-center p-4 md:p-8 overflow-hidden min-h-[340px] md:min-h-[560px]">
            {/* Corner Decorative Brackets */}
            <div className="absolute top-4 right-4 w-5 h-5 border-t-2 border-r-2 border-[#c49a2c]/60 pointer-events-none" />
            <div className="absolute top-4 left-4 w-5 h-5 border-t-2 border-l-2 border-[#c49a2c]/60 pointer-events-none" />
            <div className="absolute bottom-4 right-4 w-5 h-5 border-b-2 border-r-2 border-[#c49a2c]/60 pointer-events-none" />
            <div className="absolute bottom-4 left-4 w-5 h-5 border-b-2 border-l-2 border-[#c49a2c]/60 pointer-events-none" />

            {/* Document Image Container with Zoom Toggle */}
            <div
              className={`relative max-w-full max-h-[75vh] transition-transform duration-300 ease-out cursor-pointer ${
                isZoomed ? "scale-125 md:scale-150 overflow-auto" : "scale-100"
              }`}
              onClick={() => setIsZoomed((prev) => !prev)}
            >
              <img
                src={imageUrl}
                alt={certificate.title}
                className="max-h-[70vh] w-auto object-contain rounded-lg shadow-2xl border border-white/10 bg-white"
                loading="eager"
              />
            </div>

            {/* Zoom Toggle Floating Pill */}
            <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsZoomed((prev) => !prev)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white/90 bg-white/10 hover:bg-white/20 rounded-full border border-white/15 backdrop-blur-sm transition-colors shadow-lg"
              >
                {isZoomed ? (
                  <>
                    <ZoomOut className="w-3.5 h-3.5 text-[#c49a2c]" />
                    <span>اندازه معمول</span>
                  </>
                ) : (
                  <>
                    <ZoomIn className="w-3.5 h-3.5 text-[#c49a2c]" />
                    <span>بزرگ‌نمایی سند</span>
                  </>
                )}
              </button>
            </div>

            {/* Navigation Arrows for Cycling Certificates */}
            {allCertificates.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 text-white/80 hover:text-white bg-black/50 hover:bg-[#c49a2c] hover:text-[#0a1628] rounded-full border border-white/10 transition-colors backdrop-blur-sm shadow-xl"
                  aria-label="گواهینامه قبلی"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 text-white/80 hover:text-white bg-black/50 hover:bg-[#c49a2c] hover:text-[#0a1628] rounded-full border border-white/10 transition-colors backdrop-blur-sm shadow-xl"
                  aria-label="گواهینامه بعدی"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* Right: Technical Inspection & Scope Details Panel */}
          <div className="w-full md:w-[380px] lg:w-[420px] bg-[#0c182c] p-6 md:p-8 flex flex-col justify-between border-t md:border-t-0 md:border-r border-white/10 overflow-y-auto max-h-[50vh] md:max-h-[92vh]">
            <div className="space-y-6">
              {/* Standard Badge & Sequence Tag */}
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#c49a2c]/15 text-[#e5b53d] border border-[#c49a2c]/40 tracking-wider">
                  <Award className="w-3.5 h-3.5" />
                  {certificate.standard}
                </span>

                {allCertificates.length > 0 && currentIndex !== -1 && (
                  <span className="text-xs text-gray-400 font-medium">
                    {currentIndex + 1} از {allCertificates.length}
                  </span>
                )}
              </div>

              {/* Title & Subtitle */}
              <div>
                <h3
                  id="cert-lightbox-title"
                  className="text-lg md:text-xl font-bold text-white leading-snug tracking-tight"
                >
                  {certificate.title}
                </h3>
                {certificate.subtitle && (
                  <p className="text-xs md:text-sm text-gray-400 mt-1 leading-relaxed">
                    {certificate.subtitle}
                  </p>
                )}
              </div>

              {/* Metadata Key-Value Cards */}
              <div className="space-y-2.5 pt-2 border-t border-white/10">
                {/* Registration Number */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.04] border border-white/5">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Hash className="w-3.5 h-3.5 text-[#c49a2c]" />
                    <span>شماره ثبت بین‌المللی:</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-white tracking-wider dir-ltr select-all">
                      {certificate.registrationNumber}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyRegNumber(certificate.registrationNumber)}
                      className="p-1 text-gray-400 hover:text-white transition-colors rounded"
                      title="کپی شماره ثبت"
                    >
                      {copied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Issuing Authority */}
                {certificate.issuingAuthority && (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.04] border border-white/5">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Building className="w-3.5 h-3.5 text-[#c49a2c]" />
                      <span>مرجع صدور / ممیزی:</span>
                    </div>
                    <span className="text-xs font-semibold text-white text-left dir-ltr">
                      {certificate.issuingAuthority}
                    </span>
                  </div>
                )}

                {/* Issue Date / Validity */}
                {certificate.issueDate && (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.04] border border-white/5">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Calendar className="w-3.5 h-3.5 text-[#c49a2c]" />
                      <span>دوره اعتبار / صدور:</span>
                    </div>
                    <span className="text-xs font-semibold text-white">
                      {certificate.issueDate}
                    </span>
                  </div>
                )}
              </div>

              {/* Scope Description */}
              {certificate.description && (
                <div className="pt-2">
                  <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#c49a2c]" />
                    <span>دامنه کاربرد و استانداردهای منطبق</span>
                  </h4>
                  <p className="text-xs md:text-sm text-gray-400 leading-relaxed text-justify bg-white/[0.02] p-3 rounded-xl border border-white/5">
                    {certificate.description}
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 mt-6 border-t border-white/10 flex flex-col gap-2">
              <a
                href={imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-[#c49a2c] hover:bg-[#d8ab34] text-[#0a1628] font-bold text-xs md:text-sm rounded-xl transition-all duration-200 shadow-md hover:shadow-[#c49a2c]/20"
              >
                <ExternalLink className="w-4 h-4" />
                <span>مشاهده اندازه کامل / دانلود</span>
              </a>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2 px-4 bg-white/5 hover:bg-white/10 text-gray-300 text-xs rounded-xl transition-colors text-center"
              >
                بستن
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
