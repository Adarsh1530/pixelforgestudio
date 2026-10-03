"use client";

import { useState, useEffect } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import { Plus, Edit3, Trash2, Star, X, AlertCircle } from "lucide-react";

interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  message: string;
  image?: string | null;
  rating: number;
  published: boolean;
}

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TestimonialItem | null>(null);

  // Form
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");
  const [image, setImage] = useState("");
  const [rating, setRating] = useState(5);
  const [published, setPublished] = useState(true);
  const [saving, setSaving] = useState(false);

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/testimonials");
      const data = await res.json();
      if (Array.isArray(data)) setTestimonials(data);
    } catch (err) {
      console.error("Fetch testimonials error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setName("");
    setRole("");
    setMessage("");
    setImage("");
    setRating(5);
    setPublished(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (t: TestimonialItem) => {
    setEditingItem(t);
    setName(t.name);
    setRole(t.role);
    setMessage(t.message);
    setImage(t.image || "");
    setRating(t.rating || 5);
    setPublished(t.published);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      name,
      role,
      message,
      image: image || undefined,
      rating: Number(rating),
      published,
    };

    try {
      if (editingItem) {
        await fetch(`/api/admin/testimonials/${editingItem.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch("/api/admin/testimonials", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      setIsModalOpen(false);
      await fetchTestimonials();
    } catch (err) {
      console.error("Save testimonial error:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
      setDeleteConfirmId(null);
      await fetchTestimonials();
    } catch (err) {
      console.error("Delete testimonial error:", err);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <AdminHeader
        title="Testimonials & Reviews Manager"
        description="Add, edit or publish verified client feedback."
      />

      <main className="p-6 space-y-6">
        
        <div className="bg-[#2E4053]/40 border border-[#D5DBDB]/15 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#F4F6F6]">Client Reviews ({testimonials.length})</h3>
            <p className="text-xs text-[#AAB7B8]">Verified client reviews displayed on the website.</p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-[#1C2833] bg-[#F4F6F6] hover:bg-[#D5DBDB] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Testimonial
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-[#AAB7B8]">Loading testimonials...</div>
        ) : testimonials.length === 0 ? (
          <div className="bg-[#2E4053]/30 border border-[#D5DBDB]/15 rounded-2xl p-12 text-center text-xs text-[#AAB7B8]">
            No client testimonials added yet. Click &quot;Add Testimonial&quot; when verified client feedback is received.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="bg-[#2E4053]/30 border border-[#D5DBDB]/15 rounded-2xl p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex text-amber-400">
                      {Array.from({ length: t.rating || 5 }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                    <span className={`text-[10px] font-bold ${t.published ? "text-emerald-400" : "text-[#AAB7B8]"}`}>
                      {t.published ? "PUBLISHED" : "UNPUBLISHED"}
                    </span>
                  </div>

                  <p className="text-xs text-[#D5DBDB] italic mb-4 leading-relaxed">&ldquo;{t.message}&rdquo;</p>
                </div>

                <div className="pt-4 border-t border-[#D5DBDB]/10 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-[#F4F6F6]">{t.name}</h4>
                    <p className="text-[11px] text-[#AAB7B8]">{t.role}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button onClick={() => handleOpenEdit(t)} className="p-1.5 rounded bg-[#1C2833] text-[#D5DBDB] hover:text-[#F4F6F6]">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => setDeleteConfirmId(t.id)} className="p-1.5 rounded bg-rose-950/60 text-rose-300 hover:bg-rose-900">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-[#1C2833]/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#1C2833] border border-[#D5DBDB]/20 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-[#D5DBDB]/10">
                <h3 className="text-base font-bold text-[#F4F6F6]">
                  {editingItem ? "Edit Testimonial" : "Add Testimonial"}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-[#AAB7B8] hover:text-[#F4F6F6]">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[#AAB7B8] mb-1 font-semibold">Client Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rajesh Kumar"
                    className="w-full p-2.5 rounded-xl bg-[#2E4053] border border-[#D5DBDB]/20 text-[#F4F6F6]"
                  />
                </div>

                <div>
                  <label className="block text-[#AAB7B8] mb-1 font-semibold">Role / Organization</label>
                  <input
                    type="text"
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Founder, Retail Store"
                    className="w-full p-2.5 rounded-xl bg-[#2E4053] border border-[#D5DBDB]/20 text-[#F4F6F6]"
                  />
                </div>

                <div>
                  <label className="block text-[#AAB7B8] mb-1 font-semibold">Rating (1 to 5 Stars)</label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-[#2E4053] border border-[#D5DBDB]/20 text-[#F4F6F6]"
                  >
                    <option value={5}>5 Stars (Excellent)</option>
                    <option value={4}>4 Stars (Very Good)</option>
                    <option value={3}>3 Stars (Good)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#AAB7B8] mb-1 font-semibold">Testimonial Message</label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#2E4053] border border-[#D5DBDB]/20 text-[#F4F6F6] resize-none"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="tPublished"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    className="rounded bg-[#2E4053]"
                  />
                  <label htmlFor="tPublished" className="text-[#D5DBDB] font-semibold">
                    Publish Testimonial
                  </label>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#D5DBDB]/10">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 font-semibold text-[#AAB7B8]">
                    Cancel
                  </button>
                  <button type="submit" disabled={saving} className="px-5 py-2 font-bold bg-[#F4F6F6] text-[#1C2833] rounded-xl hover:bg-[#D5DBDB]">
                    {saving ? "Saving..." : "Save Review"}
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
                <h4 className="text-base font-bold">Delete Testimonial?</h4>
              </div>
              <p className="text-xs text-[#AAB7B8]">Are you sure you want to delete this testimonial?</p>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button onClick={() => setDeleteConfirmId(null)} className="px-4 py-2 text-xs text-[#AAB7B8]">
                  Cancel
                </button>
                <button onClick={() => handleDelete(deleteConfirmId)} className="px-4 py-2 text-xs font-bold bg-rose-600 text-white rounded-lg">
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
