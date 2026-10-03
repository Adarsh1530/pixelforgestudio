"use client";

import Image from "next/image";
import { Mail, Phone } from "lucide-react";

interface FooterProps {
  settings?: {
    brandName?: string;
    tagline?: string;
    primaryEmail?: string;
    primaryPhone?: string;
    footerText?: string;
  };
}

export default function Footer({ settings }: FooterProps) {
  const brandName = settings?.brandName || "PixelForge Studio";
  const tagline = settings?.tagline || "Your Ideas. Our Code. Real Solutions.";
  const primaryEmail = settings?.primaryEmail || "keerthiadarshmp@gmail.com";
  const primaryPhone = settings?.primaryPhone || "+91 87789 79416";
  const footerText = settings?.footerText || "Let's turn your ideas into powerful solutions.";

  const cleanPrimaryPhone = primaryPhone.replace(/[^0-9+]/g, "");

  return (
    <footer className="bg-[#1C2833] text-[#F4F6F6] pt-16 pb-12 border-t border-[#2E4053]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#2E4053]">
          
          {/* Brand Info (5 Cols) */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-[#D5DBDB]/20 bg-[#1C2833] flex items-center justify-center">
                <Image
                  src="/images/logo.png"
                  alt={brandName}
                  width={40}
                  height={40}
                  className="object-contain p-1"
                />
              </div>
              <div>
                <span className="font-bold tracking-tight text-lg text-[#F4F6F6] block leading-none">
                  PIXEL<span className="text-[#AAB7B8]">FORGE</span>
                </span>
                <span className="text-[10px] tracking-widest text-[#AAB7B8] uppercase block mt-0.5">
                  STUDIO
                </span>
              </div>
            </div>

            <p className="text-sm font-semibold text-[#D5DBDB] mb-2">
              &quot;{tagline}&quot;
            </p>

            <p className="text-xs text-[#AAB7B8] tracking-widest uppercase mb-4">
              DESIGN • DEVELOPMENT • BRANDING • SOLUTIONS
            </p>

            <p className="text-xs text-[#AAB7B8] max-w-sm leading-relaxed">
              {footerText}
            </p>
          </div>

          {/* Quick Links (3 Cols) */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#AAB7B8] mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs text-[#D5DBDB]">
              <li>
                <a href="#hero" className="hover:text-[#F4F6F6] transition-colors">Home</a>
              </li>
              <li>
                <a href="#services" className="hover:text-[#F4F6F6] transition-colors">Services</a>
              </li>
              <li>
                <a href="#business-solutions" className="hover:text-[#F4F6F6] transition-colors">Business Solutions</a>
              </li>
              <li>
                <a href="#academic" className="hover:text-[#F4F6F6] transition-colors">Academic Projects</a>
              </li>
              <li>
                <a href="#process" className="hover:text-[#F4F6F6] transition-colors">Process</a>
              </li>
              <li>
                <a href="#portfolio" className="hover:text-[#F4F6F6] transition-colors">Works &amp; Projects</a>
              </li>
              <li>
                <a href="#why-us" className="hover:text-[#F4F6F6] transition-colors">Why PixelForge</a>
              </li>
              <li>
                <a href="#contact" className="hover:text-[#F4F6F6] transition-colors">Contact</a>
              </li>
            </ul>
          </div>

          {/* Contact Details (4 Cols) */}
          <div className="md:col-span-4">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#AAB7B8] mb-4">
              Contact Details
            </h4>
            <div className="space-y-3 text-xs text-[#D5DBDB]">
              <p className="text-sm font-bold text-[#F4F6F6]">
                KEERTHI ADARSH M P
              </p>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#AAB7B8]" />
                <a href={`mailto:${primaryEmail}`} className="font-bold text-[#F4F6F6] hover:text-[#D5DBDB] transition-colors">
                  {primaryEmail}
                </a>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <Phone className="w-3.5 h-3.5 text-[#AAB7B8]" />
                <a href={`tel:${cleanPrimaryPhone}`} className="font-bold text-[#F4F6F6] hover:text-[#D5DBDB] transition-colors">
                  {primaryPhone}
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#AAB7B8]">
          <p>© 2026 PixelForge Studio. All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
}
