"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Mail, Phone, MessageSquare, Send, CheckCircle2, AlertCircle, User } from "lucide-react";

interface ContactSectionProps {
  settings?: {
    primaryEmail?: string;
    primaryPhone?: string;
    whatsapp?: string;
  };
}

export default function ContactSection({ settings }: ContactSectionProps) {
  const searchParams = useSearchParams();

  const primaryEmail = settings?.primaryEmail || "keerthiadarshmp@gmail.com";
  const primaryPhone = settings?.primaryPhone || "+91 87789 79416";
  const whatsappNumber = settings?.whatsapp || "+91 87789 79416";

  const cleanPrimaryPhone = primaryPhone.replace(/[^0-9+]/g, "");
  const cleanWhatsapp = whatsappNumber.replace(/[^0-9]/g, "");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "Business Website",
    budget: "₹15,000 – ₹30,000",
    description: "",
  });

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [submittedWhatsAppUrl, setSubmittedWhatsAppUrl] = useState("");
  const [submittedClientName, setSubmittedClientName] = useState("");

  useEffect(() => {
    const serviceParam = searchParams.get("service");
    if (serviceParam) {
      setFormData((prev) => ({ ...prev, service: serviceParam }));
    }

    const handleHashService = () => {
      const hash = window.location.hash;
      if (hash.includes("service=")) {
        const queryStr = hash.split("?")[1];
        if (queryStr) {
          const params = new URLSearchParams(queryStr);
          const s = params.get("service");
          if (s) setFormData((prev) => ({ ...prev, service: s }));
        }
      }
    };

    handleHashService();
    window.addEventListener("hashchange", handleHashService);
    return () => window.removeEventListener("hashchange", handleHashService);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    // Prepare WhatsApp prefilled message
    const adminWhatsApp = cleanWhatsapp || "918778979416";
    const clientWaText =
      `Hello Keerthi Adarsh, I just submitted an enquiry on PixelForge Studio:\n\n` +
      `• Name: ${formData.name}\n` +
      `• Service: ${formData.service}\n` +
      `• Budget: ${formData.budget}\n` +
      `• Phone: ${formData.phone}\n` +
      `• Email: ${formData.email}\n` +
      (formData.description ? `• Details: ${formData.description}` : "");

    const fallbackWaUrl = `https://wa.me/${adminWhatsApp}?text=${encodeURIComponent(clientWaText)}`;

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to submit enquiry.");
      }

      const waUrl = data?.whatsappUrl || fallbackWaUrl;
      setSubmittedWhatsAppUrl(waUrl);
      setSubmittedClientName(formData.name);
      setStatus("success");

      // Attempt to open WhatsApp directly for immediate chat
      try {
        window.open(waUrl, "_blank");
      } catch {
        // Popups might be blocked on some browsers; user can tap button directly
      }

      setFormData({
        name: "",
        email: "",
        phone: "",
        service: "Business Website",
        budget: "₹15,000 – ₹30,000",
        description: "",
      });
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err?.message || "Something went wrong. Please try again.");
    }
  };

  const serviceOptions = [
    "Business Website",
    "E-Commerce Website",
    "Mobile Application",
    "Custom Software",
    "CRM & Management System",
    "AI-Powered Solution",
    "BCA Minor Project",
    "BCA Major Project",
    "MCA Minor Project",
    "MCA Major Project",
    "Other",
  ];

  const budgetOptions = [
    "Below ₹5,000",
    "₹5,000 – ₹15,000",
    "₹15,000 – ₹30,000",
    "₹30,000 – ₹50,000",
    "₹50,000+",
    "Not Sure",
  ];

  return (
    <section id="contact" className="py-24 bg-[#2E4053] text-[#F4F6F6] border-b border-[#1C2833] scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Contact Info (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#D5DBDB] bg-[#1C2833] px-3 py-1 rounded-full border border-[#D5DBDB]/10">
                GET IN TOUCH
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F4F6F6] tracking-tight mt-4 mb-4">
                Let&apos;s Turn Your Ideas Into Powerful Solutions
              </h2>
              <p className="text-sm text-[#AAB7B8] mb-8 leading-relaxed">
                Have a project idea? Tell us what you are looking to build. Our team responds promptly with technical scope and tailored pricing.
              </p>

              {/* Direct Contact Cards */}
              <div className="space-y-4">
                
                {/* Lead Contact Person Box */}
                <div className="bg-[#1C2833] p-5 rounded-2xl border border-[#D5DBDB]/15 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#2E4053] text-[#D5DBDB] flex items-center justify-center shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-mono uppercase tracking-wider text-[#AAB7B8] mb-1">
                      Lead Contact
                    </h4>
                    <p className="text-sm font-bold text-[#F4F6F6]">
                      KEERTHI ADARSH M P
                    </p>
                  </div>
                </div>

                {/* WhatsApp Box */}
                <div className="bg-[#1C2833] p-5 rounded-2xl border border-[#D5DBDB]/15 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-950 text-emerald-400 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-mono uppercase tracking-wider text-[#AAB7B8] mb-1">
                      Direct WhatsApp
                    </h4>
                    <a
                      href={`https://wa.me/${cleanWhatsapp}?text=Hello%20PixelForge%20Studio,%20I%20would%20like%20to%20discuss%20a%20project.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                      Chat on WhatsApp ({whatsappNumber})
                    </a>
                  </div>
                </div>

                {/* Email Box */}
                <div className="bg-[#1C2833] p-5 rounded-2xl border border-[#D5DBDB]/15 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#2E4053] text-[#D5DBDB] flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-mono uppercase tracking-wider text-[#AAB7B8] mb-1">
                      Email Address
                    </h4>
                    <a
                      href={`mailto:${primaryEmail}`}
                      className="block text-sm font-bold text-[#F4F6F6] hover:text-[#D5DBDB] transition-colors"
                    >
                      {primaryEmail}
                    </a>
                  </div>
                </div>

                {/* Phone Box */}
                <div className="bg-[#1C2833] p-5 rounded-2xl border border-[#D5DBDB]/15 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#2E4053] text-[#D5DBDB] flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-mono uppercase tracking-wider text-[#AAB7B8] mb-1">
                      Call Us
                    </h4>
                    <a
                      href={`tel:${cleanPrimaryPhone}`}
                      className="block text-sm font-bold text-[#F4F6F6] hover:text-[#D5DBDB] transition-colors"
                    >
                      {primaryPhone}
                    </a>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Right Interactive Form (7 Cols) */}
          <div className="lg:col-span-7">
            <div className="bg-[#1C2833] rounded-3xl p-6 sm:p-8 border border-[#D5DBDB]/20 shadow-2xl">
              <h3 className="text-xl font-bold text-[#F4F6F6] mb-2">
                Send Project Enquiry
              </h3>
              <p className="text-xs text-[#AAB7B8] mb-6">
                Fill out the details below to receive a consultation within 24 hours.
              </p>

              {status === "success" ? (
                <div className="bg-emerald-950/80 border border-emerald-500/30 rounded-2xl p-6 sm:p-8 text-center animate-in fade-in duration-300">
                  <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto mb-3" />
                  <h4 className="text-xl font-bold text-[#F4F6F6] mb-2">
                    Enquiry Submitted Successfully!
                  </h4>
                  <p className="text-xs text-[#D5DBDB] leading-relaxed mb-6 max-w-md mx-auto">
                    {submittedClientName ? `Thank you, ${submittedClientName}! ` : "Thank you! "}
                    Your project enquiry has been successfully received. Keerthi Adarsh and the PixelForge Studio team will review your requirements and reach out to you shortly.
                  </p>

                  <div className="max-w-xs mx-auto">
                    <button
                      type="button"
                      onClick={() => setStatus("idle")}
                      className="py-2.5 px-5 rounded-xl text-xs font-semibold bg-[#2E4053] text-[#F4F6F6] hover:bg-[#2E4053]/80 transition-colors cursor-pointer border border-[#D5DBDB]/15"
                    >
                      ← Submit Another Enquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {status === "error" && (
                    <div className="bg-rose-950/80 border border-rose-500/30 rounded-xl p-3 flex items-center gap-2 text-xs text-rose-200">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[#AAB7B8] mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#2E4053] border border-[#D5DBDB]/20 text-xs text-[#F4F6F6] placeholder-[#AAB7B8]/50 focus:outline-none focus:border-[#D5DBDB] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#AAB7B8] mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#2E4053] border border-[#D5DBDB]/20 text-xs text-[#F4F6F6] placeholder-[#AAB7B8]/50 focus:outline-none focus:border-[#D5DBDB] transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[#AAB7B8] mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#2E4053] border border-[#D5DBDB]/20 text-xs text-[#F4F6F6] placeholder-[#AAB7B8]/50 focus:outline-none focus:border-[#D5DBDB] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#AAB7B8] mb-1">
                        Service Required *
                      </label>
                      <select
                        value={formData.service}
                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#2E4053] border border-[#D5DBDB]/20 text-xs text-[#F4F6F6] focus:outline-none focus:border-[#D5DBDB] transition-colors"
                      >
                        {serviceOptions.map((opt) => (
                          <option key={opt} value={opt} className="bg-[#1C2833] text-[#F4F6F6]">
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#AAB7B8] mb-1">
                      Budget Range *
                    </label>
                    <select
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#2E4053] border border-[#D5DBDB]/20 text-xs text-[#F4F6F6] focus:outline-none focus:border-[#D5DBDB] transition-colors"
                    >
                      {budgetOptions.map((opt) => (
                        <option key={opt} value={opt} className="bg-[#1C2833] text-[#F4F6F6]">
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#AAB7B8] mb-1">
                      Project Description *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Tell us about your project requirements, features, or academic guidelines..."
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#2E4053] border border-[#D5DBDB]/20 text-xs text-[#F4F6F6] placeholder-[#AAB7B8]/50 focus:outline-none focus:border-[#D5DBDB] transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="w-full py-3.5 px-6 rounded-lg text-xs font-bold uppercase tracking-wider text-[#1C2833] bg-[#F4F6F6] hover:bg-[#D5DBDB] disabled:opacity-50 transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    {status === "submitting" ? (
                      <span>Sending Enquiry...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Enquiry</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
