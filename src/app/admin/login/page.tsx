"use client";

import { useState } from "react";
import Image from "next/image";
import { Lock, Mail, ArrowRight, AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15-second fail-safe timeout

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.error || "Invalid email or password.");
      }

      // Hard redirect ensures the browser commits the session cookie and navigates immediately
      window.location.replace("/admin");
    } catch (err: any) {
      clearTimeout(timeoutId);
      setStatus("error");
      if (err.name === "AbortError") {
        setErrorMsg("Connection timed out. Please check your network and try again.");
      } else {
        setErrorMsg(err?.message || "Login failed. Please check your credentials.");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1C2833] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#2E4053]/50 border border-[#D5DBDB]/15 rounded-3xl p-8 backdrop-blur-md shadow-2xl">
        
        {/* Header Logo */}
        <div className="text-center mb-8">
          <div className="relative w-14 h-14 rounded-2xl overflow-hidden border border-[#D5DBDB]/20 bg-[#1C2833] flex items-center justify-center mx-auto mb-4">
            <Image
              src="/images/logo.png"
              alt="PixelForge Studio"
              width={56}
              height={56}
              className="object-contain p-1"
            />
          </div>
          <h1 className="text-2xl font-extrabold text-[#F4F6F6] tracking-tight">
            PIXELFORGE ADMIN
          </h1>
          <p className="text-xs text-[#AAB7B8] mt-1">
            Enter your credentials to access the studio control panel.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {status === "error" && (
            <div className="bg-rose-950/80 border border-rose-500/30 rounded-xl p-3 flex items-center gap-2.5 text-xs text-rose-200">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
            disabled={status === "submitting"}
            className="w-full py-3.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-[#1C2833] bg-[#F4F6F6] hover:bg-[#D5DBDB] disabled:opacity-50 transition-all shadow-lg flex items-center justify-center gap-2 mt-6 cursor-pointer"
          >
            {status === "submitting" ? (
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

        <div className="mt-8 text-center pt-4 border-t border-[#D5DBDB]/10">
          <p className="text-[11px] text-[#AAB7B8]">
            Protected Studio CMS Portal — PixelForge 2026
          </p>
        </div>

      </div>
    </div>
  );
}
