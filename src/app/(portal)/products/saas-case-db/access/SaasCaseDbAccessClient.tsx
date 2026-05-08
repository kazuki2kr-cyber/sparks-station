"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Database, Download } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import type { SaasCaseDbRow } from "@/lib/saas-case-db";

export function SaasCaseDbAccessClient() {
  const { user, loading, loginWithGoogle } = useAuth();
  const [rows, setRows] = useState<SaasCaseDbRow[]>([]);
  const [error, setError] = useState("");
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    async function loadRows() {
      if (!user) return;
      setFetching(true);
      setError("");
      try {
        const token = await user.getIdToken();
        const res = await fetch("/api/products/saas-case-db/rows", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error ?? "データベースを取得できませんでした。");
        }
        setRows(data.rows);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setFetching(false);
      }
    }
    void loadRows();
  }, [user]);

  async function download(format: "csv" | "json") {
    if (!user) return;
    const token = await user.getIdToken();
    const res = await fetch(`/api/products/saas-case-db/download?format=${format}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      setError("ダウンロードできませんでした。");
      return;
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sparks-saas-case-db-beta.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (loading) {
    return <p className="text-sm text-neutral-400">ログイン状態を確認しています...</p>;
  }

  if (!user) {
    return (
      <div className="max-w-2xl rounded-lg border border-white/10 bg-neutral-900 p-6">
        <h1 className="text-2xl font-bold text-white">
          購入済みアカウントでログイン
        </h1>
        <p className="mt-3 text-sm leading-7 text-neutral-400">
          購入時に使ったGoogleアカウントでログインすると、ブラウザを変えても購入済みDBへアクセスできます。
        </p>
        <button
          type="button"
          onClick={() => void loginWithGoogle()}
          className="mt-6 inline-flex rounded-md bg-emerald-400 px-4 py-2 text-sm font-semibold text-neutral-950"
        >
          Googleでログイン
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl rounded-lg border border-red-500/20 bg-red-500/[0.04] p-6">
        <h1 className="text-2xl font-bold text-white">アクセスできません</h1>
        <p className="mt-3 text-sm leading-7 text-neutral-400">{error}</p>
        <p className="mt-3 text-sm leading-7 text-neutral-500">
          購入時と別のGoogleアカウントでログインしている場合は、購入時のアカウントでログインし直してください。
        </p>
        <Link
          href="/products"
          className="mt-6 inline-flex rounded-md bg-emerald-400 px-4 py-2 text-sm font-semibold text-neutral-950"
        >
          Productsへ戻る
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="max-w-4xl space-y-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-md border border-emerald-400/30 bg-emerald-400/10 text-emerald-300">
          <Database className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
            Beta Access
          </p>
          <h1 className="mt-2 text-3xl font-bold text-white">
            Sparks Station SaaS Case DB
          </h1>
        </div>
        <p className="text-sm leading-7 text-neutral-400">
          {user.email} でログイン中。ベータ版には、既存記事から抽出した15件の事例を収録しています。
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => void download("csv")}
            className="inline-flex items-center gap-2 rounded-md bg-emerald-400 px-4 py-2 text-sm font-semibold text-neutral-950"
          >
            <Download className="h-4 w-4" />
            CSVをダウンロード
          </button>
          <button
            onClick={() => void download("json")}
            className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-neutral-900 px-4 py-2 text-sm font-semibold text-neutral-200"
          >
            <Download className="h-4 w-4" />
            JSONをダウンロード
          </button>
        </div>
      </header>

      {fetching ? (
        <p className="text-sm text-neutral-400">データベースを読み込んでいます...</p>
      ) : (
        <section className="overflow-hidden rounded-lg border border-white/10 bg-neutral-900">
          <div className="overflow-x-auto">
            <table className="min-w-[1200px] text-left text-sm">
              <thead className="bg-neutral-950 text-xs uppercase tracking-[0.14em] text-neutral-500">
                <tr>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Revenue</th>
                  <th className="px-4 py-3">GTM</th>
                  <th className="px-4 py-3">Japan Hypothesis</th>
                  <th className="px-4 py-3">Confidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {rows.map((row) => (
                  <tr key={row.id} className="align-top">
                    <td className="px-4 py-4">
                      <div className="font-semibold text-white">{row.productName}</div>
                      <div className="mt-2 max-w-xs text-xs leading-5 text-neutral-500">
                        {row.productSummary}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-neutral-300">{row.category}</td>
                    <td className="px-4 py-4 text-neutral-300">{row.revenue}</td>
                    <td className="px-4 py-4 text-neutral-300">{row.gtmPattern}</td>
                    <td className="px-4 py-4 text-neutral-300">{row.japanHypothesis}</td>
                    <td className="px-4 py-4">
                      <span className="rounded-md border border-white/10 bg-neutral-950 px-2 py-1 text-xs font-semibold text-emerald-300">
                        {row.confidence}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
