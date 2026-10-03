import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Seed Admin User
  const adminEmail = process.env.ADMIN_EMAIL || "admin@pixelforge.studio";
  const rawPassword = process.env.ADMIN_PASSWORD || "PixelForge2026!";
  const passwordHash = await bcrypt.hash(rawPassword, 10);

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: { passwordHash },
    create: {
      email: adminEmail,
      passwordHash,
    },
  });
  console.log(`Admin user seeded: ${adminEmail}`);

  // Seed Site Settings
  await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {
      primaryEmail: "keerthiadarshmp@gmail.com",
      secondaryEmail: "",
      primaryPhone: "+91 87789 79416",
      secondaryPhone: "",
      whatsapp: "+91 87789 79416",
      secondaryWhatsapp: "",
    },
    create: {
      id: "default",
      brandName: "PixelForge Studio",
      tagline: "Your Ideas. Our Code. Real Solutions.",
      heroTitle: "Your Ideas.\nOur Code.\nReal Solutions.",
      heroDescription: "Custom digital solutions for businesses, shops, individuals and students.",
      startingPrice: 3000,
      primaryEmail: "keerthiadarshmp@gmail.com",
      secondaryEmail: "",
      primaryPhone: "+91 87789 79416",
      secondaryPhone: "",
      whatsapp: "+91 87789 79416",
      secondaryWhatsapp: "",
      footerText: "Let's turn your ideas into powerful solutions.",
    },
  });
  console.log("Site settings seeded.");

  // Seed Services
  const defaultServices = [
    {
      title: "Business Websites",
      description: "Professional, responsive websites designed to establish your brand and convert visitors into customers.",
      icon: "Globe",
      sortOrder: 1,
    },
    {
      title: "E-Commerce Websites",
      description: "Modern online stores with product management, secure checkout and scalable architecture.",
      icon: "ShoppingCart",
      sortOrder: 2,
    },
    {
      title: "Mobile Applications",
      description: "Custom mobile applications designed for practical business requirements and user experiences.",
      icon: "Smartphone",
      sortOrder: 3,
    },
    {
      title: "Custom Software",
      description: "Tailored software solutions built around your organization's specific workflow and requirements.",
      icon: "Code",
      sortOrder: 4,
    },
    {
      title: "CRM & Management Systems",
      description: "Custom management platforms that help businesses organize operations, customers, staff and data.",
      icon: "Database",
      sortOrder: 5,
    },
    {
      title: "AI-Powered Solutions",
      description: "Intelligent digital solutions using AI and automation to simplify workflows and improve productivity.",
      icon: "Cpu",
      sortOrder: 6,
    },
  ];

  for (const s of defaultServices) {
    const existing = await prisma.service.findFirst({ where: { title: s.title } });
    if (!existing) {
      await prisma.service.create({ data: s });
    }
  }
  console.log("Services seeded.");

  // Seed Academic Packages
  const defaultPackages = [
    {
      category: "BCA",
      projectType: "Minor Project",
      price: 3000,
      description: "Complete minor project solution tailored for BCA curriculum requirements.",
      features: JSON.stringify([
        "PPT Presentation",
        "Documentation Report",
        "Source Code (GitHub / ZIP)",
        "Implementation Guide",
        "Training (Live / Online)",
      ]),
      sortOrder: 1,
    },
    {
      category: "BCA",
      projectType: "Major Project",
      price: 5000,
      description: "Full-scale final year major project solution for BCA with comprehensive documentation.",
      features: JSON.stringify([
        "PPT Presentation",
        "Full Documentation & IEEE standard Report",
        "Source Code (GitHub / ZIP)",
        "Step-by-step Setup & Deployment Guide",
        "Live Code Walkthrough & Viva Training",
      ]),
      sortOrder: 2,
    },
    {
      category: "MCA",
      projectType: "Minor Project",
      price: 6000,
      description: "Advanced architecture minor project tailored for postgraduate MCA standards.",
      features: JSON.stringify([
        "PPT Presentation",
        "System Architecture & Documentation Report",
        "Clean Modular Source Code",
        "Deployment & Environment Setup Guide",
        "Dedicated Live Training Session",
      ]),
      sortOrder: 3,
    },
    {
      category: "MCA",
      projectType: "Major Project",
      price: 8000,
      description: "Enterprise-level final year project solution for MCA with complete technical support.",
      features: JSON.stringify([
        "High-Impact PPT Presentation",
        "Complete Project Thesis & SRS Report",
        "Production-Grade Source Code",
        "Full Deployment & Server Setup Guide",
        "Interactive Viva Voice Preparation & Live Support",
      ]),
      sortOrder: 4,
    },
  ];

  for (const pkg of defaultPackages) {
    const existing = await prisma.academicPackage.findFirst({
      where: { category: pkg.category, projectType: pkg.projectType },
    });
    if (!existing) {
      await prisma.academicPackage.create({ data: pkg });
    }
  }
  console.log("Academic packages seeded.");

  // Seed Portfolio Projects
  const defaultPortfolio = [
    {
      title: "VMS PRO — Vehicle Management & Transport Software",
      category: "Software",
      description:
        "Advanced vehicle management and transport software system built for fleet operators. Covers vehicle tracking, trip management, driver records, maintenance scheduling and detailed reporting — engineered for scale and reliability.",
      image: "/images/projects/vmspro.jpg",
      technologies: "Next.js,Node.js,PostgreSQL,Prisma,Tailwind CSS",
      projectUrl: "https://vmspro.in/",
      githubUrl: null,
      featured: true,
      published: true,
      sortOrder: 1,
    },
    {
      title: "Bhavan's Vivekananda Vidya Mandir — School Website",
      category: "Websites",
      description:
        "Complete institutional website for Bhavan's Vivekananda Vidya Mandir, Manvila, Thiruvananthapuram. Features school information, gallery, announcements, staff directory and admission details with a clean, professional design.",
      image: "/images/projects/bvb-manvila.png",
      technologies: "Next.js,Tailwind CSS,Vercel",
      projectUrl: "https://bvb-manvila.vercel.app/",
      githubUrl: null,
      featured: true,
      published: true,
      sortOrder: 2,
    },
    {
      title: "Wales Group — Corporate Business Website",
      category: "Websites",
      description:
        "Corporate website for Wales Group, UAE. A premium business presence website for an international group company based in the Middle East — showcasing services, portfolio and contact information.",
      image: "/images/projects/walesgroup.jpg",
      technologies: "Next.js,Tailwind CSS,Vercel",
      projectUrl: "https://walessgroup.ae/",
      githubUrl: null,
      featured: false,
      published: true,
      sortOrder: 3,
    },
    {
      title: "Rosellsa Haute Beauty Sanctuary — Salon & Spa, Muscat",
      category: "Websites",
      description:
        "Luxury salon and spa website for Rosellsa Haute Beauty Sanctuary, Muscat, Oman. Elegant, high-end design reflecting the premium brand identity — featuring services, gallery, booking info and contact details.",
      image: "/images/logo.jpg",
      technologies: "Next.js,Tailwind CSS,Vercel",
      projectUrl: "https://rosellsa-haute-salon-spa.vercel.app/",
      githubUrl: null,
      featured: true,
      published: true,
      sortOrder: 4,
    },
  ];

  for (const proj of defaultPortfolio) {
    const existing = await prisma.portfolioProject.findFirst({
      where: { title: proj.title },
    });
    if (!existing) {
      await prisma.portfolioProject.create({ data: proj });
    } else {
      await prisma.portfolioProject.update({
        where: { id: existing.id },
        data: { image: proj.image },
      });
    }
  }
  console.log("Portfolio projects seeded.");

  // Seed Testimonials
  const defaultTestimonials = [
    {
      name: "Karthik R.",
      role: "Fleet Operations Manager, VMS PRO",
      message:
        "PixelForge Studio engineered our vehicle management software with incredible attention to detail. The tracking, driver records, and automated maintenance modules have made our fleet logistics completely seamless.",
      rating: 5,
      published: true,
    },
    {
      name: "Dr. S. Nair",
      role: "Administrator, Bhavan's Vivekananda Vidya Mandir",
      message:
        "The school portal developed by PixelForge Studio has received outstanding feedback from parents and faculty. Fast loading, elegant modern aesthetics, and effortless management.",
      rating: 5,
      published: true,
    },
    {
      name: "Fatima Al-Balushi",
      role: "Managing Director, Rosellsa Haute Beauty (Muscat)",
      message:
        "PixelForge Studio captured our luxury salon aesthetic flawlessly. The booking system and responsive layout showcase our Muscat sanctuary with the premium elegance our clientele expects.",
      rating: 5,
      published: true,
    },
    {
      name: "Arun Prakash",
      role: "MCA Graduate, University Project",
      message:
        "The project code architecture, documentation report, and live viva coaching provided by PixelForge Studio were top tier. Secured an A+ grade in our final evaluation!",
      rating: 5,
      published: true,
    },
  ];

  for (const t of defaultTestimonials) {
    const existing = await prisma.testimonial.findFirst({
      where: { name: t.name },
    });
    if (!existing) {
      await prisma.testimonial.create({ data: t });
    }
  }
  console.log("Testimonials seeded.");

  console.log("Seeding finished successfully.");

}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
