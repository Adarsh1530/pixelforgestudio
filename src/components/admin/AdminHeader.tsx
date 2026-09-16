"use client";

import { UserCircle, ShieldCheck } from "lucide-react";

interface AdminHeaderProps {
  title: string;
  description?: string;
  adminEmail?: string;
}

export default function AdminHeader({
  title,
  description,
  adminEmail = "admin@pixelforge.studio",
}: AdminHeaderProps) {
  return (
    <header className="bg-[#1C2833] border-b border-[#2E4053] px-6 py-4 flex items-center justify-between sticky top-0 z-30">
      <div>
        <h1 className="text-xl font-bold text-[#F4F6F6] tracking-tight">{title}</h1>
        {description && (
          <p className="text-xs text-[#AAB7B8] mt-0.5">{description}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#2E4053]/60 border border-[#D5DBDB]/15 text-xs">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[#D5DBDB] font-medium hidden sm:inline">{adminEmail}</span>
          <UserCircle className="w-4 h-4 text-[#AAB7B8]" />
        </div>
      </div>
    </header>
  );
}
