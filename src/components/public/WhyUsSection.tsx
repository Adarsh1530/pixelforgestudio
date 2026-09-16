"use client";

import { motion } from "framer-motion";
import { Wrench, Layout, Layers, Headset } from "lucide-react";

export default function WhyUsSection() {
  const pillars = [
    {
      title: "CUSTOM SOLUTIONS",
      desc: "Built according to the project's specific workflow and exact requirements.",
      icon: Wrench,
    },
    {
      title: "MODERN DESIGN",
      desc: "Clean, responsive and user-focused interfaces tailored for high conversion.",
      icon: Layout,
    },
    {
      title: "SCALABLE DEVELOPMENT",
      desc: "Technology structured cleanly to support future growth and improvements.",
      icon: Layers,
    },
    {
      title: "DIRECT SUPPORT",
      desc: "Clear, responsive communication throughout every phase of the project.",
      icon: Headset,
    },
  ];

  return (
    <section id="why-us" className="py-24 bg-[#1C2833] text-[#F4F6F6] border-b border-[#2E4053] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column Description */}
          <div className="lg:col-span-5">
            <span className="text-xs font-bold uppercase tracking-widest text-[#AAB7B8] bg-[#2E4053] px-3 py-1 rounded-full border border-[#D5DBDB]/10">
              WHY CHOOSE US
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F4F6F6] tracking-tight mt-4 mb-6">
              Built Around Your Ideas
            </h2>
            <p className="text-sm sm:text-base text-[#AAB7B8] leading-relaxed mb-6">
              From a simple concept to a complete digital product, PixelForge Studio combines design, development, branding and technology to turn ideas into practical digital solutions.
            </p>
            <div className="p-4 rounded-xl bg-[#2E4053]/50 border border-[#D5DBDB]/15">
              <span className="text-xs font-mono text-[#D5DBDB] block font-semibold mb-1">
                OUR PROMISE
              </span>
              <p className="text-xs text-[#AAB7B8]">
                Quality work delivered on schedule with full support from start to finish.
              </p>
            </div>
          </div>

          {/* Right Column 4 Pillars Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="bg-[#2E4053]/40 p-6 rounded-2xl border border-[#D5DBDB]/15 hover:border-[#AAB7B8] transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#1C2833] text-[#F4F6F6] flex items-center justify-center mb-4 shadow-sm border border-[#D5DBDB]/10">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-extrabold text-[#F4F6F6] tracking-wide mb-2 uppercase">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-[#AAB7B8] leading-relaxed">
                    {pillar.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
