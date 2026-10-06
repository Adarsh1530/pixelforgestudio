"use client";

import { motion } from "framer-motion";
import { MessageSquare, Compass, Palette, Code2, Rocket } from "lucide-react";

export default function ProcessSection() {
  const steps = [
    {
      num: "01",
      title: "Discuss",
      desc: "Understand the idea, requirements and objectives.",
      icon: MessageSquare,
    },
    {
      num: "02",
      title: "Plan",
      desc: "Define features, technology, design and project scope.",
      icon: Compass,
    },
    {
      num: "03",
      title: "Design",
      desc: "Create the UI/UX and visual direction.",
      icon: Palette,
    },
    {
      num: "04",
      title: "Develop",
      desc: "Build, test and refine the solution.",
      icon: Code2,
    },
    {
      num: "05",
      title: "Deliver",
      desc: "Provide the final solution, documentation, source code and guidance where applicable.",
      icon: Rocket,
    },
  ];

  return (
    <section id="process" className="py-24 bg-[#2E4053] text-[#F4F6F6] border-b border-[#1C2833] relative overflow-hidden scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D5DBDB] bg-[#1C2833]/60 px-3 py-1 rounded-full border border-[#D5DBDB]/10">
            OUR METHODOLOGY
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F4F6F6] tracking-tight mt-3 mb-3">
            How We Work
          </h2>
          <p className="text-sm text-[#AAB7B8]">
            A transparent, disciplined 5-step engineering process from initial concept to launch.
          </p>
        </div>

        {/* 5 Step Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative bg-[#1C2833] rounded-2xl p-6 border border-[#D5DBDB]/15 shadow-xl flex flex-col justify-between group hover:border-[#AAB7B8] transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl font-black text-[#AAB7B8]/40 font-mono group-hover:text-[#D5DBDB] transition-colors">
                      {step.num}
                    </span>
                    <div className="w-9 h-9 rounded-lg bg-[#2E4053] text-[#F4F6F6] flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-[#F4F6F6] mb-2">
                    {step.title}
                  </h3>

                  <p className="text-xs text-[#AAB7B8] leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-[#2E4053]">
                  <span className="text-[10px] font-mono text-[#AAB7B8] uppercase tracking-wider">
                    Step {step.num} of 05
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
