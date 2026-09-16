import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "PixelForge Studio | Website, App & Software Development",
  description:
    "PixelForge Studio provides custom websites, e-commerce solutions, mobile applications, custom software, CRM systems, AI-powered solutions and academic project packages.",
  keywords: [
    "PixelForge Studio",
    "Website Development",
    "App Development",
    "Custom Software",
    "CRM Systems",
    "AI Solutions",
    "BCA Project Packages",
    "MCA Project Packages",
  ],
  openGraph: {
    title: "PixelForge Studio | Website, App & Software Development",
    description:
      "Your Ideas. Our Code. Real Solutions. Custom digital solutions for businesses, shops, individuals and students.",
    url: "https://pixelforge.studio",
    siteName: "PixelForge Studio",
    images: [
      {
        url: "/images/logo.jpg",
        width: 800,
        height: 600,
        alt: "PixelForge Studio Logo",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  icons: {
    icon: "/images/logo.png",
    shortcut: "/images/logo.png",
    apple: "/images/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} scroll-smooth`} suppressHydrationWarning>
      <body className="bg-[#1C2833] text-[#F4F6F6] font-sans antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
