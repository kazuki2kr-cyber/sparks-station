"use client";

import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { AlertCircle, CheckCircle, Loader2, Mail, Send } from "lucide-react";
import { db } from "@/lib/firebase";
import { SITE_CONTACT_EMAIL, getMailtoHref } from "@/lib/site-config";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      await addDoc(collection(db, "contacts"), {
        ...formData,
        createdAt: serverTimestamp(),
        status: "unread",
      });
      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Error submitting form:", error);
      setStatus("error");
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-12">
      <header className="space-y-4 border-b border-neutral-800 pb-8">
        <h1 className="text-3xl font-bold text-white md:text-4xl">お問い合わせ</h1>
        <p className="text-neutral-400">
          記事、プロダクト、購入後のアクセス、取材や提携のご相談はこちらからお送りください。
        </p>
        <a
          href={getMailtoHref("Sparks Stationへの問い合わせ")}
          className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-300 underline"
        >
          <Mail className="h-4 w-4" />
          {SITE_CONTACT_EMAIL}
        </a>
      </header>

      {status === "success" ? (
        <div className="space-y-4 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-8 text-center">
          <div className="inline-block rounded-full bg-emerald-500/20 p-4">
            <CheckCircle className="h-12 w-12 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">送信完了</h2>
          <p className="text-neutral-300">
            お問い合わせありがとうございます。
            <br />
            内容を確認したうえで、必要に応じてご連絡します。
          </p>
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="mt-4 font-medium text-emerald-400 underline hover:text-emerald-300"
          >
            別の問い合わせを送る
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-neutral-300">
                お名前
              </label>
              <input
                type="text"
                id="name"
                required
                className="w-full rounded-md border border-neutral-700 bg-neutral-900 px-4 py-3 text-white transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                placeholder="例: 山田 太郎"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-neutral-300">
                メールアドレス
              </label>
              <input
                type="email"
                id="email"
                required
                className="w-full rounded-md border border-neutral-700 bg-neutral-900 px-4 py-3 text-white transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                placeholder="例: yamada@example.com"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium text-neutral-300">
                お問い合わせ内容
              </label>
              <textarea
                id="message"
                required
                rows={6}
                className="w-full resize-none rounded-md border border-neutral-700 bg-neutral-900 px-4 py-3 text-white transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                placeholder="購入後のアクセス、取材、提携、記事へのご意見などをご記入ください。"
                value={formData.message}
                onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
              />
            </div>
          </div>

          {status === "error" && (
            <div className="flex items-center gap-3 rounded-md border border-red-500/20 bg-red-500/10 p-4 text-red-400">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p className="text-sm">
                送信に失敗しました。時間をおいて再度お試しいただくか、直接メールでお問い合わせください。
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-emerald-600 py-4 font-bold text-white transition-all hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {status === "loading" ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                送信中...
              </>
            ) : (
              <>
                <Send className="h-5 w-5" />
                送信する
              </>
            )}
          </button>

          <p className="text-center text-xs text-neutral-500">
            お預かりした個人情報は、お問い合わせへの回答にのみ使用します。詳しくは
            <a href="/privacy" className="underline hover:text-neutral-400">
              プライバシーポリシー
            </a>
            をご確認ください。
          </p>
        </form>
      )}
    </div>
  );
}
