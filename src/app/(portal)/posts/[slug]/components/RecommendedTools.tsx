import Link from "next/link";
import { ArrowRight, ExternalLink, Wrench } from "lucide-react";
import { getToolUrl, selectArticleProductCta, selectRecommendedTools } from "@/lib/monetization";

type RecommendedToolsProps = {
    tags: string[];
    content: string;
};

export default function RecommendedTools({ tags, content }: RecommendedToolsProps) {
    const tools = selectRecommendedTools(tags, content);
    const productCta = selectArticleProductCta(tags, content);

    return (
        <section className="space-y-5 rounded-lg border border-emerald-500/20 bg-emerald-500/[0.04] p-5 md:p-6">
            <div className="flex items-start gap-3">
                <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-emerald-400/30 bg-emerald-400/10 text-emerald-300">
                    <Wrench className="h-5 w-5" />
                </div>
                <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
                        Tools to try
                    </p>
                    <h2 className="text-xl font-bold text-white">
                        この事例を日本で試すなら
                    </h2>
                    <p className="text-sm leading-6 text-neutral-400">
                        海外SaaSの成功パターンを実行へ移すための候補です。一部リンクは今後、提携リンクに差し替える場合があります。
                    </p>
                </div>
            </div>

            <div className="rounded-md border border-white/10 bg-neutral-950/60 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
                    {productCta.eyebrow}
                </p>
                <h3 className="mt-2 text-lg font-bold text-white">{productCta.title}</h3>
                <p className="mt-2 text-sm leading-6 text-neutral-400">{productCta.description}</p>
                <div className="mt-4 flex flex-wrap gap-3">
                    <Link
                        href={productCta.href}
                        className="inline-flex items-center gap-2 rounded-md bg-emerald-400 px-4 py-2 text-sm font-semibold text-neutral-950 transition-colors hover:bg-emerald-300"
                    >
                        {productCta.primaryLabel}
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                    {productCta.secondaryHref && productCta.secondaryLabel && (
                        <Link
                            href={productCta.secondaryHref}
                            className="inline-flex items-center gap-2 rounded-md border border-white/10 px-4 py-2 text-sm font-semibold text-neutral-200 transition-colors hover:border-emerald-400/40 hover:text-white"
                        >
                            {productCta.secondaryLabel}
                        </Link>
                    )}
                </div>
            </div>

            <div className="grid gap-3">
                {tools.map((tool) => (
                    <Link
                        key={tool.id}
                        href={getToolUrl(tool)}
                        target="_blank"
                        rel="nofollow sponsored noopener noreferrer"
                        className="group flex items-start justify-between gap-4 rounded-md border border-white/10 bg-neutral-950/50 p-4 transition-colors hover:border-emerald-400/40 hover:bg-neutral-900"
                    >
                        <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="font-semibold text-white">{tool.name}</span>
                                <span className="rounded border border-white/10 px-2 py-0.5 text-[11px] font-medium text-neutral-400">
                                    {tool.category}
                                </span>
                            </div>
                            <p className="text-sm leading-6 text-neutral-400">{tool.description}</p>
                        </div>
                        <ExternalLink className="mt-1 h-4 w-4 shrink-0 text-neutral-500 transition-colors group-hover:text-emerald-300" />
                    </Link>
                ))}
            </div>
        </section>
    );
}
