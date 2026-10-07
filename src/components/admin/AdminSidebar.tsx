"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  Wrench,
  GraduationCap,
  FolderGit2,
  Star,
  FileText,
  Image as ImageIcon,
  Settings,
  Shield,
  LogOut,
  ExternalLink,
} from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/admin/login") {
    return null;
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.replace("/admin/login");
    } catch (err) {
      console.error("Logout error:", err);
      window.location.replace("/admin/login");
    }
  };

  const menuGroups = [
    {
      title: "OVERVIEW",
      items: [
        { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { name: "Enquiries", href: "/admin/enquiries", icon: MessageSquare },
      ],
    },
    {
      title: "CONTENT MANAGEMENT",
      items: [
        { name: "Services", href: "/admin/services", icon: Wrench },
        { name: "Academic Packages", href: "/admin/packages", icon: GraduationCap },
        { name: "Portfolio", href: "/admin/portfolio", icon: FolderGit2 },
        { name: "Testimonials", href: "/admin/testimonials", icon: Star },
        { name: "Website Content", href: "/admin/content", icon: FileText },
        { name: "Media Library", href: "/admin/media", icon: ImageIcon },
      ],
    },
    {
      title: "SYSTEM & SETTINGS",
      items: [
        { name: "Contact Settings", href: "/admin/settings", icon: Settings },
        { name: "Security & Password", href: "/admin/security", icon: Shield },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-[#1C2833] border-r border-[#2E4053] text-[#F4F6F6] min-h-screen flex flex-col justify-between shrink-0">
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-[#2E4053] flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-lg overflow-hidden border border-[#D5DBDB]/20 bg-[#1C2833] flex items-center justify-center">
              <Image src="/images/logo.png" alt="PixelForge Admin" width={36} height={36} className="object-contain p-0.5" />
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-tight text-[#F4F6F6] block leading-none">
                PIXEL<span className="text-[#AAB7B8]">FORGE</span>
              </span>
              <span className="text-[10px] tracking-widest text-[#AAB7B8] uppercase block mt-0.5">
                ADMIN CMS
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation List */}
        <nav className="p-4 space-y-6">
          {menuGroups.map((group, idx) => (
            <div key={idx}>
              <h4 className="text-[10px] font-mono uppercase tracking-widest text-[#AAB7B8] px-3 mb-2">
                {group.title}
              </h4>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? "bg-[#2E4053] text-[#F4F6F6] shadow-sm"
                          : "text-[#AAB7B8] hover:bg-[#2E4053]/50 hover:text-[#F4F6F6]"
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? "text-[#F4F6F6]" : "text-[#AAB7B8]"}`} />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Footer User Info & Logout */}
      <div className="p-4 border-t border-[#2E4053] space-y-2">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-[#AAB7B8] hover:bg-[#2E4053]/50 hover:text-[#F4F6F6] transition-colors"
        >
          <span>View Public Site</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-rose-300 hover:bg-rose-950/40 transition-colors text-left"
        >
          <LogOut className="w-4 h-4 text-rose-400" />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
}
