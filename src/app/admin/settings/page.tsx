"use client";

import { useState, useEffect } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import { Save, CheckCircle2, Phone, Mail, MessageSquare } from "lucide-react";

export default function AdminSettingsPage() {
  const [formData, setFormData] = useState({
    primaryEmail: "keerthiadarshmp@gmail.com",
    secondaryEmail: "",
    primaryPhone: "+91 87789 79416",
    secondaryPhone: "",
    whatsapp: "+91 87789 79416",
    secondaryWhatsapp: "",
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
            primaryEmail: data.primaryEmail || "keerthiadarshmp@gmail.com",
            secondaryEmail: data.secondaryEmail || "",
            primaryPhone: data.primaryPhone || "+91 87789 79416",
            secondaryPhone: data.secondaryPhone || "",
            whatsapp: data.whatsapp || "+91 87789 79416",
            secondaryWhatsapp: data.secondaryWhatsapp || "",
          });
        }
      } catch (err) {
        console.error("Fetch contact settings error:", err);
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
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Save contact settings error:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <AdminHeader
        title="Contact Settings Manager"
        description="Update studio email addresses, contact phone numbers, and official WhatsApp link."
      />

      <main className="p-6 max-w-4xl space-y-6">
        
        {success && (
          <div className="bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 p-4 rounded-2xl text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Contact details updated! Every email, call, and WhatsApp link across the website has been updated.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="bg-[#2E4053]/30 border border-[#D5DBDB]/15 rounded-2xl p-6 space-y-6 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#AAB7B8] mb-1 font-semibold uppercase tracking-wider">
                Primary Email Address
              </label>
              <input
                type="email"
                required
                value={formData.primaryEmail}
                onChange={(e) => setFormData({ ...formData, primaryEmail: e.target.value })}
                className="w-full p-3 rounded-xl bg-[#1C2833] border border-[#D5DBDB]/20 text-[#F4F6F6]"
              />
            </div>

            <div>
              <label className="block text-[#AAB7B8] mb-1 font-semibold uppercase tracking-wider">
                Secondary Email Address (Optional)
              </label>
              <input
                type="email"
                value={formData.secondaryEmail}
                onChange={(e) => setFormData({ ...formData, secondaryEmail: e.target.value })}
                className="w-full p-3 rounded-xl bg-[#1C2833] border border-[#D5DBDB]/20 text-[#F4F6F6]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#AAB7B8] mb-1 font-semibold uppercase tracking-wider">
                Primary Phone Number
              </label>
              <input
                type="text"
                required
                value={formData.primaryPhone}
                onChange={(e) => setFormData({ ...formData, primaryPhone: e.target.value })}
                className="w-full p-3 rounded-xl bg-[#1C2833] border border-[#D5DBDB]/20 text-[#F4F6F6]"
              />
            </div>

            <div>
              <label className="block text-[#AAB7B8] mb-1 font-semibold uppercase tracking-wider">
                Secondary Phone Number (Optional)
              </label>
              <input
                type="text"
                value={formData.secondaryPhone}
                onChange={(e) => setFormData({ ...formData, secondaryPhone: e.target.value })}
                className="w-full p-3 rounded-xl bg-[#1C2833] border border-[#D5DBDB]/20 text-[#F4F6F6]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#AAB7B8] mb-1 font-semibold uppercase tracking-wider">
                Primary WhatsApp Number
              </label>
              <input
                type="text"
                required
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                className="w-full p-3 rounded-xl bg-[#1C2833] border border-[#D5DBDB]/20 text-[#F4F6F6]"
              />
            </div>

            <div>
              <label className="block text-[#AAB7B8] mb-1 font-semibold uppercase tracking-wider">
                Secondary WhatsApp Number (Optional)
              </label>
              <input
                type="text"
                value={formData.secondaryWhatsapp}
                onChange={(e) => setFormData({ ...formData, secondaryWhatsapp: e.target.value })}
                className="w-full p-3 rounded-xl bg-[#1C2833] border border-[#D5DBDB]/20 text-[#F4F6F6]"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#D5DBDB]/10 flex items-center justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-xl font-bold text-[#1C2833] bg-[#F4F6F6] hover:bg-[#D5DBDB] transition-colors inline-flex items-center gap-2 shadow-lg"
            >
              <Save className="w-4 h-4" />
              {saving ? "Updating..." : "Save Contact Settings"}
            </button>
          </div>

        </form>

      </main>
    </div>
  );
}
