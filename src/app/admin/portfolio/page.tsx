"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import AdminHeader from "@/components/admin/AdminHeader";
import { Plus, Edit3, Trash2, Upload, ExternalLink, Github, X, AlertCircle, Image as ImageIcon } from "lucide-react";

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  technologies: string;
  projectUrl?: string | null;
  githubUrl?: string | null;
  featured: boolean;
  published: boolean;
}

export default function AdminPortfolioPage() {
  const [projects, setProjects] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<PortfolioItem | null>(null);

  // Form
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Websites");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [technologies, setTechnologies] = useState("");
  const [projectUrl, setProjectUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [featured, setFeatured] = useState(false);
  const [published, setPublished] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/portfolio");
      const data = await res.json();
      if (Array.isArray(data)) setProjects(data);
    } catch (err) {
      console.error("Fetch portfolio error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleOpenAdd = () => {
    setEditingProject(null);
    setTitle("");
    setCategory("Websites");
    setDescription("");
    setImage("");
    setTechnologies("Next.js, TypeScript, Tailwind");
    setProjectUrl("");
    setGithubUrl("");
    setFeatured(false);
    setPublished(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: PortfolioItem) => {
    setEditingProject(p);
    setTitle(p.title);
    setCategory(p.category);
    setDescription(p.description);
    setImage(p.image);
    setTechnologies(p.technologies);
    setProjectUrl(p.projectUrl || "");
    setGithubUrl(p.githubUrl || "");
    setFeatured(p.featured);
    setPublished(p.published);
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data?.media?.url) {
        setImage(data.media.url);
      }
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      title,
      category,
      description,
      image: image || "/images/logo.jpg",
      technologies,
      projectUrl: projectUrl || undefined,
      githubUrl: githubUrl || undefined,
      featured,
      published,
    };

    try {
      if (editingProject) {
        await fetch(`/api/admin/portfolio/${editingProject.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch("/api/admin/portfolio", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      setIsModalOpen(false);
      await fetchProjects();
    } catch (err) {
      console.error("Save project error:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/admin/portfolio/${id}`, { method: "DELETE" });
      setDeleteConfirmId(null);
      await fetchProjects();
    } catch (err) {
      console.error("Delete project error:", err);
    }
  };

  const categoriesList = ["Websites", "E-Commerce", "Applications", "Software", "UI/UX", "Branding", "Academic"];

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <AdminHeader
        title="Portfolio Showcase Manager"
        description="Add and manage client projects & case studies displayed on the public site."
      />

      <main className="p-6 space-y-6">
        
        <div className="bg-[#2E4053]/40 border border-[#D5DBDB]/15 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#F4F6F6]">Portfolio Projects ({projects.length})</h3>
            <p className="text-xs text-[#AAB7B8]">Filterable showcase projects for your visitors.</p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-[#1C2833] bg-[#F4F6F6] hover:bg-[#D5DBDB] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add New Project
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-[#AAB7B8]">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="bg-[#2E4053]/30 border border-[#D5DBDB]/15 rounded-2xl p-12 text-center text-xs text-[#AAB7B8]">
            No portfolio projects added yet. Click &quot;Add New Project&quot; to populate your showcase.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((p) => (
              <div
                key={p.id}
                className="bg-[#2E4053]/30 border border-[#D5DBDB]/15 rounded-2xl overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-40 w-full bg-[#1C2833]">
                    <Image src={p.image || "/images/logo.jpg"} alt={p.title} fill className="object-cover" />
                    <div className="absolute top-2 left-2 flex gap-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#1C2833]/90 text-[#F4F6F6]">
                        {p.category}
                      </span>
                      {p.featured && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/30">
                          FEATURED
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-5">
                    <h4 className="text-base font-bold text-[#F4F6F6] mb-1">{p.title}</h4>
                    <p className="text-xs text-[#AAB7B8] mb-3 line-clamp-2">{p.description}</p>
                    <p className="text-[10px] font-mono text-[#D5DBDB] truncate bg-[#1C2833] p-1.5 rounded">
                      {p.technologies}
                    </p>
                  </div>
                </div>

                <div className="p-4 border-t border-[#D5DBDB]/10 flex items-center justify-between">
                  <span className={`text-[10px] font-bold ${p.published ? "text-emerald-400" : "text-[#AAB7B8]"}`}>
                    {p.published ? "PUBLISHED" : "UNPUBLISHED"}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(p)}
                      className="p-1.5 rounded bg-[#1C2833] text-[#D5DBDB] hover:text-[#F4F6F6]"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(p.id)}
                      className="p-1.5 rounded bg-rose-950/60 text-rose-300 hover:bg-rose-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Form Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-[#1C2833]/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#1C2833] border border-[#D5DBDB]/20 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-[#D5DBDB]/10">
                <h3 className="text-base font-bold text-[#F4F6F6]">
                  {editingProject ? "Edit Portfolio Project" : "Add Portfolio Project"}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-[#AAB7B8] hover:text-[#F4F6F6]">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[#AAB7B8] mb-1 font-semibold">Project Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Modern E-Commerce Platform"
                    className="w-full p-2.5 rounded-xl bg-[#2E4053] border border-[#D5DBDB]/20 text-[#F4F6F6]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#AAB7B8] mb-1 font-semibold">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-[#2E4053] border border-[#D5DBDB]/20 text-[#F4F6F6]"
                    >
                      {categoriesList.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#AAB7B8] mb-1 font-semibold">Project Image</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        required
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        placeholder="/images/logo.jpg or upload URL"
                        className="w-full p-2.5 rounded-xl bg-[#2E4053] border border-[#D5DBDB]/20 text-[#F4F6F6] text-[11px]"
                      />
                      <label className="px-3 py-2 bg-[#2E4053] hover:bg-[#1C2833] text-[#F4F6F6] rounded-xl border border-[#D5DBDB]/20 cursor-pointer flex items-center justify-center shrink-0">
                        <Upload className="w-4 h-4" />
                        <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[#AAB7B8] mb-1 font-semibold">Description</label>
                  <textarea
                    rows={3}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#2E4053] border border-[#D5DBDB]/20 text-[#F4F6F6] resize-none"
                  />
                </div>

                <div>
                  <label className="block text-[#AAB7B8] mb-1 font-semibold">Technologies (Comma separated)</label>
                  <input
                    type="text"
                    required
                    value={technologies}
                    onChange={(e) => setTechnologies(e.target.value)}
                    placeholder="Next.js, TypeScript, PostgreSQL, Tailwind"
                    className="w-full p-2.5 rounded-xl bg-[#2E4053] border border-[#D5DBDB]/20 text-[#F4F6F6]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#AAB7B8] mb-1 font-semibold">Live Project URL (Optional)</label>
                    <input
                      type="url"
                      value={projectUrl}
                      onChange={(e) => setProjectUrl(e.target.value)}
                      placeholder="https://example.com"
                      className="w-full p-2.5 rounded-xl bg-[#2E4053] border border-[#D5DBDB]/20 text-[#F4F6F6]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#AAB7B8] mb-1 font-semibold">GitHub URL (Optional)</label>
                    <input
                      type="url"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      placeholder="https://github.com/org/repo"
                      className="w-full p-2.5 rounded-xl bg-[#2E4053] border border-[#D5DBDB]/20 text-[#F4F6F6]"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={published}
                      onChange={(e) => setPublished(e.target.checked)}
                      className="rounded bg-[#2E4053]"
                    />
                    <span className="text-[#D5DBDB] font-semibold">Published</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      className="rounded bg-[#2E4053]"
                    />
                    <span className="text-[#D5DBDB] font-semibold">Mark Featured</span>
                  </label>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#D5DBDB]/10">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 font-semibold text-[#AAB7B8]">
                    Cancel
                  </button>
                  <button type="submit" disabled={saving} className="px-5 py-2 font-bold bg-[#F4F6F6] text-[#1C2833] rounded-xl hover:bg-[#D5DBDB]">
                    {saving ? "Saving..." : "Save Project"}
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
                <h4 className="text-base font-bold">Delete Portfolio Project?</h4>
              </div>
              <p className="text-xs text-[#AAB7B8]">Are you sure you want to permanently remove this portfolio project?</p>
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
