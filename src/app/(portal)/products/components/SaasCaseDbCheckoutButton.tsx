"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const checkoutEnabled = process.env.NEXT_PUBLIC_SAAS_CASE_DB_CHECKOUT_ENABLED === "true";

export function SaasCaseDbCheckoutButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user, loading: authLoading, loginWithGoogle } = useAuth();

  async function startCheckout() {
    if (!checkoutEnabled) {
      setError("現在、購入受付の準備中です。公開前のテストが完了し次第、受付を開始します。");
      return;
    }

    setLoading(true);
    setError("");
    try {
      let currentUser = user;
      if (!currentUser) {
        await loginWithGoogle();
        const { auth } = await import("@/lib/firebase");
        currentUser = auth.currentUser;
      }
      const token = await currentUser?.getIdToken();
      if (!token) {
        throw new Error("Googleログインを確認できませんでした。");
      }

      const res = await fetch("/api/checkout/saas-case-db", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "決済ページを作成できませんでした。");
      }
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={startCheckout}
        disabled={loading || authLoading || !checkoutEnabled}
        className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-emerald-400 px-4 py-2 text-sm font-semibold text-neutral-950 transition-colors hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {checkoutEnabled
          ? loading || authLoading
            ? "Stripeへ移動中..."
            : "Googleでログインして購入"
          : "購入受付は準備中"}
        <ArrowRight className="h-4 w-4" />
      </button>
      <p className="text-xs leading-5 text-neutral-500">
        {checkoutEnabled
          ? "決済はStripe Checkoutで安全に処理されます。"
          : "本番決済テストの完了後に受付を開始します。"}
      </p>
      {error && <p className="text-xs leading-5 text-red-300">{error}</p>}
    </div>
  );
}
