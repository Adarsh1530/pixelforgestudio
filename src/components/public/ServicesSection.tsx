"use client";

import { motion } from "framer-motion";
import {
  Globe,
  ShoppingCart,
  Smartphone,
  Code,
  Database,
  Cpu,
  ArrowUpRight,
} from "lucide-react";

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface ServicesSectionProps {
  services: ServiceItem[];
}

const iconMap: Record<string, React.ElementType> = {
  Globe,
  ShoppingCart,
  Smartphone,
  Code,
  Database,
  Cpu,
};

export default function ServicesSection({ services }: ServicesSectionProps) {
  return (
    <section id="services" className="py-24 bg-[#F4F6F6] text-[#1C2833] border-b border-[#D5DBDB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#2E4053] bg-[#D5DBDB]/50 px-3 py-1 rounded-full">
            WHAT WE BUILD
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1C2833] tracking-tight mt-3 mb-4">
            Professional Digital Solutions
          </h2>
          <p className="text-base text-[#2E4053]/80">
            Technology, design and digital solutions built around your ideas.
          </p>
        </div>

        {/* 6 Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = iconMap[service.icon] || Code;

            return (
              <motion.div
                key={service.id || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="group relative bg-[#1C2833] text-[#F4F6F6] p-8 rounded-2xl border border-[#2E4053] shadow-lg hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-[#2E4053] text-[#F4F6F6] flex items-center justify-center mb-6 group-hover:bg-[#F4F6F6] group-hover:text-[#1C2833] transition-all duration-300 shadow-sm">
                    <IconComponent className="w-6 h-6" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold mb-3 text-[#F4F6F6] group-hover:text-[#D5DBDB] transition-colors">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-[#AAB7B8] leading-relaxed mb-6">
                    {service.description}
                  </p>
                </div>

                {/* Card Footer Action */}
                <a
                  href={`#contact?service=${encodeURIComponent(service.title)}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#D5DBDB] group-hover:text-[#F4F6F6] transition-colors pt-4 border-t border-[#2E4053]"
                >
                  Explore Service
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
