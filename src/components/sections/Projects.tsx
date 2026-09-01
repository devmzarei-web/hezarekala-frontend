"use client";

import { motion } from "framer-motion";
import { Building2, MapPin, Calendar } from "lucide-react";
import { getMediaUrl } from "@/lib/media";

interface Project {
  id: string; title: string; slug: string;
  client?: string; location?: string; completionDate?: string; description?: string;
  featuredImage?: { url?: string; alt?: string; filename?: string } | string;
}

interface ProjectsProps {
  projects: Project[];
}

export default function Projects({ projects }: ProjectsProps) {
  return (
    <section className="relative py-16 md:py-24 bg-white overflow-hidden" aria-labelledby="projects-heading">
      <div className="relative z-10 w-full px-4 md:px-8 lg:px-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 md:mb-14"
        >
          <span className="text-[#c49a2c] text-xs md:text-sm font-bold uppercase tracking-widest">
            نمونه کارها
          </span>
          <h2 id="projects-heading" className="section-title section-title-light text-3xl md:text-5xl lg:text-6xl text-[#0a1628] mt-3 md:mt-4 mb-4 md:mb-6">
            پروژه‌های انجام شده
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-sm md:text-lg">
            افتخار همکاری با بزرگترین صنایع کشور
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {projects.map((project, index) => (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="flex flex-col h-full bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-[#c49a2c]/20 transition-all duration-300 hover:-translate-y-1">
                <div className="relative aspect-[16/9] bg-gray-100 overflow-hidden">
                  <img
                    src={getMediaUrl(project.featuredImage)} alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                    <h3 className="card-title text-sm md:text-lg text-white line-clamp-1">
                      {project.title}
                    </h3>
                  </div>
                </div>
                <div className="p-3 md:p-5 flex flex-col flex-1 space-y-1.5 md:space-y-2">
                  {project.client && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Building2 size={12} className="text-[#c49a2c] shrink-0" />
                      <span>کارفرما: {project.client}</span>
                    </div>
                  )}
                  {project.location && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <MapPin size={12} className="text-[#c49a2c] shrink-0" />
                      <span>{project.location}</span>
                    </div>
                  )}
                  {project.completionDate && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Calendar size={12} className="text-[#c49a2c] shrink-0" />
                      <span>{project.completionDate}</span>
                    </div>
                  )}
                  {project.description && (
                    <p className="text-gray-500 text-xs md:text-sm leading-relaxed line-clamp-2 flex-1">
                      {project.description}
                    </p>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-10 md:py-16">
            <p className="text-gray-500 text-base">پروژه‌ای برای نمایش وجود ندارد</p>
          </div>
        )}
      </div>
    </section>
  );
}