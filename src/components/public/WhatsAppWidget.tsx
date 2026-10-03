"use client";

import { MessageSquare } from "lucide-react";

interface WhatsAppWidgetProps {
  whatsappNumber?: string;
}

export default function WhatsAppWidget({
  whatsappNumber = "+91 87789 79416",
}: WhatsAppWidgetProps) {
  const cleanPrimary = whatsappNumber.replace(/[^0-9]/g, "");
  const msg = encodeURIComponent("Hello PixelForge Studio, I would like to discuss a project.");
  const primaryUrl = `https://wa.me/${cleanPrimary}?text=${msg}`;

  return (
    <>
      {/* Desktop Floating Button */}
      <div className="hidden sm:block fixed bottom-6 right-6 z-40">
        <a
          href={primaryUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 px-5 py-3.5 bg-[#1C2833] text-emerald-400 border border-emerald-500/40 rounded-full shadow-2xl hover:scale-105 transition-all group"
        >
          <div className="w-8 h-8 rounded-full bg-emerald-950 flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-emerald-400 group-hover:animate-bounce" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-bold text-[#F4F6F6]">Chat on WhatsApp</span>
            <span className="text-[10px] text-emerald-400 font-mono">Keerthi Adarsh M P</span>
          </div>
        </a>
      </div>

      {/* Mobile Fixed Bottom CTA Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#1C2833]/95 backdrop-blur-md border-t border-[#2E4053] p-2.5 shadow-2xl">
        <a
          href={primaryUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-[#F4F6F6] text-xs font-bold rounded-xl shadow-md transition-colors"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Chat on WhatsApp (+91 87789 79416)</span>
        </a>
      </div>
    </>
  );
}
