import { prisma } from "@/lib/prisma";
import Navbar from "@/components/public/Navbar";
import HeroSection from "@/components/public/HeroSection";
import ServicesSection from "@/components/public/ServicesSection";
import BusinessSolutionsSection from "@/components/public/BusinessSolutionsSection";
import AcademicSection from "@/components/public/AcademicSection";
import PerksSection from "@/components/public/PerksSection";
import ProcessSection from "@/components/public/ProcessSection";
import PortfolioSection from "@/components/public/PortfolioSection";
import TestimonialsSection from "@/components/public/TestimonialsSection";
import WhyUsSection from "@/components/public/WhyUsSection";
import ContactSection from "@/components/public/ContactSection";
import WhatsAppWidget from "@/components/public/WhatsAppWidget";
import Footer from "@/components/public/Footer";

export const revalidate = 0; // Ensure fresh data from database on requests

export default async function HomePage() {
  // Fetch dynamic content from DB
  const [settings, services, packages, projects, testimonials] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: "default" } }),
    prisma.service.findMany({ where: { published: true }, orderBy: { sortOrder: "asc" } }),
    prisma.academicPackage.findMany({ where: { published: true }, orderBy: { sortOrder: "asc" } }),
    prisma.portfolioProject.findMany({ where: { published: true }, orderBy: { sortOrder: "asc" } }),
    prisma.testimonial.findMany({ where: { published: true }, orderBy: { createdAt: "desc" } }),
  ]);

  const activeSettings = settings || {
    brandName: "PixelForge Studio",
    tagline: "Your Ideas. Our Code. Real Solutions.",
    heroTitle: "Your Ideas.\nOur Code.\nReal Solutions.",
    heroDescription: "Custom digital solutions for businesses, shops, individuals and students.",
    startingPrice: 15000,
    primaryEmail: "keerthiadarshmp@gmail.com",
    secondaryEmail: "barathponnusamyy@gmail.com",
    primaryPhone: "+91 87789 79416",
    secondaryPhone: "+91 81248 44253",
    whatsapp: "+91 87789 79416",
    secondaryWhatsapp: "+91 81248 44253",
    footerText: "Let's turn your ideas into powerful solutions.",
  };

  return (
    <main className="min-h-screen bg-[#F4F6F6] text-[#1C2833] font-sans antialiased selection:bg-[#2E4053] selection:text-[#F4F6F6]">
      <Navbar
        brandName={activeSettings.brandName}
        whatsappNumber={activeSettings.whatsapp}
        secondaryWhatsapp={activeSettings.secondaryWhatsapp}
      />

      <HeroSection settings={activeSettings} />

      <ServicesSection services={services} />

      <BusinessSolutionsSection
        startingPrice={activeSettings.startingPrice}
        whatsappNumber={activeSettings.whatsapp}
        secondaryWhatsapp={activeSettings.secondaryWhatsapp}
      />

      <AcademicSection
        packages={packages}
        whatsappNumber={activeSettings.whatsapp}
        secondaryWhatsapp={activeSettings.secondaryWhatsapp}
      />

      <PerksSection />

      <ProcessSection />

      <PortfolioSection projects={projects} />

      <TestimonialsSection testimonials={testimonials} />

      <WhyUsSection />

      <ContactSection settings={activeSettings} />

      <Footer settings={activeSettings} />

      <WhatsAppWidget
        whatsappNumber={activeSettings.whatsapp}
        secondaryWhatsapp={activeSettings.secondaryWhatsapp}
      />
    </main>
  );
}
