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
    update: {},
    create: {
      id: "default",
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
