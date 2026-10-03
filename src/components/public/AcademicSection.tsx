"use client";

import { motion } from "framer-motion";
import { Check, GraduationCap, MessageSquare } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export interface AcademicPackageItem {
  id: string;
  category: string; // "BCA" | "MCA"
  projectType: string; // "Minor Project" | "Major Project"
  price: number;
  description: string;
  features: string; // JSON string array
}

interface AcademicSectionProps {
  packages: AcademicPackageItem[];
  whatsappNumber?: string;
}

export default function AcademicSection({
  packages,
  whatsappNumber = "+91 87789 79416",
}: AcademicSectionProps) {
  const cleanWhatsapp = whatsappNumber.replace(/[^0-9]/g, "");

  const bcaPackages = packages.filter((p) => p.category === "BCA");
  const mcaPackages = packages.filter((p) => p.category === "MCA");

  const parseFeatures = (featuresStr: string): string[] => {
    try {
      return JSON.parse(featuresStr);
    } catch {
      return [
        "PPT Presentation",
        "Documentation Report",
        "Source Code (GitHub / ZIP)",
        "Implementation Guide",
        "Training (Live / Online)",
      ];
    }
  };

  return (
    <section id="academic" className="py-24 bg-[#1C2833] text-[#F4F6F6] border-b border-[#2E4053] relative overflow-hidden">
      {/* Background Accent Lines */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#2E4053] border border-[#D5DBDB]/15 mb-3">
            <GraduationCap className="w-4 h-4 text-[#AAB7B8]" />
            <span className="text-xs font-semibold uppercase tracking-widest text-[#D5DBDB]">
              STUDENT SOLUTIONS
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F4F6F6] tracking-tight mb-4">
            Academic Project Packages
          </h2>
          <p className="text-base text-[#AAB7B8]">
            Project development support for BCA and MCA students.
          </p>
        </div>

        {/* BCA & MCA Group Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* BCA Category Block */}
          <div className="bg-[#2E4053]/40 rounded-3xl p-6 sm:p-8 border border-[#D5DBDB]/15 backdrop-blur-sm">
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#D5DBDB]/10">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-[#AAB7B8]">Degree Stream</span>
                <h3 className="text-2xl font-black text-[#F4F6F6] tracking-tight">BCA Packages</h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#1C2833] text-xs font-bold text-[#D5DBDB] border border-[#D5DBDB]/20">
                Bachelor Level
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {bcaPackages.map((pkg, idx) => {
                const featuresList = parseFeatures(pkg.features);
                const pkgTitle = `${pkg.category} ${pkg.projectType}`;
                const waMessage = `Hello PixelForge Studio, I am interested in the ${pkgTitle} package priced at ${formatCurrency(pkg.price)}.`;

                return (
                  <motion.div
                    key={pkg.id || idx}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-[#1C2833] rounded-2xl p-6 border border-[#2E4053] hover:border-[#AAB7B8] transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-xs font-semibold uppercase text-[#AAB7B8] tracking-wider">
                          {pkg.projectType}
                        </span>
                      </div>

                      <div className="mb-4">
                        <span className="text-3xl font-extrabold text-[#F4F6F6]">
                          {formatCurrency(pkg.price)}
                        </span>
                      </div>

                      <p className="text-xs text-[#AAB7B8] mb-6 leading-relaxed">
                        {pkg.description}
                      </p>

                      <ul className="space-y-2.5 mb-6 border-t border-[#2E4053] pt-4">
                        {featuresList.map((feat, i) => (
                          <li key={i} className="flex items-center gap-2 text-xs text-[#D5DBDB]">
                            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-4 border-t border-[#2E4053]">
                      <div className="flex flex-col gap-2 w-full">
                        <a
                          href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(waMessage)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold text-[#1C2833] bg-[#F4F6F6] hover:bg-[#D5DBDB] rounded-lg transition-all shadow-sm"
                        >
                          <MessageSquare className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                          <span>Enquire Project</span>
                        </a>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* MCA Category Block */}
          <div className="bg-[#2E4053]/40 rounded-3xl p-6 sm:p-8 border border-[#D5DBDB]/15 backdrop-blur-sm">
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#D5DBDB]/10">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-[#AAB7B8]">Degree Stream</span>
                <h3 className="text-2xl font-black text-[#F4F6F6] tracking-tight">MCA Packages</h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#1C2833] text-xs font-bold text-[#D5DBDB] border border-[#D5DBDB]/20">
                Master Level
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mcaPackages.map((pkg, idx) => {
                const featuresList = parseFeatures(pkg.features);
                const pkgTitle = `${pkg.category} ${pkg.projectType}`;
                const waMessage = `Hello PixelForge Studio, I am interested in the ${pkgTitle} package priced at ${formatCurrency(pkg.price)}.`;

                return (
                  <motion.div
                    key={pkg.id || idx}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-[#1C2833] rounded-2xl p-6 border border-[#2E4053] hover:border-[#AAB7B8] transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-xs font-semibold uppercase text-[#AAB7B8] tracking-wider">
                          {pkg.projectType}
                        </span>
                      </div>

                      <div className="mb-4">
                        <span className="text-3xl font-extrabold text-[#F4F6F6]">
                          {formatCurrency(pkg.price)}
                        </span>
                      </div>

                      <p className="text-xs text-[#AAB7B8] mb-6 leading-relaxed">
                        {pkg.description}
                      </p>

                      <ul className="space-y-2.5 mb-6 border-t border-[#2E4053] pt-4">
                        {featuresList.map((feat, i) => (
                          <li key={i} className="flex items-center gap-2 text-xs text-[#D5DBDB]">
                            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-4 border-t border-[#2E4053]">
                      <div className="flex flex-col gap-2 w-full">
                        <a
                          href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(waMessage)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold text-[#1C2833] bg-[#F4F6F6] hover:bg-[#D5DBDB] rounded-lg transition-all shadow-sm"
                        >
                          <MessageSquare className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                          <span>Enquire Project</span>
                        </a>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
