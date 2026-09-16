"use client";

import { useState, useEffect } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import { Save, CheckCircle2, FileText } from "lucide-react";

export default function AdminContentPage() {
  const [formData, setFormData] = useState({
    brandName: "PixelForge Studio",
    tagline: "Your Ideas. Our Code. Real Solutions.",
    heroTitle: "Your Ideas.\nOur Code.\nReal Solutions.",
    heroDescription: "Custom digital solutions for businesses, shops, individuals and students.",
    startingPrice: 15000,
    footerText: "Let's turn your ideas into powerful solutions.",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/admin/settings");
        const data = await res.json();
        if (data && !data.error) {
          setFormData({
            brandName: data.brandName || "PixelForge Studio",
            tagline: data.tagline || "Your Ideas. Our Code. Real Solutions.",
            heroTitle: data.heroTitle || "Your Ideas.\nOur Code.\nReal Solutions.",
            heroDescription: data.heroDescription || "Custom digital solutions for businesses, shops, individuals and students.",
            startingPrice: data.startingPrice || 15000,
            footerText: data.footerText || "Let's turn your ideas into powerful solutions.",
          });
        }
      } catch (err) {
        console.error("Fetch content error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandName: formData.brandName,
          tagline: formData.tagline,
          heroTitle: formData.heroTitle,
          heroDescription: formData.heroDescription,
          startingPrice: Number(formData.startingPrice),
          footerText: formData.footerText,
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Save content error:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <AdminHeader
        title="Website Content CMS"
        description="Edit main headlines, brand statements, starting pricing, and hero copy."
      />

      <main className="p-6 max-w-4xl space-y-6">
        
        {success && (
          <div className="bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 p-4 rounded-2xl text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Website content updated successfully! Public site has been revalidated.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="bg-[#2E4053]/30 border border-[#D5DBDB]/15 rounded-2xl p-6 space-y-6 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#AAB7B8] mb-1 font-semibold uppercase tracking-wider">
                Brand Name
              </label>
              <input
                type="text"
                required
                value={formData.brandName}
                onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                className="w-full p-3 rounded-xl bg-[#1C2833] border border-[#D5DBDB]/20 text-[#F4F6F6]"
              />
            </div>

            <div>
              <label className="block text-[#AAB7B8] mb-1 font-semibold uppercase tracking-wider">
                Starting Price (INR ₹)
              </label>
              <input
                type="number"
                required
                value={formData.startingPrice}
                onChange={(e) => setFormData({ ...formData, startingPrice: Number(e.target.value) })}
                className="w-full p-3 rounded-xl bg-[#1C2833] border border-[#D5DBDB]/20 text-[#F4F6F6]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#AAB7B8] mb-1 font-semibold uppercase tracking-wider">
              Main Tagline
            </label>
            <input
              type="text"
              required
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full p-3 rounded-xl bg-[#1C2833] border border-[#D5DBDB]/20 text-[#F4F6F6]"
            />
          </div>

          <div>
            <label className="block text-[#AAB7B8] mb-1 font-semibold uppercase tracking-wider">
              Hero Section Description
            </label>
            <textarea
              rows={3}
              required
              value={formData.heroDescription}
              onChange={(e) => setFormData({ ...formData, heroDescription: e.target.value })}
              className="w-full p-3 rounded-xl bg-[#1C2833] border border-[#D5DBDB]/20 text-[#F4F6F6] resize-none"
            />
          </div>

          <div>
            <label className="block text-[#AAB7B8] mb-1 font-semibold uppercase tracking-wider">
              Footer Brand Statement
            </label>
            <input
              type="text"
              required
              value={formData.footerText}
              onChange={(e) => setFormData({ ...formData, footerText: e.target.value })}
              className="w-full p-3 rounded-xl bg-[#1C2833] border border-[#D5DBDB]/20 text-[#F4F6F6]"
            />
          </div>

          <div className="pt-4 border-t border-[#D5DBDB]/10 flex items-center justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-xl font-bold text-[#1C2833] bg-[#F4F6F6] hover:bg-[#D5DBDB] transition-colors inline-flex items-center gap-2 shadow-lg"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving Changes..." : "Save Website Content"}
            </button>
          </div>

        </form>

      </main>
    </div>
  );
}
