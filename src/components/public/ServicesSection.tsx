"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  ShoppingCart,
  Smartphone,
  Code,
  Database,
  Cpu,
  ArrowUpRight,
  MessageSquare,
  X,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface ServicesSectionProps {
  services: ServiceItem[];
  whatsappNumber?: string;
}

const iconMap: Record<string, React.ElementType> = {
  Globe,
  ShoppingCart,
  Smartphone,
  Code,
  Database,
  Cpu,
};

const serviceDetailsData: Record<
  string,
  {
    tagline: string;
    timeline: string;
    deliverables: string[];
    techStack: string[];
  }
> = {
  "Business Websites": {
    tagline:
      "High-conversion corporate and storefront websites designed to establish brand authority and convert visitors into high-value leads.",
    timeline: "5 – 10 Business Days",
    deliverables: [
      "Custom responsive design for desktop, tablet, and mobile",
      "Fast page load speed with modern SEO architecture",
      "Direct WhatsApp lead capture & interactive contact form",
      "Google Business & Maps integration",
      "Domain setup, SSL certificate, and cloud hosting deployment",
      "Admin CMS training & 30 days post-launch support",
    ],
    techStack: ["Next.js", "Tailwind CSS", "TypeScript", "Vercel"],
  },
  "E-Commerce Websites": {
    tagline:
      "Scalable online retail platforms with instant checkout, payment gateways, and inventory control.",
    timeline: "2 – 3 Weeks",
    deliverables: [
      "Dynamic product catalog with variants, filters, and search",
      "Secure payment gateway integration (Razorpay, UPI, Stripe)",
      "Cart, checkout, and automated customer order notifications",
      "Admin dashboard for order fulfillment and stock tracking",
      "Discount codes, coupon engine, and shipping rules",
      "Mobile-first checkout optimized for conversion rate",
    ],
    techStack: ["Next.js", "PostgreSQL", "Prisma", "Razorpay / Stripe"],
  },
  "Mobile Applications": {
    tagline:
      "Cross-platform mobile apps for iOS and Android tailored to your business operations and audience.",
    timeline: "3 – 6 Weeks",
    deliverables: [
      "Native-feel UI/UX for iOS and Android from a single codebase",
      "User authentication, profile management, and role security",
      "Real-time database sync and RESTful API backend",
      "Push notifications and automated customer reminders",
      "Offline caching support for seamless performance",
      "Google Play Store & Apple App Store publishing assistance",
    ],
    techStack: ["React Native / Flutter", "Node.js", "PostgreSQL", "Firebase"],
  },
  "Custom Software": {
    tagline:
      "Tailored web and desktop applications engineered around your organization's specific workflow.",
    timeline: "3 – 8 Weeks",
    deliverables: [
      "Custom business logic and automated digital workflows",
      "Role-based access control (Admin, Manager, Staff, Viewer)",
      "Automated PDF invoice generation, billing, and report exports",
      "Secure relational database architecture with automated backups",
      "Interactive data tables with sorting, filtering, and CSV export",
      "Complete technical documentation and staff onboarding support",
    ],
    techStack: ["Next.js", "Node.js", "Prisma", "PostgreSQL", "Docker"],
  },
  "CRM & Management Systems": {
    tagline:
      "Centralized operations software to manage clients, leads, staff, inventory, and accounts.",
    timeline: "3 – 6 Weeks",
    deliverables: [
      "End-to-end customer and lead tracking pipeline (Kanban / Table)",
      "Staff attendance, task assignment, and activity logging",
      "Billing, automated recurring invoices, and payment tracking",
      "Executive analytics dashboard with financial metrics",
      "Multi-user permission levels and activity audit logs",
      "Custom data exports and third-party API integrations",
    ],
    techStack: ["React", "Next.js", "PostgreSQL", "Tailwind CSS"],
  },
  "AI-Powered Solutions": {
    tagline:
      "Cutting-edge AI automation, intelligent bots, and predictive features integrated into your business.",
    timeline: "2 – 4 Weeks",
    deliverables: [
      "Custom AI chatbot trained on your company's documents and FAQs",
      "Automated document processing, text parsing, and OCR data extraction",
      "Intelligent lead qualification and customer support automation",
      "Integration with OpenAI, Google Gemini, and Claude APIs",
      "Workflow triggers via webhooks and external platforms",
      "Private and secure data handling with enterprise encryption",
    ],
    techStack: ["Python / Node.js", "OpenAI / Gemini API", "Vector DB", "Next.js"],
  },
};

export default function ServicesSection({
  services,
  whatsappNumber = "+91 87789 79416",
}: ServicesSectionProps) {
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const cleanWhatsapp = whatsappNumber.replace(/[^0-9]/g, "");

  // Close modal on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedService(null);
    };
    if (selectedService) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [selectedService]);

  const handleContactScroll = (serviceTitle: string) => {
    setSelectedService(null);
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
      // Update form's service select field if available
      window.location.hash = `contact?service=${encodeURIComponent(serviceTitle)}`;
    }
  };

  const activeDetails = selectedService
    ? serviceDetailsData[selectedService.title] || {
        tagline: selectedService.description,
        timeline: "1 – 3 Weeks",
        deliverables: [
          "Custom design tailored to client brand identity",
          "Clean, scalable, and documented source code",
          "Comprehensive cross-device responsive testing",
          "Direct WhatsApp lead capture integration",
          "Complete deployment and server configuration",
        ],
        techStack: ["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL"],
      }
    : null;

  return (
    <section id="services" className="py-24 bg-[#F4F6F6] text-[#1C2833] border-b border-[#D5DBDB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#2E4053] bg-[#D5DBDB]/50 px-3 py-1 rounded-full">
            WHAT WE BUILD
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1C2833] tracking-tight mt-3 mb-4">
            Custom Development Services
          </h2>
          <p className="text-base text-[#2E4053]/80">
            High-performance technology, design, and tailored software built around your ideas.
          </p>
        </div>

        {/* 6 Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = iconMap[service.icon] || Code;
            const waMsg = `Hello PixelForge Studio, I would like to enquire about your ${service.title} service.`;

            return (
              <motion.div
                key={service.id || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="group relative bg-[#1C2833] text-[#F4F6F6] p-7 sm:p-8 rounded-2xl border border-[#2E4053] shadow-lg hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
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

                {/* Card Actions */}
                <div className="pt-4 border-t border-[#2E4053] flex items-center justify-between gap-3">
                  <a
                    href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(waMsg)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 py-2 px-3.5 text-xs font-bold text-[#1C2833] bg-[#F4F6F6] hover:bg-[#D5DBDB] rounded-lg transition-all shadow-sm"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Enquire</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setSelectedService(service)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#AAB7B8] hover:text-[#F4F6F6] transition-colors py-2 px-2.5 rounded-lg hover:bg-[#2E4053]/50 cursor-pointer"
                  >
                    <span>Details</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Interactive Service Details Modal */}
      <AnimatePresence>
        {selectedService && activeDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedService(null)}
              className="fixed inset-0 bg-[#1C2833]/80 backdrop-blur-md"
            />

            {/* Modal Dialog Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-2xl bg-[#1C2833] text-[#F4F6F6] border border-[#D5DBDB]/20 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedService(null)}
                aria-label="Close dialog"
                className="absolute top-5 right-5 p-2 rounded-xl bg-[#2E4053] text-[#AAB7B8] hover:text-[#F4F6F6] hover:bg-[#2E4053]/80 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header */}
              <div className="flex items-start gap-4 mb-6 pr-10">
                <div className="w-14 h-14 rounded-2xl bg-[#2E4053] text-[#F4F6F6] flex items-center justify-center shrink-0 border border-[#D5DBDB]/15">
                  {(() => {
                    const Icon = iconMap[selectedService.icon] || Code;
                    return <Icon className="w-7 h-7" />;
                  })()}
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#2E4053] text-[10px] font-mono uppercase tracking-widest text-[#D5DBDB] border border-[#D5DBDB]/15 mb-2">
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    PixelForge Capability
                  </div>
                  <h3 className="text-2xl font-extrabold text-[#F4F6F6] tracking-tight">
                    {selectedService.title}
                  </h3>
                </div>
              </div>

              {/* Tagline / Overview */}
              <div className="p-4 rounded-2xl bg-[#2E4053]/40 border border-[#D5DBDB]/10 mb-6">
                <p className="text-sm text-[#D5DBDB] leading-relaxed">
                  {activeDetails.tagline}
                </p>
              </div>

              {/* Key Deliverables & Features */}
              <div className="mb-6">
                <h4 className="text-xs font-mono uppercase tracking-widest text-[#AAB7B8] mb-3">
                  Key Deliverables &amp; Features
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activeDetails.deliverables.map((item, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-[#2E4053]/30 border border-[#D5DBDB]/10 flex items-start gap-2.5"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-xs text-[#F4F6F6] leading-snug">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Meta Info: Timeline & Tech Stack */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 pt-4 border-t border-[#2E4053]">
                <div className="p-3.5 rounded-xl bg-[#2E4053]/20 border border-[#D5DBDB]/10 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#2E4053] flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-[#AAB7B8]" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-mono uppercase tracking-wider text-[#AAB7B8]">
                      Estimated Turnaround
                    </span>
                    <span className="text-xs font-bold text-[#F4F6F6]">
                      {activeDetails.timeline}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#2E4053]/20 border border-[#D5DBDB]/10 flex flex-col justify-center">
                  <span className="block text-[10px] font-mono uppercase tracking-wider text-[#AAB7B8] mb-1.5">
                    Core Technology Stack
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeDetails.techStack.map((tech, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#2E4053] text-[#D5DBDB] border border-[#D5DBDB]/10"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <a
                  href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
                    `Hello PixelForge Studio, I would like to discuss a project regarding ${selectedService.title}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:flex-1 py-3 px-5 rounded-xl text-xs font-bold text-[#1C2833] bg-[#F4F6F6] hover:bg-[#D5DBDB] transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  <span>Enquire on WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={() => handleContactScroll(selectedService.title)}
                  className="w-full sm:flex-1 py-3 px-5 rounded-xl text-xs font-bold text-[#F4F6F6] bg-[#2E4053] hover:bg-[#2E4053]/80 border border-[#D5DBDB]/20 transition-all flex items-center justify-center gap-2"
                >
                  <span>Request Custom Quote</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

