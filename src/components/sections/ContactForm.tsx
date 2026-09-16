"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Send, CheckCircle, AlertCircle } from "lucide-react";
import { PAYLOAD_API_URL } from "@/lib/env";

const SUBJECTS = [
  { value: "", label: "انتخاب موضوع" },
  { value: "استعلام قیمت", label: "استعلام قیمت" },
  { value: "مشاوره فنی", label: "مشاوره فنی" },
  { value: "همکاری تجاری", label: "همکاری تجاری" },
  { value: "خدمات پس از فروش", label: "خدمات پس از فروش" },
  { value: "سایر", label: "سایر" },
];

export default function ContactForm() {
  const searchParams = useSearchParams();
  const productParam = searchParams.get("product");

  const [formData, setFormData] = useState({
    fullName: "",
    company: "",
    phone: "",
    email: "",
    subject: productParam ? "استعلام قیمت" : "",
    message: productParam
      ? `درخواست استعلام قیمت، شرایط تحویل و مشخصات فنی برای محصول: ${productParam}`
      : "",
  });

  useEffect(() => {
    if (productParam) {
      setFormData((prev) => ({
        ...prev,
        subject: "استعلام قیمت",
        message:
          prev.message ||
          `درخواست استعلام قیمت، شرایط تحویل و مشخصات فنی برای محصول: ${productParam}`,
      }));
    }
  }, [productParam]);

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const honeypotRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setFormData({
      fullName: "",
      company: "",
      phone: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (honeypotRef.current?.value) {
      setStatus("success");
      resetForm();
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch(`${PAYLOAD_API_URL}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.errors?.[0]?.message || "خطا در ارسال پیام");
      }

      setStatus("success");
      resetForm();
    } catch (err: unknown) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "خطایی رخ داد. لطفاً دوباره تلاش کنید.");
    }
  };

  return (
    <section
      className="w-full max-w-full overflow-x-hidden py-12 md:py-16 bg-gray-50"
      dir="rtl"
      aria-labelledby="contact-form-heading"
    >
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
        <div className="text-center mb-10 md:mb-12">
          <span className="text-[#c49a2c] text-xs md:text-sm font-bold uppercase tracking-widest">
            با ما در ارتباط باشید
          </span>

          <h2
            id="contact-form-heading"
            className="text-2xl md:text-4xl font-extrabold text-[#0a1628] mt-3"
          >
            ارسال پیام
          </h2>

          <p className="text-gray-600 mt-4 text-sm md:text-base leading-relaxed">
            برای استعلام قیمت، مشاوره فنی و یا هرگونه سوال با ما تماس بگیرید
          </p>
        </div>

        {status === "success" ? (
          <div
            className="w-full max-w-full bg-green-50 border border-green-200 rounded-2xl p-5 sm:p-8 text-center"
            role="alert"
          >
            <CheckCircle size={48} className="text-green-500 mx-auto mb-4" aria-hidden="true" />

            <h3 className="text-lg sm:text-xl font-bold text-green-800 mb-2">
              پیام شما با موفقیت ارسال شد
            </h3>

            <p className="text-green-600 text-sm sm:text-base leading-relaxed">
              کارشناسان ما در اسرع وقت با شما تماس خواهند گرفت.
            </p>

            <button
              type="button"
              onClick={() => setStatus("idle")}
              className="mt-6 bg-[#c49a2c] text-black px-6 py-2 rounded-lg font-bold hover:bg-[#d4a82c] transition-colors"
            >
              ارسال پیام جدید
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="relative w-full max-w-full min-w-0 bg-white rounded-2xl p-4 sm:p-6 md:p-8 border border-gray-100 shadow-sm overflow-hidden"
            noValidate
          >
            <div className="sr-only" aria-hidden="true">
              <label htmlFor="website">وب‌سایت</label>
              <input
                ref={honeypotRef}
                type="text"
                id="website"
                name="website"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <div className="grid w-full min-w-0 grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="min-w-0">
                <label htmlFor="fullName" className="block text-sm font-bold text-gray-700 mb-2">
                  نام و نام خانوادگی <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  autoComplete="name"
                  className="block w-full max-w-full min-w-0 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#c49a2c] transition-colors"
                  placeholder="نام کامل شما"
                />
              </div>

              <div className="min-w-0">
                <label htmlFor="company" className="block text-sm font-bold text-gray-700 mb-2">
                  نام شرکت / سازمان
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  autoComplete="organization"
                  className="block w-full max-w-full min-w-0 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#c49a2c] transition-colors"
                  placeholder="نام شرکت شما"
                />
              </div>

              <div className="min-w-0">
                <label htmlFor="phone" className="block text-sm font-bold text-gray-700 mb-2">
                  شماره تماس <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  inputMode="tel"
                  autoComplete="tel"
                  className="block w-full max-w-full min-w-0 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#c49a2c] transition-colors"
                  placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                  dir="ltr"
                />
              </div>

              <div className="min-w-0">
                <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">
                  ایمیل
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  className="block w-full max-w-full min-w-0 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#c49a2c] transition-colors"
                  placeholder="email@example.com"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="mb-4 min-w-0">
              <label htmlFor="subject" className="block text-sm font-bold text-gray-700 mb-2">
                موضوع <span className="text-red-500">*</span>
              </label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="block w-full max-w-full min-w-0 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#c49a2c] transition-colors bg-white"
              >
                {SUBJECTS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6 min-w-0">
              <label htmlFor="message" className="block text-sm font-bold text-gray-700 mb-2">
                متن پیام <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="block w-full max-w-full min-w-0 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#c49a2c] transition-colors resize-none"
                placeholder="توضیحات خود را بنویسید..."
              />
            </div>

            {status === "error" && (
              <div
                className="flex min-w-0 items-start gap-2 text-red-600 bg-red-50 p-3 rounded-lg mb-4"
                role="alert"
              >
                <AlertCircle size={18} className="shrink-0 mt-0.5" aria-hidden="true" />
                <span className="min-w-0 break-words text-sm">{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full max-w-full flex items-center justify-center gap-2 bg-[#c49a2c] hover:bg-[#d4a82c] text-black px-5 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg transition-all hover:shadow-lg disabled:opacity-50"
              aria-label="ارسال فرم تماس"
            >
              {status === "loading" ? (
                <span className="animate-pulse">در حال ارسال...</span>
              ) : (
                <>
                  <Send size={20} aria-hidden="true" />
                  <span>ارسال پیام</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}