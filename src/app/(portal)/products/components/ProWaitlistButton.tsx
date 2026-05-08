"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export function ProWaitlistButton() {
  const { user, loading: authLoading, loginWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function joinWaitlist() {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      let currentUser = user;
      if (!currentUser) {
        const completedWithPopup = await loginWithGoogle();
        if (!completedWithPopup) {
          setLoading(false);
          return;
        }
        const { auth } = await import("@/lib/firebase");
        currentUser = auth.currentUser;
      }

      const token = await currentUser?.getIdToken();
      if (!token) {
        throw new Error("Googleログインを確認できませんでした。");
      }

      const res = await fetch("/api/pro-waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ source: "products-pro-card" }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "登録できませんでした。");
      }
      setMessage(`${data.email} に先行案内をお送りします。`);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={joinWaitlist}
        disabled={loading || authLoading}
        className="inline-flex items-center gap-2 rounded-md bg-emerald-400 px-4 py-2 text-sm font-semibold text-neutral-950 transition-colors hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading || authLoading ? "登録中..." : "先行案内を希望する"}
        {message ? <CheckCircle2 className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
      </button>
      {message && <p className="text-xs leading-5 text-emerald-300">{message}</p>}
      {error && <p className="text-xs leading-5 text-red-300">{error}</p>}
    </div>
  );
}
