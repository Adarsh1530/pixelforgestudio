"use client";

import Image from "next/image";
import { Star, MessageSquareQuote } from "lucide-react";

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  message: string;
  image?: string | null;
  rating: number;
  published?: boolean;
}

interface TestimonialsSectionProps {
  testimonials: TestimonialItem[];
}

const defaultTestimonials: TestimonialItem[] = [
  {
    id: "test-1",
    name: "Karthik R.",
    role: "Fleet Operations Manager, VMS PRO",
    message:
      "PixelForge Studio engineered our vehicle management software with incredible attention to detail. The tracking, driver records, and automated maintenance modules have made our fleet logistics completely seamless.",
    rating: 5,
  },
  {
    id: "test-2",
    name: "Dr. S. Nair",
    role: "Administrator, Bhavan's Vivekananda Vidya Mandir",
    message:
      "The school portal developed by PixelForge Studio has received outstanding feedback from parents and faculty. Fast loading, elegant modern aesthetics, and effortless management.",
    rating: 5,
  },
  {
    id: "test-3",
    name: "Fatima Al-Balushi",
    role: "Managing Director, Rosellsa Haute Beauty (Muscat)",
    message:
      "PixelForge Studio captured our luxury salon aesthetic flawlessly. The booking system and responsive layout showcase our Muscat sanctuary with the premium elegance our clientele expects.",
    rating: 5,
  },
  {
    id: "test-4",
    name: "Arun Prakash",
    role: "MCA Graduate, University Project",
    message:
      "The project code architecture, documentation report, and live viva coaching provided by PixelForge Studio were top tier. Secured an A+ grade in our final evaluation!",
    rating: 5,
  },
];

export default function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const activeList = testimonials?.filter((t) => t.published !== false) || [];
  const publishedTestimonials = activeList.length > 0 ? activeList : defaultTestimonials;

  return (
    <section className="py-24 bg-[#1C2833] text-[#F4F6F6] border-b border-[#2E4053]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#AAB7B8] bg-[#2E4053] px-3 py-1 rounded-full border border-[#D5DBDB]/10">
            TESTIMONIALS
          </span>
          <h2 className="text-3xl font-extrabold text-[#F4F6F6] tracking-tight mt-3 mb-3">
            What Our Clients & Students Say
          </h2>
          <p className="text-sm text-[#AAB7B8]">
            Direct feedback from businesses and graduates who partnered with PixelForge Studio.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {publishedTestimonials.map((item) => (
            <div
              key={item.id}
              className="bg-[#2E4053]/50 rounded-2xl p-6 border border-[#D5DBDB]/15 shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {Array.from({ length: item.rating || 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-[#D5DBDB] italic leading-relaxed mb-6">
                  &ldquo;{item.message}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-[#D5DBDB]/10">
                <div className="relative w-10 h-10 rounded-full bg-[#1C2833] overflow-hidden border border-[#D5DBDB]/20 shrink-0 flex items-center justify-center font-bold text-sm text-[#F4F6F6]">
                  {item.image ? (
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  ) : (
                    item.name.charAt(0)
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#F4F6F6]">{item.name}</h4>
                  <p className="text-[11px] text-[#AAB7B8]">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
