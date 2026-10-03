"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, Layers, Maximize2, X, ZoomIn } from "lucide-react";

export interface PortfolioProjectItem {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  technologies: string;
  projectUrl?: string | null;
  githubUrl?: string | null;
  featured?: boolean;
  published?: boolean;
}

interface PortfolioSectionProps {
  projects: PortfolioProjectItem[];
}

export default function PortfolioSection({ projects }: PortfolioSectionProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [previewImage, setPreviewImage] = useState<{
    url: string;
    title: string;
    category: string;
  } | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPreviewImage(null);
    };
    if (previewImage) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [previewImage]);

  const categories = ["All", "Websites", "E-Commerce", "Applications", "Software", "UI/UX", "Branding", "Academic"];

  const publishedProjects = projects.filter((p) => p.published !== false);

  const filteredProjects =
    activeCategory === "All"
      ? publishedProjects
      : publishedProjects.filter(
          (p) => p.category.toLowerCase() === activeCategory.toLowerCase()
        );

  return (
    <section id="portfolio" className="py-24 bg-[#2E4053] text-[#F4F6F6] border-b border-[#1C2833]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D5DBDB] bg-[#1C2833] px-3.5 py-1 rounded-full border border-[#D5DBDB]/15">
            PORTFOLIO SHOWCASE
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F4F6F6] tracking-tight mt-3 mb-4">
            WORKS &amp; PROJECTS
          </h2>
          <p className="text-base text-[#D5DBDB]/90">
            A selection of websites, software, and digital solutions developed for businesses, organizations, and academic projects.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-[#1C2833] text-[#F4F6F6] shadow-md border border-[#D5DBDB]/30"
                  : "bg-[#1C2833]/50 text-[#D5DBDB] hover:bg-[#1C2833] hover:text-[#F4F6F6] border border-[#D5DBDB]/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Portfolio Projects Grid or Clean Empty State */}
        {filteredProjects.length === 0 ? (
          <div className="bg-[#1C2833] text-[#F4F6F6] rounded-3xl p-12 text-center max-w-xl mx-auto border border-[#2E4053] shadow-lg">
            <div className="w-12 h-12 rounded-2xl bg-[#2E4053] text-[#AAB7B8] flex items-center justify-center mx-auto mb-4">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-[#F4F6F6]">
              Selected Work Showcase Updating
            </h3>
            <p className="text-xs text-[#AAB7B8] max-w-sm mx-auto leading-relaxed">
              Our recent client projects and academic case studies are currently being cataloged. Check back soon or contact us to view live client demos.
            </p>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredProjects.map((project) => {
                const techList = project.technologies
                  ? project.technologies.split(",").map((t) => t.trim())
                  : [];

                const imgUrl = project.image || "/images/logo.jpg";

                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    key={project.id}
                    className="bg-[#1C2833] text-[#F4F6F6] rounded-2xl overflow-hidden border border-[#D5DBDB]/15 shadow-xl flex flex-col justify-between group hover:border-[#AAB7B8] transition-all"
                  >
                    <div>
                      {/* Interactive Full Size Image Container */}
                      <div
                        onClick={() =>
                          setPreviewImage({
                            url: imgUrl,
                            title: project.title,
                            category: project.category,
                          })
                        }
                        className="relative aspect-[16/10] w-full bg-[#1C2833] overflow-hidden cursor-pointer"
                        title="Click to view full size image"
                      >
                        <Image
                          src={imgUrl}
                          alt={project.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 bg-[#1C2833]/90 text-[#F4F6F6] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border border-[#D5DBDB]/20 z-10">
                          {project.category}
                        </div>

                        {/* Hover Overlay with Expand Hint */}
                        <div className="absolute inset-0 bg-[#1C2833]/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-xs font-bold text-[#F4F6F6] backdrop-blur-[2px]">
                          <Maximize2 className="w-4 h-4 text-emerald-400" />
                          <span>View Full Image</span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <h3 className="text-lg font-bold text-[#F4F6F6] mb-2 group-hover:text-[#D5DBDB] transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-xs text-[#AAB7B8] leading-relaxed mb-4 line-clamp-3">
                          {project.description}
                        </p>

                        {/* Tech Tags */}
                        {techList.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {techList.map((tech, i) => (
                              <span
                                key={i}
                                className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#2E4053] text-[#D5DBDB]"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Links */}
                    <div className="p-6 pt-0 border-t border-[#2E4053] flex items-center justify-between gap-3 mt-4">
                      {project.projectUrl ? (
                        <a
                          href={project.projectUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#F4F6F6] hover:text-[#D5DBDB] transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                          <span>View Project</span>
                        </a>
                      ) : (
                        <span className="text-[10px] text-[#AAB7B8]">Internal System</span>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          setPreviewImage({
                            url: imgUrl,
                            title: project.title,
                            category: project.category,
                          })
                        }
                        className="inline-flex items-center gap-1 text-xs text-[#AAB7B8] hover:text-[#F4F6F6] transition-colors"
                      >
                        <ZoomIn className="w-3.5 h-3.5" />
                        <span>Full Size</span>
                      </button>

                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#AAB7B8] hover:text-[#F4F6F6] transition-colors"
                        >
                          <Github className="w-3.5 h-3.5" />
                          <span>Source</span>
                        </a>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}

      </div>

      {/* Full Size Image Lightbox Modal */}
      <AnimatePresence>
        {previewImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewImage(null)}
              className="fixed inset-0 bg-[#1C2833]/90 backdrop-blur-md"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-5xl bg-[#1C2833] border border-[#D5DBDB]/20 rounded-2xl overflow-hidden shadow-2xl z-10 flex flex-col max-h-[92vh]"
            >
              {/* Top Modal Header */}
              <div className="flex items-center justify-between p-4 border-b border-[#2E4053] bg-[#1C2833]/80">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#AAB7B8] block">
                    {previewImage.category}
                  </span>
                  <h4 className="text-sm sm:text-base font-bold text-[#F4F6F6]">
                    {previewImage.title}
                  </h4>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={previewImage.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-[#2E4053] text-[#D5DBDB] hover:text-[#F4F6F6] transition-colors text-xs font-semibold inline-flex items-center gap-1.5"
                    title="Open original file in new tab"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Open Original</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setPreviewImage(null)}
                    aria-label="Close image preview"
                    className="p-2 rounded-xl bg-[#2E4053] text-[#AAB7B8] hover:text-[#F4F6F6] transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Scrollable / Full Size Image View */}
              <div className="p-4 sm:p-6 overflow-y-auto flex items-center justify-center bg-[#151D24]">
                <img
                  src={previewImage.url}
                  alt={previewImage.title}
                  className="max-h-[75vh] w-auto max-w-full object-contain rounded-lg shadow-2xl border border-[#2E4053]"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
