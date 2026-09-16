"use client";

import { useState, useEffect } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import { Plus, Edit3, Trash2, Check, AlertCircle, Save, X, GraduationCap } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface PackageItem {
  id: string;
  category: "BCA" | "MCA";
  projectType: "Minor Project" | "Major Project";
  price: number;
  description: string;
  features: string; // JSON string
  published: boolean;
  sortOrder: number;
}

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPkg, setEditingPkg] = useState<PackageItem | null>(null);

  // Form State
  const [category, setCategory] = useState<"BCA" | "MCA">("BCA");
  const [projectType, setProjectType] = useState<"Minor Project" | "Major Project">("Minor Project");
  const [price, setPrice] = useState<number>(3000);
  const [description, setDescription] = useState("");
  const [featuresText, setFeaturesText] = useState("");
  const [published, setPublished] = useState(true);
  const [saving, setSaving] = useState(false);

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/packages");
      const data = await res.json();
      if (Array.isArray(data)) setPackages(data);
    } catch (err) {
      console.error("Fetch packages error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleOpenAdd = () => {
    setEditingPkg(null);
    setCategory("BCA");
    setProjectType("Minor Project");
    setPrice(3000);
    setDescription("Complete project package solution tailored for BCA students.");
    setFeaturesText("PPT Presentation\nDocumentation Report\nSource Code (GitHub / ZIP)\nImplementation Guide\nTraining (Live / Online)");
    setPublished(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (pkg: PackageItem) => {
    setEditingPkg(pkg);
    setCategory(pkg.category);
    setProjectType(pkg.projectType);
    setPrice(pkg.price);
    setDescription(pkg.description);
    try {
      const parsed = JSON.parse(pkg.features);
      setFeaturesText(Array.isArray(parsed) ? parsed.join("\n") : pkg.features);
    } catch {
      setFeaturesText(pkg.features);
    }
    setPublished(pkg.published);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const featuresArray = featuresText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      category,
      projectType,
      price: Number(price),
      description,
      features: featuresArray,
      published,
    };

    try {
      if (editingPkg) {
        // Edit existing
        await fetch(`/api/admin/packages/${editingPkg.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        // Create new
        await fetch("/api/admin/packages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      setIsModalOpen(false);
      await fetchPackages();
    } catch (err) {
      console.error("Save package error:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/admin/packages/${id}`, { method: "DELETE" });
      setDeleteConfirmId(null);
      await fetchPackages();
    } catch (err) {
      console.error("Delete package error:", err);
    }
  };

  const parseFeatures = (featuresStr: string): string[] => {
    try {
      return JSON.parse(featuresStr);
    } catch {
      return [];
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <AdminHeader
        title="Academic Packages Manager"
        description="Manage pricing, features, and descriptions for BCA & MCA student projects."
      />

      <main className="p-6 space-y-6">
        
        {/* Top Control Bar */}
        <div className="bg-[#2E4053]/40 border border-[#D5DBDB]/15 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#F4F6F6]">Packages & Pricing</h3>
            <p className="text-xs text-[#AAB7B8]">Price changes immediately reflect on the live public website.</p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-[#1C2833] bg-[#F4F6F6] hover:bg-[#D5DBDB] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add New Package
          </button>
        </div>

        {/* Packages Cards Grid */}
        {loading ? (
          <div className="p-12 text-center text-xs text-[#AAB7B8]">Loading packages...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {packages.map((pkg) => {
              const featuresList = parseFeatures(pkg.features);
              return (
                <div
                  key={pkg.id}
                  className="bg-[#2E4053]/30 border border-[#D5DBDB]/15 rounded-2xl p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-mono uppercase text-[#AAB7B8] font-bold">
                        {pkg.category} STREAM
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          pkg.published
                            ? "bg-emerald-950 text-emerald-300 border border-emerald-500/30"
                            : "bg-[#1C2833] text-[#AAB7B8]"
                        }`}
                      >
                        {pkg.published ? "PUBLISHED" : "DRAFT"}
                      </span>
                    </div>

                    <h4 className="text-lg font-bold text-[#F4F6F6] mb-1">{pkg.projectType}</h4>

                    <div className="text-2xl font-black text-[#F4F6F6] mb-4">
                      {formatCurrency(pkg.price)}
                    </div>

                    <p className="text-xs text-[#AAB7B8] mb-4 leading-relaxed line-clamp-3">
                      {pkg.description}
                    </p>

                    <div className="border-t border-[#D5DBDB]/10 pt-3 space-y-1.5 mb-6">
                      {featuresList.map((f, i) => (
                        <div key={i} className="flex items-center gap-2 text-[11px] text-[#D5DBDB]">
                          <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span className="truncate">{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#D5DBDB]/10">
                    <button
                      onClick={() => handleOpenEdit(pkg)}
                      className="p-2 rounded-lg bg-[#1C2833] text-[#D5DBDB] hover:text-[#F4F6F6] border border-[#D5DBDB]/15 transition-colors"
                      title="Edit package"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(pkg.id)}
                      className="p-2 rounded-lg bg-rose-950/60 text-rose-300 border border-rose-500/30 hover:bg-rose-900 transition-colors"
                      title="Delete package"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal Editor Form */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-[#1C2833]/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#1C2833] border border-[#D5DBDB]/20 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-[#D5DBDB]/10">
                <h3 className="text-base font-bold text-[#F4F6F6]">
                  {editingPkg ? "Edit Academic Package" : "Create New Package"}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-[#AAB7B8] hover:text-[#F4F6F6]">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#AAB7B8] mb-1 font-semibold">Category Stream</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full p-2.5 rounded-xl bg-[#2E4053] border border-[#D5DBDB]/20 text-[#F4F6F6]"
                    >
                      <option value="BCA">BCA</option>
                      <option value="MCA">MCA</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#AAB7B8] mb-1 font-semibold">Project Type</label>
                    <select
                      value={projectType}
                      onChange={(e) => setProjectType(e.target.value as any)}
                      className="w-full p-2.5 rounded-xl bg-[#2E4053] border border-[#D5DBDB]/20 text-[#F4F6F6]"
                    >
                      <option value="Minor Project">Minor Project</option>
                      <option value="Major Project">Major Project</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[#AAB7B8] mb-1 font-semibold">Price (INR ₹)</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-[#2E4053] border border-[#D5DBDB]/20 text-[#F4F6F6]"
                  />
                </div>

                <div>
                  <label className="block text-[#AAB7B8] mb-1 font-semibold">Description</label>
                  <textarea
                    rows={2}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#2E4053] border border-[#D5DBDB]/20 text-[#F4F6F6] resize-none"
                  />
                </div>

                <div>
                  <label className="block text-[#AAB7B8] mb-1 font-semibold">
                    Included Features (One per line)
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={featuresText}
                    onChange={(e) => setFeaturesText(e.target.value)}
                    placeholder="PPT Presentation&#10;Documentation Report&#10;Source Code (GitHub / ZIP)"
                    className="w-full p-2.5 rounded-xl bg-[#2E4053] border border-[#D5DBDB]/20 text-[#F4F6F6] resize-none font-mono"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="pkgPublished"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    className="rounded bg-[#2E4053]"
                  />
                  <label htmlFor="pkgPublished" className="text-[#D5DBDB] font-semibold">
                    Publish Package on Public Site
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
                    {saving ? "Saving..." : "Save Package"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 bg-[#1C2833]/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#1C2833] border border-rose-500/40 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
              <div className="flex items-center gap-3 text-rose-400">
                <AlertCircle className="w-6 h-6 shrink-0" />
                <h4 className="text-base font-bold">Delete Academic Package?</h4>
              </div>
              <p className="text-xs text-[#AAB7B8]">
                Are you sure you want to permanently delete this package pricing item?
              </p>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-[#AAB7B8]"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirmId)}
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white"
                >
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
