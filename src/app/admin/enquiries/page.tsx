"use client";

import { useState, useEffect, useRef } from "react";
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
  Bell,
  BellRing,
  Sparkles,
  Send,
  RefreshCw,
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
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "NEW" | "CONTACTED" | "IN_PROGRESS" | "COMPLETED" | "CLOSED";
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
  const [editingStatus, setEditingStatus] = useState<EnquiryItem["status"]>("PENDING");
  const [updating, setUpdating] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Workflow Decision State: "ACCEPT" | "REJECT" | null
  const [decisionMode, setDecisionMode] = useState<"ACCEPT" | "REJECT" | null>(null);
  const [decisionMessage, setDecisionMessage] = useState<string>("");

  // Notification State
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const previousCountRef = useRef<number>(0);

  const getAcceptanceMessage = (enq: EnquiryItem) => {
    return (
      `Hello ${enq.name}! 👋\n\n` +
      `Thank you for contacting PixelForge Studio.\n\n` +
      `✅ We are pleased to *ACCEPT* your project enquiry for:\n` +
      `• Service: ${enq.service}\n` +
      `• Budget: ${enq.budget}\n\n` +
      `We would love to discuss the project requirements, architecture, and timeline with you. Let us know when it's convenient for a quick call or chat!\n\n` +
      `Best regards,\n` +
      `Keerthi Adarsh | PixelForge Studio\n` +
      `📞 +91 87789 79416\n` +
      `🌐 https://pxfgsd.vercel.app`
    );
  };

  const getRejectionMessage = (enq: EnquiryItem) => {
    return (
      `Hello ${enq.name},\n\n` +
      `Thank you for reaching out to PixelForge Studio regarding your enquiry for:\n` +
      `• Service: ${enq.service}\n` +
      `• Budget: ${enq.budget}\n\n` +
      `❌ Unfortunately, we are currently unable to take on this project due to our existing development and scheduling commitments.\n\n` +
      `We truly appreciate your interest in PixelForge Studio and wish you the very best with your project!\n\n` +
      `Best regards,\n` +
      `Keerthi Adarsh | PixelForge Studio\n` +
      `📞 +91 87789 79416`
    );
  };

  const fetchEnquiries = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const res = await fetch("/api/enquiries");
      const data = await res.json();
      if (Array.isArray(data)) {
        // Trigger browser notification if new enquiries arrived
        if (
          notificationsEnabled &&
          previousCountRef.current > 0 &&
          data.length > previousCountRef.current &&
          typeof window !== "undefined" &&
          "Notification" in window &&
          Notification.permission === "granted"
        ) {
          const newest = data[0];
          new Notification("🔔 New PixelForge Enquiry Received!", {
            body: `From: ${newest.name} | Service: ${newest.service} | Budget: ${newest.budget}`,
            icon: "/images/logo.png",
          });
        }
        previousCountRef.current = data.length;

        setEnquiries(data);
        if (data.length > 0 && !selectedEnquiry) {
          selectEnquiry(data[0]);
        } else if (selectedEnquiry) {
          const refreshed = data.find((item: EnquiryItem) => item.id === selectedEnquiry.id);
          if (refreshed) {
            setSelectedEnquiry(refreshed);
          }
        }
      }
    } catch (err) {
      console.error("Fetch enquiries failed:", err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  // Initial load and periodic polling every 20s
  useEffect(() => {
    fetchEnquiries();
    const interval = setInterval(() => {
      fetchEnquiries(true);
    }, 20000);
    return () => clearInterval(interval);
  }, [notificationsEnabled]);

  const requestNotificationPermission = async () => {
    if (typeof window !== "undefined" && "Notification" in window) {
      const perm = await Notification.requestPermission();
      if (perm === "granted") {
        setNotificationsEnabled(true);
        new Notification("🔔 PixelForge Notifications Enabled", {
          body: "You will be alerted when prospective clients submit project enquiries.",
          icon: "/images/logo.png",
        });
      }
    }
  };

  const selectEnquiry = (enq: EnquiryItem) => {
    setSelectedEnquiry(enq);
    setEditingNotes(enq.notes || "");
    setEditingStatus(enq.status);
    // Reset decision mode when selecting another enquiry
    setDecisionMode(null);
    setDecisionMessage("");
  };

  const handleTriggerDecision = (mode: "ACCEPT" | "REJECT") => {
    if (!selectedEnquiry) return;
    setDecisionMode(mode);
    if (mode === "ACCEPT") {
      setDecisionMessage(getAcceptanceMessage(selectedEnquiry));
    } else {
      setDecisionMessage(getRejectionMessage(selectedEnquiry));
    }
  };

  const handleSendDecisionOnWhatsApp = async () => {
    if (!selectedEnquiry || !decisionMode) return;
    setUpdating(true);

    const targetStatus = decisionMode === "ACCEPT" ? "ACCEPTED" : "REJECTED";
    const cleanPhone = selectedEnquiry.phone.replace(/[^0-9]/g, "");
    const encodedText = encodeURIComponent(decisionMessage);
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodedText}`;

    try {
      const logNote = `[${new Date().toLocaleString()}]: Marked as ${targetStatus} and WhatsApp response prepared.`;
      const updatedNotes = selectedEnquiry.notes
        ? `${selectedEnquiry.notes}\n${logNote}`
        : logNote;

      const res = await fetch(`/api/admin/enquiries/${selectedEnquiry.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: targetStatus,
          notes: updatedNotes,
        }),
      });

      if (res.ok) {
        setSelectedEnquiry((prev) =>
          prev ? { ...prev, status: targetStatus, notes: updatedNotes } : null
        );
        setEditingStatus(targetStatus);
        setEditingNotes(updatedNotes);
        setEnquiries((prev) =>
          prev.map((e) =>
            e.id === selectedEnquiry.id ? { ...e, status: targetStatus, notes: updatedNotes } : e
          )
        );

        // Open WhatsApp in a new tab with client phone & pre-filled message
        window.open(waUrl, "_blank");
      }
    } catch (err) {
      console.error("Failed to update enquiry status:", err);
    } finally {
      setUpdating(false);
    }
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
        await fetchEnquiries(true);
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
        if (selectedEnquiry?.id === id) {
          setSelectedEnquiry(null);
          setDecisionMode(null);
        }
        await fetchEnquiries(true);
      }
    } catch (err) {
      console.error("Failed to delete enquiry:", err);
    }
  };

  const pendingCount = enquiries.filter(
    (e) => e.status === "PENDING" || e.status === "NEW"
  ).length;

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
      case "NEW":
        return (
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-500/40 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            PENDING
          </span>
        );
      case "ACCEPTED":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40">
            <CheckCircle2 className="w-3 h-3" />
            ACCEPTED
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-500/40">
            <XCircle className="w-3 h-3" />
            REJECTED
          </span>
        );
      case "CONTACTED":
        return (
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-sky-950 text-sky-300 border border-sky-500/30">
            CONTACTED
          </span>
        );
      case "IN_PROGRESS":
        return (
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-500/30">
            IN PROGRESS
          </span>
        );
      case "COMPLETED":
        return (
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30">
            COMPLETED
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#1C2833] text-[#AAB7B8]">
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

    if (statusFilter === "ALL") return matchesSearch;
    if (statusFilter === "PENDING") {
      return matchesSearch && (e.status === "PENDING" || e.status === "NEW");
    }
    return matchesSearch && e.status === statusFilter;
  });

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <AdminHeader
        title="Enquiry Lead Management"
        description="Review incoming website enquiries, accept or reject leads, and respond via WhatsApp."
      />

      <main className="p-6 space-y-6">

        {/* Real-time Notification Alert Bar */}
        {pendingCount > 0 ? (
          <div className="bg-amber-950/70 border border-amber-500/40 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-lg animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0 border border-amber-500/30">
                <BellRing className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-amber-200">
                  {pendingCount} Pending {pendingCount === 1 ? "Enquiry" : "Enquiries"} Awaiting Review
                </h4>
                <p className="text-xs text-amber-300/80">
                  Clients are waiting for project consultation. Accept or reject leads below to send WhatsApp responses.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!notificationsEnabled && (
                <button
                  type="button"
                  onClick={requestNotificationPermission}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/30 text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <Bell className="w-3.5 h-3.5" />
                  Enable Desktop Alerts
                </button>
              )}
              <button
                type="button"
                onClick={() => fetchEnquiries(false)}
                className="p-2 rounded-xl bg-[#1C2833] text-[#D5DBDB] hover:text-[#F4F6F6] border border-[#D5DBDB]/15 transition-colors"
                title="Refresh list"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-[#2E4053]/30 border border-[#D5DBDB]/10 rounded-2xl p-3 px-4 flex items-center justify-between text-xs text-[#AAB7B8]">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              All leads processed. Real-time polling active.
            </span>
            {!notificationsEnabled && (
              <button
                type="button"
                onClick={requestNotificationPermission}
                className="text-xs text-[#D5DBDB] hover:text-[#F4F6F6] underline flex items-center gap-1"
              >
                <Bell className="w-3 h-3" /> Enable Browser Notifications
              </button>
            )}
          </div>
        )}

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
              <option value="PENDING">Pending Review ({pendingCount})</option>
              <option value="ACCEPTED">Accepted ✅</option>
              <option value="REJECTED">Rejected ❌</option>
              <option value="CONTACTED">Contacted</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>
        </div>

        {/* Two-Column Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Enquiries List (5 Cols) */}
          <div className="lg:col-span-5 bg-[#2E4053]/30 border border-[#D5DBDB]/15 rounded-2xl overflow-hidden flex flex-col h-[700px]">
            <div className="p-4 border-b border-[#D5DBDB]/10 flex items-center justify-between bg-[#1C2833]/50">
              <span className="text-xs font-bold text-[#F4F6F6] uppercase tracking-wider">
                Enquiry Inbox ({filteredEnquiries.length})
              </span>
              <button
                type="button"
                onClick={() => fetchEnquiries(false)}
                className="text-xs text-[#AAB7B8] hover:text-[#F4F6F6] inline-flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Refresh
              </button>
            </div>

            <div className="overflow-y-auto flex-1 divide-y divide-[#D5DBDB]/10">
              {loading && enquiries.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#AAB7B8]">Loading enquiry leads...</div>
              ) : filteredEnquiries.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#AAB7B8]">No enquiries found matching filter.</div>
              ) : (
                filteredEnquiries.map((enq) => {
                  const isSelected = selectedEnquiry?.id === enq.id;
                  const isPending = enq.status === "PENDING" || enq.status === "NEW";

                  return (
                    <div
                      key={enq.id}
                      onClick={() => selectEnquiry(enq)}
                      className={`p-4 transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#2E4053] border-l-4 border-l-emerald-400"
                          : isPending
                          ? "bg-amber-950/20 hover:bg-[#2E4053]/40 border-l-2 border-l-amber-500/50"
                          : "hover:bg-[#2E4053]/40"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-[#F4F6F6] truncate max-w-[170px]">
                          {enq.name}
                        </span>
                        <span className="text-[10px] text-[#AAB7B8]">
                          {formatDate(enq.createdAt)}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-[#D5DBDB] mb-1.5 truncate">
                        {enq.service}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-[#AAB7B8] font-mono">{enq.budget}</span>
                        {renderStatusBadge(enq.status)}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Detail & Operations View (7 Cols) */}
          <div className="lg:col-span-7 bg-[#2E4053]/30 border border-[#D5DBDB]/15 rounded-2xl p-6 flex flex-col justify-between h-[700px] overflow-y-auto">
            {selectedEnquiry ? (
              <div className="space-y-6">
                
                {/* Header Client Overview */}
                <div className="pb-4 border-b border-[#D5DBDB]/10 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2.5 mb-1">
                      <h3 className="text-xl font-bold text-[#F4F6F6]">{selectedEnquiry.name}</h3>
                      {renderStatusBadge(selectedEnquiry.status)}
                    </div>
                    <p className="text-xs text-[#AAB7B8]">
                      Submitted on {formatDate(selectedEnquiry.createdAt)} via {selectedEnquiry.source}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
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

                {/* 1-CLICK ACCEPT / REJECT WORKFLOW PANEL */}
                <div className="p-5 rounded-2xl bg-[#1C2833] border border-[#D5DBDB]/15 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#F4F6F6] flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                        Decision Workflow: Accept or Reject Lead
                      </span>
                      <p className="text-xs text-[#AAB7B8] mt-0.5">
                        Choose an action to generate a pre-filled WhatsApp response for this client.
                      </p>
                    </div>
                  </div>

                  {/* Accept & Reject Action Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleTriggerDecision("ACCEPT")}
                      className={`inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer ${
                        decisionMode === "ACCEPT"
                          ? "bg-emerald-600 text-white ring-2 ring-emerald-400 shadow-emerald-950/60"
                          : selectedEnquiry.status === "ACCEPTED"
                          ? "bg-emerald-950/80 text-emerald-300 border border-emerald-500/40"
                          : "bg-[#2E4053] hover:bg-emerald-700 hover:text-white text-[#F4F6F6] border border-[#D5DBDB]/15"
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>{selectedEnquiry.status === "ACCEPTED" ? "Accepted (Review Message)" : "ACCEPT Enquiry"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleTriggerDecision("REJECT")}
                      className={`inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer ${
                        decisionMode === "REJECT"
                          ? "bg-rose-700 text-white ring-2 ring-rose-400 shadow-rose-950/60"
                          : selectedEnquiry.status === "REJECTED"
                          ? "bg-rose-950/80 text-rose-300 border border-rose-500/40"
                          : "bg-[#2E4053] hover:bg-rose-800 hover:text-white text-[#F4F6F6] border border-[#D5DBDB]/15"
                      }`}
                    >
                      <XCircle className="w-4 h-4 text-rose-400" />
                      <span>{selectedEnquiry.status === "REJECTED" ? "Rejected (Review Message)" : "REJECT Enquiry"}</span>
                    </button>
                  </div>

                  {/* Predefined WhatsApp Message Editor & Send on WhatsApp Action */}
                  {decisionMode && (
                    <div className="pt-3 border-t border-[#D5DBDB]/10 space-y-3 animate-fade-in">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#D5DBDB] flex items-center gap-1.5">
                          <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
                          Predefined {decisionMode === "ACCEPT" ? "Acceptance" : "Rejection"} WhatsApp Message (Editable):
                        </span>
                        <span className="text-[10px] text-[#AAB7B8]">Target: {selectedEnquiry.phone}</span>
                      </div>

                      <textarea
                        rows={7}
                        value={decisionMessage}
                        onChange={(e) => setDecisionMessage(e.target.value)}
                        className="w-full p-3 rounded-xl bg-[#2E4053]/70 border border-[#D5DBDB]/20 text-xs text-[#F4F6F6] font-mono leading-relaxed focus:outline-none focus:border-[#D5DBDB] resize-y"
                        placeholder="WhatsApp message..."
                      />

                      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                        <button
                          type="button"
                          onClick={() => setDecisionMode(null)}
                          className="text-xs text-[#AAB7B8] hover:text-[#F4F6F6] transition-colors"
                        >
                          Cancel
                        </button>

                        <button
                          type="button"
                          onClick={handleSendDecisionOnWhatsApp}
                          disabled={updating}
                          className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-xs font-bold uppercase tracking-wider text-[#1C2833] bg-[#25D366] hover:bg-[#20ba59] disabled:opacity-50 transition-all shadow-lg shadow-emerald-950/60 cursor-pointer"
                        >
                          <Send className="w-4 h-4 fill-current" />
                          <span>{updating ? "Saving..." : "Send on WhatsApp"}</span>
                        </button>
                      </div>
                    </div>
                  )}
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

                {/* Internal Notes & Manual Status Dropdown */}
                <div className="p-4 rounded-xl bg-[#1C2833] border border-[#D5DBDB]/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#AAB7B8]">
                      Manual Status Override
                    </label>
                    <select
                      value={editingStatus}
                      onChange={(e) => setEditingStatus(e.target.value as any)}
                      className="px-3 py-1.5 rounded-lg bg-[#2E4053] border border-[#D5DBDB]/20 text-xs text-[#F4F6F6]"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="ACCEPTED">ACCEPTED ✅</option>
                      <option value="REJECTED">REJECTED ❌</option>
                      <option value="CONTACTED">CONTACTED</option>
                      <option value="IN_PROGRESS">IN PROGRESS</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="CLOSED">CLOSED</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#AAB7B8] mb-1">
                      Internal Notes & History
                    </label>
                    <textarea
                      rows={3}
                      value={editingNotes}
                      onChange={(e) => setEditingNotes(e.target.value)}
                      placeholder="Add confidential notes (e.g. quote ₹25k, viva guide scheduled...)"
                      className="w-full p-3 rounded-lg bg-[#2E4053] border border-[#D5DBDB]/20 text-xs text-[#F4F6F6] placeholder-[#AAB7B8]/50 focus:outline-none resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(selectedEnquiry.id)}
                      className="px-3 py-1.5 rounded-lg bg-rose-950/60 text-rose-300 border border-rose-500/30 text-xs font-semibold hover:bg-rose-900 transition-colors inline-flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete Lead
                    </button>

                    <button
                      type="button"
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
                  type="button"
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-[#AAB7B8] hover:bg-[#2E4053]"
                >
                  Cancel
                </button>
                <button
                  type="button"
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
