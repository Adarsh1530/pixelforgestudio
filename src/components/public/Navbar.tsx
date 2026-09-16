"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NavbarProps {
  brandName?: string;
  whatsappNumber?: string;
  secondaryWhatsapp?: string;
}

export default function Navbar({
  brandName = "PixelForge Studio",
  whatsappNumber = "+91 87789 79416",
  secondaryWhatsapp = "+91 81248 44253",
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Detect active section
      const sections = ["hero", "services", "business-solutions", "academic", "process", "portfolio", "why-us", "contact"];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const cleanWhatsapp = whatsappNumber.replace(/[^0-9]/g, "");
  const cleanSecondaryWhatsapp = secondaryWhatsapp.replace(/[^0-9]/g, "");

  const navLinks = [
    { name: "Home", href: "#hero", id: "hero" },
    { name: "Services", href: "#services", id: "services" },
    { name: "Business Solutions", href: "#business-solutions", id: "business-solutions" },
    { name: "Academic Projects", href: "#academic", id: "academic" },
    { name: "Process", href: "#process", id: "process" },
    { name: "Selected Work", href: "#portfolio", id: "portfolio" },
    { name: "Why PixelForge", href: "#why-us", id: "why-us" },
    { name: "Contact", href: "#contact", id: "contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#1C2833]/90 backdrop-blur-md shadow-lg border-b border-[#2E4053] py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="#hero" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-[#D5DBDB]/20 bg-[#1C2833] flex items-center justify-center group-hover:border-[#AAB7B8] transition-colors">
              <Image
                src="/images/logo.png"
                alt={brandName}
                width={40}
                height={40}
                className="object-contain p-1"
                priority
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
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 bg-[#1C2833]/60 border border-[#2E4053] rounded-full px-4 py-1.5 backdrop-blur-sm">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ${
                  activeSection === link.id
                    ? "text-[#F4F6F6] bg-[#2E4053]"
                    : "text-[#AAB7B8] hover:text-[#F4F6F6] hover:bg-[#2E4053]/50"
                }`}
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="hidden lg:flex items-center gap-2">
            <a
              href={`https://wa.me/${cleanWhatsapp}?text=Hello%20PixelForge%20Studio,%20I%20would%20like%20to%20discuss%20a%20project.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#1C2833] bg-[#F4F6F6] rounded-full hover:bg-[#D5DBDB] transition-all shadow-sm"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
              WA 1
            </a>
            <a
              href={`https://wa.me/${cleanSecondaryWhatsapp}?text=Hello%20PixelForge%20Studio,%20I%20would%20like%20to%20discuss%20a%20project.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#1C2833] bg-[#F4F6F6] rounded-full hover:bg-[#D5DBDB] transition-all shadow-sm"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
              WA 2
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            className="md:hidden p-2 rounded-lg bg-[#2E4053] text-[#F4F6F6] hover:bg-[#1C2833] transition-colors border border-[#D5DBDB]/10"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#1C2833] border-b border-[#2E4053] px-4 pt-3 pb-6 mt-3 shadow-xl"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    activeSection === link.id
                      ? "bg-[#2E4053] text-[#F4F6F6]"
                      : "text-[#AAB7B8] hover:bg-[#2E4053]/50 hover:text-[#F4F6F6]"
                  }`}
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-3 border-t border-[#2E4053] flex flex-col gap-2">
                <a
                  href={`https://wa.me/${cleanWhatsapp}?text=Hello%20PixelForge%20Studio,%20I%20would%20like%20to%20discuss%20a%20project.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold text-[#1C2833] bg-[#F4F6F6] hover:bg-[#D5DBDB] rounded-lg transition-all"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                  Chat on WhatsApp — WA 1
                </a>
                <a
                  href={`https://wa.me/${cleanSecondaryWhatsapp}?text=Hello%20PixelForge%20Studio,%20I%20would%20like%20to%20discuss%20a%20project.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold text-[#1C2833] bg-[#F4F6F6] hover:bg-[#D5DBDB] rounded-lg transition-all"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                  Chat on WhatsApp — WA 2
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
