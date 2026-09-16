"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Code2, Sparkles, CheckCircle2, MessageSquare } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface HeroSectionProps {
  settings?: {
    heroTitle?: string;
    heroDescription?: string;
    startingPrice?: number;
    whatsapp?: string;
  };
}

export default function HeroSection({ settings }: HeroSectionProps) {
  const startingPrice = settings?.startingPrice || 15000;
  const whatsappNumber = (settings?.whatsapp || "+91 87789 79416").replace(/[^0-9]/g, "");

  return (
    <section
      id="hero"
      className="relative min-h-screen pt-32 pb-20 bg-[#1C2833] text-[#F4F6F6] flex items-center overflow-hidden border-b border-[#2E4053]"
    >
      {/* Background Subtle Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

      {/* Tonal Background Accents */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#2E4053] rounded-full filter blur-3xl opacity-30 pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#2E4053] rounded-full filter blur-3xl opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Content (7 Cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 flex flex-col items-start"
          >
            {/* Brand Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2E4053]/80 border border-[#D5DBDB]/20 mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-widest text-[#D5DBDB]">
                PIXELFORGE STUDIO
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#F4F6F6] leading-[1.1] mb-4">
              Your Ideas. <br />
              <span className="text-[#AAB7B8]">Our Code.</span> <br />
              Real Solutions.
            </h1>

            {/* Secondary Headline */}
            <p className="text-lg sm:text-xl font-semibold text-[#D5DBDB] mb-3">
              Website, App & Software Development
            </p>

            {/* Description */}
            <p className="text-sm sm:text-base text-[#AAB7B8] max-w-xl leading-relaxed mb-6">
              {settings?.heroDescription ||
                "Custom digital solutions for businesses, shops, individuals and students. Evolving bold concepts into high-performance software, modern mobile apps, and scalable web platforms."}
            </p>

            {/* Starting Price Pill */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-lg bg-[#2E4053]/50 border border-[#D5DBDB]/15 mb-8">
              <Sparkles className="w-4 h-4 text-[#D5DBDB]" />
              <span className="text-xs sm:text-sm text-[#AAB7B8]">
                Professional Digital Solutions —{" "}
                <span className="text-[#F4F6F6] font-bold">
                  Starting from {formatCurrency(startingPrice)}
                </span>
              </span>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-[#1C2833] bg-[#F4F6F6] hover:bg-[#D5DBDB] rounded-lg transition-all shadow-md group"
              >
                Start Your Project
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href={`https://wa.me/${whatsappNumber}?text=Hello%20PixelForge%20Studio,%20I%20would%20like%20to%20discuss%20a%20project.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-[#F4F6F6] bg-[#2E4053] hover:bg-[#2E4053]/80 border border-[#D5DBDB]/20 rounded-lg transition-all"
              >
                <MessageSquare className="w-4 h-4 text-[#AAB7B8]" />
                Chat on WhatsApp
              </a>

              <a
                href="#services"
                className="inline-flex items-center justify-center gap-1 px-4 py-3 text-sm font-medium text-[#AAB7B8] hover:text-[#F4F6F6] transition-colors"
              >
                Explore Services ↓
              </a>
            </div>
          </motion.div>

          {/* Right Technical Workspace Panel (5 Cols) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative rounded-2xl bg-[#2E4053]/60 border border-[#D5DBDB]/20 p-5 shadow-2xl backdrop-blur-sm overflow-hidden">
              {/* Window Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#D5DBDB]/10 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400/80" />
                  <span className="text-xs font-mono text-[#AAB7B8] ml-2">
                    pixelforge_studio.ts
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Code2 className="w-4 h-4 text-[#AAB7B8]" />
                  <span className="text-[10px] font-mono text-[#AAB7B8]">v2.6</span>
                </div>
              </div>

              {/* Code Panel */}
              <div className="font-mono text-xs text-[#D5DBDB] space-y-2 leading-relaxed bg-[#1C2833] p-4 rounded-xl border border-[#D5DBDB]/10">
                <p className="text-[#AAB7B8]">// PixelForge Studio — Digital Solution Engine</p>
                <p>
                  <span className="text-emerald-400">const</span> studio ={" "}
                  <span className="text-amber-300">new PixelForge</span>();
                </p>
                <p className="pl-4">
                  studio.<span className="text-sky-300">buildSolution</span>({`{`}
                </p>
                <p className="pl-8 text-[#AAB7B8]">
                  vision: <span className="text-amber-200">&quot;Your Ideas&quot;</span>,
                </p>
                <p className="pl-8 text-[#AAB7B8]">
                  stack: [<span className="text-emerald-300">&quot;Next.js&quot;</span>,{" "}
                  <span className="text-emerald-300">&quot;Mobile Apps&quot;</span>,{" "}
                  <span className="text-emerald-300">&quot;AI&quot;</span>],
                </p>
                <p className="pl-8 text-[#AAB7B8]">
                  quality: <span className="text-sky-300">Quality.EXCELLENCE</span>,
                </p>
                <p className="pl-4">{`}`});</p>
                <p className="text-emerald-400">// Status: Ready to Launch</p>
              </div>

              {/* Floating UI Badges */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="bg-[#1C2833]/80 p-3 rounded-xl border border-[#D5DBDB]/10 flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <p className="text-[11px] font-semibold text-[#F4F6F6]">
                      Tailored Architecture
                    </p>
                    <p className="text-[10px] text-[#AAB7B8]">Clean & Scalable</p>
                  </div>
                </div>

                <div className="bg-[#1C2833]/80 p-3 rounded-xl border border-[#D5DBDB]/10 flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <p className="text-[11px] font-semibold text-[#F4F6F6]">
                      Academic Support
                    </p>
                    <p className="text-[10px] text-[#AAB7B8]">BCA / MCA Packages</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
