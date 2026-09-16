"use client";

import { useState } from "react";
import { MessageSquare, ChevronUp } from "lucide-react";

interface WhatsAppWidgetProps {
  whatsappNumber?: string;
  secondaryWhatsapp?: string;
}

export default function WhatsAppWidget({
  whatsappNumber = "+91 87789 79416",
  secondaryWhatsapp = "+91 81248 44253",
}: WhatsAppWidgetProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const cleanPrimary = whatsappNumber.replace(/[^0-9]/g, "");
  const cleanSecondary = secondaryWhatsapp.replace(/[^0-9]/g, "");

  const msg = encodeURIComponent("Hello PixelForge Studio, I would like to discuss a project.");
  const primaryUrl = `https://wa.me/${cleanPrimary}?text=${msg}`;
  const secondaryUrl = `https://wa.me/${cleanSecondary}?text=${msg}`;

  return (
    <>
      {/* Desktop Floating Button with Dual Number Popover */}
      <div className="hidden sm:block fixed bottom-6 right-6 z-40">
        {menuOpen && (
          <div className="mb-2 bg-[#1C2833] border border-emerald-500/30 rounded-2xl p-3 shadow-2xl space-y-2 text-xs w-64 animate-in fade-in slide-in-from-bottom-2">
            <p className="text-[10px] font-mono text-[#AAB7B8] uppercase px-2">
              Choose WhatsApp Contact:
            </p>
            <a
              href={primaryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 p-2 rounded-xl bg-[#2E4053]/50 hover:bg-[#2E4053] text-[#F4F6F6] transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-emerald-950 text-emerald-400 flex items-center justify-center shrink-0">
                <MessageSquare className="w-3.5 h-3.5" />
              </div>
              <div className="truncate">
                <span className="block font-bold text-xs">{whatsappNumber}</span>
                <span className="block text-[10px] text-emerald-400 font-mono">Keerthi Adarsh M P</span>
              </div>
            </a>

            <a
              href={secondaryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 p-2 rounded-xl bg-[#2E4053]/50 hover:bg-[#2E4053] text-[#F4F6F6] transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-emerald-950 text-emerald-400 flex items-center justify-center shrink-0">
                <MessageSquare className="w-3.5 h-3.5" />
              </div>
              <div className="truncate">
                <span className="block font-bold text-xs">{secondaryWhatsapp}</span>
                <span className="block text-[10px] text-emerald-400 font-mono">Barath Ponnusamy</span>
              </div>
            </a>
          </div>
        )}

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center gap-2.5 px-4 py-3 bg-[#1C2833] text-emerald-400 border border-emerald-500/40 rounded-full shadow-2xl hover:scale-105 transition-all group"
        >
          <div className="w-8 h-8 rounded-full bg-emerald-950 flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-emerald-400 group-hover:animate-bounce" />
          </div>
          <span className="text-xs font-bold text-[#F4F6F6] pr-1">
            Chat on WhatsApp
          </span>
          <ChevronUp className={`w-4 h-4 text-[#AAB7B8] transition-transform ${menuOpen ? "rotate-180" : ""}`} />
        </button>
      </div>

      {/* Mobile Fixed Bottom CTA Bar with Dual Options */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#1C2833]/95 backdrop-blur-md border-t border-[#2E4053] p-2.5 shadow-2xl">
        <div className="grid grid-cols-2 gap-2">
          <a
            href={primaryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 py-2.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-[#F4F6F6] text-[11px] font-bold rounded-xl shadow-md transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WA 1 ({whatsappNumber.slice(-5)})</span>
          </a>
          <a
            href={secondaryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 py-2.5 px-2 bg-emerald-700 hover:bg-emerald-800 text-[#F4F6F6] text-[11px] font-bold rounded-xl shadow-md transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WA 2 ({secondaryWhatsapp.slice(-5)})</span>
          </a>
        </div>
      </div>
    </>
  );
}
