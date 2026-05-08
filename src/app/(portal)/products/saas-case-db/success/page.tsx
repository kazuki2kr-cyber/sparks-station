import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default function SaasCaseDbSuccessPage() {
  return (
    <div className="max-w-2xl rounded-lg border border-emerald-500/20 bg-emerald-500/[0.04] p-6 md:p-8">
      <CheckCircle2 className="h-10 w-10 text-emerald-300" />
      <h1 className="mt-4 text-2xl font-bold text-white">
        ご購入ありがとうございます
      </h1>
      <p className="mt-3 text-sm leading-7 text-neutral-300">
        Stripeから購入記録を受け取り次第、購入時のGoogleアカウントでデータベースへアクセスできます。通常は数秒で反映されます。
      </p>
      <Link
        href="/products/saas-case-db/access"
        className="mt-6 inline-flex rounded-md bg-emerald-400 px-4 py-2 text-sm font-semibold text-neutral-950 transition-colors hover:bg-emerald-300"
      >
        データベースを開く
      </Link>
    </div>
  );
}
