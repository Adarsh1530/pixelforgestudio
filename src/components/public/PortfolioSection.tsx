"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, Layers } from "lucide-react";

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

                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    key={project.id}
                    className="bg-[#1C2833] text-[#F4F6F6] rounded-2xl overflow-hidden border border-[#2E4053] shadow-lg flex flex-col justify-between group"
                  >
                    <div>
                      {/* Image Container */}
                      <div className="relative h-48 w-full bg-[#2E4053] overflow-hidden">
                        <Image
                          src={project.image || "/images/logo.jpg"}
                          alt={project.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 bg-[#1C2833]/90 text-[#F4F6F6] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border border-[#D5DBDB]/20">
                          {project.category}
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
                          <ExternalLink className="w-3.5 h-3.5" />
                          View Project
                        </a>
                      ) : (
                        <span className="text-[10px] text-[#AAB7B8]">Internal System</span>
                      )}

                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#AAB7B8] hover:text-[#F4F6F6] transition-colors"
                        >
                          <Github className="w-3.5 h-3.5" />
                          Source
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
    </section>
  );
}
