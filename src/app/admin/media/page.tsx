"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import AdminHeader from "@/components/admin/AdminHeader";
import { Upload, Copy, Check, Trash2, Image as ImageIcon, AlertCircle } from "lucide-react";
import { formatDateShort } from "@/lib/utils";

interface MediaItem {
  id: string;
  filename: string;
  url: string;
  type: string;
  size: number;
  createdAt: string;
}

export default function AdminMediaPage() {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/media");
      const data = await res.json();
      if (Array.isArray(data)) setMediaList(data);
    } catch (err) {
      console.error("Fetch media error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

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
      if (res.ok) {
        await fetchMedia();
      } else {
        alert(data?.error || "Upload failed");
      }
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleCopyUrl = (item: MediaItem) => {
    navigator.clipboard.writeText(item.url);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/admin/media/${id}`, { method: "DELETE" });
      setDeleteConfirmId(null);
      await fetchMedia();
    } catch (err) {
      console.error("Delete media error:", err);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <AdminHeader
        title="Media Library Manager"
        description="Upload, inspect, copy image URLs, and manage assets."
      />

      <main className="p-6 space-y-6">
        
        {/* Upload Bar */}
        <div className="bg-[#2E4053]/40 border border-[#D5DBDB]/15 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#F4F6F6]">Media Assets ({mediaList.length})</h3>
            <p className="text-xs text-[#AAB7B8]">Upload JPG, PNG, WEBP, or SVG images up to 5MB.</p>
          </div>

          <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-[#1C2833] bg-[#F4F6F6] hover:bg-[#D5DBDB] cursor-pointer transition-colors shadow-md">
            <Upload className="w-4 h-4" />
            <span>{uploading ? "Uploading Image..." : "Upload New Image"}</span>
            <input
              type="file"
              accept="image/*"
              disabled={uploading}
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Media Grid */}
        {loading ? (
          <div className="p-12 text-center text-xs text-[#AAB7B8]">Loading media assets...</div>
        ) : mediaList.length === 0 ? (
          <div className="bg-[#2E4053]/30 border border-[#D5DBDB]/15 rounded-2xl p-12 text-center text-xs text-[#AAB7B8]">
            <ImageIcon className="w-10 h-10 mx-auto mb-3 text-[#AAB7B8]" />
            Your media library is empty. Click &quot;Upload New Image&quot; to add your first asset.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mediaList.map((item) => (
              <div
                key={item.id}
                className="bg-[#2E4053]/30 border border-[#D5DBDB]/15 rounded-2xl overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-40 w-full bg-[#1C2833]">
                    <Image src={item.url} alt={item.filename} fill className="object-cover" />
                  </div>
                  <div className="p-4 space-y-1">
                    <p className="text-xs font-bold text-[#F4F6F6] truncate" title={item.filename}>
                      {item.filename}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-[#AAB7B8] font-mono">
                      <span>{formatSize(item.size)}</span>
                      <span>{formatDateShort(item.createdAt)}</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 border-t border-[#D5DBDB]/10 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleCopyUrl(item)}
                    className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-[#1C2833] text-[#D5DBDB] hover:text-[#F4F6F6] text-xs font-medium border border-[#D5DBDB]/15 transition-colors"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy URL</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setDeleteConfirmId(item.id)}
                    className="p-1.5 rounded-lg bg-rose-950/60 text-rose-300 border border-rose-500/30 hover:bg-rose-900 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 bg-[#1C2833]/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#1C2833] border border-rose-500/40 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
              <div className="flex items-center gap-3 text-rose-400">
                <AlertCircle className="w-6 h-6 shrink-0" />
                <h4 className="text-base font-bold">Delete Media Asset?</h4>
              </div>
              <p className="text-xs text-[#AAB7B8]">
                Are you sure you want to permanently delete this file? Any references to its URL will break.
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
