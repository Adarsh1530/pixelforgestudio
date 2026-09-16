"use client";

import { useState, useEffect } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import { Plus, Edit3, Trash2, Globe, ShoppingCart, Smartphone, Code, Database, Cpu, X, AlertCircle } from "lucide-react";

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  published: boolean;
  sortOrder: number;
}

const iconOptions = ["Globe", "ShoppingCart", "Smartphone", "Code", "Database", "Cpu"];

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("Code");
  const [published, setPublished] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/services");
      const data = await res.json();
      if (Array.isArray(data)) setServices(data);
    } catch (err) {
      console.error("Fetch services error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleOpenAdd = () => {
    setEditingService(null);
    setTitle("");
    setDescription("");
    setIcon("Code");
    setPublished(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (s: ServiceItem) => {
    setEditingService(s);
    setTitle(s.title);
    setDescription(s.description);
    setIcon(s.icon || "Code");
    setPublished(s.published);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      title,
      description,
      icon,
      published,
    };

    try {
      if (editingService) {
        await fetch(`/api/admin/services/${editingService.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch("/api/admin/services", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      setIsModalOpen(false);
      await fetchServices();
    } catch (err) {
      console.error("Save service error:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/admin/services/${id}`, { method: "DELETE" });
      setDeleteConfirmId(null);
      await fetchServices();
    } catch (err) {
      console.error("Delete service error:", err);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <AdminHeader
        title="Services Manager"
        description="Add, update or reorder digital solutions offered on the studio landing page."
      />

      <main className="p-6 space-y-6">
        
        <div className="bg-[#2E4053]/40 border border-[#D5DBDB]/15 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#F4F6F6]">Services List</h3>
            <p className="text-xs text-[#AAB7B8]">Changes automatically reflect in the public Services section.</p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-[#1C2833] bg-[#F4F6F6] hover:bg-[#D5DBDB] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add New Service
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-[#AAB7B8]">Loading services...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s) => (
              <div
                key={s.id}
                className="bg-[#2E4053]/30 border border-[#D5DBDB]/15 rounded-2xl p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1C2833] text-[#AAB7B8]">
                      Icon: {s.icon}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        s.published
                          ? "bg-emerald-950 text-emerald-300 border border-emerald-500/30"
                          : "bg-[#1C2833] text-[#AAB7B8]"
                      }`}
                    >
                      {s.published ? "PUBLISHED" : "DRAFT"}
                    </span>
                  </div>

                  <h4 className="text-lg font-bold text-[#F4F6F6] mb-2">{s.title}</h4>
                  <p className="text-xs text-[#AAB7B8] leading-relaxed mb-4">{s.description}</p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#D5DBDB]/10">
                  <button
                    onClick={() => handleOpenEdit(s)}
                    className="p-2 rounded-lg bg-[#1C2833] text-[#D5DBDB] hover:text-[#F4F6F6] border border-[#D5DBDB]/15 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(s.id)}
                    className="p-2 rounded-lg bg-rose-950/60 text-rose-300 border border-rose-500/30 hover:bg-rose-900 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Form */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-[#1C2833]/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#1C2833] border border-[#D5DBDB]/20 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-[#D5DBDB]/10">
                <h3 className="text-base font-bold text-[#F4F6F6]">
                  {editingService ? "Edit Service" : "Add Service"}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-[#AAB7B8] hover:text-[#F4F6F6]">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[#AAB7B8] mb-1 font-semibold">Service Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Business Websites"
                    className="w-full p-2.5 rounded-xl bg-[#2E4053] border border-[#D5DBDB]/20 text-[#F4F6F6]"
                  />
                </div>

                <div>
                  <label className="block text-[#AAB7B8] mb-1 font-semibold">Icon Style</label>
                  <select
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#2E4053] border border-[#D5DBDB]/20 text-[#F4F6F6]"
                  >
                    {iconOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[#AAB7B8] mb-1 font-semibold">Description</label>
                  <textarea
                    rows={4}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#2E4053] border border-[#D5DBDB]/20 text-[#F4F6F6] resize-none"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="servicePublished"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    className="rounded bg-[#2E4053]"
                  />
                  <label htmlFor="servicePublished" className="text-[#D5DBDB] font-semibold">
                    Published on Website
                  </label>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#D5DBDB]/10">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl font-semibold text-[#AAB7B8]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2 rounded-xl font-bold bg-[#F4F6F6] text-[#1C2833] hover:bg-[#D5DBDB]"
                  >
                    {saving ? "Saving..." : "Save Service"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 bg-[#1C2833]/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#1C2833] border border-rose-500/40 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
              <div className="flex items-center gap-3 text-rose-400">
                <AlertCircle className="w-6 h-6 shrink-0" />
                <h4 className="text-base font-bold">Delete Service?</h4>
              </div>
              <p className="text-xs text-[#AAB7B8]">
                Are you sure you want to permanently delete this service offering?
              </p>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button onClick={() => setDeleteConfirmId(null)} className="px-4 py-2 rounded-lg text-xs font-semibold text-[#AAB7B8]">
                  Cancel
                </button>
                <button onClick={() => handleDelete(deleteConfirmId)} className="px-4 py-2 rounded-lg text-xs font-bold bg-rose-600 text-white">
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
