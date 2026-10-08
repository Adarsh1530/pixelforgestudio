import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required."),
  newPassword: z.string().min(6, "New password must be at least 6 characters."),
  confirmPassword: z.string().min(6, "Confirm password is required."),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "New passwords do not match.",
  path: ["confirmPassword"],
});

export const EnquirySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().min(8, "Please enter a valid phone number."),
  service: z.string().min(1, "Please select a service or project package."),
  budget: z.string().min(1, "Please select a budget range."),
  description: z.string().min(10, "Please provide a description of at least 10 characters."),
  source: z.string().optional().default("WEBSITE"),
});

export const ServiceSchema = z.object({
  title: z.string().min(2, "Title is required."),
  description: z.string().min(10, "Description is required."),
  icon: z.string().default("Code"),
  sortOrder: z.number().int().default(0),
  published: z.boolean().default(true),
});

export const AcademicPackageSchema = z.object({
  category: z.enum(["BCA", "MCA"]),
  projectType: z.enum(["Minor Project", "Major Project"]),
  price: z.number().positive("Price must be positive."),
  description: z.string().min(5, "Description is required."),
  features: z.array(z.string()).min(1, "At least one feature is required."),
  published: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export const PortfolioProjectSchema = z.object({
  title: z.string().min(2, "Title is required."),
  category: z.string().min(1, "Category is required."),
  description: z.string().min(10, "Description is required."),
  image: z.string().min(1, "Project image URL is required."),
  technologies: z.string().min(1, "Technologies list is required."),
  projectUrl: z.string().url().optional().or(z.literal("")),
  githubUrl: z.string().url().optional().or(z.literal("")),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export const TestimonialSchema = z.object({
  name: z.string().min(2, "Name is required."),
  role: z.string().min(2, "Role/Organization is required."),
  message: z.string().min(10, "Testimonial message is required."),
  image: z.string().optional().or(z.literal("")),
  rating: z.number().min(1).max(5).default(5),
  published: z.boolean().default(true),
});

export const SiteSettingsSchema = z.object({
  brandName: z.string().min(1, "Brand name is required."),
  tagline: z.string().min(1, "Tagline is required."),
  heroTitle: z.string().min(1, "Hero title is required."),
  heroDescription: z.string().min(1, "Hero description is required."),
  startingPrice: z.number().positive("Starting price must be positive."),
  primaryEmail: z.string().email("Invalid primary email."),
  secondaryEmail: z.string().email("Invalid secondary email.").optional().or(z.literal("")),
  primaryPhone: z.string().min(5, "Primary phone is required."),
  secondaryPhone: z.string().optional().or(z.literal("")),
  whatsapp: z.string().min(5, "WhatsApp number is required."),
  secondaryWhatsapp: z.string().optional().or(z.literal("")),
  footerText: z.string().min(1, "Footer text is required."),
});

export const EnquiryUpdateSchema = z.object({
  status: z.enum([
    "PENDING",
    "ACCEPTED",
    "REJECTED",
    "NEW",
    "CONTACTED",
    "IN_PROGRESS",
    "COMPLETED",
    "CLOSED",
  ]),
  notes: z.string().optional(),
});
