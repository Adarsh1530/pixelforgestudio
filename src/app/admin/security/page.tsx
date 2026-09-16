"use client";

import { useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import { Shield, KeyRound, CheckCircle2, AlertCircle } from "lucide-react";

export default function AdminSecurityPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    if (newPassword !== confirmPassword) {
      setStatus("error");
      setErrorMsg("New passwords do not match.");
      return;
    }

    try {
      const res = await fetch("/api/admin/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Failed to update password.");
      }

      setStatus("success");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err?.message || "Password update failed.");
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <AdminHeader
        title="Security & Password Settings"
        description="Change administrator authentication password securely."
      />

      <main className="p-6 max-w-2xl space-y-6">
        
        {status === "success" && (
          <div className="bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 p-4 rounded-2xl text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Admin password updated successfully! Please use your new password on next login.</span>
          </div>
        )}

        {status === "error" && (
          <div className="bg-rose-950/80 border border-rose-500/40 text-rose-200 p-4 rounded-2xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="bg-[#2E4053]/30 border border-[#D5DBDB]/15 rounded-2xl p-6 space-y-4 text-xs">
          
          <div>
            <label className="block text-[#AAB7B8] mb-1 font-semibold uppercase tracking-wider">
              Current Password
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full p-3 rounded-xl bg-[#1C2833] border border-[#D5DBDB]/20 text-[#F4F6F6]"
            />
          </div>

          <div>
            <label className="block text-[#AAB7B8] mb-1 font-semibold uppercase tracking-wider">
              New Password (Min 6 chars)
            </label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full p-3 rounded-xl bg-[#1C2833] border border-[#D5DBDB]/20 text-[#F4F6F6]"
            />
          </div>

          <div>
            <label className="block text-[#AAB7B8] mb-1 font-semibold uppercase tracking-wider">
              Confirm New Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full p-3 rounded-xl bg-[#1C2833] border border-[#D5DBDB]/20 text-[#F4F6F6]"
            />
          </div>

          <div className="pt-4 border-t border-[#D5DBDB]/10 flex items-center justify-end">
            <button
              type="submit"
              disabled={status === "submitting"}
              className="px-6 py-3 rounded-xl font-bold text-[#1C2833] bg-[#F4F6F6] hover:bg-[#D5DBDB] transition-colors inline-flex items-center gap-2 shadow-lg"
            >
              <KeyRound className="w-4 h-4" />
              {status === "submitting" ? "Updating..." : "Update Password"}
            </button>
          </div>

        </form>

      </main>
    </div>
  );
}
