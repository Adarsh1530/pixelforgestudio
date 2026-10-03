"use client";

import { motion } from "framer-motion";
import { Presentation, FileText, Code2, BookOpen, Video } from "lucide-react";

export default function PerksSection() {
  const perks = [
    {
      title: "PPT",
      subtitle: "Presentation",
      desc: "Comprehensive slide deck designed for academic project presentations & viva evaluation.",
      icon: Presentation,
    },
    {
      title: "Documentation",
      subtitle: "Report",
      desc: "Complete SRS & IEEE standard project report formatted for submission.",
      icon: FileText,
    },
    {
      title: "Source Code",
      subtitle: "GitHub / ZIP",
      desc: "Clean, well-structured, modular source code with full repository access.",
      icon: Code2,
    },
    {
      title: "Implementation",
      subtitle: "Guide",
      desc: "Step-by-step setup documentation for database configuration and server launch.",
      icon: BookOpen,
    },
    {
      title: "Training",
      subtitle: "Live / Online",
      desc: "Interactive live code walkthroughs and viva preparation sessions.",
      icon: Video,
    },
  ];

  return (
    <section className="py-20 bg-[#2E4053] text-[#F4F6F6] border-b border-[#1C2833]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D5DBDB] bg-[#1C2833] px-3.5 py-1 rounded-full border border-[#D5DBDB]/15">
            ALL PACKAGES INCLUDE
          </span>
          <h2 className="text-3xl font-extrabold text-[#F4F6F6] tracking-tight mt-3 mb-2">
            Everything You Need
          </h2>
          <p className="text-sm text-[#D5DBDB]/90">
            Complete end-to-end deliverables included in every academic project package.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {perks.map((perk, idx) => {
            const Icon = perk.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="bg-[#1C2833] text-[#F4F6F6] rounded-2xl p-6 border border-[#D5DBDB]/15 hover:border-[#AAB7B8] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#2E4053] text-[#D5DBDB] flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-[#F4F6F6] leading-snug">
                    {perk.title}
                  </h3>
                  <p className="text-xs font-semibold text-[#AAB7B8] mb-3 uppercase tracking-wide">
                    {perk.subtitle}
                  </p>
                  <p className="text-xs text-[#AAB7B8] leading-relaxed">
                    {perk.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
