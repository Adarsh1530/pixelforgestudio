"use client";

import { motion } from "framer-motion";
import { Check, Building2, ShoppingBag, School, Cpu, MessageSquare, Sparkles } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface BusinessSolutionsProps {
  startingPrice?: number;
  whatsappNumber?: string;
}

export default function BusinessSolutionsSection({
  startingPrice = 15000,
  whatsappNumber = "+91 87789 79416",
}: BusinessSolutionsProps) {
  const cleanWhatsapp = whatsappNumber.replace(/[^0-9]/g, "");

  const businessSolutions = [
    {
      id: "biz-website",
      icon: Building2,
      category: "Shops & Businesses",
      title: "Business & Shop Websites",
      price: startingPrice,
      badge: "Starting Price",
      description: "Custom responsive websites for local shops, retail businesses, and corporate brands.",
      features: [
        "High-Conversion Modern UI/UX",
        "Google Maps & Direct WhatsApp Lead Action",
        "SEO Optimization & Fast Page Loading",
        "Contact & Lead Enquiry Forms",
        "Domain & Cloud Hosting Guidance",
      ],
    },
    {
      id: "ecommerce-store",
      icon: ShoppingBag,
      category: "E-Commerce & Retail",
      title: "Online Store & E-Commerce",
      price: 25000,
      badge: "Full Setup",
      description: "Complete online store with product catalog, cart, and payment gateway integration.",
      features: [
        "Product Management & Inventory System",
        "Secure Payment Gateway Integration",
        "Admin Dashboard for Orders & Sales",
        "Customer Account & Order Tracking",
        "Automated Order Notifications",
      ],
    },
    {
      id: "school-institute",
      icon: School,
      category: "Schools & Academies",
      title: "School & Institution Software",
      price: 35000,
      badge: "Custom System",
      description: "Tailored management portals for schools, colleges, and coaching centers.",
      features: [
        "Student & Staff Information Management",
        "Fee Collection & Automated Billing",
        "Attendance & Marks Reporting System",
        "Notice Board & Parent Communication",
        "Role-Based Access Control",
      ],
    },
    {
      id: "crm-ai-enterprise",
      icon: Cpu,
      category: "Enterprise & Marketing",
      title: "Custom CRM & AI Solutions",
      price: 50000,
      badge: "Enterprise Grade",
      description: "Intelligent software, CRM platforms, and AI automation tailored to your exact workflow.",
      features: [
        "Custom Business Workflow Automation",
        "Lead Management & Customer CRM",
        "AI Chatbot & Intelligent Automation",
        "Real-time Analytics & Financial Reports",
        "Scalable Cloud Architecture",
      ],
    },
  ];

  return (
    <section id="business-solutions" className="py-24 bg-[#1C2833] text-[#F4F6F6] border-b border-[#2E4053] relative overflow-hidden">
      {/* Background Accent Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#2E4053] border border-[#D5DBDB]/15 mb-3">
            <Sparkles className="w-4 h-4 text-[#D5DBDB]" />
            <span className="text-xs font-semibold uppercase tracking-widest text-[#D5DBDB]">
              LIVE COMMERCIAL PROJECTS
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F4F6F6] tracking-tight mb-4">
            Professional Digital Solutions
          </h2>
          <p className="text-base text-[#AAB7B8] max-w-2xl mx-auto">
            Live custom software, web platforms, and management systems engineered for businesses, schools, shops, retail stores & marketing.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-xs font-bold text-emerald-300">
            Professional Live Solutions — Starting from {formatCurrency(startingPrice)}
          </div>
        </div>

        {/* 4 Commercial Solutions Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {businessSolutions.map((sol, idx) => {
            const Icon = sol.icon;
            const waMsg = `Hello PixelForge Studio, I am interested in your ${sol.title} starting from ${formatCurrency(sol.price)}.`;

            return (
              <motion.div
                key={sol.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="bg-[#2E4053]/40 rounded-3xl p-6 border border-[#D5DBDB]/15 backdrop-blur-sm flex flex-col justify-between hover:border-[#AAB7B8] transition-all group"
              >
                <div>
                  {/* Category & Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#1C2833] text-[#F4F6F6] flex items-center justify-center border border-[#D5DBDB]/15">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#1C2833] text-[#D5DBDB] border border-[#D5DBDB]/20">
                      {sol.badge}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#AAB7B8] block mb-1">
                    {sol.category}
                  </span>

                  <h3 className="text-lg font-bold text-[#F4F6F6] mb-2 group-hover:text-[#D5DBDB] transition-colors">
                    {sol.title}
                  </h3>

                  <div className="mb-4">
                    <span className="text-2xl font-black text-[#F4F6F6]">
                      {formatCurrency(sol.price)}
                    </span>
                    <span className="text-xs text-[#AAB7B8] font-normal"> / project</span>
                  </div>

                  <p className="text-xs text-[#AAB7B8] mb-6 leading-relaxed">
                    {sol.description}
                  </p>

                  {/* Feature Checklist */}
                  <ul className="space-y-2.5 mb-6 border-t border-[#D5DBDB]/10 pt-4">
                    {sol.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-[#D5DBDB]">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-[#D5DBDB]/10">
                  <div className="flex flex-col gap-2 w-full">
                    <a
                      href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(waMsg)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold text-[#1C2833] bg-[#F4F6F6] hover:bg-[#D5DBDB] rounded-xl transition-all shadow-sm"
                    >
                      <MessageSquare className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                      <span>Enquire Solution</span>
                    </a>
                  </div>
                </div>

              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
