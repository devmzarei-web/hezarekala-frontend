import type { Metadata } from "next";
import { getSettings, getPage } from "@/lib/payload";
import { SITE_URL, PAYLOAD_API_URL } from "@/lib/env";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import BreadcrumbSchema from "@/components/ui/BreadcrumbSchema";
import { getMediaUrl } from "@/lib/media";
import { Building2, MapPin, Calendar } from "lucide-react";

export const revalidate = 60;

interface Project {
  id: string;
  title: string;
  slug: string;
  client?: string;
  location?: string;
  completionDate?: string;
  description?: string;
  featuredImage?: { url?: string; alt?: string } | string;
  isFeatured?: boolean;
  order?: number;
}

async function getProjects(): Promise<Project[]> {
  try {
    const res = await fetch(`${PAYLOAD_API_URL}/projects?sort=-order&limit=50`, {
      signal: AbortSignal.timeout(3000),
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.docs ?? [];
  } catch {
    return [];
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("projects");
  return {
    title: page?.metaTitle || page?.title || "پروژه‌ها | هزاره کالا",
    description:
      page?.metaDescription ||
      page?.excerpt ||
      "نمونه پروژه‌های انجام شده توسط شرکت هزاره کالا دانش اروند - طراحی و ساخت پمپ‌های صنعتی برای صنایع نفت، گاز و پتروشیمی.",
    alternates: { canonical: `${SITE_URL}/projects` },
    openGraph: {
      title: page?.metaTitle || page?.title || "پروژه‌ها | هزاره کالا",
      description: page?.metaDescription || page?.excerpt || "",
      images: page?.heroImage ? [{ url: getMediaUrl(page.heroImage) }] : [],
    },
  };
}

export default async function ProjectsPage() {
  const [settings, page, projects] = await Promise.all([
    getSettings(),
    getPage("projects"),
    getProjects(),
  ]);

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "خانه", url: SITE_URL },
          { name: page?.title || "پروژه‌ها", url: `${SITE_URL}/projects` },
        ]}
      />

      <main className="min-h-screen bg-white" dir="rtl">
        <Header settings={settings} />

        <PageHero
          title={page?.title || "پروژه‌های انجام شده"}
          subtitle={page?.subtitle || "نمونه کارها"}
          excerpt={page?.excerpt || ""}
          image={page?.heroImage}
          breadcrumb={[{ label: "خانه", href: "/" }, { label: page?.title || "پروژه‌ها" }]}
        />

        {/* Projects Grid */}
        <section className="py-16 md:py-20 bg-white">
          <div className="w-full px-6 md:px-12 lg:px-16">
            {projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project: any) => (
                  <article
                    key={project.id}
                    className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-[#c49a2c]/20 transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="relative aspect-[16/9] bg-gray-100 overflow-hidden">
                      <img
                        src={getMediaUrl(project.featuredImage)}
                        alt={
                          project.featuredImage &&
                          typeof project.featuredImage === "object" &&
                          "alt" in project.featuredImage
                            ? project.featuredImage.alt || project.title
                            : project.title
                        }
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="card-title text-lg text-white line-clamp-1">
                          {project.title}
                        </h3>
                      </div>
                    </div>
                    <div className="p-5 space-y-2">
                      {project.client && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Building2 size={14} className="text-[#c49a2c] shrink-0" />
                          <span>کارفرما: {project.client}</span>
                        </div>
                      )}
                      {project.location && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <MapPin size={14} className="text-[#c49a2c] shrink-0" />
                          <span>{project.location}</span>
                        </div>
                      )}
                      {project.completionDate && (
  <div className="flex items-center gap-2 text-sm text-gray-500">
    <Calendar size={14} className="text-[#c49a2c] shrink-0" />
    <span>{project.completionDate}</span>
  </div>
)}
                      {project.description && (
                        <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
                          {project.description}
                        </p>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-400 text-lg">پروژه‌ای برای نمایش وجود ندارد</p>
              </div>
            )}
          </div>
        </section>

        <Footer settings={settings} />
      </main>
    </>
  );
}