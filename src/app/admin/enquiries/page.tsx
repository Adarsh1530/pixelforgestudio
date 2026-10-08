"use client";

import { useState, useEffect } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import {
  Search,
  MessageSquare,
  Mail,
  Phone,
  Trash2,
  Save,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ExternalLink,
  Filter,
  Sparkles,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface EnquiryItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  budget: string;
  description: string;
  status: "NEW" | "ACCEPTED" | "REJECTED" | "CONTACTED" | "IN_PROGRESS" | "COMPLETED" | "CLOSED";
  notes?: string | null;
  source: string;
  createdAt: string;
}

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<EnquiryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedEnquiry, setSelectedEnquiry] = useState<EnquiryItem | null>(null);
  const [editingNotes, setEditingNotes] = useState("");
  const [editingStatus, setEditingStatus] = useState<EnquiryItem["status"]>("NEW");
  const [updating, setUpdating] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/enquiries");
      const data = await res.json();
      if (Array.isArray(data)) {
        setEnquiries(data);
        if (data.length > 0 && !selectedEnquiry) {
          setSelectedEnquiry(data[0]);
          setEditingNotes(data[0].notes || "");
          setEditingStatus(data[0].status);
        }
      }
    } catch (err) {
      console.error("Fetch enquiries failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleSelect = (enq: EnquiryItem) => {
    setSelectedEnquiry(enq);
    setEditingNotes(enq.notes || "");
    setEditingStatus(enq.status);
  };

  const handleUpdateStatusNotes = async () => {
    if (!selectedEnquiry) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/enquiries/${selectedEnquiry.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: editingStatus,
          notes: editingNotes,
        }),
      });

      if (res.ok) {
        await fetchEnquiries();
        setSelectedEnquiry((prev) =>
          prev ? { ...prev, status: editingStatus, notes: editingNotes } : null
        );
      }
    } catch (err) {
      console.error("Failed to update enquiry:", err);
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteEnquiry = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/enquiries/${id}`, { method: "DELETE" });
      if (res.ok) {
        setDeleteConfirmId(null);
        if (selectedEnquiry?.id === id) setSelectedEnquiry(null);
        await fetchEnquiries();
      }
    } catch (err) {
      console.error("Failed to delete enquiry:", err);
    }
  };

  const handleDecision = async (action: "accept" | "reject") => {
    if (!selectedEnquiry) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/enquiries/${selectedEnquiry.id}/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (res.ok && data?.whatsappUrl) {
        const updatedStatus = action === "accept" ? "ACCEPTED" : "REJECTED";
        setEditingStatus(updatedStatus as any);
        setSelectedEnquiry((prev) => (prev ? { ...prev, status: updatedStatus as any } : null));
        setEnquiries((prev) =>
          prev.map((e) => (e.id === selectedEnquiry.id ? { ...e, status: updatedStatus as any } : e))
        );
        window.open(data.whatsappUrl, "_blank");
      }
    } catch (err) {
      console.error("Decision update failed:", err);
    } finally {
      setUpdating(false);
    }
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30">
            ACCEPTED
          </span>
        );
      case "REJECTED":
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-500/30">
            REJECTED
          </span>
        );
      case "NEW":
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-500/30">
            NEW
          </span>
        );
      case "CONTACTED":
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-950 text-sky-300 border border-sky-500/30">
            CONTACTED
          </span>
        );
      case "IN_PROGRESS":
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-500/30">
            IN PROGRESS
          </span>
        );
      case "COMPLETED":
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30">
            COMPLETED
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#1C2833] text-[#AAB7B8]">
            CLOSED
          </span>
        );
    }
  };

  const filteredEnquiries = enquiries.filter((e) => {
    const matchesSearch =
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase()) ||
      e.phone.toLowerCase().includes(search.toLowerCase()) ||
      e.service.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <AdminHeader
        title="Enquiry Lead Management"
        description="Search, process, assign status, and contact prospective clients."
      />

      <main className="p-6 space-y-6">
        
        {/* Top Search & Filter Bar */}
        <div className="bg-[#2E4053]/40 border border-[#D5DBDB]/15 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-[#AAB7B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by client name, email, phone, or service..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1C2833] border border-[#D5DBDB]/20 text-xs text-[#F4F6F6] placeholder-[#AAB7B8]/50 focus:outline-none focus:border-[#D5DBDB]"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#AAB7B8]" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl bg-[#1C2833] border border-[#D5DBDB]/20 text-xs text-[#F4F6F6] focus:outline-none"
            >
              <option value="ALL">All Statuses ({enquiries.length})</option>
              <option value="NEW">New Leads</option>
              <option value="ACCEPTED">Accepted ✅</option>
              <option value="REJECTED">Rejected ❌</option>
              <option value="CONTACTED">Contacted</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>
        </div>

        {/* Master / Detail Split View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Master List (5 Cols) */}
          <div className="lg:col-span-5 bg-[#2E4053]/30 border border-[#D5DBDB]/15 rounded-2xl overflow-hidden flex flex-col h-[650px]">
            <div className="p-4 border-b border-[#D5DBDB]/10 bg-[#1C2833]/60 flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-[#AAB7B8]">
                Leads List ({filteredEnquiries.length})
              </span>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-[#D5DBDB]/10">
              {loading ? (
                <div className="p-8 text-center text-xs text-[#AAB7B8]">Loading enquiries...</div>
              ) : filteredEnquiries.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#AAB7B8]">No matching enquiries found.</div>
              ) : (
                filteredEnquiries.map((enq) => {
                  const isSelected = selectedEnquiry?.id === enq.id;
                  return (
                    <div
                      key={enq.id}
                      onClick={() => handleSelect(enq)}
                      className={`p-4 cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-[#2E4053] border-l-4 border-l-[#F4F6F6]"
                          : "hover:bg-[#2E4053]/40"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-bold text-[#F4F6F6] truncate">{enq.name}</h4>
                        <span className="text-[10px] text-[#AAB7B8] font-mono">
                          {formatDate(enq.createdAt)}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-[#D5DBDB] mb-1">{enq.service}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-[#AAB7B8]">{enq.budget}</span>
                        {renderStatusBadge(enq.status)}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Detail & Operations View (7 Cols) */}
          <div className="lg:col-span-7 bg-[#2E4053]/30 border border-[#D5DBDB]/15 rounded-2xl p-6 flex flex-col justify-between h-[650px] overflow-y-auto">
            {selectedEnquiry ? (
              <div className="space-y-6">
                
                {/* Header & Quick Action Trigger Buttons */}
                <div className="pb-4 border-b border-[#D5DBDB]/10 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-[#F4F6F6]">{selectedEnquiry.name}</h3>
                    <p className="text-xs text-[#AAB7B8]">
                      Submitted on {formatDate(selectedEnquiry.createdAt)} via {selectedEnquiry.source}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`https://wa.me/${selectedEnquiry.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hello ${selectedEnquiry.name}, regarding your ${selectedEnquiry.service} enquiry:`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-xs font-bold hover:bg-emerald-900 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      WhatsApp
                    </a>
                    <a
                      href={`tel:${selectedEnquiry.phone.replace(/[^0-9+]/g, "")}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1C2833] text-[#F4F6F6] border border-[#D5DBDB]/20 text-xs font-semibold hover:bg-[#2E4053] transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      Call
                    </a>
                    <a
                      href={`mailto:${selectedEnquiry.email}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1C2833] text-[#F4F6F6] border border-[#D5DBDB]/20 text-xs font-semibold hover:bg-[#2E4053] transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      Email
                    </a>
                  </div>
                </div>

                {/* Quick Decision: 1-Click Accept / Reject with WhatsApp Reply */}
                <div className="p-4 rounded-xl bg-[#1C2833] border border-[#D5DBDB]/15 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#F4F6F6] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      Decision & Instant Client Reply
                    </span>
                    {renderStatusBadge(selectedEnquiry.status)}
                  </div>
                  <p className="text-xs text-[#AAB7B8] leading-relaxed">
                    Clicking instantly records the decision in the database and opens WhatsApp with a personalized message to the client.
                  </p>
                  <div className="flex items-center gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => handleDecision("accept")}
                      disabled={updating || selectedEnquiry.status === "ACCEPTED"}
                      className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md ${
                        selectedEnquiry.status === "ACCEPTED"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default"
                          : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/50 hover:scale-[1.01]"
                      } disabled:opacity-60`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      {selectedEnquiry.status === "ACCEPTED" ? "Enquiry Accepted ✅" : "Accept & Send WhatsApp"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDecision("reject")}
                      disabled={updating || selectedEnquiry.status === "REJECTED"}
                      className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md ${
                        selectedEnquiry.status === "REJECTED"
                          ? "bg-rose-500/20 text-rose-300 border border-rose-500/40 cursor-default"
                          : "bg-rose-700 hover:bg-rose-600 text-white shadow-rose-950/50 hover:scale-[1.01]"
                      } disabled:opacity-60`}
                    >
                      <XCircle className="w-4 h-4" />
                      {selectedEnquiry.status === "REJECTED" ? "Enquiry Rejected ❌" : "Reject & Send WhatsApp"}
                    </button>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4 text-xs bg-[#1C2833] p-4 rounded-xl border border-[#D5DBDB]/10">
                  <div>
                    <span className="text-[#AAB7B8] block text-[10px] uppercase font-mono">Service Requested</span>
                    <span className="font-bold text-[#F4F6F6] text-sm">{selectedEnquiry.service}</span>
                  </div>
                  <div>
                    <span className="text-[#AAB7B8] block text-[10px] uppercase font-mono">Budget</span>
                    <span className="font-bold text-[#F4F6F6] text-sm">{selectedEnquiry.budget}</span>
                  </div>
                  <div>
                    <span className="text-[#AAB7B8] block text-[10px] uppercase font-mono">Client Email</span>
                    <span className="text-[#D5DBDB]">{selectedEnquiry.email}</span>
                  </div>
                  <div>
                    <span className="text-[#AAB7B8] block text-[10px] uppercase font-mono">Client Phone</span>
                    <span className="text-[#D5DBDB]">{selectedEnquiry.phone}</span>
                  </div>
                </div>

                {/* Description Body */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#AAB7B8] mb-2">
                    Project Requirement Description
                  </h4>
                  <div className="p-4 rounded-xl bg-[#1C2833] border border-[#D5DBDB]/10 text-xs text-[#D5DBDB] leading-relaxed whitespace-pre-wrap">
                    {selectedEnquiry.description}
                  </div>
                </div>

                {/* Internal Notes & Status Update Controls */}
                <div className="p-4 rounded-xl bg-[#1C2833] border border-[#D5DBDB]/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#AAB7B8]">
                      Update Lead Status
                    </label>
                    <select
                      value={editingStatus}
                      onChange={(e) => setEditingStatus(e.target.value as any)}
                      className="px-3 py-1.5 rounded-lg bg-[#2E4053] border border-[#D5DBDB]/20 text-xs text-[#F4F6F6]"
                    >
                      <option value="NEW">NEW LEAD</option>
                      <option value="ACCEPTED">ACCEPTED</option>
                      <option value="REJECTED">REJECTED</option>
                      <option value="CONTACTED">CONTACTED</option>
                      <option value="IN_PROGRESS">IN PROGRESS</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="CLOSED">CLOSED</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#AAB7B8] mb-1">
                      Internal Notes
                    </label>
                    <textarea
                      rows={3}
                      value={editingNotes}
                      onChange={(e) => setEditingNotes(e.target.value)}
                      placeholder="Add confidential notes (e.g. quoted ₹25k, viva guide scheduled...)"
                      className="w-full p-3 rounded-lg bg-[#2E4053] border border-[#D5DBDB]/20 text-xs text-[#F4F6F6] placeholder-[#AAB7B8]/50 focus:outline-none resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => setDeleteConfirmId(selectedEnquiry.id)}
                      className="px-3 py-1.5 rounded-lg bg-rose-950/60 text-rose-300 border border-rose-500/30 text-xs font-semibold hover:bg-rose-900 transition-colors inline-flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete Lead
                    </button>

                    <button
                      onClick={handleUpdateStatusNotes}
                      disabled={updating}
                      className="px-4 py-2 rounded-lg bg-[#F4F6F6] text-[#1C2833] text-xs font-bold hover:bg-[#D5DBDB] transition-colors inline-flex items-center gap-1.5"
                    >
                      <Save className="w-3.5 h-3.5" />
                      {updating ? "Saving..." : "Save Status & Notes"}
                    </button>
                  </div>
                </div>

              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-[#AAB7B8]">
                <MessageSquare className="w-10 h-10 mb-3" />
                <p className="text-sm font-semibold">Select an enquiry lead from the left list to view details.</p>
              </div>
            )}
          </div>

        </div>

        {/* Delete Confirmation Modal */}
        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 bg-[#1C2833]/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#1C2833] border border-rose-500/40 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
              <div className="flex items-center gap-3 text-rose-400">
                <AlertCircle className="w-6 h-6 shrink-0" />
                <h4 className="text-base font-bold">Delete Enquiry Lead?</h4>
              </div>
              <p className="text-xs text-[#AAB7B8]">
                This action cannot be undone. Are you sure you want to permanently remove this enquiry?
              </p>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-[#AAB7B8] hover:bg-[#2E4053]"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteEnquiry(deleteConfirmId)}
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
