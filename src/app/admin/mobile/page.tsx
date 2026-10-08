"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Search,
  Phone,
  Mail,
  Send,
  Bell,
  BellOff,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Lock,
  LogOut,
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
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

// Play notification chime using Web Audio API
function playAlertChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(587.33, ctx.currentTime);
    osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.45);
  } catch (e) {
    console.warn("Audio chime error:", e);
  }
}

// Trigger native device vibration
function triggerDeviceVibration() {
  if (typeof window !== "undefined") {
    const bridge = (window as unknown as { AndroidBridge?: { vibrate: (ms: number) => void } }).AndroidBridge;
    if (bridge?.vibrate) {
      bridge.vibrate(300);
      return;
    }
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200]);
    }
  }
}

// Trigger notification via Android Bridge or Web Notification
function triggerSystemNotification(title: string, body: string) {
  if (typeof window === "undefined") return;

  const bridge = (window as unknown as { AndroidBridge?: { showNotification: (t: string, b: string) => void } }).AndroidBridge;
  if (bridge?.showNotification) {
    bridge.showNotification(title, body);
    return;
  }

  if ("Notification" in window && Notification.permission === "granted") {
    new Notification(title, {
      body,
      icon: "/images/logo.png",
    });
  }
}

export default function MobileAdminPage() {
  // Authentication State
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Data & View State
  const [enquiries, setEnquiries] = useState<EnquiryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"PENDING" | "ALL" | "ACCEPTED" | "REJECTED">("PENDING");
  const [selectedEnquiry, setSelectedEnquiry] = useState<EnquiryItem | null>(null);

  // Workflow Decision State
  const [decisionMode, setDecisionMode] = useState<"ACCEPT" | "REJECT" | null>(null);
  const [decisionMessage, setDecisionMessage] = useState("");
  const [submittingDecision, setSubmittingDecision] = useState(false);

  // Alert Settings
  const [soundEnabled, setSoundEnabled] = useState(true);
  const previousPendingIdsRef = useRef<Set<string>>(new Set());
  const initialLoadDoneRef = useRef(false);

  // Check stored auth token on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("pf_mobile_token");
      if (stored) {
        setAuthToken(stored);
      }
      setAuthChecked(true);

      if ("Notification" in window && Notification.permission === "default") {
        Notification.requestPermission();
      }
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail.trim(), password: loginPassword }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        setLoginError(data?.error || "Invalid email or password.");
        setLoginLoading(false);
        return;
      }

      const token = data.token || "authenticated";
      setAuthToken(token);
      if (typeof window !== "undefined") {
        localStorage.setItem("pf_mobile_token", token);
      }
    } catch {
      setLoginError("Failed to connect to authentication server");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    setAuthToken(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("pf_mobile_token");
    }
  };

  // Fetch enquiries with optional silent background refresh
  const fetchEnquiries = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      else setRefreshing(true);

      const res = await fetch("/api/enquiries", {
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
      });
      const data = await res.json();

      if (Array.isArray(data)) {
        const currentPendingIds = new Set(
          data.filter((e: EnquiryItem) => e.status === "PENDING" || e.status === "NEW").map((e: EnquiryItem) => e.id)
        );

        if (initialLoadDoneRef.current) {
          const newPendingItems = data.filter(
            (e: EnquiryItem) => (e.status === "PENDING" || e.status === "NEW") && !previousPendingIdsRef.current.has(e.id)
          );

          if (newPendingItems.length > 0) {
            if (soundEnabled) playAlertChime();
            triggerDeviceVibration();

            const newest = newPendingItems[0];
            triggerSystemNotification(
              `🔔 New Enquiry: ${newest.name}`,
              `${newest.service} • ${newest.budget}`
            );
          }
        }

        previousPendingIdsRef.current = currentPendingIds;
        initialLoadDoneRef.current = true;
        setEnquiries(data);
      }
    } catch (err) {
      console.error("Failed to load enquiries:", err);
    } finally {
      if (!silent) setLoading(false);
      setRefreshing(false);
    }
  };

  // Polling every 15 seconds
  useEffect(() => {
    if (!authToken) return;
    fetchEnquiries();
    const interval = setInterval(() => {
      fetchEnquiries(true);
    }, 15000);
    return () => clearInterval(interval);
  }, [authToken, soundEnabled]);

  // Generate Acceptance Message Template
  const getAcceptanceMessage = (enq: EnquiryItem) => {
    return (
      `Hello ${enq.name}! 👋\n\n` +
      `Thank you for contacting *PixelForge Studio* regarding your *${enq.service}* project (Estimated Budget: *${enq.budget}*).\n\n` +
      `We have reviewed your project requirements and are delighted to let you know that *we have accepted your enquiry!* 🚀\n\n` +
      `We would love to discuss the project scope, technical roadmap, and timeline with you. Are you available for a quick discussion today or tomorrow?\n\n` +
      `Looking forward to collaborating with you!\n\n` +
      `Best regards,\n` +
      `*Keerthi Adarsh | PixelForge Studio*\n` +
      `📞 +91 87789 79416\n` +
      `🌐 https://pxfgsd.vercel.app`
    );
  };

  // Generate Rejection Message Template
  const getRejectionMessage = (enq: EnquiryItem) => {
    return (
      `Hello ${enq.name},\n\n` +
      `Thank you for reaching out to *PixelForge Studio* regarding your *${enq.service}* project.\n\n` +
      `After carefully reviewing our current project capacity and technical timeline, we regret to inform you that we are currently unable to take on this specific project.\n\n` +
      `We truly appreciate your interest in PixelForge Studio and wish you the very best with your project!\n\n` +
      `Best regards,\n` +
      `*Keerthi Adarsh | PixelForge Studio*\n` +
      `📞 +91 87789 79416`
    );
  };

  const handleSelectEnquiry = (enq: EnquiryItem) => {
    setSelectedEnquiry(enq);
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

  const handleSendWhatsApp = async () => {
    if (!selectedEnquiry || !decisionMode) return;
    setSubmittingDecision(true);

    const newStatus = decisionMode === "ACCEPT" ? "ACCEPTED" : "REJECTED";
    const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    const updatedNotes = `${selectedEnquiry.notes ? selectedEnquiry.notes + "\n" : ""}[${timestamp}] Decision: ${newStatus} via PixelForge Admin Mobile App.`;

    try {
      await fetch(`/api/admin/enquiries/${selectedEnquiry.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        body: JSON.stringify({
          status: newStatus,
          notes: updatedNotes,
        }),
      });

      setEnquiries((prev) =>
        prev.map((e) =>
          e.id === selectedEnquiry.id ? { ...e, status: newStatus, notes: updatedNotes } : e
        )
      );
      setSelectedEnquiry((prev) => (prev ? { ...prev, status: newStatus, notes: updatedNotes } : null));

      let cleanPhone = selectedEnquiry.phone.replace(/[^0-9]/g, "");
      if (cleanPhone.length === 10) {
        cleanPhone = `91${cleanPhone}`;
      }

      const encodedMessage = encodeURIComponent(decisionMessage);
      const waUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;

      const bridge = (window as unknown as { AndroidBridge?: { openWhatsApp: (p: string, m: string) => void } }).AndroidBridge;
      if (bridge?.openWhatsApp) {
        bridge.openWhatsApp(cleanPhone, decisionMessage);
      } else {
        window.open(waUrl, "_blank");
      }
    } catch (err) {
      console.error("Failed to update status before opening WhatsApp:", err);
    } finally {
      setSubmittingDecision(false);
    }
  };

  const pendingCount = enquiries.filter((e) => e.status === "PENDING" || e.status === "NEW").length;

  const filteredEnquiries = enquiries.filter((item) => {
    const matchesTab =
      activeTab === "ALL"
        ? true
        : activeTab === "PENDING"
        ? item.status === "PENDING" || item.status === "NEW"
        : item.status === activeTab;

    const matchesSearch =
      !search ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.phone.includes(search) ||
      item.service.toLowerCase().includes(search.toLowerCase()) ||
      item.budget.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());

    return matchesTab && matchesSearch;
  });

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-[#1C2833] flex items-center justify-center text-[#F4F6F6]">
        <Loader2 className="w-8 h-8 animate-spin text-[#D5DBDB]" />
      </div>
    );
  }

  // Exact Match to Desktop Admin Login Styling
  if (!authToken) {
    return (
      <div className="min-h-screen bg-[#1C2833] flex flex-col items-center justify-center p-4 antialiased font-sans">
        <div className="w-full max-w-sm bg-[#2E4053]/50 border border-[#D5DBDB]/15 rounded-3xl p-6 backdrop-blur-md shadow-2xl space-y-6">
          {/* Header Logo */}
          <div className="text-center">
            <div className="relative w-14 h-14 rounded-2xl overflow-hidden border border-[#D5DBDB]/20 bg-[#1C2833] flex items-center justify-center mx-auto mb-3 shadow-lg">
              <Image
                src="/images/logo.png"
                alt="PixelForge Studio"
                width={56}
                height={56}
                className="object-contain p-1"
                priority
              />
            </div>
            <h1 className="text-xl font-extrabold text-[#F4F6F6] tracking-tight">
              PIXELFORGE ADMIN
            </h1>
            <p className="text-xs text-[#AAB7B8] mt-1">
              Enquiry Management App
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && (
              <div className="bg-rose-950/80 border border-rose-500/30 rounded-xl p-3 flex items-center gap-2.5 text-xs text-rose-200">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#AAB7B8] mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#AAB7B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="admin@pixelforge.studio"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#1C2833] border border-[#D5DBDB]/20 text-xs text-[#F4F6F6] placeholder-[#AAB7B8]/40 focus:outline-none focus:border-[#D5DBDB] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#AAB7B8] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#AAB7B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-[#1C2833] border border-[#D5DBDB]/20 text-xs text-[#F4F6F6] placeholder-[#AAB7B8]/40 focus:outline-none focus:border-[#D5DBDB] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#AAB7B8] hover:text-[#F4F6F6] transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-[#1C2833] bg-[#F4F6F6] hover:bg-[#D5DBDB] disabled:opacity-50 transition-all shadow-lg flex items-center justify-center gap-2 mt-6 cursor-pointer"
            >
              {loginLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#1C2833]" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Admin</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1C2833] text-[#F4F6F6] pb-24 flex flex-col font-sans antialiased">
      {/* Top Header - Matching Desktop Admin Navbar */}
      <header className="sticky top-0 z-40 bg-[#1C2833]/95 backdrop-blur-md border-b border-[#2E4053] px-4 py-3 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-[#D5DBDB]/20 bg-[#1C2833] flex items-center justify-center">
              <Image
                src="/images/logo.png"
                alt="PixelForge Admin"
                width={32}
                height={32}
                className="object-contain p-0.5"
              />
            </div>
            <div>
              <div className="font-extrabold text-sm tracking-tight text-[#F4F6F6] leading-none flex items-center gap-1.5">
                <span>PIXEL<span className="text-[#AAB7B8]">FORGE</span></span>
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
              <span className="text-[10px] tracking-widest text-[#AAB7B8] uppercase block mt-0.5">
                ENQUIRY HUB
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Sound Toggle */}
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                if (!soundEnabled) playAlertChime();
              }}
              title={soundEnabled ? "Alert Sound On" : "Alert Sound Muted"}
              className={`p-2 rounded-xl border transition-colors ${
                soundEnabled
                  ? "bg-[#2E4053] border-[#D5DBDB]/20 text-[#F4F6F6]"
                  : "bg-[#1C2833] border-[#2E4053] text-[#AAB7B8]"
              }`}
            >
              {soundEnabled ? <Bell className="w-4 h-4 text-amber-300" /> : <BellOff className="w-4 h-4" />}
            </button>

            {/* Manual Refresh */}
            <button
              onClick={() => fetchEnquiries(false)}
              disabled={refreshing || loading}
              className="p-2 rounded-xl bg-[#2E4053] border border-[#D5DBDB]/10 text-[#AAB7B8] hover:text-[#F4F6F6] transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin text-[#F4F6F6]" : ""}`} />
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl bg-rose-950/40 border border-rose-500/20 text-rose-300 hover:text-white transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-3 relative">
          <input
            type="text"
            placeholder="Search client, phone, service, budget..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#1C2833] border border-[#D5DBDB]/15 text-xs text-[#F4F6F6] placeholder-[#AAB7B8]/50 focus:outline-none focus:border-[#D5DBDB] transition-colors"
          />
          <Search className="w-3.5 h-3.5 text-[#AAB7B8] absolute left-3 top-3" />
        </div>

        {/* Filter Tabs */}
        <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActiveTab("PENDING")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === "PENDING"
                ? "bg-[#2E4053] text-[#F4F6F6] border border-[#D5DBDB]/30 shadow-sm"
                : "bg-[#1C2833] border border-[#2E4053] text-[#AAB7B8]"
            }`}
          >
            <span>Pending</span>
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-400 text-[#1C2833] animate-pulse">
                {pendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("ALL")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === "ALL"
                ? "bg-[#2E4053] text-[#F4F6F6] border border-[#D5DBDB]/30 shadow-sm"
                : "bg-[#1C2833] border border-[#2E4053] text-[#AAB7B8]"
            }`}
          >
            All ({enquiries.length})
          </button>

          <button
            onClick={() => setActiveTab("ACCEPTED")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === "ACCEPTED"
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-[#1C2833] border border-[#2E4053] text-[#AAB7B8]"
            }`}
          >
            Accepted
          </button>

          <button
            onClick={() => setActiveTab("REJECTED")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === "REJECTED"
                ? "bg-rose-600 text-white shadow-sm"
                : "bg-[#1C2833] border border-[#2E4053] text-[#AAB7B8]"
            }`}
          >
            Rejected
          </button>
        </div>
      </header>

      {/* Main Enquiries Content */}
      <main className="flex-1 px-4 py-3 space-y-3">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-2 text-[#AAB7B8]">
            <Loader2 className="w-7 h-7 animate-spin text-[#F4F6F6]" />
            <p className="text-xs">Fetching client enquiries...</p>
          </div>
        ) : filteredEnquiries.length === 0 ? (
          <div className="py-16 text-center space-y-3 bg-[#2E4053]/30 border border-[#D5DBDB]/10 rounded-2xl p-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h3 className="text-sm font-bold text-[#F4F6F6]">No Enquiries Found</h3>
            <p className="text-xs text-[#AAB7B8]">
              {activeTab === "PENDING"
                ? "All caught up! No pending enquiries waiting for response."
                : "No enquiries match your current filter."}
            </p>
          </div>
        ) : (
          filteredEnquiries.map((enq) => {
            const isSelected = selectedEnquiry?.id === enq.id;
            const isPending = enq.status === "PENDING" || enq.status === "NEW";

            return (
              <div
                key={enq.id}
                className={`bg-[#2E4053]/40 border rounded-2xl p-4 transition-all space-y-3 ${
                  isPending
                    ? "border-amber-400/50 shadow-lg shadow-amber-400/5 ring-1 ring-amber-400/20"
                    : enq.status === "ACCEPTED"
                    ? "border-emerald-500/30"
                    : enq.status === "REJECTED"
                    ? "border-rose-500/30"
                    : "border-[#D5DBDB]/10"
                }`}
              >
                {/* Header: Name, Time, Status */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="font-bold text-sm text-[#F4F6F6] flex items-center gap-2">
                      {enq.name}
                      {isPending && (
                        <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black bg-amber-400 text-[#1C2833] uppercase animate-pulse">
                          Pending
                        </span>
                      )}
                      {enq.status === "ACCEPTED" && (
                        <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          Accepted
                        </span>
                      )}
                      {enq.status === "REJECTED" && (
                        <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          Rejected
                        </span>
                      )}
                    </h2>
                    <div className="flex items-center gap-1.5 text-[10px] text-[#AAB7B8] mt-0.5">
                      <Clock className="w-3 h-3" />
                      <span>{formatDate(enq.createdAt)}</span>
                    </div>
                  </div>

                  {/* Budget Badge */}
                  <span className="px-2.5 py-1 rounded-xl bg-[#1C2833] border border-[#D5DBDB]/15 text-[#F4F6F6] text-[11px] font-bold tracking-tight shrink-0 font-mono">
                    {enq.budget}
                  </span>
                </div>

                {/* Service Tag */}
                <div className="inline-block px-2.5 py-1 rounded-lg bg-[#1C2833] border border-[#D5DBDB]/15 text-[#D5DBDB] text-xs font-semibold">
                  🛠️ {enq.service}
                </div>

                {/* Description */}
                <div className="bg-[#1C2833] rounded-xl p-3 border border-[#D5DBDB]/10 text-xs text-[#D5DBDB] leading-relaxed">
                  {enq.description || "No project description provided."}
                </div>

                {/* Contact Shortcuts */}
                <div className="flex items-center gap-2 pt-1">
                  <a
                    href={`tel:${enq.phone}`}
                    className="flex-1 py-2 px-2.5 rounded-xl bg-[#1C2833] hover:bg-[#2E4053] text-[11px] font-medium text-[#F4F6F6] flex items-center justify-center gap-1.5 transition-colors border border-[#D5DBDB]/10"
                  >
                    <Phone className="w-3 h-3 text-emerald-400" />
                    <span className="truncate">{enq.phone}</span>
                  </a>

                  <a
                    href={`mailto:${enq.email}`}
                    className="flex-1 py-2 px-2.5 rounded-xl bg-[#1C2833] hover:bg-[#2E4053] text-[11px] font-medium text-[#F4F6F6] flex items-center justify-center gap-1.5 transition-colors border border-[#D5DBDB]/10"
                  >
                    <Mail className="w-3 h-3 text-sky-400" />
                    <span className="truncate">{enq.email}</span>
                  </a>
                </div>

                {/* Workflow Buttons: ACCEPT & REJECT */}
                <div className="pt-2 border-t border-[#D5DBDB]/10 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        handleSelectEnquiry(enq);
                        handleTriggerDecision("ACCEPT");
                      }}
                      className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                        isSelected && decisionMode === "ACCEPT"
                          ? "bg-emerald-600 text-white ring-2 ring-emerald-400"
                          : "bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-900/60"
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>ACCEPT</span>
                    </button>

                    <button
                      onClick={() => {
                        handleSelectEnquiry(enq);
                        handleTriggerDecision("REJECT");
                      }}
                      className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                        isSelected && decisionMode === "REJECT"
                          ? "bg-rose-600 text-white ring-2 ring-rose-400"
                          : "bg-rose-950/60 text-rose-300 border border-rose-500/30 hover:bg-rose-900/60"
                      }`}
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>REJECT</span>
                    </button>
                  </div>

                  {/* Pre-filled WhatsApp Response Box */}
                  {isSelected && decisionMode && (
                    <div className="p-3.5 rounded-2xl bg-[#1C2833] border border-[#D5DBDB]/20 space-y-2.5 animate-in fade-in duration-200 shadow-xl">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-[#F4F6F6] flex items-center gap-1.5">
                          <Sparkles className="w-3 h-3 text-amber-300" />
                          Pre-filled {decisionMode} WhatsApp Response
                        </span>
                        <span className="text-[10px] text-[#AAB7B8]">Editable</span>
                      </div>

                      <textarea
                        rows={6}
                        value={decisionMessage}
                        onChange={(e) => setDecisionMessage(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-[#2E4053]/50 border border-[#D5DBDB]/15 text-xs text-[#F4F6F6] leading-relaxed focus:outline-none focus:border-[#D5DBDB]"
                      />

                      <button
                        onClick={handleSendWhatsApp}
                        disabled={submittingDecision}
                        className="w-full py-3 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 disabled:opacity-50"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>
                          {submittingDecision
                            ? "Updating & Launching..."
                            : "📱 Open WhatsApp (Pre-filled)"}
                        </span>
                      </button>
                      <p className="text-[9px] text-center text-[#AAB7B8]">
                        Status will update to {decisionMode === "ACCEPT" ? "Accepted" : "Rejected"} & WhatsApp will open with message ready.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </main>
    </div>
  );
}
