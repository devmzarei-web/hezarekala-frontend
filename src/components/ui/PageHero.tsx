import Link from "next/link";
import { getMediaUrl } from "@/lib/media";
import type { Media } from "@/payload-types";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  excerpt?: string;
  image?: Media | string | null;
  breadcrumb?: { label: string; href?: string }[];
}

export default function PageHero({
  title,
  subtitle,
  excerpt,
  image,
  breadcrumb,
}: PageHeroProps) {
  const imageUrl = image ? getMediaUrl(image) : null;
  const imageAlt = image && typeof image === "object" && "alt" in image ? (image.alt as string) : title;

  return (
    <section
      className="relative min-h-[55vh] flex items-start pt-28 md:pt-36 pb-16 bg-cover bg-center"
      style={
        imageUrl
          ? {
              backgroundImage: `linear-gradient(
                to top,
                rgba(6, 15, 28, 0.9) 0%,
                rgba(6, 15, 28, 0.6) 40%,
                rgba(6, 15, 28, 0.25) 70%,
                rgba(6, 15, 28, 0.1) 100%
              ), url('${imageUrl}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }
          : {
              background: "linear-gradient(180deg, #0a1628 0%, #162033 100%)",
            }
      }
    >
      {/* Hidden image for SEO (background-image isn't indexed) */}
      {imageUrl && (
        <img src={imageUrl} alt={imageAlt} className="hidden" aria-hidden="true" />
      )}

      {/* Very subtle dot pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(196,154,44,0.5) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
        aria-hidden="true"
      />

      {/* Top accent line */}
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-l from-[#c49a2c] via-[#c49a2c]/50 to-transparent" aria-hidden="true" />

      <div className="relative w-full px-6 md:px-12 lg:px-16 max-w-5xl mx-auto">
        {/* Breadcrumb */}
        {breadcrumb && breadcrumb.length > 0 && (
          <nav className="mb-6" aria-label="مسیر صفحه">
            <ol className="inline-flex items-center gap-2 text-xs md:text-sm text-gray-400 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full border border-white/5 list-none p-0">
              {breadcrumb.map((item, index) => (
                <li key={index} className="flex items-center gap-2">
                  {item.href ? (
                    <Link href={item.href} className="hover:text-white transition-colors">
                      {item.label}
                    </Link>
                  ) : (
                    <span className="text-[#c49a2c] font-medium" aria-current="page">
                      {item.label}
                    </span>
                  )}
                  {index < breadcrumb.length - 1 && (
                    <span className="text-gray-500 text-xs" aria-hidden="true">
                      /
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        {/* Subtitle */}
        {subtitle && (
          <span className="inline-block text-[#c49a2c] text-xs md:text-sm font-bold uppercase tracking-[0.2em] mb-4 bg-[#c49a2c]/10 px-4 py-1.5 rounded-full">
            {subtitle}
          </span>
        )}

        {/* Title */}
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-black text-white leading-tight mb-4 max-w-3xl">
          {title}
        </h1>

        {/* Excerpt */}
        {excerpt && (
          <p className="text-sm md:text-base text-gray-300/80 leading-relaxed max-w-xl">
            {excerpt}
          </p>
        )}
      </div>
    </section>
  );
}